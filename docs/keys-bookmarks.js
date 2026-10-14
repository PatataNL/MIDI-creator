/*
  Bookmarks from MIDI-Creator, for the Keys app (piano-keys-web-version)
  ======================================================================

  MIDI-Creator sends bookmarks (named, colored moments in a song) in two ways.
  Both give you a list sorted by time:

      [{ time: 12.5, name: "Chorus", color: "#60a5fa" }, ...]

  time is in seconds from the start of the song. color is "#rrggbb".

  1. In the link. "Open in Keys" adds  &bm=<data>  after  #midi=...&title=...
     <data> is URI-encoded JSON:  [{"t":12.5,"n":"Chorus","c":"#60a5fa"}, ...]
     Use readBookmarksFromHash(). This is the easy route: the times are already in seconds.

  2. In the MIDI file itself, so a downloaded .mid keeps them too:
     - each bookmark is a standard Marker meta event (FF 06) whose text is the name;
     - right after it, at the same tick, comes a sequencer-specific meta event (FF 7F)
       with 8 data bytes: 7D 'M' 'C' 'B' 'M' red green blue.
       (7D is the manufacturer ID reserved for non-commercial use, so other programs skip it.)
     Use readBookmarksFromMidi(bytes) when you only have the file. It converts ticks to seconds
     with the file's own tempo changes. Markers made by other programs come through too
     (with the default amber color).

  textColorOn(color) picks dark or white text for a label drawn on a bookmark color.
*/

const BOOKMARK_DEFAULT_COLOR = '#f2b84b';

function cleanBookmarks(list) {
  return (Array.isArray(list) ? list : [])
    .filter(b => b && isFinite(b.time) && b.time >= 0)
    .map(b => ({
      time: +b.time,
      name: String(b.name == null ? 'Bookmark' : b.name).slice(0, 60),
      color: /^#[0-9a-f]{6}$/i.test(b.color) ? b.color.toLowerCase() : BOOKMARK_DEFAULT_COLOR,
    }))
    .sort((a, b) => a.time - b.time);
}

// Route 1: the &bm= part of the link. Pass location.hash (or the whole URL).
function readBookmarksFromHash(hash = location.hash) {
  const h = String(hash);
  const i = h.indexOf('#');
  const params = new URLSearchParams(i >= 0 ? h.slice(i + 1) : h);
  const raw = params.get('bm'); // URLSearchParams already undoes the URI encoding
  if (!raw) return [];
  try {
    return cleanBookmarks(JSON.parse(raw).map(b => ({ time: b.t, name: b.n, color: b.c })));
  } catch (e) {
    return [];
  }
}

// Route 2: the markers inside the MIDI bytes (an ArrayBuffer or Uint8Array).
function readBookmarksFromMidi(bytes) {
  const u = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  const dv = new DataView(u.buffer, u.byteOffset, u.byteLength);
  const tag = p => String.fromCharCode(u[p], u[p + 1], u[p + 2], u[p + 3]);
  if (u.length < 14 || tag(0) !== 'MThd') return [];
  const tracks = dv.getUint16(10), division = dv.getUint16(12);
  if (division & 0x8000) return []; // SMPTE timing: not used by MIDI-Creator
  const dec = new TextDecoder('utf-8');
  const marks = [], tempos = []; // tempos: {tick, mpq} (microseconds per quarter note)
  let p = 8 + dv.getUint32(4);

  for (let t = 0; t < tracks && p + 8 <= u.length; t++) {
    const len = dv.getUint32(p + 4), isTrack = tag(p) === 'MTrk';
    let q = p + 8;
    const end = Math.min(u.length, q + len);
    p = end;
    if (!isTrack) { t--; continue; }
    let tick = 0, running = 0;
    const vlq = () => { let v = 0, b; do { b = u[q++]; v = v * 128 + (b & 127); } while (b & 128 && q < end); return v; };
    while (q < end) {
      tick += vlq();
      let s = u[q];
      if (s < 0x80) s = running; else { q++; if (s < 0xF0) running = s; }
      if (s === 0xFF) {
        const type = u[q++], l = vlq(), d = q;
        q += l;
        if (type === 0x51 && l === 3) tempos.push({ tick, mpq: (u[d] << 16) | (u[d + 1] << 8) | u[d + 2] });
        else if (type === 0x06) marks.push({ tick, name: dec.decode(u.subarray(d, d + l)).replace(/\0/g, '').trim() || 'Marker', color: BOOKMARK_DEFAULT_COLOR });
        else if (type === 0x7F && l === 8 && u[d] === 0x7D && u[d + 1] === 77 && u[d + 2] === 67 && u[d + 3] === 66 && u[d + 4] === 77) {
          const last = marks[marks.length - 1];
          if (last && last.tick === tick) last.color = '#' + [u[d + 5], u[d + 6], u[d + 7]].map(v => v.toString(16).padStart(2, '0')).join('');
        }
      } else if (s === 0xF0 || s === 0xF7) {
        q += vlq();
      } else {
        const hi = s & 0xF0;
        q += hi === 0xC0 || hi === 0xD0 ? 1 : 2;
      }
    }
  }

  // ticks to seconds, following the tempo changes (120 BPM until the first one)
  tempos.sort((a, b) => a.tick - b.tick);
  const toSec = tick => {
    let sec = 0, at = 0, mpq = 500000;
    for (const tp of tempos) {
      if (tp.tick >= tick) break;
      sec += (tp.tick - at) * mpq / division / 1e6;
      at = tp.tick; mpq = tp.mpq;
    }
    return sec + (tick - at) * mpq / division / 1e6;
  };
  return cleanBookmarks(marks.map(m => ({ time: toSec(m.tick), name: m.name, color: m.color })));
}

// Dark text on light colors, white on dark ones (the same rule MIDI-Creator uses for its labels).
function textColorOn(color) {
  const n = parseInt(color.slice(1), 16);
  const lin = c => { c /= 255; return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); };
  const L = 0.2126 * lin((n >> 16) & 255) + 0.7152 * lin((n >> 8) & 255) + 0.0722 * lin(n & 255);
  return L > 0.18 ? '#1d1707' : '#ffffff';
}

/*
  Example, where Keys reads its link:

    const bookmarks = readBookmarksFromHash();
    // or, for a dropped .mid file:  const bookmarks = readBookmarksFromMidi(await file.arrayBuffer());
    for (const b of bookmarks) console.log(b.time.toFixed(1) + 's', b.name, b.color);
*/
