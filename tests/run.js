/* MIDI-Creator test suite.
   Open index.html#test (or tests/index.html, which goes there). A panel appears with two kinds of tests:
   - Built-in tests need no files: a synthetic falling-notes video with known notes, MIDI, MusicXML and project files
     written and read back, time signatures, tempo changes, splitting, joining and selecting notes, splitting a piece
     into its two hands, and the layer slider values.
   - Video tests run the video import on real videos you pick from your computer (they are not in the repository) and
     compare every note with the results recorded in tests/expected.js. Each video is read with the keyboard marks and
     settings stored there, in each mode listed; a run passes when at most one note differs. Auto-position is checked
     against the stored marks too.
   "Record expected results" runs the same videos and saves a new tests/expected.js: use it after an improvement you
   have checked, and commit the file.
   While the tests run, auto-save is off and your video settings are put back afterwards, so nothing of yours changes. */
(()=>{
'use strict';
// The videos the expected results were recorded from, and how each is read. band: scan area as percent of the video
// height (top, bottom, keys line), when not the automatic one; rows and fps as in the dialog.
const PLAN=[
  {id:'rules',file:"It's Pronounced -Rules- (from Deltarune Chapter 2) - Piano Tutorial - Sheet Music Boss (1080p).mp4",runs:[{mode:'fall',start:30,end:60},{mode:'keys',start:30,end:60}]},
  {id:'spider',file:'Lattice Spider Dance Synthesia - AkiPiano (1080p).mp4',runs:[{mode:'fall',start:30,end:60},{mode:'keys',start:30,end:60}]},
  {id:'amoeba',file:'Clairo - Amoeba - Easy_Intermediate Piano Solo Tutorial (Sheet Music Available).mp4',runs:[{mode:'fall',start:0,end:80},{mode:'keys',start:0,end:80}]},
  {id:'castle',file:'My Castle Town (EASY Piano Tutorial) - Deltarune - Merendi Music (1080p).mp4',runs:[{mode:'fall',start:20,end:50},{mode:'fall',start:20,end:50,band:[16.9,45.8,59.1],rows:'4000',fps:'60'},{mode:'keys',start:20,end:50}]},
  {id:'bat',file:'Raise Up Your Bat [Piano Cover] - Deltarune Chapter 3 OST - Woop (1080p).mp4',runs:[{mode:'fall',start:0,end:136.9},{mode:'keys',start:0,end:136.9}]},
  {id:'knife',file:'Black Knife (from Deltarune) - Piano Tutorial - Sheet Music Boss (1080p).mp4',spread:1.005,runs:[{mode:'fall',start:0,end:135.7,band:[5.9,54.8,80.2]},{mode:'keys',start:0,end:135.7}]}
];
const EXP=()=>window.MC_EXPECTED||{videos:[]};

/* ---------------- the panel ---------------- */
const css=`#mcTest{position:fixed;right:12px;bottom:12px;z-index:5000;width:min(560px,calc(100vw - 24px));max-height:calc(100vh - 24px);display:flex;flex-direction:column;background:var(--panel);color:var(--text);border:1px solid var(--line);border-radius:12px;box-shadow:0 16px 40px rgba(0,0,0,.35);font:13px/1.4 Figtree,system-ui,sans-serif}
#mcTest header{display:flex;align-items:center;gap:8px;padding:10px 12px;border-bottom:1px solid var(--line)}#mcTest header strong{flex:1;font-size:14px}
#mcTest .row{display:flex;flex-wrap:wrap;gap:6px;padding:10px 12px;border-bottom:1px solid var(--line)}
#mcTest .out{overflow:auto;padding:8px 12px;flex:1;min-height:120px}
#mcTest .t{display:flex;gap:8px;padding:4px 0;border-bottom:1px dashed var(--line)}#mcTest .t b{flex:none;width:44px}
#mcTest .ok b{color:#3ecf8e}#mcTest .bad b{color:#ff5a6e}#mcTest .run b{color:var(--dim)}
#mcTest .t small{display:block;color:var(--dim);white-space:pre-wrap;word-break:break-word}#mcTest .sum{padding:8px 12px;font-weight:600}`;
const st=document.createElement('style');st.textContent=css;document.head.appendChild(st);
const P=document.createElement('section');P.id='mcTest';
P.innerHTML=`<header><strong>MIDI-Creator tests</strong><button class="btn" id="tClose">Close</button></header>
<div class="row"><button class="btn on" id="tUnit">Run built-in tests</button><button class="btn" id="tVid">Pick videos and run…</button><button class="btn" id="tRec">Record expected results…</button>
<input type="file" id="tFiles" accept="video/*" multiple hidden></div>
<div class="out" id="tOut"><small>Built-in tests take a few seconds. Video tests need the test videos (see tests/README.md) and take several minutes; keep this tab visible while they run.</small></div><div class="sum" id="tSum"></div>`;
document.body.appendChild(P);
const out=document.getElementById('tOut'),sum=document.getElementById('tSum');
const esc=s=>String(s).replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
function line(name){const d=document.createElement('div');d.className='t run';d.innerHTML=`<b>…</b><div>${esc(name)}<small></small></div>`;out.appendChild(d);out.scrollTop=out.scrollHeight;
  return{done(ok,detail){d.className='t '+(ok?'ok':'bad');d.querySelector('b').textContent=ok?'pass':'FAIL';d.querySelector('small').textContent=detail||'';out.scrollTop=out.scrollHeight;},note(t){d.querySelector('small').textContent=t;}};}
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
let busy=false;
async function guard(fn){
  if(busy)return;busy=true;out.innerHTML='';sum.textContent='';
  // nothing of yours is saved or changed while testing
  const keepAuto=S.set.autosave,keepOpts=(()=>{try{return localStorage.getItem('mc.vid.opts');}catch(e){return null;}})();S.set.autosave=false;
  const keep=snapState();let pass=0,fail=0;
  try{const r=await fn();pass=r.pass;fail=r.fail;}
  catch(e){const l=line('The tests stopped');l.done(false,String(e&&e.stack||e));fail++;}
  finally{
    try{if(vdlg.open){PV.pause();VID.v.pause();vdlg.close();}}catch(e){}
    restoreState(keep);S.set.autosave=keepAuto;try{if(keepOpts!=null)localStorage.setItem('mc.vid.opts',keepOpts);else localStorage.removeItem('mc.vid.opts');vidLoadOpts();}catch(e){}
    busy=false;
  }
  sum.textContent=fail?`${fail} failed, ${pass} passed`:`All ${pass} passed`;sum.style.color=fail?'#ff5a6e':'#3ecf8e';
}
async function runAll(tests){
  let pass=0,fail=0;
  for(const [name,fn] of tests){const l=line(name);try{const r=await fn(l);l.done(r.ok,r.detail);r.ok?pass++:fail++;}catch(e){l.done(false,String(e&&e.stack||e));fail++;}await sleep(0);}
  return{pass,fail};
}
document.getElementById('tClose').onclick=()=>P.remove();
document.getElementById('tUnit').onclick=()=>guard(()=>runAll(UNIT));

/* ---------------- built-in tests ---------------- */
const eqNotes=(a,b,k=n=>n.p+'@'+n.s+'+'+n.d+'v'+n.v)=>{const A=a.map(k).sort(),B=b.map(k).sort();const miss=A.filter(x=>!B.includes(x)),extra=B.filter(x=>!A.includes(x));return{ok:!miss.length&&!extra.length,detail:miss.length||extra.length?'missing '+miss.slice(0,6).join(' ')+' · extra '+extra.slice(0,6).join(' '):a.length+' notes the same'};};
const nt=(p,s,d,v=100)=>({id:nextId++,p,s,d,v});
// a small song with a bit of everything
function sampleSong(){
  return{name:'Test song',tempos:[{tick:0,bpm:120},{tick:PPQ*8,bpm:96}],ts:{n:4,d:4},sigs:[{tick:PPQ*16,n:3,d:4}],marks:[{tick:PPQ*4,name:'Verse',color:'#60a5fa'}],tracks:[
    newTrack({name:'Piano – right hand',program:0,color:'#4da0db',notes:[nt(72,0,480,110),nt(76,0,480,90),nt(74,480,240),nt(76,720,240),nt(79,960,1440,70),nt(77,1920,960),nt(72,PPQ*16,PPQ*3),nt(84,PPQ*15,PPQ*2,80)],pedal:[{s:0,d:1920}]}),
    newTrack({name:'Piano – left hand',program:0,notes:[nt(48,0,1920),nt(55,480,480),nt(52,960,480),nt(43,PPQ*16,PPQ*3)]}),
    newTrack({name:'Bass',program:33,pan:30,vol:90,notes:[nt(36,0,PPQ*2),nt(38,PPQ,PPQ*2),nt(40,PPQ*2,60)]}),
    newTrack({name:'Drums',drum:true,notes:[nt(36,0,240),nt(42,0,120),nt(38,480,240),nt(42,480,120)]})]};
}
// a generated two-hand piece: a melody with some thirds in the right hand, bass and broken chords in the left (the
// hands kept apart: where they overlap, only the music tells them apart, which the real scores in the benchmark test)
function twoHands(seed=7){
  let s=seed;const rnd=()=>{s=(s*1103515245+12345)&0x7fffffff;return s/0x7fffffff;};
  const rh=[],lh=[],scale=[0,2,4,5,7,9,11];let mel=76,root=48;
  for(let bar=0;bar<32;bar++){
    if(bar%2===0)root=[43,41,45,40,38,36][Math.floor(rnd()*6)];
    for(let b=0;b<4;b++){const t=(bar*4+b)*PPQ;
      lh.push({p:root,s:t,d:PPQ*.9|0});lh.push({p:root+7,s:t+PPQ/2,d:PPQ/2|0});if(b%2===1)lh.push({p:root+12,s:t+PPQ/2,d:PPQ/2|0});
      for(let h=0;h<2;h++){mel=Math.max(67,Math.min(86,mel+[-2,-1,1,2,0][Math.floor(rnd()*5)]));const p=mel-((mel%12)&&!scale.includes(mel%12)?1:0);
        rh.push({p,s:t+h*PPQ/2,d:PPQ/2-20|0});if(rnd()<.25)rh.push({p:p-4,s:t+h*PPQ/2,d:PPQ/2-20|0});}
    }
  }
  return{rh,lh};
}
const UNIT=[
  ['Synthetic falling-notes video: every note found on time',async()=>{
    const keep={vw:VID.vw,vh:VID.vh,persp:VID.persp,cal:VID.cal.slice(),step:VID.step,fall:{...VID.fall},kbTop:VID.kbTop,lo:$('vLo').value,hi:$('vHi').value,src:$('vSrc').value,rows:$('vRows').value,lane:$('vLaneW').value};
    try{
      const r=await synRun();
      const ok=r.found===r.total&&!r.extra&&r.startMax<=15&&r.endMax<=15;
      return{ok,detail:`${r.found}/${r.total} found, ${r.extra} extra, start error up to ${r.startMax.toFixed(1)} ms, end error up to ${r.endMax.toFixed(1)} ms`};
    }finally{Object.assign(VID,{vw:keep.vw,vh:keep.vh,persp:keep.persp,cal:keep.cal,step:keep.step,fall:keep.fall,kbTop:keep.kbTop});$('vLo').value=keep.lo;$('vHi').value=keep.hi;$('vSrc').value=keep.src;$('vRows').value=keep.rows;$('vLaneW').value=keep.lane;}
  }],
  ['Note direction: notes falling toward the keys win over sparks rising and a pulsing screen',async()=>{
    // six lanes of notes falling at 250 px/s and lanes of short sparks rising at 150 px/s through a 300 px band. With
    // five lanes of sparks either way could win the vote, and auto takes the way toward the keys; with twenty the sparks
    // clearly win, and only forcing the direction finds the notes. Pulse: no sparks, but twenty lanes of edges swinging
    // up and down at 400 px/s (like a glowing end screen), more of them than note edges.
    const run=(lanes,pulse)=>{
      let seed=7;const rnd=()=>(seed=seed*16807%2147483647)/2147483647;
      const F=90,band=300,times=Float64Array.from({length:F},(_,f)=>f/30),all=[],off=new Uint32Array(F+1);
      const notes=[...Array(6)].map((_,i)=>{let y=-1500+i*17;return[...Array(16)].map(()=>y+=60+rnd()*140);});
      const sparks=[...Array(lanes)].map(()=>{let y=band+250;return[...Array(40)].map(()=>y-=25+rnd()*45);});
      for(let f=0;f<F;f++){
        off[f]=all.length;const t=times[f];
        notes.forEach((l,i)=>{for(const y of l){const top=y+250*t,bot=top+40;if(bot>0&&top<band)all.push(i,Math.max(0,top),Math.min(band,bot),(top<0?1:0)|(bot>band?2:0),0,0,0,0);}});
        sparks.forEach((l,i)=>{for(const y of l){const top=y-150*t;if(top>=0&&top+6<=band)all.push(6+i,top,top+6,0,0,0,0,0);}});
        if(pulse)for(let i=0;i<20;i++)for(let j=0;j<3;j++){const ph=(t+i*.037+j*.11)%.4,top=40+j*90+(ph<.2?400*ph:400*(.4-ph));all.push(6+i,top,top+20,0,0,0,0,0);}
      }
      off[F]=all.length;const segs=Float32Array.from(all);
      return(force,toward)=>{const r=vidFallSpeed(segs,off,times,F,band,force,toward);return r?Math.round(r.v0):null;};
    };
    const few=run(5),many=run(20),pulse=run(0,true),near=(v,w)=>v!=null&&Math.abs(v-w)<=.03*Math.abs(w);
    const auto=few(0,1),away=few(0,-1),swamped=many(0,1),down=many(1,1),pulsed=pulse(0,1),pulsedUp=pulse(0,-1);
    return{ok:near(auto,250)&&near(away,-150)&&near(swamped,-150)&&near(down,250)&&near(pulsed,250)&&near(pulsedUp,250),
      detail:`${auto} px/s with the keys below, ${away} px/s with the keys above; with many more sparks ${swamped} px/s, forced down ${down}; with a pulsing screen ${pulsed} px/s (${pulsedUp} with the keys above)`};
  }],
  ['MIDI file: written and read back the same',async()=>{
    const sg=sampleSong(),bytes=writeMidi(sg),r=parseMidi(bytes.buffer.slice(bytes.byteOffset,bytes.byteOffset+bytes.byteLength));
    const all=g=>g.flatMap(x=>x.notes);const a=eqNotes(sg.tracks.flatMap(t=>t.notes),all(r.groups),n=>n.p+'@'+n.s+'+'+n.d);
    const ok=a.ok&&r.tempos.length===2&&Math.round(r.tempos[1].bpm)===96&&r.sigs.length===1&&r.sigs[0].n===3&&r.marks.length===1&&r.marks[0].name==='Verse';
    return{ok,detail:a.detail+` · tempos ${r.tempos.map(t=>Math.round(t.bpm)).join('/')} · time signature changes ${r.sigs.map(s=>s.n+'/'+s.d).join(',')} · bookmarks ${r.marks.map(m=>m.name).join(',')}`};
  }],
  ['MusicXML score: written and read back the same',async()=>{
    const sg=sampleSong(),xml=writeMusicXML(sg),doc=new DOMParser().parseFromString(xml,'application/xml');
    if(doc.getElementsByTagName('parsererror').length)return{ok:false,detail:'The score is not well-formed XML'};
    const r=parseMusicXML(xml),bad=[];
    sg.tracks.forEach((t,i)=>{const g=r.groups[i];if(!g){bad.push('no layer for '+t.name);return;}if(g.name!==t.name)bad.push(g.name+' ≠ '+t.name);const e=eqNotes(t.notes,g.notes);if(!e.ok)bad.push(t.name+': '+e.detail);});
    if(r.tempos.length!==2||r.sigs.length!==1||r.marks.length!==1)bad.push('tempo, time signature or bookmark lost');
    return{ok:!bad.length,detail:bad.length?bad.join(' · '):`${sg.tracks.length} layers (the hands as one grand staff), every note, tempo, time signature, bookmark and the pedal kept`};
  }],
  ['Project file: written and read back the same',async()=>{
    const sg=sampleSong();sg.tracks[0].mxV=80;sg.tracks[0].nvPan=20;
    const back=projFrom(JSON.parse(JSON.stringify(serProject(sg))));
    const ok=back.tracks.length===4&&back.tracks.every((t,i)=>eqNotes(sg.tracks[i].notes,t.notes).ok)&&back.tracks[0].mxV===80&&back.tracks[0].nvPan===20&&back.sigs.length===1&&back.tempos.length===2;
    return{ok,detail:ok?'layers, notes, slider values, tempos and time signatures kept':'something was lost'};
  }],
  ['Time signatures: bars, beats and positions follow the changes',async()=>{
    const keep={ts:{...song.ts},sigs:song.sigs};
    try{
      song.ts={n:4,d:4};song.sigs=[{tick:PPQ*8,n:3,d:4},{tick:PPQ*14,n:6,d:8}];SIGC.k='';
      const a=barInfo(PPQ*8),b=barInfo(PPQ*13),c=barInfo(PPQ*14+PPQ*3/2*1),bars=[];eachBar(0,PPQ*20,t=>bars.push(t/PPQ));
      const ok=a.bar===3&&a.beat===1&&b.bar===4&&b.beat===3&&c.bar===5&&c.beat===4&&fmtPos(PPQ*13)==='4.3.000'&&bars.join(',')==='0,4,8,11,14,17,20';
      return{ok,detail:`bar lines at beats ${bars.join(', ')} · ${fmtPos(PPQ*13)} · bar ${c.bar} beat ${c.beat}`};
    }finally{song.ts=keep.ts;song.sigs=keep.sigs;SIGC.k='';}
  }],
  ['Tempo changes: times follow the tempo map',async()=>{
    const keep=song.tempos;
    try{song.tempos=[{tick:0,bpm:120},{tick:PPQ*4,bpm:60}];buildTempoMap();const s=secAt(PPQ*6),t=tickAtSec(3);return{ok:Math.abs(s-4)<1e-6&&Math.abs(t-PPQ*5)<1e-6,detail:`6 beats = ${s.toFixed(3)} s, 3 s = beat ${(t/PPQ).toFixed(3)}`};}
    finally{song.tempos=keep;buildTempoMap();}
  }],
  ['Split, join and select across layers',async()=>{
    const A=newTrack({name:'A',notes:[nt(60,0,960),nt(62,960,480)]}),B=newTrack({name:'B',notes:[nt(60,480,480),nt(64,1920,480)]});
    song.tracks=[A,B];S.active=A.id;S.sel.clear();
    selectPitches([60]);const pitch=S.sel.size;selectRange(0,1000);const range=S.sel.size;
    S.playhead=600;splitAtPlayhead();const split=song.tracks.map(t=>t.notes.length).join('+');
    S.sel.clear();for(const n of song.tracks[0].notes)if(n.p===60)S.sel.add(n);joinSel();const joined=song.tracks[0].notes.filter(n=>n.p===60).map(n=>n.s+'+'+n.d).join(',');
    selectRange(0,3000);copySel();pasteClip(4000);const pasted=song.tracks.map(t=>t.notes.length).join('+');
    const ok=pitch===2&&range===3&&split==='3+3'&&joined==='0+960'&&pasted==='4+6';
    return{ok,detail:`pitch ${pitch}, range ${range}, after split ${split}, joined ${joined}, after paste ${pasted}`};
  }],
  ['References: follow their original, saved, exported and deleted',async()=>{
    const A=newTrack({name:'A',notes:[nt(60,0,480),nt(64,480,480)],pedal:[{s:0,d:960}]}),key=t=>t.notes.map(n=>n.p+'@'+n.s).sort().join(' '),bad=[];
    song.tracks=[A];S.active=A.id;S.sel.clear();
    refLayer(A);const R=activeTrack();R.off=PPQ*4;R.tp=12;markEdited();
    if(key(R)!=='72@1920 76@2400')bad.push('plays '+key(R));
    if(JSON.stringify(R.pedal)!=='[{"s":1920,"d":960}]')bad.push('pedal '+JSON.stringify(R.pedal));
    A.notes[0].p=62;A.notes.push(nt(67,960,480));markEdited();
    const follows=key(R);if(follows!=='74@1920 76@2400 79@2880')bad.push('after changing the original: '+follows);
    if(canEdit()||pickable().includes(R))bad.push('its notes can be changed');
    // stretched to twice as long, then moved a beat earlier and an octave down as the arrow keys do
    R.str=2;markEdited();const str=key(R),lens=R.notes.map(n=>n.d).join(',');
    if(str!=='74@1920 76@2880 79@3840'||lens!=='960,960,960')bad.push('stretched: '+str+' lengths '+lens);
    R.len=1.5;markEdited();const longer=R.notes.map(n=>n.d).join(',');if(longer!=='1440,1440,1440'||key(R)!==str)bad.push('longer notes: '+key(R)+' lengths '+longer);
    delete R.len;markEdited();
    S.sel.clear();nudge(-PPQ,-12);if(key(R)!=='62@1440 64@2400 67@3360')bad.push('moved: '+key(R));
    delete R.str;R.off=PPQ*4;R.tp=12;markEdited();
    refLayer(R);const R2=activeTrack();if(R2.ref!==A.id||key(R2)!==follows)bad.push('a reference of it does not link to the original');
    const back=projFrom(JSON.parse(JSON.stringify(serProject({name:'x',tempos:song.tempos,ts:song.ts,sigs:[],marks:[],tracks:song.tracks}))));
    if(back.tracks[1].ref!==back.tracks[0].id||key(back.tracks[1])!==follows)bad.push('the project file lost the link');
    const bytes=writeMidi(song),r=parseMidi(bytes.buffer.slice(bytes.byteOffset,bytes.byteOffset+bytes.byteLength));
    if(r.groups.length!==3||key(r.groups[1])!==follows)bad.push('the MIDI file has '+(r.groups[1]?key(r.groups[1]):'no second layer'));
    // deleting the original: the first reference keeps its notes and becomes the original of the other
    deleteLayer(A);if(isRef(R)||key(R)!==follows||R2.ref!==R.id||key(R2)!==follows)bad.push('deleting the original broke its references');
    makeIndependent(R2);R.notes[0].p=50;markEdited();if(isRef(R2)||key(R2)!==follows)bad.push('an independent layer still follows');
    return{ok:!bad.length,detail:bad.length?bad.join(' · '):'moved and transposed, followed the original, kept in project and MIDI files, survived deleting the original'};
  }],
  ['Layer View: blocks, rows and moving',async()=>{
    const bar=barTicks(),A=newTrack({name:'A',notes:[nt(60,0,480),nt(62,bar*3+240,240)]}),B=newTrack({name:'B',notes:[nt(40,bar,bar)]}),bad=[];
    song.tracks=[A,B];S.active=A.id;S.sel.clear();refLayer(A);const R=activeTrack();R.off=bar*4;markEdited();
    const lay=()=>[...lvLayout()].map(([t,o])=>t.name+':'+o.row+':'+o.s/bar+'-'+o.e/bar).sort().join(' '),key=t=>t.notes.map(n=>n.p+'@'+n.s).join(' ');
    // the blocks span whole bars; the reference packs into its original's row, the bass below
    const l0=lay();if(l0!=='A (ref):0:4-8 A:0:0-4 B:1:1-2')bad.push('packed as '+l0);
    // a bar later with the arrow keys: onto the reference, so to the nearest free row; the reference stays put
    const r0=key(R);S.active=A.id;lvNudge(1,true,false);const l1=lay();
    if(l1!=='A (ref):0:4-8 A:2:1-5 B:1:1-2')bad.push('moved to '+l1);
    if(key(R)!==r0)bad.push('the reference moved along: '+key(R));
    if(A.notes[0].s!==bar)bad.push('notes not moved: '+A.notes[0].s);
    // rows and blocks are kept in a project file
    const back=projFrom(JSON.parse(JSON.stringify(serProject({name:'x',tempos:song.tempos,ts:song.ts,sigs:[],marks:[],tracks:song.tracks}))));
    if(back.tracks.map(t=>t.row).join()!==song.tracks.map(t=>t.row).join()||JSON.stringify(back.tracks[0].blk)!==JSON.stringify(A.blk))bad.push('the project file lost rows or blocks');
    return{ok:!bad.length,detail:bad.length?bad.join(' · '):'packed into rows, moved a bar to the nearest free row with its reference staying put, kept in a project file'};
  }],
  ['Layer View: trimming, repeating, stretching, splitting and removed stretches',async()=>{
    const bar=barTicks(),A=newTrack({name:'A',notes:[0,1,2,3].map(i=>nt(60+i,i*bar,bar/2))}),bad=[],tick=()=>new Promise(r=>setTimeout(r,0));
    song.tracks=[A];S.active=A.id;S.sel.clear();refLayer(A);const R=activeTrack();R.off=bar*8;markEdited();
    const D=(t,side,to,stretch)=>{LV.drag={mode:'edge',side,stretch,t,x0:0,moved:false};lvEdge(1e9,false);LV.drag.x0=lvX(side==='r'?LV.drag.b.e:LV.drag.b.s);lvEdge(lvX(to),false);LV.drag=null;endEdit();};
    const rk=()=>R.notes.map(n=>n.s+':'+n.p+':'+n.d).sort().join(),r0=rk(),vis=t=>t.notes.filter(n=>!n.out);
    // lengthened from 4 to 8 bars: its notes come round again as its own, a seam where; the reference stays as it was
    D(A,'r',bar*8);await tick();if(A.notes.length!==8||A.notes[4].s!==bar*4||(A.seams||[]).join()!==String(bar*4))bad.push('lengthened: '+A.notes.length+' notes');
    // trimmed back to 3 bars: the notes after are left out, not removed
    D(A,'r',bar*3);await tick();if(vis(A).length!==3||A.notes.length!==8||blockOf(A).e!==bar*3)bad.push('trimmed: '+vis(A).length+' of '+A.notes.length+' notes play');
    // stretched twice as long (Ctrl), then over its start backwards would be: here forwards
    D(A,'r',bar*6,true);await tick();if(vis(A)[1].s!==bar*2||vis(A)[1].d!==bar||A.sx!==2)bad.push('stretched: '+vis(A)[1].s+'+'+vis(A)[1].d);
    if(rk()!==r0)bad.push('the reference changed with its original\'s block');
    // the reference lengthened past its block repeats it, and follows a change in its original's notes
    D(R,'r',bar*20);await tick();const reps=R.notes.length;A.notes[0].p=72;markEdited();
    if(reps!==12||R.notes.filter(n=>n.p===72).length!==3)bad.push('reference repeats: '+reps+' notes, '+R.notes.filter(n=>n.p===72).length+' changed');
    // split at bar 2: two layers; the original keeps its second half, left out
    const rs=rk();lvSplit([A],bar*2);await tick();const A2=song.tracks.find(t=>t.name==='A (2)');
    if(!A2||vis(A).length!==1||vis(A2).length!==2||A2.row!==A.row)bad.push('split: '+(A2?vis(A).length+'+'+vis(A2).length:'no second half'));
    if(rk()!==rs)bad.push('the reference changed with the split');
    // a stretch removed from the reference: joined up, then put back
    lvSplice([R],bar*8,bar*10);await tick();if(R.notes.length!==10||!R.cuts||blockOf(R).e!==bar*18)bad.push('removed from the reference: '+R.notes.length+' notes, ends at bar '+blockOf(R).e/bar);
    lvRestoreOne(R,0);await tick();if(rk()!==rs||R.cuts)bad.push('restored: '+R.notes.length+' notes');
    // two stretches removed from an original, the first put back alone: the second stays out
    const O=newTrack({name:'O',notes:[0,1,2,3,4,5,6,7].map(i=>nt(60+i,i*bar,bar/2))});song.tracks.push(O);markEdited();
    lvSplice([O],bar,bar*2);lvSplice([O],bar*3,bar*4);lvRestoreOne(O,0);await tick();
    const ps=[...O.notes].sort((x,y)=>x.s-y.s).map(n=>n.p).join();
    if(ps!=='60,61,62,63,65,66,67'||(O.cuts||[]).length!==1)bad.push('one stretch put back: '+ps);
    // notes cut where a stretch is removed (across it, into it, out of it), and whole again when it is put back
    const N=newTrack({name:'N',notes:[nt(48,0,bar*4),nt(50,bar/2,bar),nt(52,bar*1.5,bar)]});song.tracks.push(N);markEdited();
    const nk=()=>[...N.notes].sort((x,y)=>x.p-y.p).map(n=>n.s/bar+'+'+n.d/bar).join(' ');lvSplice([N],bar,bar*2);const cutK=nk();lvRestoreOne(N,0);
    if(cutK!=='0+3 0.5+0.5 1+0.5'||nk()!=='0+4 0.5+1 1.5+1')bad.push('notes cut: '+cutK+', put back: '+nk());
    // a muted part in the second half
    lvMutePart([A2],bar*4,bar*6,true);if(!inPart(A2.mutes,vis(A2)[1].s)||inPart(A2.mutes,vis(A2)[0].s))bad.push('muted part '+JSON.stringify(A2.mutes));
    return{ok:!bad.length,detail:bad.length?bad.join(' · '):'lengthened with repeats, trimmed and stretched with the reference unchanged, a reference repeating its original, split, a stretch removed and put back, one muted'};
  }],
  ['Layer View: the Values strip',async()=>{
    const A=newTrack({name:'A',notes:[0,1,2,3,4,5].map(i=>nt(60+i,i*PPQ,PPQ/2,64))}),bad=[],tick=()=>new Promise(r=>setTimeout(r,30));
    const was={lane:S.lane,step:S.valStep,view:LV.on,grid:S.gridIdx,fold:$('lvwrap').classList.contains('vfold'),x:LV.x,ppt:LV.ppt};LV.x=0;LV.ppt=.1;
    song.tracks=[A];S.active=A.id;S.sel.clear();S.valStep=1;S.gridIdx=GRIDS.findIndex(g=>g.k==='1/16');
    setView('layers');lvvFold(false);await tick();sizeCanvases();await tick();
    const VH=lvvcol.clientHeight;if(VH<40)bad.push('the strip is '+VH+' px high');
    // velocity painted across the second to fourth notes
    S.lane='vel';VL={mode:'paint',x:lvX(PPQ)-2,lx:lvX(PPQ)-2,y:0};lvvApply(lvX(PPQ*3)+2,lvvY(100,VH));VL={mode:null};endEdit();await tick();
    if(A.notes.map(n=>n.v).join()!=='64,100,100,100,64,64')bad.push('painted '+A.notes.map(n=>n.v).join());
    // the first note's pan dragged to 20 (its own value from then on)
    S.lane='pan';const n0=A.notes[0];VL={mode:'val',x:lvX(0),lx:lvX(0),y:0,start:effVal(n0,A,'pan'),targets:[{n:n0,v:effVal(n0,A,'pan')}]};lvvApply(lvX(0),lvvY(20,VH));VL={mode:null};endEdit();await tick();
    if(n0.pan!==20||A.notes[1].pan!==undefined)bad.push('pan '+n0.pan+', the next one '+A.notes[1].pan);
    // the pedal: added from beat 3, dragged two beats longer, then removed with a right-click
    S.lane='pedal';lvvPedalDown(lvX(PPQ*2)+1,{button:0,altKey:false});lvvPedalDrag(lvX(PPQ*4)+1,{altKey:false});lvvEnd();await tick();
    const ped=JSON.stringify(A.pedal);if(ped!==JSON.stringify([{s:PPQ*2,d:gridT()+PPQ*2}]))bad.push('pedal '+ped);
    lvvPedalDown(lvX(PPQ*2)+3,{button:2,altKey:false});await tick();if((A.pedal||[]).length)bad.push('pedal not removed: '+JSON.stringify(A.pedal));
    // a reference shows its original's values, and can't be changed here
    S.lane='vel';refLayer(A);const R=activeTrack();await tick();drawLVV();
    if(R.notes.map(n=>n.v).join()!=='64,100,100,100,64,64'||$('lvvRef').hidden||lvvCursor(lvX(PPQ),lvvY(100,VH))!=='not-allowed')bad.push('the reference: '+R.notes.map(n=>n.v).join()+(lvvCursor(lvX(PPQ),lvvY(100,VH))));
    S.lane=was.lane;S.valStep=was.step;S.gridIdx=was.grid;LV.x=was.x;LV.ppt=was.ppt;syncLaneTabs();lvvFold(was.fold);if(!was.view)setView('notes');
    return{ok:!bad.length,detail:bad.length?bad.join(' · '):'velocity painted over three notes, one note\'s pan dragged, a pedal added, lengthened and removed, a reference shown read-only'};
  }],
  ['Curves: each kind, layer and song together, edited, moved, saved and exported',async()=>{
    const bad=[],tick=()=>new Promise(r=>setTimeout(r,30)),r1=x=>Math.round(x*10)/10;
    // every kind: linear, smooth (no overshoot past its points), exponential, logarithmic, hold, level past the ends
    const P=[{t:0,v:0,c:'linear'},{t:1000,v:100,c:'smooth'},{t:2000,v:50,c:'exp'},{t:3000,v:150,c:'log'},{t:4000,v:50,c:'hold'},{t:5000,v:200}];
    const at=[-10,500,1500,2500,3500,4500,6000].map(t=>r1(autoAt(P,t))).join();
    if(at!=='0,50,75,68.2,68.2,50,200')bad.push('values '+at);
    let lo=1e9,hi=-1e9;for(let t=1000;t<=2000;t+=10){const v=autoAt(P,t);lo=Math.min(lo,v);hi=Math.max(hi,v);}if(lo<50-1e-9||hi>100+1e-9)bad.push('smooth overshoots: '+r1(lo)+' to '+r1(hi));
    // a layer's curve and the song's multiply (velocity), or add (pan); the volume curve reaches MIDI as controller 7
    const A=newTrack({name:'A',vol:100,notes:[nt(60,0,PPQ),nt(62,PPQ*4,PPQ),nt(64,PPQ*8,PPQ)],auto:{vel:[{t:0,v:100,c:'linear'},{t:PPQ*8,v:50}],pan:[{t:0,v:-20}],vol:[{t:0,v:100,c:'linear'},{t:PPQ*4,v:50}]}});
    const was={auto:song.auto,lane:S.lane,vol:S.lvVol,curve:S.lvCurve,glob:S.lvGlobal,view:LV.on,x:LV.x,ppt:LV.ppt};
    song.tracks=[A];S.active=A.id;S.sel.clear();song.auto={vel:[{t:0,v:50}],pan:[{t:0,v:10}]};
    const pv=A.notes.map(n=>playVals(A,n));if(pv.map(p=>p.v).join()!=='50,38,25'||pv[0].pan!==54)bad.push('played '+pv.map(p=>p.v+'/'+p.pan).join(' '));
    const sa=song.auto;song.auto=null;const bytes=[...writeMidi(song)];song.auto=sa;const cc7=[];for(let i=0;i<bytes.length-2;i++)if((bytes[i]&0xF0)===0xB0&&bytes[i+1]===7)cc7.push(bytes[i+2]);
    // (falling while the first note sounds, as it glides: then 50 from the second note on)
    if(cc7[0]!==100||cc7[cc7.length-1]!==50||cc7.length<4||cc7.some((v,i)=>i&&v>=cc7[i-1])||cc7[cc7.length-2]<85)bad.push('controller 7: '+cc7.join());
    // edited in Layer View's Values strip: a point added on the velocity curve, then its kind changed
    setView('layers');lvvFold(false);LV.x=0;LV.ppt=.1;await tick();sizeCanvases();await tick();
    S.lane='vel';S.lvVol=false;S.lvCurve=true;S.lvGlobal=false;const VH=lvvcol.clientHeight;
    lvvCurveDown(lvX(PPQ*2),lvvCY(120,VH),{button:0,shiftKey:true});lvvEnd();await tick();
    const v=A.auto.vel;if(v.length!==3||v[1].t!==PPQ*2||Math.abs(v[1].v-120)>2)bad.push('added '+JSON.stringify(v));
    act(()=>lvvSetPts(A,'vel',v.map((q,i)=>i===1?{...q,c:'hold'}:q)),'Change curve kind');undo();await tick();
    const A2=song.tracks[0];if(A2.auto.vel[1].c==='hold')bad.push('undo kept the change');
    // the curve moves with the block; backwards, the kinds run the other way (a hold's step at its other end)
    LV.sel=new Set([A2.id]);const t1=A2.auto.vel[1].t;lvNudge(1,true,false);await tick();if(song.tracks[0].auto.vel[1].t-t1!==barTicks())bad.push('not moved with its block');
    const T={auto:{vel:[{t:0,v:10,c:'exp'},{t:960,v:50,c:'hold'},{t:1920,v:90}]}};mapParts(T,x=>3840-x);
    const bk=T.auto.vel.map(p=>p.t+':'+p.v+':'+p.c).join(' ');if(bk!=='1920:90:hold 1921:50:hold 2880:50:log 3840:10:smooth')bad.push('backwards '+bk);
    // kept in a project file, the song's curves too
    const back=projFrom(JSON.parse(JSON.stringify(serProject({name:'x',tempos:song.tempos,ts:song.ts,sigs:[],marks:[],auto:song.auto,tracks:song.tracks}))));
    if(JSON.stringify(back.tracks[0].auto)!==JSON.stringify(normAuto(song.tracks[0].auto))||JSON.stringify(back.auto)!==JSON.stringify(normAuto(song.auto)))bad.push('the project file lost a curve');
    Object.assign(S,{lane:was.lane,lvVol:was.vol,lvCurve:was.curve,lvGlobal:was.glob});song.auto=was.auto;LV.x=was.x;LV.ppt=was.ppt;syncLaneTabs();lvvSyncPills();if(!was.view)setView('notes');
    return{ok:!bad.length,detail:bad.length?bad.join(' · '):'every kind of curve, layer and song together, controller 7, a point added and undone, moved with its block, backwards, kept in a project file'};
  }],
  ['Curves: removed stretches, several points at once, and in Note View',async()=>{
    const bad=[],tick=()=>new Promise(r=>setTimeout(r,30)),bar=barTicks(),key=t=>(t.auto&&t.auto.vel||[]).map(p=>p.t/bar+':'+p.v).join(' ');
    const was={lane:S.lane,vol:S.lvVol,curve:S.lvCurve,glob:S.lvGlobal,view:LV.on,x:LV.x,ppt:LV.ppt,ph:S.playhead};
    const A=newTrack({name:'A',notes:[0,1,2,3].map(i=>nt(60+i,i*bar,bar/2)),auto:{vel:[{t:0,v:100,c:'linear'},{t:bar,v:40,c:'linear'},{t:bar*2,v:120,c:'linear'},{t:bar*3,v:60}]}});
    song.tracks=[A];S.active=A.id;S.sel.clear();const k0=key(A);
    // a stretch removed (bar 2): the curve keeps its values on either side of the join; put back, it is as it was
    lvSplice([A],bar,bar*2);await tick();let T=song.tracks[0];
    if(Math.round(autoAt(T.auto.vel,bar-2))!==40||Math.round(autoAt(T.auto.vel,bar+1))!==120||T.auto.vel[T.auto.vel.length-1].t!==bar*2)bad.push('removed: '+key(T));
    lvRestoreOne(T,0);await tick();T=song.tracks[0];if(key(T)!==k0)bad.push('put back: '+key(T));
    // in Layer View's strip: two points box-selected (Ctrl), dragged a beat later together, copied and pasted at bar 6
    setView('layers');lvvFold(false);LV.x=0;LV.ppt=.1;await tick();sizeCanvases();await tick();
    S.lane='vel';S.lvVol=false;S.lvCurve=true;S.lvGlobal=false;const G=CGEO.strip,VH=lvvcol.clientHeight,P=()=>song.tracks[0].auto.vel;
    lvvCurveDown(lvX(bar)-6,2,{button:0,ctrlKey:true},G);lvvCurveDrag(lvX(bar*2)+6,VH-2,{});lvvEnd();
    if([...CS.sel].sort().join()!=='1,2')bad.push('box selected '+[...CS.sel].join());
    const [x1,y1]=G.at(P()[1].t,P()[1].v,'vel');lvvCurveDown(x1,y1,{button:0},G);lvvCurveDrag(x1+lvX(PPQ)-lvX(0),y1,{});lvvEnd();await tick();
    if(P()[1].t!==bar+PPQ||P()[2].t!==bar*2+PPQ||P()[1].v!==40)bad.push('dragged together: '+key(song.tracks[0]));
    lvvCopy([...CS.sel]);S.playhead=bar*6;lvvPaste();await tick();
    if(P().filter(p=>p.t>=bar*6).map(p=>(p.t-bar*6)/bar+':'+p.v).join()!=='0:40,1:120')bad.push('pasted: '+key(song.tracks[0]));
    lvvDelPts([...CS.sel]);await tick();if(P().length!==4)bad.push('deleted: '+key(song.tracks[0]));
    // in Note View's Values sidebar: a point added at 50%, where note 3 starts
    setView('notes');await tick();sizeCanvases();await tick();const L=CGEO.lane;
    const nn=song.tracks[0].notes[3];lvvCurveDown(laneCX(50,'vel'),yOfTick(nn.s),{button:0},L);lvvEnd();endLane();await tick();
    const q=P().find(p=>Math.abs(p.t-nn.s)<=PPQ/8&&Math.abs(p.v-50)<=2);if(!q)bad.push('added in Note View: '+key(song.tracks[0]));
    Object.assign(S,{lane:was.lane,lvVol:was.vol,lvCurve:was.curve,lvGlobal:was.glob,playhead:was.ph});LV.x=was.x;LV.ppt=was.ppt;syncLaneTabs();lvvSyncPills();if(was.view)setView('layers');
    return{ok:!bad.length,detail:bad.length?bad.join(' · '):'a stretch removed and put back, two points box-selected, dragged together, copied, pasted and deleted, one added in Note View'};
  }],
  ['Layer View: references selected together, sections, merging and the library',async()=>{
    const bad=[],tick=()=>new Promise(r=>setTimeout(r,30)),bar=barTicks(),was={marks:song.marks,ph:S.playhead};
    const A=newTrack({name:'A',notes:[0,1,2,3].map(i=>nt(60+i,i*PPQ,PPQ/2,80))}),B=newTrack({name:'B',vol:50,notes:[nt(40,0,bar),nt(41,bar,bar)]});
    song.tracks=[A,B];S.active=A.id;S.sel.clear();refLayer(A);const R=activeTrack();R.off=bar*2;markEdited();await tick();
    // an original and its references selected together, from either
    lvFamilyItems(R).find(i=>i.label&&i.label.startsWith('Select the original'))?.fn();
    if([...LV.sel].sort().join()!==[A.id,R.id].sort().join())bad.push('family selected: '+[...LV.sel].length);
    // a section (a bookmark to the next) copied, then referenced, at bar 6 and bar 10
    song.marks=[{tick:0,name:'Intro'},{tick:bar*2,name:'Verse'}];const {a,b}=bmRange(0);
    lvCopyRange(a,b,bar*6,false);await tick();const cp=song.tracks.filter(t=>LV.sel.has(t.id));
    if(cp.length!==2||cp.some(t=>isRef(t))||cp.map(t=>blockOf(t).s/bar).join()!=='6,6'||cp.find(t=>t.name.startsWith('B')).notes.length!==2)bad.push('copied: '+cp.map(t=>t.name+'@'+blockOf(t).s/bar).join());
    lvCopyRange(a,b,bar*10,true);await tick();syncRefs();const rf=song.tracks.filter(t=>LV.sel.has(t.id));
    if(rf.length!==2||!rf.every(isRef)||rf.find(t=>t.ref===A.id).notes[0].s!==bar*10)bad.push('referenced: '+rf.map(t=>t.name+'@'+blockOf(t).s/bar).join());
    // two blocks merged: the notes they play, as they play them (B is quieter; a note left out of A's block stays out)
    A.notes[3].out=1;const want=[...A.notes.filter(n=>!n.out).map(n=>playVals(A,n).v),...B.notes.map(n=>Math.round(playVals(B,n).v*.5))].sort((x,y)=>x-y).join();
    lvMerge([A,B]);await tick();const M=song.tracks.find(t=>t.id===S.active);
    const got=M.notes.map(n=>playVals(M,n).v).sort((x,y)=>x-y).join();if(got!==want||song.tracks.includes(A)||song.tracks.includes(B))bad.push('merged '+got+' (wanted '+want+')');
    if(!song.tracks.filter(isRef).every(t=>t.ref!==A.id))bad.push('references of a merged original still link to it');
    undo();await tick();if(!song.tracks.some(t=>t.name==='A')||!song.tracks.some(t=>t.name==='B'))bad.push('undo did not bring the layers back');
    // the library: a reference placed at bar 14, a copy beside it
    const A2=song.tracks.find(t=>t.name==='A');libPlace(A2,bar*14,0,false);await tick();const p1=activeTrack();
    libPlace(A2,bar*14,0,true);await tick();const p2=activeTrack();
    if(!isRef(p1)||blockOf(p1).s!==bar*14||isRef(p2)||blockOf(p2).s!==bar*14||p1.row===p2.row)bad.push('placed: '+[p1,p2].map(t=>t.name+'@'+blockOf(t).s/bar+' row '+t.row).join(', '));
    song.marks=was.marks;S.playhead=was.ph;
    return{ok:!bad.length,detail:bad.length?bad.join(' · '):'an original and its reference selected together, a section copied and referenced, two blocks merged sounding the same (and undone), a reference and a copy placed from the library'};
  }],
  ['Time put in and taken out, a section played twice, and fades',async()=>{
    const bad=[],tick=()=>new Promise(r=>setTimeout(r,30)),bar=barTicks(),was={marks:song.marks,tempos:song.tempos,sigs:song.sigs};
    const P=newTrack({name:'P',notes:[0,1,2,3].map(i=>nt(60+i,i*bar,bar/2))}),B=newTrack({name:'B',notes:[0,1,2,3].map(i=>nt(36+i,i*bar,bar/2))});
    song.tracks=[P,B];S.active=P.id;S.sel.clear();refLayer(P);const R=activeTrack();R.off=bar*6;
    song.marks=[{tick:bar,name:'A'},{tick:bar*3,name:'B'}];song.tempos=[{tick:0,bpm:120},{tick:bar*2,bpm:90}];markEdited();tmChanged();await tick();
    const key=()=>song.tracks.map(t=>t.name+':'+blockOf(t).s/bar+'-'+blockOf(t).e/bar+'['+t.notes.filter(n=>!n.out).map(n=>n.s/bar).sort((x,y)=>x-y).join(',')+']').join(' '),k0=key();
    // two bars put in before bar 2: P (with a reference) is split there, B (without) takes the gap; what follows moves on
    insertTime(bar,bar*2);await tick();syncRefs();
    if(key()!=='P:0-1[0] P (2):3-6[3,4,5] P (ref):8-12[8,9,10,11] B:0-6[0,3,4,5]')bad.push('inserted: '+key());
    if(song.marks.map(m=>m.tick/bar).join()!=='3,5'||song.tempos.map(t=>t.tick/bar).join()!=='0,4')bad.push('marks and tempos after inserting');
    undo();await tick();syncRefs();if(key()!==k0)bad.push('undone: '+key());
    // bar 2 taken out: its notes and its bookmark go, the rest closes up, the tempo change after it moves up with it
    deleteTime(bar,bar*2);await tick();syncRefs();
    if(key().replace(/\[[^\]]*\]/g,'')!=='P:0-3 P (ref):5-9 B:0-3'||song.marks.map(m=>m.name+m.tick/bar).join()!=='B2'||song.tempos.map(t=>t.tick/bar).join()!=='0,1')bad.push('deleted: '+key()+' marks '+song.marks.map(m=>m.name+m.tick/bar).join());
    undo();await tick();syncRefs();
    // the section from bar 2 to 4 played twice: time put in after it and copies of it there, as one step
    const h0=H.undo.length;lvDupInPlace(bar,bar*3,false);await tick();syncRefs();
    if(H.undo.length-h0!==1||!song.tracks.some(t=>t.name==='B (2)'&&blockOf(t).s===bar*3&&t.notes.length===2)||song.marks[1].tick!==bar*5)bad.push('duplicated: '+key());
    undo();await tick();
    // fades: a bar in, half a bar out; the first note silent, the rest full; kept at the ends when the block is trimmed
    const B2=song.tracks.find(t=>t.name==='B');setFade(B2,'in',bar);setFade(B2,'out',bar/2);markEdited();
    if(B2.notes.map(n=>playVals(B2,n).vf).join()!=='0,1,1,1'||getFade(B2,'in')!==bar||getFade(B2,'out')!==bar/2)bad.push('fades '+B2.auto.vol.map(p=>p.t/bar+':'+p.v).join(' '));
    LV.drag={mode:'edge',side:'r',stretch:false,t:B2,x0:0,moved:false};lvEdge(1e9,false);LV.drag.x0=lvX(LV.drag.b.e);lvEdge(lvX(bar*3),false);LV.drag=null;endEdit();await tick();
    const B3=song.tracks.find(t=>t.name==='B');if(getFade(B3,'out')!==bar/2||B3.auto.vol[B3.auto.vol.length-1].t!==bar*3)bad.push('fade out after trimming: '+B3.auto.vol.map(p=>p.t/bar).join());
    const back=projFrom(JSON.parse(JSON.stringify(serProject({name:'x',tempos:song.tempos,ts:song.ts,sigs:[],marks:[],tracks:song.tracks}))));
    if(getFade(back.tracks.find(t=>t.name==='B'),'out',blockOf(B3))!==bar/2)bad.push('the project file lost a fade');
    song.marks=was.marks;song.tempos=was.tempos;song.sigs=was.sigs;tmChanged();
    return{ok:!bad.length,detail:bad.length?bad.join(' · '):'two bars put in (a block split, another taking the gap), a bar taken out, a section played twice as one step, fades kept when trimmed and in a project file'};
  }],
  ['References: swing, humanize, legato, snap and clean up',async()=>{
    const A=newTrack({name:'A',notes:[nt(60,0,120),nt(60,0,60),nt(62,240,120),nt(64,480,120),nt(65,720,120)]}),bad=[],tick=()=>new Promise(r=>setTimeout(r,0));
    song.tracks=[A];S.active=A.id;S.sel.clear();refLayer(A);const R=activeTrack();S.sel.clear();
    const rk=()=>[...R.notes].sort((x,y)=>x.s-y.s||x.p-y.p).map(n=>n.s+'+'+n.d).join(' ');
    // swung 67% on eighths: the second of each pair starts later; the original stays straight
    toolSwing(67,PPQ/2);await tick();if(!R.notes.some(n=>n.s===322)||A.notes[2].s!==240)bad.push('swung: '+rk());
    // legato, then the duplicate on the first key cleaned up
    toolLegato(false,0);cleanNotes('dupes');await tick();
    if(rk()!=='0+322 322+158 480+322 802+79'||A.notes.length!==5)bad.push('legato and clean up: '+rk());
    // a note added to the original: swung too, and the note before now runs up to it
    A.notes.push(nt(67,960,120));markEdited();await tick();if(rk()!=='0+322 322+158 480+322 802+158 960+161')bad.push('after changing the original: '+rk());
    // snap (lengths, to 1/16) and humanize (timing): the nudges stay the same when the reference moves (humanized a bar
    // in, so no note is held at the song's start)
    const gi=S.gridIdx;S.gridIdx=GRIDS.findIndex(g=>g.k==='1/16');snapNotes('len');S.gridIdx=gi;
    shiftRef(R,PPQ*4,0,'Move reference');endEdit();await tick();toolHumanize(10,0);await tick();
    const h0=R.notes.map(n=>n.s-PPQ*4).join();shiftRef(R,PPQ*4,0,'Move reference');endEdit();await tick();const h1=R.notes.map(n=>n.s-PPQ*8).join();
    if(h0!==h1||R.notes.some((n,i)=>Math.abs(n.s-PPQ*8-[0,322,480,802,960][i])>10))bad.push('humanized '+h0+', moved '+h1);
    shiftRef(R,-PPQ*4,0,'Move reference');endEdit();await tick();
    if(R.fx.map(fxKey).join()!=='swing,legato,clean:dupes,snap:len,human')bad.push('changes '+R.fx.map(fxKey).join());
    // kept in a project file
    const back=projFrom(JSON.parse(JSON.stringify(serProject({name:'x',tempos:song.tempos,ts:song.ts,sigs:[],marks:[],tracks:song.tracks}))));
    if(back.tracks[1].notes.map(n=>n.s+'+'+n.d).join()!==R.notes.map(n=>n.s+'+'+n.d).join())bad.push('the project file plays it differently');
    // each taken off again: the original's notes, moved, once more
    for(const k of ['swing','legato','clean:dupes','snap:len','human'])refFx(R,null,k);await tick();
    if(R.fx||R.notes.length!==6||rk()!=='1920+120 1920+60 2160+120 2400+120 2640+120 2880+120')bad.push('taken off: '+rk());
    // undone: humanize back; made independent: the notes it plays stay, as its own
    undo();await tick();const R2=song.tracks.find(isRef),u=R2&&R2.notes.map(n=>n.s).join();
    makeIndependent(R2);await tick();if(!R2||R2.fx||isRef(R2)||R2.notes.map(n=>n.s).join()!==u)bad.push('undone and made independent: '+(R2?R2.notes.map(n=>n.s).join():'gone'));
    return{ok:!bad.length,detail:bad.length?bad.join(' · '):'swung, legato, cleaned up, snapped and humanized as it plays; kept up with a new note in the original, kept its nudges when moved and in a project file, came off again'};
  }],
  ['Arpeggiate, strum, scale and chance: as note tools and on references',async()=>{
    const A=newTrack({name:'A',notes:[nt(60,0,960,90),nt(64,0,960,80),nt(67,5,960,70),nt(62,960,480),nt(65,960,480),nt(69,960,480),nt(72,1920,480)]}),bad=[],tick=()=>new Promise(r=>setTimeout(r,0));
    song.tracks=[A];S.active=A.id;S.sel.clear();
    const L=()=>activeTrack(),key=t=>[...t.notes].sort((x,y)=>x.s-y.s||x.p-y.p).map(n=>n.s+':'+n.p).join(' '),ids=new Set(A.notes.map(n=>n.id));
    // arpeggiated up in eighths: each chord a run for as long as it lasts, the single note left; chord notes keep their ids
    toolFx({k:'arp',pat:'up',g:PPQ/2,gl:'1/8',oct:1,gate:100,seed:1},'Arpeggiate');
    if(key(L())!=='0:60 240:64 480:67 720:60 960:62 1200:65 1920:72'||L().notes.filter(n=>ids.has(n.id)).length!==6)bad.push('arpeggiated: '+key(L()));
    undo();toolFx({k:'arp',pat:'updown',g:PPQ/2,gl:'1/8',oct:2,gate:50,seed:1},'Arpeggiate');
    if(key(L())!=='0:60 240:64 480:67 720:72 960:62 1200:65 1920:72 2160:84'||L().notes.some(n=>n.d!==120))bad.push('up and down over 2 octaves: '+key(L()));
    // strummed low to high, then high to low wider: each strum starts afresh, and the notes keep their ends
    undo();toolFx({k:'strum',dir:'up',sp:20,seed:1},'Strum');toolFx({k:'strum',dir:'down',sp:40,seed:1},'Strum');
    const c1=[...L().notes].filter(n=>n.s<900).sort((x,y)=>x.s-y.s);
    if(c1.map(n=>n.s+':'+n.p).join()!=='0:67,40:64,80:60'||c1.some(n=>n.s+n.d!==(n.p===67?965:960)))bad.push('strummed: '+c1.map(n=>n.s+':'+n.p+'+'+n.d).join());
    // a step up C major, two down, and fitted into C minor pentatonic
    undo();undo();toolFx({k:'scale',kind:'move',root:0,sc:'major',steps:1},'Move along scale');
    if(key(L())!=='0:62 0:65 5:69 960:64 960:67 960:71 1920:74')bad.push('a step up: '+key(L()));
    undo();toolFx({k:'scale',kind:'move',root:0,sc:'major',steps:-2},'Move along scale');
    if(key(L())!=='0:57 0:60 5:64 960:59 960:62 960:65 1920:69')bad.push('two steps down: '+key(L()));
    undo();toolFx({k:'scale',kind:'fit',root:0,sc:'minor pentatonic'},'Fit to scale');
    if(key(L())!=='0:60 0:63 5:67 960:63 960:65 960:70 1920:72')bad.push('fitted: '+key(L()));
    const gk=guessKey(L().notes);if(gk.root!==0||gk.sc!=='minor')bad.push('key guessed as '+NOTE_NAMES[gk.root]+' '+gk.sc);
    // chance: some left out; undone, all seven back
    undo();toolFx({k:'chance',pct:50,seed:1},'Chance');const kept=L().notes.length;undo();
    if(!(kept>0&&kept<7)||L().notes.length!==7)bad.push('chance kept '+kept+', undone '+L().notes.length);
    // on a reference: the same notes as the tool, as it plays; a chord added to the original is arpeggiated too
    const A2=L();refLayer(A2);const R=()=>song.tracks.find(isRef);S.sel.clear();
    toolFx({k:'arp',pat:'up',g:PPQ/2,gl:'1/8',oct:1,gate:100,seed:1},'Arpeggiate');await tick();
    if(key(R())!=='0:60 240:64 480:67 720:60 960:62 1200:65 1920:72'||key(A2)!=='0:60 0:64 5:67 960:62 960:65 960:69 1920:72')bad.push('reference arpeggiated: '+key(R()));
    A2.notes.push(nt(60,2880,480),nt(63,2880,480));markEdited();await tick();
    if(!key(R()).endsWith('1920:72 2880:60 3120:63'))bad.push('after changing the original: '+key(R()));
    toolFx({k:'chance',pct:60,seed:11},'Chance');toolFx({k:'scale',kind:'move',root:0,sc:'major',steps:2},'Move along scale');await tick();
    const k1=key(R());SYNCSIG.delete(R());syncRefs();if(key(R())!==k1)bad.push('chance left out other notes when worked out again');
    if(R().fx.map(fxKey).join()!=='arp,chance,scale:move')bad.push('modifiers '+R().fx.map(fxKey).join());
    const st=fxStats(R());if(st[0]!=='3 chords became 8 notes'||!/ of 9 notes left out$/.test(st[1]))bad.push('stats '+st.join(' / '));
    // kept in a project file
    const back=projFrom(JSON.parse(JSON.stringify(serProject({name:'x',tempos:song.tempos,ts:song.ts,sigs:[],marks:[],tracks:song.tracks}))));
    if(back.tracks[1].notes.map(n=>n.s+':'+n.p).join()!==R().notes.map(n=>n.s+':'+n.p).join())bad.push('the project file plays it differently');
    // the panel: a chance of 100% changes nothing
    const kp=FXS.chance.pct;S.active=A2.id;fxPanel('chance',100,100);const inp=document.querySelector('.fxtool input[type=number]');inp.value='100';inp.dispatchEvent(new Event('change',{bubbles:true}));
    const n0=H.undo.length;document.querySelector('.fxtool [data-fa="go"]').click();fxPanelClose();FXS.chance.pct=kp;if(H.undo.length!==n0)bad.push('a 100% chance made a change');
    return{ok:!bad.length,detail:bad.length?bad.join(' · '):'arpeggiated, strummed (afresh each time), moved along and fitted into a scale, notes left out by chance and back; on a reference as it plays, keeping up with the original and the same each time, and in a project file'};
  }],
  ['Curves from MIDI controllers, glide, the tempo curve and shapes',async()=>{
    const bad=[],tick=()=>new Promise(r=>setTimeout(r,0)),r3=x=>Math.round(x*1000)/1000;
    // a file with a volume fade drawn as many controller changes, a pan step and reverb coming in
    const trk=[];let last=0;const put=(t,b)=>{const a=[];vlq(t-last,a);trk.push(...a,...b);last=t;};
    put(0,[0xB0,7,100]);put(0,[0xB0,10,64]);put(0,[0x90,60,100]);for(let i=1;i<=32;i++)put(i*30,[0xB0,7,100-i*3]);
    put(1920,[0xB0,10,20]);put(1920,[0xB0,91,40]);put(1920,[0x90,64,90]);put(3840,[0x80,60,0]);put(3840,[0x80,64,0]);trk.push(0,0xFF,0x2F,0);
    const g=parseMidi(new Uint8Array([0x4D,0x54,0x68,0x64,0,0,0,6,0,0,0,1,1,0xE0,0x4D,0x54,0x72,0x6B,0,0,trk.length>>8,trk.length&255,...trk]).buffer).groups[0],au=g.auto||{};
    if(JSON.stringify(au.vol)!=='[{"t":0,"v":100,"c":"linear"},{"t":960,"v":4,"c":"hold"}]')bad.push('volume curve '+JSON.stringify(au.vol));
    if(!au.pan||au.pan.map(q=>q.t+':'+q.v).join()!=='0:0,1920:-44'||g.notes.some(n=>n.pan!=null))bad.push('pan curve '+JSON.stringify(au.pan));
    if(g.def.rev!==40||!au.rev||au.rev.map(q=>q.v).join()!=='0,100')bad.push('reverb '+g.def.rev+' '+JSON.stringify(au.rev));
    // glide: a fade in rises while the note is held; a note where nothing changes doesn't glide
    const A=newTrack({name:'A',notes:[nt(60,0,1920),nt(62,2400,480)],auto:{vol:[{t:0,v:0,c:'linear'},{t:1920,v:100}]}});
    song.tracks=[A];S.active=A.id;S.sel.clear();
    const gl=glideFor(A,A.notes[0],0,1920);if(!gl||gl[0][1]!==0||gl[gl.length-1][1]!==1||!(gl[32][1]>.3&&gl[32][1]<.4)||glideFor(A,A.notes[1],2400,2880))bad.push('glide '+(gl&&gl.length));
    // the tempo gliding from 120 down to 60 over four bars: as long as it should be, back and forth; kept in files
    const keepT=song.tempos;song.tempos=normTempos([{tick:0,bpm:120,c:'linear'},{tick:7680,bpm:60}]);buildTempoMap();
    const exact=60/(PPQ*(-60/7680))*Math.log(.5);
    if(Math.abs(secAt(7680)-exact)>.002||tempoAt(3840)!==90||Math.round(tickAtSec(secAt(5000)))!==5000)bad.push('tempo glide '+r3(secAt(7680))+' s, '+tempoAt(3840));
    if(parseMidi(writeMidi(song).buffer).tempos.length<100)bad.push('the glide in a MIDI file');
    if(projFrom(JSON.parse(JSON.stringify(serProject({name:'x',tempos:song.tempos,ts:song.ts,sigs:[],marks:[],tracks:song.tracks})))).tempos[0].c!=='linear')bad.push('the glide in a project file');
    // edited as a curve: always one from the start
    lvvSetPts(song,'tempo',[{t:5,v:100,c:'smooth'},{t:3840,v:140,c:'hold'}]);if(song.tempos.map(x=>x.tick+':'+x.bpm+':'+(x.c||'')).join()!=='0:100:smooth,3840:140:')bad.push('tempo points '+JSON.stringify(song.tempos));
    song.tempos=keepT;buildTempoMap();
    // shapes: a ramp, a sine wave and a square one on the volume curve over a stretch, the points around it kept
    const was={vol:S.lvVol,tempo:S.lvTempo,glob:S.lvGlobal,mode:SHP.mode,lfo:{...SHP.lfo},per:SHP.per.vol,ramp:{...SHP.ramp}};
    S.lvVol=true;S.lvTempo=false;S.lvGlobal=false;A.auto={vol:[{t:0,v:100,c:'smooth'},{t:4800,v:60,c:'smooth'}]};
    SHP.mode='ramp';SHP.ramp={from:100,to:0,c:'exp'};shapeApply('vol',{a:960,b:2880,what:'x'});
    if(A.auto.vol.map(q=>q.t+':'+q.v+':'+q.c).join()!=='0:100:smooth,960:100:exp,2880:0:smooth,4800:60:smooth')bad.push('ramp '+JSON.stringify(A.auto.vol));
    undo();const A2=activeTrack();SHP.mode='lfo';SHP.lfo={wave:'sine',per:PPQ};SHP.per.vol={mid:80,depth:20};shapeApply('vol',{a:0,b:1920,what:'x'});
    const sv=activeTrack().auto.vol;if(sv.length!==18||sv.slice(0,5).map(q=>q.v).join()!=='80,100,80,60,80'||sv[17].t!==4800)bad.push('sine '+sv.length+' '+sv.slice(0,5).map(q=>q.v));
    undo();SHP.lfo={wave:'square',per:PPQ};shapeApply('vol',{a:0,b:960,what:'x'});const sq=activeTrack().auto.vol;
    if(sq.slice(0,4).map(q=>q.v+q.c).join()!=='100hold,60hold,100hold,60hold')bad.push('square '+JSON.stringify(sq.slice(0,4)));
    Object.assign(SHP,{mode:was.mode,lfo:was.lfo,ramp:was.ramp});if(was.per)SHP.per.vol=was.per;else delete SHP.per.vol;
    // a line drawn by hand keeps only the points it needs
    if(thinPts(Array.from({length:50},(x,i)=>({t:i*10,v:20+i})),1).length!==2)bad.push('a straight line kept its points');
    S.lvVol=was.vol;S.lvTempo=was.tempo;S.lvGlobal=was.glob;
    return{ok:!bad.length,detail:bad.length?bad.join(' · '):'controller changes became curves (a drawn fade as one line), a fade in glides while held, the tempo glides as long as it should and keeps it in MIDI and project files, ramps and waves took the place of the points in their stretch'};
  }],
  ['Hands: a two-hand piece split back into its hands',async()=>{
    let ok=0,n=0;for(const seed of [3,7,11]){const {rh,lh}=twoHands(seed),notes=rh.map(x=>({...x,h:0})).concat(lh.map(x=>({...x,h:1}))),lab=splitHands(notes);notes.forEach((x,i)=>{n++;if(lab[i]===x.h)ok++;});}
    const pct=ok/n*100;return{ok:pct>=98,detail:pct.toFixed(1)+'% of '+n+' notes in the right hand'};
  }],
  ['Layer sliders: new note values and whole-layer values',async()=>{
    const tr=newTrack({pan:64,rev:24,muf:0,nvV:90,nvPan:20,mxV:50,mxPan:10,mxRev:200}),nn=newNoteVals(tr),pv=playVals(tr,{v:100,pan:30});
    const ok=nn.v===90&&nn.pan===20&&nn.rev===undefined&&pv.v===50&&pv.pan===40&&pv.rev===48;
    return{ok,detail:`new note ${JSON.stringify(nn)} · plays as ${JSON.stringify(pv)}`};
  }]
];

// the synthetic video: notes with glow, outlines, labels and sparks fall onto a keyboard that lights up; the
// falling-notes reader is run on its frames and must find every note
const SYN=(()=>{
  const W=1280,H=720,HIT=560,V=260,lo=36,hi=96,k0=KG.x0[lo],span=KG.x1[hi]-k0,kx=k=>(k-k0)/span*W;
  const RH='#4ade80',LH='#60a5fa',notes=[],add=(p,t0,t1,c)=>notes.push({p,t0,t1,c});
  add(72,1.0,1.4,RH);add(74,1.4,1.8,RH);add(76,1.8,2.2,RH);add(76,2.26,2.6,RH);add(78,2.6,3.0,RH);add(79,3.0,3.25,RH);add(79,3.31,3.6,RH);add(82,3.6,4.4,RH);
  add(48,1.0,3.0,LH);add(60,2.0,2.8,LH);add(62,2.0,2.8,LH);add(52,3.0,3.5,LH);add(51,3.5,4.0,LH);add(55,4.0,4.1,LH);add(69,4.2,4.6,RH);add(69,4.6,5.0,RH);
  function draw(g,t){
    const bg=g.createLinearGradient(0,0,0,HIT);bg.addColorStop(0,'#101018');bg.addColorStop(1,'#1c1c2a');g.fillStyle=bg;g.fillRect(0,0,W,H);
    g.fillStyle='#2c2c3e';for(let p=lo;p<=hi;p++)if(p%12===0)g.fillRect(Math.round(kx(KG.x0[p])),0,1,HIT);
    for(const pass of [false,true])for(const n of notes){
      if(isBlack(n.p)!==pass)continue;const yb=HIT-(n.t0-t)*V,yt=HIT-(n.t1-t)*V;if(yb<0||yt>HIT)continue;
      const x0=kx(KG.x0[n.p])+2,x1=kx(KG.x1[n.p])-2;g.save();g.beginPath();g.rect(0,0,W,HIT);g.clip();
      g.shadowColor=n.c;g.shadowBlur=16;g.fillStyle=n.c;rr(g,x0,yt,x1-x0,yb-yt,5);g.fill();g.shadowBlur=0;g.lineWidth=2;g.strokeStyle='rgba(0,0,0,.65)';g.stroke();
      g.fillStyle='#08130c';g.font='bold 10px sans-serif';g.textAlign='center';g.fillText(noteName(n.p).replace(/\d/,''),(x0+x1)/2,yb-5);g.restore();
    }
    const fg=g.createLinearGradient(0,HIT-90,0,HIT);fg.addColorStop(0,'rgba(16,16,24,0)');fg.addColorStop(1,'rgba(16,16,24,.85)');g.fillStyle=fg;g.fillRect(0,HIT-90,W,90);
    for(const n of notes)if(t>=n.t0&&t<n.t1){const x=(kx(KG.x0[n.p])+kx(KG.x1[n.p]))/2;for(let s=0;s<6;s++){const a=(t*7+s*1.3+n.p)%1;g.fillStyle='rgba(255,240,200,'+(1-a).toFixed(2)+')';g.fillRect(x+Math.sin(s*2.1+t*9)*12,HIT-a*60,3,3);}}
    const lit=p=>{const n=notes.find(n=>n.p===p&&t>=n.t0&&t<n.t1);return n&&n.c;};
    for(let p=lo;p<=hi;p++)if(!isBlack(p)){g.fillStyle=lit(p)||'#f4f4f4';g.fillRect(kx(KG.x0[p])+.5,HIT,kx(KG.x1[p])-kx(KG.x0[p])-1,H-HIT);}
    for(let p=lo;p<=hi;p++)if(isBlack(p)){g.fillStyle=lit(p)||'#151515';g.fillRect(kx(KG.x0[p]),HIT,kx(KG.x1[p])-kx(KG.x0[p]),100);}
  }
  return{W,H,HIT,lo,hi,notes,draw};
})();
async function synRun(){
  const {W,H,HIT}=SYN,fps=30;
  VID.vw=W;VID.vh=H;VID.persp=false;VID.cal=[0,W,HIT+130,HIT+70];VID.step=4;$('vLo').value=SYN.lo;$('vHi').value=SYN.hi;$('vSrc').value='fall';$('vRows').value='200';$('vLaneW').value='50';
  VID.kbTop=HIT;vidAutoBand(true);
  const map=vidMap(),G=vidFallGeom(map),cv=document.createElement('canvas');cv.width=W;cv.height=H;const g=cv.getContext('2d'),read=vidFallReader(G);
  const oldSeek=window.vidSeek,oldV=VID.v;VID.v=cv;window.vidSeek=async t=>{SYN.draw(g,t);};
  let bg;try{bg=await vidFallLearnBg(G,read,map,0,6,()=>{});}finally{window.vidSeek=oldSeek;VID.v=oldV;}
  const cols=[],times=[];for(let f=0;f<6*fps;f++){const t=f/fps;SYN.draw(g,t);times.push(t);cols.push(vidFallFrame(G,bg,vidFallView(G,read(cv))));}
  let tot=0;for(const c of cols)tot+=c.length;const segs=new Float32Array(tot),off=new Uint32Array(cols.length+1);let q=0;cols.forEach((c,i)=>{off[i]=q;segs.set(c,q);q+=c.length;});off[cols.length]=q;
  const T=Float64Array.from(times),F=T.length;let band=0;for(let i=0;i<G.N;i++)band=Math.max(band,Math.abs(G.sB[i]-G.sA[i]));
  const sp=vidFallSpeed(segs,off,T,F,band),got=vidDetectFall({segs,off,times:T,F,N:G.N,sK:G.sK,sA:G.sA,sB:G.sB,p:map.map(m=>m.p),black:map.map(m=>m.black),v0:sp.v0,a:sp.a,band},vidOpts());
  const used=new Set(),e0=[],e1=[];for(const n of SYN.notes){const i=got.findIndex((x,j)=>!used.has(j)&&x.p===n.p&&Math.abs(x.t0-n.t0)<.08);if(i>=0){used.add(i);e0.push((got[i].t0-n.t0)*1000);e1.push((got[i].t1-n.t1)*1000);}}
  return{found:e0.length,total:SYN.notes.length,extra:got.length-used.size,startMax:Math.max(0,...e0.map(Math.abs)),endMax:Math.max(0,...e1.map(Math.abs))};
}

/* ---------------- video tests ---------------- */
// the dialog's settings back to what the page starts with, so your saved ones do not change the results (not the
// ones that belong with the keyboard marks: spread and perspective, set from the recording)
function videoDefaults(){
  for(const id of VOPT_IDS){if(/^v(Spread|LRm|HW|HB)$/.test(id))continue;const e=$(id);if(!e)continue;if(e.type==='checkbox')e.checked=e.defaultChecked;else if(e.tagName==='SELECT'){const o=[...e.options].find(o=>o.defaultSelected)||e.options[0];e.value=o.value;}else e.value=e.defaultValue;e.dispatchEvent(new Event('input',{bubbles:true}));}
}
async function openVideo(file){
  try{for(const k of Object.keys(localStorage))if(k.startsWith('mc.vid.cal.'))localStorage.removeItem(k);}catch(e){}
  const dt=new DataTransfer();dt.items.add(file);if(!vdlg.open)$('bVideo').click();
  VID.cal=[null,null,null,null];$('vFile').files=dt.files;$('vFile').dispatchEvent(new Event('change'));
  for(let i=0;i<80&&!(VID.vw&&VID.cal.every(v=>v!=null));i++)await sleep(250);await sleep(800);
  if(!VID.vw)throw new Error('the video could not be opened');
}
const pct=(v,h)=>Math.round(v/h*1000)/10;
async function analyzeRun(r){
  videoDefaults();$('vLRm').value=1;$('vLRmN').value=1;$('vLRm').dispatchEvent(new Event('input',{bubbles:true}));$('vSrc').value=r.mode;$('vSrc').dispatchEvent(new Event('change'));
  if(r.mode==='fall'){
    if(r.band){const set=(id,v)=>{const e=$(id);e.value=v;e.dispatchEvent(new Event('input',{bubbles:true}));};set('vBandTop',r.band[0]);set('vBandBot',r.band[1]);set('vBandHit',r.band[2]);}
    else if(r.fall)VID.fall={...r.fall};
  }
  if(r.rows)$('vRows').value=r.rows;if(r.fps)$('vFps').value=r.fps;
  $('vStart').value=r.start;$('vEnd').value=r.end;
  const before=VID.notes;$('vAnalyze').click();await sleep(300);
  for(let i=0;i<3000&&VID.running;i++)await sleep(250);
  for(let i=0;i<80&&VID.notes===before;i++)await sleep(100);await sleep(300);
  return{notes:VID.notes.map(n=>[n.p,Math.round(n.t0*1000),Math.round(n.t1*1000)]),fall:{...VID.fall}};
}
// every expected note matched to one found on the same key starting within 40 ms; ends more than 60 ms apart are changes
function compare(exp,got){
  const used=new Set(),missing=[],moved=[];
  const byP=new Map();got.forEach((n,i)=>{if(!byP.has(n[0]))byP.set(n[0],[]);byP.get(n[0]).push(i);});
  for(const e of exp){let best=-1,bd=41;for(const i of byP.get(e[0])||[]){if(used.has(i))continue;const d=Math.abs(got[i][1]-e[1]);if(d<bd){bd=d;best=i;}}
    if(best<0){missing.push(e);continue;}used.add(best);if(Math.abs(got[best][2]-e[2])>60)moved.push([e,got[best]]);}
  const extra=got.filter((n,i)=>!used.has(i));
  const f=n=>noteName(n[0])+' '+(n[1]/1000).toFixed(2)+'–'+(n[2]/1000).toFixed(2);
  return{diff:missing.length+extra.length+moved.length,detail:`${got.length} notes (expected ${exp.length})`+(missing.length?` · missing ${missing.slice(0,5).map(f).join(', ')}`:'')+(extra.length?` · extra ${extra.slice(0,5).map(f).join(', ')}`:'')+(moved.length?` · ends moved ${moved.slice(0,5).map(([a,b])=>f(a)+' → '+(b[2]/1000).toFixed(2)).join(', ')}`:'')};
}
function pickFiles(){
  return new Promise(res=>{const inp=document.getElementById('tFiles');inp.value='';inp.onchange=()=>res([...inp.files]);inp.click();});
}
// the plan's videos among the files picked (by name, or by size for a renamed copy)
function matchFiles(files){
  const ex=EXP().videos;const m=[];
  for(const pl of PLAN){const e=ex.find(v=>v.id===pl.id);const f=files.find(f=>f.name===pl.file)||(e&&files.find(f=>f.size===e.size));if(f)m.push({pl,e,f});}
  return m;
}
async function videoTests(files){
  const m=matchFiles(files);if(!m.length){const l=line('Video tests');l.done(false,'None of the picked files is one of the test videos (see tests/README.md).');return{pass:0,fail:1};}
  const tests=[];
  for(const {pl,e,f} of m){
    if(!e){tests.push([pl.id+': no expected results recorded',async()=>({ok:false,detail:'Record expected results first.'})]);continue;}
    tests.push([pl.id+': open the video and find the keyboard',async l=>{
      await openVideo(f);const a=e.auto,c=VID.cal;if(!a)return{ok:true,detail:'opened'};
      const d=Math.max(...[0,1,2,3].map(i=>Math.abs(c[i]-a.cal[i])));
      const ok=d<=4&&+$('vLo').value===a.lo&&+$('vHi').value===a.hi&&Math.abs(+$('vSpread').value-a.spread)<.003;
      return{ok,detail:`marks within ${d.toFixed(1)} px of the recorded ones · keys ${noteName(+$('vLo').value)}–${noteName(+$('vHi').value)} · spread ${$('vSpread').value}`};
    }]);
    e.runs.forEach((r,ri)=>tests.push([`${pl.id}: ${r.mode==='fall'?'falling notes':'bottom keyboard'} ${r.start}–${r.end} s${r.band?' (scan area '+r.band.join('/')+'%)':''}${r.rows?' rows '+r.rows:''}${r.fps?' at '+r.fps+'/s':''}`,async l=>{
      // the recorded marks, so the result does not depend on auto-position
      VID.persp=false;VID.cal=e.cal.slice();$('vLo').value=e.lo;$('vHi').value=e.hi;vidSyncRangeUI();$('vSpread').value=e.spread;$('vSpreadN').value=e.spread;$('vSpread').dispatchEvent(new Event('input',{bubbles:true}));
      l.note('analyzing…');const got=await analyzeRun(r),c=compare(r.notes,got.notes);
      return{ok:c.diff<=1,detail:c.detail};
    }]));
  }
  return runAll(tests);
}
document.getElementById('tVid').onclick=async()=>{const files=await pickFiles();if(files.length)guard(async()=>{const u=await runAll(UNIT),v=await videoTests(files);return{pass:u.pass+v.pass,fail:u.fail+v.fail};});};

/* ---------------- recording expected results ---------------- */
async function record(files,save){
  const m=matchFiles(files),videos=[];let pass=0;
  for(const {pl,f} of m){
    const l=line(pl.id+': recording');
    await openVideo(f);
    // the spread set for this video (auto-position also sets one), then the marks are what the runs use
    const auto={cal:VID.cal.slice(),lo:+$('vLo').value,hi:+$('vHi').value,spread:+$('vSpread').value};
    if(pl.spread){$('vSpread').value=pl.spread;$('vSpreadN').value=pl.spread;$('vSpread').dispatchEvent(new Event('input',{bubbles:true}));}
    const v={id:pl.id,file:pl.file,size:f.size,vw:VID.vw,vh:VID.vh,cal:VID.cal.slice(),lo:+$('vLo').value,hi:+$('vHi').value,spread:+$('vSpread').value,auto,runs:[]};
    for(const r of pl.runs){l.note('analyzing '+r.mode+' '+r.start+'–'+r.end+' s…');const got=await analyzeRun(r);v.runs.push({...r,fall:r.mode==='fall'&&!r.band?got.fall:undefined,notes:got.notes});}
    videos.push(v);l.done(true,v.runs.map(r=>r.mode+': '+r.notes.length+' notes').join(' · '));pass++;
  }
  const text='/* Expected results for the video tests (tests/run.js), recorded '+new Date().toISOString().slice(0,10)+'.\n   Notes are [key, start ms, end ms]. Re-record with the "Record expected results" button. */\nwindow.MC_EXPECTED='+JSON.stringify({version:1,videos})+';\n';
  await save(text);
  return{pass,fail:0};
}
document.getElementById('tRec').onclick=async()=>{const files=await pickFiles();if(files.length)guard(()=>record(files,async text=>{await saveBytes('expected.js',new TextEncoder().encode(text),'text/javascript');const l=line('Saved expected.js');l.done(true,'Put it in the tests folder and commit it.');}));};
// for automation: run with files given directly, and save the recording through a function
window.MC_TESTS={UNIT,runAll,guard,videoTests,record,PLAN};
})();
