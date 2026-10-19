# MIDI-Creator tests

The tests run inside the app. Open `index.html#test` (or `tests/index.html`, which takes you there) and a panel appears in the bottom-right corner. It works straight from your disk; no server needed.

While the tests run, auto-save is switched off and your saved video settings are put back afterwards, so your tabs and preferences don't change.

## Built-in tests

**Run built-in tests** needs no files and takes a few seconds. It covers:

| Test | What it checks |
|---|---|
| Synthetic falling-notes video | A video drawn on the fly has 16 known notes with glow, outlines, labels and sparks. The falling-notes reader must find every one, with no extras, within 15 ms. |
| Note direction | Notes falling toward the keys win over sparks rising from them, whichever side the keys are on, and forcing a direction finds the notes even when the sparks clearly win. |
| MIDI file | A song with layers, drums, the pedal, tempo and time-signature changes and a bookmark is saved as MIDI and read back unchanged. |
| MusicXML score | The same song is exported as sheet music (with the two hands as one grand staff) and read back unchanged, velocities included. |
| Project file | The song is saved as a project, slider values included, and read back unchanged. |
| Time signatures | Bar lines, beats and positions follow time-signature changes. |
| Tempo changes | Times follow the tempo map. |
| Split, join and select | Selecting by key and by time across layers, splitting at the playhead, joining, and copy/paste back into each note's own layer. |
| References | A reference plays its original's notes and pedal moved and transposed, follows changes to the original, stretches, moves as a whole with the arrow keys, can't have single notes edited, links to the original when made from another reference, and keeps its link in a project file. MIDI export holds its notes; deleting the original leaves the references working; an independent layer no longer follows. |
| Layer View | Blocks span whole bars and pack into rows (a reference shares its original's row); moving a block onto another sends it to the nearest free row, moves its notes and leaves its references where they are; rows and blocks are kept in a project file. |
| Layer View editing | An original lengthened past its notes repeats them (with a seam), trimmed leaves the notes beyond out without removing them, and stretched doubles them, all leaving its reference unchanged; a reference lengthened past its block repeats it and follows a change in its original; a split shares the notes out between two layers in one row; a stretch is removed from a reference and put back; of two stretches removed from an original only the first is put back; notes across, into and out of a removed stretch are cut there and whole again when it is put back; another is muted. |
| Layer View values | In Layer View's Values strip, velocity painted across three notes changes just those; dragging one note's pan gives it a value of its own; a pedal region is added, lengthened and removed; a reference shows its original's values and can't be changed there. |
| Curves | Each kind of curve gives the right values (smooth never overshooting its points); a layer's and the song's curves multiply velocity and add up for pan; the volume curve reaches MIDI as controller 7, falling while a note is held; a point added in the Values strip lands on the grid and an undo puts a change back; a curve moves with its block and runs the other way when stretched backwards; project files keep layer and song curves. |
| Curves, more | A removed stretch takes the curve points in it along and keeps the values either side of the join, and putting it back gives the curve back; in the Values strip two points are box-selected (Ctrl), dragged together, copied, pasted at the playhead and deleted; a point is added in Note View's Values sidebar. |
| Layer View extras | An original and its reference are selected together from the reference; a section (from a bookmark to the next) is copied and referenced at later bars; two blocks merged into one sound the same, a note trimmed off staying out, and an undo brings them back; the library places a reference and a copy at a bar, in different rows. |
| Time and fades | Two bars put in split a block that has references and give a block without any the gap, moving what follows (bookmarks and tempo too); a bar taken out closes up; a section played twice in place is one step; fades give the right volumes, stay at a block's end when it is trimmed, and are kept in a project file. |
| Controllers, glide, tempo, shapes | A MIDI file's volume fade (many controller changes) becomes one straight line, a pan step a step and reverb coming in a curve on a layer with that reverb; a fade in rises while its note is held, and a note where nothing changes doesn't glide; the tempo gliding from 120 to 60 lasts exactly as long as it should, goes back and forth between ticks and seconds, and is kept in MIDI and project files; tempo points edited as a curve always start at 0; a ramp, a sine wave and a square wave take the place of the points in their stretch only; a straight hand-drawn line keeps two points. |
| Reference changes | Swing, legato, clean up, snap and humanize on a reference change how it plays and leave its original alone; it keeps up with a note added to the original; the humanize nudges stay the same when it moves and in a project file; each comes off again; undo brings one back, and an independent layer keeps the notes as they sounded. |
| Arpeggiate, strum, scale, chance | As note tools: chords become runs (up, and up and down over two octaves) with the chord notes keeping their ids; a strum done twice starts afresh and keeps the ends; notes move a step up and two down a scale, and fit into another; the key is guessed; chance leaves some out and undo brings them back. On a reference: the same notes, as it plays; a chord added to the original is arpeggiated too; chance leaves out the same notes each time; the modifier list counts right; a project file plays it the same; the panel changes nothing at 100%. |
| Hands | A generated two-hand piece is split back into its hands (at least 98% right). |
| Layer sliders | The new-note values and whole-layer values. |

## Video tests

The video tests run the video import on six real piano tutorials and compare every note with the results recorded in `expected.js`. The videos aren't in the repository; you need your own copies:

| Id | File name |
|---|---|
| rules | It's Pronounced -Rules- (from Deltarune Chapter 2) - Piano Tutorial - Sheet Music Boss (1080p).mp4 |
| spider | Lattice Spider Dance Synthesia - AkiPiano (1080p).mp4 |
| amoeba | Clairo - Amoeba - Easy_Intermediate Piano Solo Tutorial (Sheet Music Available).mp4 |
| castle | My Castle Town (EASY Piano Tutorial) - Deltarune - Merendi Music (1080p).mp4 |
| bat | Raise Up Your Bat [Piano Cover] - Deltarune Chapter 3 OST - Woop (1080p).mp4 |
| knife | Black Knife (from Deltarune) - Piano Tutorial - Sheet Music Boss (1080p).mp4 |

A file is recognised by its name, or by its size if you renamed it.

Click **Pick videos and run…** and select any of these files (several at once is fine). For each video, the tests:

1. open it and check that **Auto-position** finds the keyboard where it was found when the results were recorded (within 4 pixels, same keys, same spread);
2. analyse it with the recorded keyboard marks and settings in each mode listed in `run.js` (`PLAN`), so a change in auto-position doesn't affect the note results;
3. match every note with the recorded one: same key, start within 40 ms; an end more than 60 ms away counts as a difference.

A run passes when at most one note differs. All six videos take about 10–15 minutes. Keep the tab visible while they run, since browsers slow down hidden tabs.

## Recording new expected results

When you've improved the detection and checked that the new results are better, click **Record expected results…**, pick the videos, and save the downloaded `expected.js` into this folder. Commit it with the change.

To add a video, add it to `PLAN` in `run.js`, then record.
