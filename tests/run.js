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
