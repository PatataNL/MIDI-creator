# MIDI-Creator

A piano roll in your browser for writing music, playing it back and exporting it as MIDI. It can also turn falling-notes piano videos into notes.

It is a single web page. There is nothing to install, no account and no server: open `index.html` and start drawing notes. Everything stays on your computer.

> **Note:** this application is fully programmed by AI. The ideas are human-made, with AI additions.

---

## Contents

- [Highlights](#highlights)
- [Getting started](#getting-started)
- [A tour of the screen](#a-tour-of-the-screen)
- [Writing notes](#writing-notes)
- [Layers](#layers)
- [The Values sidebar](#the-values-sidebar)
- [Playing, listening and recording](#playing-listening-and-recording)
- [Bookmarks and loops](#bookmarks-and-loops)
- [Full-screen playback](#full-screen-playback)
- [Notes from a video](#notes-from-a-video)
- [Opening, saving and sharing](#opening-saving-and-sharing)
- [Settings](#settings)
- [Keyboard shortcuts](#keyboard-shortcuts)
- [Tips and troubleshooting](#tips-and-troubleshooting)
- [For developers](#for-developers)

---

## Highlights

- **A vertical piano roll.** Notes fall toward a full piano keyboard, as in piano tutorial videos. Draw, select, move, stretch, copy and erase with the mouse or a touch screen.
- **Layers** with their own instrument (all 128 General MIDI instruments plus drums), colour, volume, pan, reverb and muffle. You can hide, lock, mute, solo, merge and reorder them.
- **Per-note values.** Velocity, pan, reverb and muffle are edited in the Values sidebar or the note info bar. There is also a sustain pedal lane.
- **Two kinds of layer sliders.** One sets the values new notes start with. The other changes the whole layer as it plays, without touching the notes.
- **Fancy playback.** Realistic piano, electric piano, guitars, basses, harp, mallets and drums, calculated on your device.
- **Play and record** with your computer keyboard or a connected MIDI keyboard.
- **Notes from a video.** Turn a falling-notes piano tutorial video into notes, by reading the lit keys or the falling notes themselves.
- **Opens** MIDI files, MusicXML sheet music (`.musicxml`, `.mxl`) and its own project files.
- **Saves** as MIDI, as a project file, or as a WAV recording. It can also open the song in the Keys piano practice app.
- **Bookmarks**, loops, tabs for several projects at once, a full undo history, auto-save, light and dark themes and full-screen playback.

---

## Getting started

1. Download or clone this repository.
2. Open `index.html` in a modern browser: Chrome, Edge, Firefox or Safari. Chrome or Edge are recommended for the video import.
3. Click above the keyboard to place a note, then press **Space** to hear it.

That's all. Your work is auto-saved in the browser, so it's still there when you come back. You can turn this off in Settings. To keep a song for good, or to move it to another computer, use **Save project** or **Save MIDI**.

**Internet:** the app works offline, with one exception. Reading video files directly (the fastest video speed) loads a small MP4 reader library from a CDN the first time.

---

## A tour of the screen

From top to bottom:

| Area | What it does |
|---|---|
| **Top bar** | Undo/redo; New, Open… and From video…; the four tools (Draw, Select, Erase, Look); Connect MIDI and the input picker; output level meter; full screen; light/dark mode; Settings. |
| **Second bar** | Save MIDI, Save project, Export WAV, Open in Keys (and copy a Keys link). The transport: back to start, play/pause, stop, record. Then Loop, Metronome, Fancy, the position readout (bar.beat.tick and time), BPM and time signature. |
| **Tabs** | One tab per open project. The arrow at the far right of the second bar hides or shows the tab bar. |
| **Layer panel** (left) | Your layers, the Show all / Only this buttons, the opacity of other layers, and at the bottom the master volume, reverb mix and reverb space. |
| **Options row** | Grid, Fine grid, Scale highlight, Time and Key width zoom, Fit keys, Fit notes, Note tools, Follow and the computer-keyboard octave. |
| **Piano roll** | Time runs upward: the playhead line moves up through the notes toward the keyboard at the bottom. The time ruler is on the left. |
| **Playback bar** | A song-wide progress bar with bookmarks and the loop region. Drag it to look through the song, let go to jump there. |
| **Note info bar** | Pitch, start, length, velocity, pan, reverb and muffle of the selected note(s). |
| **Status line** | The note and position under the cursor. |
| **Right sidebar** | **Values** (velocity, pan, reverb, muffle and pedal lanes) and **Undo history**, plus the bookmark buttons and list. |

Both side panels can be folded away (the arrow buttons) and resized (drag the divider; double-click it to reset). In Settings you can move the layer panel to the right.

---

## Writing notes

### Tools

| Tool | Key | Use |
|---|---|---|
| **Draw** | 1 | Click to place a note on the grid; drag to stretch it right away. Click an existing note to select and move it. |
| **Select** | 2 | Drag a box to select notes. Shift adds to the selection. |
| **Erase** | 3 | Click or drag over notes to delete them. |
| **Look** | 4 | Drag to scroll around. Handy on touch screens. |

### Mouse

- **Move** a note by dragging its middle. Drag to the side to change pitch, up or down to change time. All selected notes move together.
- **Stretch** a note by dragging near its top or bottom edge. The grab area is set by *Stretch handle size* in Settings.
- **Copy** while moving by holding **Ctrl** (⌘ on Mac) as you start the drag.
- **Shift+click** a note to add it to or remove it from the selection.
- **Right-click**, or **double-click**, a note to delete it.
- **Alt** while placing, moving or stretching snaps to the fine grid instead of the main grid. For a moved or stretched note it's the other way round: it uses the fine grid, and Alt snaps to the main grid.
- **Click a key** on the keyboard to hear it.
- **Click the time ruler** to move the playhead, or drag the playhead line itself.
- **Drag the line above the keyboard** to make the keys taller or shorter.

### Grid and zoom

- **Grid** sets where new notes start and how long they are: 1/1 to 1/64, plus triplets.
- **Fine** is the finer snap used when moving and resizing: 1/32, 1/64, 1/128 or a single tick.
- **Scale** highlights the notes of a scale in the roll: major, minor, harmonic minor, dorian, mixolydian, pentatonics, blues and more.
- **Zoom.** Ctrl+wheel zooms time. Ctrl+Shift+wheel, or the plain wheel over the keyboard, changes the key width. The **Time** and **Key width** buttons do the same.
- **Fit keys** fits all 88 keys to the window; **Fit notes** zooms to the notes in your song.
- **Follow** keeps the playhead in view during playback. Scrolling by hand turns it off.

### Keyboard editing

- **Arrow left/right** move the selected notes in time by the fine grid. With **Shift**, by the main grid.
- **Arrow up/down** move them by a semitone. With **Shift**, by an octave.
- **Delete** or **Backspace** deletes them.
- **Ctrl+C / X / V** copy, cut and paste. Pasting puts the notes at the playhead.
- **Ctrl+D** duplicates the selection, and **Ctrl+A** selects all notes in the layer.

### Note info bar

With notes selected, the bar under the roll shows their **pitch, start, length, velocity, pan, reverb and muffle**, and you can type new values there. A note without its own pan, reverb or muffle uses its layer's. The small reset buttons set a note back to that.

### Note tools

**Note tools** opens a small panel that works on the selected notes, or on the whole layer when nothing is selected:

- **Snap to grid:** moves each note's start to the nearest grid line.
- **Transpose** by any number of semitones (±1 and ±12 buttons included).
- **Swing:** delays every second grid step. 50% is straight; about 67% feels like triplets.
- **Humanize:** small random changes to timing and velocity.
- **Legato:** stretches each note to the start of the next one, with an optional gap. "Only lengthen" leaves notes that already overlap alone.

---

## Layers

Each layer is a card in the layer panel. Click a card to select that layer: new notes go there, and its card shows all its controls.

- **Name:** click the coloured header and type.
- **Buttons:** hide/show, lock (locked layers can't be edited or clicked), mute, solo, move up/down, delete, and **⋯** for more.
- **Instrument:** any General MIDI instrument, grouped by family, or drums.
- **Sliders**, in two sets. Switch between them with the button on the right of the Color row.
  - **New notes:** Velocity, Pan, Reverb and Muffle that notes you draw or record in this layer start with. Existing notes are never changed. Playing on your keyboard also uses these.
  - **Whole layer:** Volume, Pan (moves every note left or right), and Velocity %, Reverb % and Muffle % (a share of each note's own value; 100 = unchanged). These change how the whole layer sounds, in playback, in WAV and MIDI export and when merging. The notes' own values stay as they are.

  Other layers show the first two sliders of whichever set is on.
- **Color:** a colour box with hex code. It opens the app's colour picker: Hex, RGB, HSL, HSV or OKLCH, a screen eyedropper and recent colours. **More settings** gives white-key and black-key notes their own colours.

Above the layers:

- **Show all** shows every layer.
- **Only this** shows only the selected layer, and keeps following your selection.
- **Other layers** sets how faintly the layers you are not editing are drawn. At 0 they can't be clicked.

The **⋯** menu, or a right-click on a card, has:

- **Duplicate layer**, **Copy layer** and **Paste layer below**. A copied layer can also be pasted into another tab.
- **Merge with the layer below** and **Merge layers…**. The merged notes move into one layer. With "Keep how each layer sounds", each note keeps its volume, pan, reverb and muffle.
- **Delete layer** (optionally with a confirmation; Ctrl+click on the delete button skips it).

### Layer colours

A layer's colour can come from its name. Name a layer "Blue right hand" or "Melody #ff8800" and it takes that colour. This also works for track names in imported MIDI files.

---

## The Values sidebar

The **Values** tab on the right shows a bar for every note of the selected layer, lined up with the notes beside it. The lane picker at the bottom chooses what the bars show:

- **Velocity**, **Pan**, **Reverb** or **Muffle:** drag a bar sideways to set it. Drag up or down over empty space to paint values across several notes. Double-click a bar to type a value. **Step** sets what the values snap to.
- **Pedal:** sustain pedal regions. Drag to add one; drag its ends to change it.

The **Undo history** tab lists every change. Click any step to jump back or forward to it. **Clear** forgets the history.

---

## Playing, listening and recording

- **Space** plays and pauses. **Home** goes back to the start. **Stop** returns to where playback began, or to the loop start (see Settings).
- **Metronome** clicks on every beat, louder on the first beat of a bar. Its volume is in Settings.
- **BPM** and the **time signature** (4/4, 3/4, 2/4, 5/4, 6/8, 7/8, 12/8, 3/8) are in the second bar.
- **Fancy playback** swaps the standard synthesizer for realistic instruments: piano, electric piano, guitars, basses, harp, mallets and drums. The first time, they are calculated on your device, which takes a few seconds. *Piano tweaks* in Settings adjust the Fancy piano's brightness, low-note balance, bass and hammer knock.
- **Master** volume (type up to 300 for extra loudness), **Reverb mix** and **Reverb space** (small room, hall, cathedral) are at the bottom of the layer panel.

### Your computer keyboard as a piano

The letter rows play one and a half octaves. **A S D F G H J K L ; '** are the white keys and **W E T Y U O P** the black keys. **Z** and **X** move the octave down and up. The current octave is shown in the options row.

### A MIDI keyboard

Click **Connect MIDI**, allow access, and pick your device (or all devices). What you play is heard on the selected layer's instrument, at the velocity you play.

### Recording

Press the **record** button. Playback starts if it isn't running already. Everything you play on the computer keyboard or a MIDI keyboard is written onto the selected layer, at the time you played it. Press record again, or stop, to finish. Locked or hidden layers aren't recorded into.

---

## Bookmarks and loops

**Bookmarks** are named, coloured moments in your song, such as "Verse" or "Chorus".

- **B** (or the bookmark+ button) adds one at the playhead. **,** and **.** jump to the previous and next one.
- The **Bookmarks** button opens the list, where you can:
  - jump to a bookmark;
  - loop from it to the next one, or to the end;
  - rename or recolour it;
  - remove it;
  - set how bookmarks are shown (on the notes and the progress bar, colour strength, one colour for all).
- Bookmarks show as name tags on the roll and as marks on the progress bar. Click a tag to jump; Shift+click or double-click it to edit.
- They are saved in projects, written into MIDI files as standard markers, and sent along to Keys.

**Loop:** turn on **Loop**, then drag along the thin strip at the right edge of the time ruler to set the region. Bookmarks can set the loop region for you too.

---

## Full-screen playback

Press **5**, or the full-screen button, for a clean view made for watching and playing along. The bars tuck away when you stop moving the mouse, and the cursor and placement preview hide with them. Move the mouse to bring them back. **Esc** or **5** leaves full screen.

In Settings you can turn on **landing ripples** (a ring on the key when a note reaches the keyboard) and set how strongly notes **fade at the top** edge.

---

## Notes from a video

**From video…** builds notes from a falling-notes piano video on your computer. That's the kind of tutorial where coloured notes fall onto a keyboard that lights up. The video never leaves your computer, and the app remembers your marks and settings for each video.

It works in three steps on the **Analysis** tab, then you review the **Result**.

### 1. Select

Choose or drop a video file, and set the **keyboard size** (88, 76, 61, 49, 37, 25 keys or a custom lowest/highest key). Usually **Auto-position** in step 2 sets it for you.

### 2. Position

The app needs to know where the keys are.

- **Auto-position** finds the keyboard, its size and its notes, and the horizontal spread. Always check that the dots sit on the keys: yellow dots on white keys, pink on black keys.
- Or click the four steps and mark them on the video by hand:
  1. the left edge of the lowest key;
  2. the right edge of the highest key;
  3. a white key, near its bottom;
  4. a black key, in its middle.
- **Snap sides to borders** puts the outer marks on the video's edges.
- **Clear marks** starts over; **Undo clear** (or Ctrl+Z) brings them back.
- **Horizontal spread** fixes dots that drift off the keys toward the sides: above 1 spreads them out, below 1 pulls them in.

**Read notes from** picks how notes are read:

- **Bottom keyboard:** reads each key's colour as it lights up. Simple and fast; works for most videos.
- **Falling notes (more precise):** reads the notes in a band above the keys, before they land, where key effects (fades, glow, sparks) don't reach. Every note edge is seen in many frames and combined, so timing is more precise. It copes with glowing and outlined notes, labels drawn on notes, notes touching each other and neighbouring notes bleeding into each other. The keys below are read too, as a second witness: a note whose key stays dark while its neighbour's lights up is trimmed or left out.

  For this mode you also set:
  - the **scan area** (two blue lines) and the **keys line** (orange, where notes reach the keys). Drag them on the video, or use **Auto scan area**.
  - **Rows read**, from 50 up to every pixel: more is more precise but slower.
  - **Lane width:** how much of each key's width is read.

**Advanced position tuning:**

- the scan area as exact percentages;
- **perspective correction**: mark the four outer corners of a tilted or angled keyboard;
- **left/right perspective**, for a keyboard filmed slightly from the side.

### 3. Analyze

- Set **Start** and **End**, use **Use current time**, or click **Auto-range** to find where the music begins and ends.
- Press **Analyze** under the video.
- *Advanced analysis* sets the **speed**:
  - **Fastest** reads the MP4 file directly, on several threads. It needs Chrome or Edge.
  - **Auto**, **real time** to **8×**, or **Exact** play the video instead.

  It also sets **samples per second** (15–60). Keep the tab open and visible while it runs.

### Result

The notes are grouped by colour. Each group becomes a layer you can rename or leave out. The summary tells you:
- how many frames were read;
- for falling notes, how fast the notes moved;
- whether the keys were used to check neighbouring notes.

The settings update the result live:

| Setting | What it does |
|---|---|
| Sensitivity | How strongly a key or note has to stand out to count. |
| Stop notes when they fade / Split repeated presses / Fade sensitivity | Bottom-keyboard mode: end notes as their light fades, and split a key pressed again before its light went out. |
| Tempo (BPM) and Estimate | The project tempo; Estimate guesses it from the notes. |
| Snap to | Snap notes to 1/32, 1/16 or 1/8. |
| *Advanced detection* | Ignore whole-screen fades and flashes; discard moments where too many keys start at once; ignore very short flashes; join short gaps; a minimum note length; how different two colours may be and still be one layer. |
| *Advanced timing* | Velocity of the notes, start at the first note, shift all notes or only black-key notes earlier or later, shorten white or black notes. |

**Put notes** on new layers in this project, or in a new tab, and press **Import notes**.

### Tips for good results

- Use the best quality video you have, 1080p if possible.
- Check the dots after Auto-position, especially at the far left and right.
- In falling-notes mode, keep the scan area clear of the effects just above the keys, and put the keys line on the top edge of the keys.
- For more precision, raise **Rows read** and **Samples per second**. The analysis takes longer.
- If a video keeps the keys dark (no lighting), use falling-notes mode. The keyboard check then switches itself off.

---

## Opening, saving and sharing

### Opening

**Open…**, or drag a file onto the window, opens it in a new tab:

- **MIDI files** (`.mid`, `.midi`). Every track and channel becomes a layer, with its instrument, volume, pan, reverb, muffle (brightness), sustain pedal, tempo changes, time signature, markers (as bookmarks) and layer colours.
- **MusicXML sheet music** (`.musicxml`, `.xml`, or zipped `.mxl`, as exported by MuseScore, Finale, Sibelius and others):
  - one layer per part, and one per staff for piano parts (right and left hand);
  - tempo, time signature, dynamics, staccato, ties and the sustain pedal come along;
  - rehearsal marks become bookmarks;
  - repeats and 1st/2nd endings are played out. D.C./D.S./Coda jumps are not followed.
- **MIDI-Creator projects** (`.json`).

### Saving

| Button | Gives you |
|---|---|
| **Save MIDI** (Ctrl+S) | A standard MIDI file that works in any music program. Layer volume, pan, reverb, muffle, the pedal, bookmarks and layer colours are included; whole-layer slider values are applied to the notes. |
| **Save project** | A `.json` file with everything: every layer and note value, both slider sets, colours, bookmarks, tempo and time signature. Use this to keep working later. |
| **Export WAV** | An audio recording of the song, with Fancy playback when it's on. |

### Keys

**Open in Keys** opens the song in the [Keys piano practice app](https://mike-dta.github.io/piano-keys-web-version/), bookmarks included. The link button next to it copies a link to share. The whole song is in the link itself, so nothing is uploaded anywhere.

### Tabs

Each project lives in its own tab. You can:
- drag tabs to reorder them;
- double-click a tab (or press F2) to rename it;
- middle-click a tab to close it.

Right-click a tab to duplicate it, close other tabs, or reopen a closed one. Tabs with unsaved changes show a dot. All open tabs are auto-saved and restored when you come back.

---

## Settings

The gear button opens Settings. The search box at the top finds any setting.

| Section | Settings |
|---|---|
| **Appearance** | Color mode (auto/light/dark); color theme; base and accent color saturation; layer panel position; note names on notes; which keys show labels; note area brightness; preview of the note under the cursor. |
| **Sound** | Fancy playback; *Piano tweaks*: brightness, low-note volume and focus, bass reduction, hammer knock. |
| **Editing** | Anti-resize delay (so a fresh note isn't stretched by accident); Values lane grab delay; stretch handle size; value bar and black-key hitboxes; play notes while editing; confirm before deleting a layer. |
| **Full-screen mode** | Landing ripples; fade at the top. |
| **Playback** | Stop returns to the loop start; metronome volume. |
| **Storage** | Auto-save to this browser. |

**Reset to defaults** puts everything back.

---

## Keyboard shortcuts

| Keys | Action |
|---|---|
| Space | Play / pause |
| Home | Back to the start |
| 1 / 2 / 3 / 4 | Draw / Select / Erase / Look |
| 5 | Full-screen playback (Esc also leaves it) |
| Ctrl+Z, Ctrl+Shift+Z or Ctrl+Y | Undo, redo |
| Ctrl+A | Select all notes in the layer |
| Ctrl+C / Ctrl+X / Ctrl+V | Copy / cut / paste at the playhead |
| Ctrl+D | Duplicate the selection |
| Ctrl+S | Save MIDI |
| Delete / Backspace | Delete the selected notes |
| Arrow left / right | Move the selection in time (Shift: by the main grid) |
| Arrow up / down | Move the selection by a semitone (Shift: an octave) |
| Esc | Clear the selection |
| B | Add a bookmark at the playhead |
| , and . | Previous / next bookmark |
| Z / X | Computer-keyboard piano octave down / up |
| A W S E D F T G Y H U J K O L P ; ' | Play notes |
| Ctrl+wheel | Zoom time |
| Ctrl+Shift+wheel, or wheel over the keys | Zoom key width |

On a Mac, use ⌘ instead of Ctrl.

---

## Tips and troubleshooting

- **No sound?** Click anywhere in the app first: browsers only start audio after a click. Check that the layer isn't muted and that Master isn't at 0.
- **The first Fancy playback takes a moment.** The instruments are being calculated; later plays start right away.
- **A note won't stretch right after placing it.** That's the anti-resize delay, set in Settings.
- **Can't edit a layer?** It may be hidden or locked. The card shows which.
- **My work is gone after clearing browser data.** Auto-save lives in the browser. Use Save project for anything you want to keep.
- **Video: "Fastest" isn't available.** Reading the file directly needs WebCodecs (Chrome or Edge) and an MP4 file. Other browsers and formats fall back to playing the video.

---

## For developers

### How it's built

The whole app is **one file, `index.html`**: HTML, CSS and JavaScript with no build step, no framework and no dependencies to install. The only outside code is [mp4box.js](https://github.com/gpac/mp4box.js), loaded on demand from a CDN for the fastest video reading. Open the file in a browser to run it. Any static web server works too.

The script is organised in sections with banner comments (`/* ===== Audio engine ===== */`, `/* ---- reading the falling notes above the keys ---- */`, and so on). The main parts are:

- **Song model and history:** `song` holds the tracks (layers), tempo map, time signature and bookmarks. Undo works on snapshots of it.
- **Rendering:** the piano roll and the Values lane are canvases, redrawn when something changes.
- **Audio:** Web Audio synthesis per General MIDI family, plus the Fancy instruments, which are rendered once and cached as samples. WAV export runs the same engine offline.
- **File formats:** a MIDI reader and writer, a MusicXML reader (with `.mxl` unzipping), the project format and the Keys link.
- **Video import:** keyboard detection, the keys reader, the falling-notes reader and detector, the keyboard check, and Web Worker pools for heavy work.

### Project file format

A project is JSON:

```json
{
  "app": "midi-creator",
  "name": "My song",
  "tempos": [{ "tick": 0, "bpm": 120 }],
  "ts": { "n": 4, "d": 4 },
  "marks": [{ "tick": 1920, "name": "Chorus", "color": "#60a5fa" }],
  "tracks": [{
    "name": "Piano", "program": 0, "drum": false,
    "vol": 100, "pan": 64, "rev": 24, "muf": 0,
    "color": "#4da0db",
    "notes": [{ "s": 0, "d": 480, "p": 60, "v": 100 }],
    "pedal": [{ "s": 0, "d": 1920 }]
  }]
}
```

- Times are in ticks, at **480 ticks per quarter note**.
- Notes have start `s`, length `d`, pitch `p` (MIDI note number) and velocity `v`. They may also have their own `pan`, `rev` and `muf`; when missing, the layer's values count.
- A layer may also hold:
  - its new-note values: `nvV`, `nvPan`, `nvRev`, `nvMuf`;
  - its whole-layer values: `mxV`, `mxPan`, `mxRev`, `mxMuf`;
  - separate note colours: `colorWhite`, `colorBlack`.

### MIDI extensions

Saved MIDI files stay fully standard. Two extras ride along in ways other programs ignore:

- **Bookmarks** are Marker meta events (`FF 06`). Each is followed by a sequencer-specific event (`FF 7F`) holding its colour, tagged with the non-commercial manufacturer ID `7D` and `MCBM`.
- **Layer colours** are sequencer-specific events with the same `7D` tag.

[`docs/keys-bookmarks.js`](docs/keys-bookmarks.js) shows how another app (Keys) reads the bookmarks, from the share link or from the MIDI file.

### Contributing

Work happens on the `beta` branch and reaches `main` through pull requests.
