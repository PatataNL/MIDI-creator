# MIDI-Creator

A piano roll in your browser for writing music, playing it back and exporting it as MIDI. It can also turn falling-notes piano videos into notes.

It is a single web page. There is nothing to install, no account and no server: open `index.html` or visit [patatanl.github.io/MIDI-creator/](https://patatanl.github.io/MIDI-creator/) and start drawing notes. Everything stays on your computer.

> **Note:** this application is fully programmed by AI. The ideas are human-made, with AI additions.

---

## Contents

- [Highlights](#highlights)
- [Getting started](#getting-started)
- [A tour of the screen](#a-tour-of-the-screen)
- [Writing notes](#writing-notes)
- [Layers](#layers)
- [Layer View](#layer-view)
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
- **References.** A layer can play the notes of another layer, moved in time and pitch, with its own instrument and values. Change the original and every reference follows.
- **Layer View.** Every layer as a block on a horizontal timeline, to arrange the song: drag blocks in time and between rows, and double-click one to edit its notes.
- **Per-note values.** Velocity, pan, reverb and muffle are edited in the Values sidebar or the note info bar. There is also a sustain pedal lane.
- **Two kinds of layer sliders.** One sets the values new notes start with. The other changes the whole layer as it plays, without touching the notes.
- **Tempo and time-signature changes** anywhere in the song.
- **Split piano parts into two hands** automatically.
- **Fancy playback.** Realistic piano, electric piano, guitars, basses, harp, mallets and drums, calculated on your device.
- **Play and record** with your computer keyboard or a connected MIDI keyboard.
- **Notes from a video.** Turn a falling-notes piano tutorial video into notes, by reading the lit keys or the falling notes themselves. You can then check the result over the video, with doubtful notes pointed out, and fix it by hand.
- **Opens** MIDI files, MusicXML sheet music (`.musicxml`, `.mxl`) and its own project files.
- **Saves** as MIDI, as MusicXML sheet music, as a project file, or as a WAV recording. It can also open the song in the Keys piano practice app.
- **Bookmarks**, loops, tabs for several projects at once, a full undo history, auto-save, light and dark themes and full-screen playback.

---

## Getting started

1. Download or clone this repository.
2. Open `index.html` or visit [patatanl.github.io/MIDI-creator/](https://patatanl.github.io/MIDI-creator/) in a modern browser: Chrome, Edge, Firefox or Safari. Chrome or Edge are recommended for the video import.
3. Click above the keyboard to place a note, then press **Space** to hear it.

That's all. Your work is auto-saved in the browser's database, so it's still there when you come back, even for very large projects. You can turn this off in Settings. To keep a song for good, or to move it to another computer, use **Save project** or **Save MIDI**.

**Internet:** the app works offline, with one exception. Reading video files directly (the fastest video speed) loads a small MP4 reader library from a CDN the first time.

---

## A tour of the screen

From top to bottom:

| Area | What it does |
|---|---|
| **Top bar** | Undo/redo; New, Open… and From video…; Save MIDI, Save score, Save project, Export WAV, Open in Keys (and copy a Keys link); Connect MIDI and the input picker; output level meter; full screen; light/dark mode; Settings. |
| **Second bar** | The **Notes | Layers** switch between [Note View and Layer View](#layer-view) (Tab also switches), and the four tools (Draw, Select, Erase, Look). In the middle the transport: back to start, play/pause, stop, record, then Loop, Metronome, the position readout (bar.beat.tick and time), BPM and time signature. On the right Grid, Fine grid and Scale highlight. |
| **Tabs** | One tab per open project. The arrow at the far right of the second bar hides or shows the tab bar. |
| **Layer panel** (left) | Your layers, the Show all / Only this buttons, the opacity of other layers, and at the bottom the master volume, reverb mix, reverb space and the Sound menu (Standard or Fancy). |
| **Note toolbar** | On the left, buttons for the notes: select across layers, select tools, snap, split and join (where you click), legato, swing, humanize, transpose, clean up, arpeggiate, strum, scale, chance, duplicate, delete and loop selection. On the right, the computer-keyboard octave (⌨ ‹ C4 ›), Follow and Zoom. |
| **Piano roll** | Time runs upward: the playhead line moves up through the notes toward the keyboard at the bottom. The time ruler is on the left. In Layer View, the timeline of blocks takes its place. |
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
| **Select** | 2 | Drag a box to select notes. Hold Ctrl to add to the selection. (With any tool, holding Shift selects too.) |
| **Erase** | 3 | Click or drag over notes to delete them. |
| **Look** | 4 | Drag to scroll around. Handy on touch screens. With any tool, dragging with the middle mouse button does the same. |

### Mouse

- **Move** a note by dragging its middle. Drag to the side to change pitch, up or down to change time. All selected notes move together.
- **Stretch** a note by dragging near its top or bottom edge. The grab area is set by *Stretch handle size* in Settings.
- **Copy** while moving by holding **Ctrl** (⌘ on Mac) as you start the drag. Drop the copy back exactly where it started and it is gone again, with nothing left to undo.
- **Shift** selects with any tool: Shift+drag draws a selection box (also in Draw mode), Shift+click selects the note there.
- **Ctrl+click** a note to add it to the selection, or take it out if it was already in, also in another layer. Ctrl with a selection box adds to what is selected.
- **Click the same spot again** to pick the next note stacked there. It goes through the selected layer's notes first, then those of other layers you can click (while *Other layers* is above 0).
- **Right-click**, or **double-click**, a note to delete it.
- **Alt** while placing, moving or stretching snaps to the fine grid instead of the main grid. For a moved or stretched note it's the other way round: it uses the fine grid, and Alt snaps to the main grid.
- **Click a key** on the keyboard to hear it.
- **Click the time ruler** to move the playhead, or drag the playhead line itself.
- **Drag the line above the keyboard** to make the keys taller or shorter.

### Grid and zoom

Grid, Fine and Scale are at the right of the second bar. Click a value to pick from the list, or use **‹ ›** to step to a coarser or finer grid (triplets step among triplets).

- **Grid** sets where new notes start and how long they are, and what Snap snaps to: 1/1 to 1/64, plus triplets (1/4T to 1/32T).
- **Fine** is the snap used when moving and resizing: anything from the Grid value itself down to 1/128 or a single tick (with a triplet Grid, triplets too). Making the Grid finer than Fine brings Fine along.
- **Scale** highlights the notes of a scale in the roll: major, minor, harmonic minor, dorian, mixolydian, pentatonics, blues and more.

**Zoom**, at the right of the note toolbar:

- **− ↕ +** zooms time (how much of the song is in view). Ctrl+wheel does the same.
- **− ↔ +** changes the key width. Ctrl+Shift+wheel, or the plain wheel over the keyboard, does the same.
- **Fit: Piano** fits all 88 keys to the window; **Fit: Notes** zooms to the notes in your song.

**Follow** keeps the playhead in view during playback. Scrolling by hand turns it off.

### Keyboard editing

- **Arrow left/right** move the selected notes down or up by a semitone. With **Shift**, by an octave.
- **Arrow up/down** move them later or earlier by the fine grid. With **Shift**, by the main grid.
- **Delete** or **Backspace** deletes them.
- **Ctrl+C / X / V** copy, cut and paste. Pasting puts the notes at the playhead.
- **Ctrl+D** duplicates the selection, and **Ctrl+A** selects all notes in the layer (in every layer while *Select across layers* is on).
- **Ctrl+E** splits the selected notes in two where the playhead crosses them (with nothing selected, the layer's notes). **Ctrl+J** joins the selected notes on the same key into one; with one note selected, it joins the next note on that key.
- **Q** snaps note starts to the grid, **Shift+Q** starts and ends (the selected notes, or the whole layer).

### Note toolbar

The buttons above the roll work on the selected notes, in whichever layers they are, or on the whole selected layer when nothing is selected. Hover a button to see what it does.

| Button | Key | What it does |
|---|---|---|
| Select across layers | M, or hold Alt | While on, a selection box and Ctrl+A take notes from every shown, unlocked layer. Holding Alt turns it on until you let go; then it goes back to how the button was. |
| Select tools | | A panel for selecting: **This layer** or **Every layer**, and **Add** to keep what is selected and add to it (so choices combine). Then **All notes**, or, like the selected notes: the **same key**, the **same note in every octave**, the **same key and length**, the **same length**, the **same velocity**, or everything **in the same stretch of time**. Also **Everything not selected** and **Nothing**. It stays open until you click elsewhere or press Esc. |
| Snap | Q | Snaps note starts to the grid. The arrow beside it also snaps **ends**, **starts and ends** (Shift+Q) or **lengths**. A note never ends up shorter than one grid step. |
| Split | Ctrl+E at the playhead | Click it, then click where to cut: with notes selected, every selected note crossing that height is cut there (on the fine grid; hold Alt for the main grid); otherwise the note you click. It stays on until you click it again or press Esc. A dashed line shows the cut before you click. **Ctrl+E** splits at the playhead instead. |
| Join | Ctrl+J for the selection | Click it, then click where two notes on one key meet (or between a note and the next one on its key) to make them one. With notes selected, it joins at that height on every key that has selected notes. It stays on until you click it again or press Esc; an outline shows what will be joined. **Ctrl+J** joins all the selected notes on each key. |
| Legato | | Each note runs up to the next one in its layer: **lengthen only**, **lengthen or shorten**, or **with a small gap** (the fine grid). |
| Swing | | A panel: the **amount** (a slider from 50%, straight, to 75%, with **Light**, **Medium**, **Triplet** and **Hard** presets) and **which grid** swings (1/8, 1/16 or 1/32). **Apply** stretches the first step of every pair and shortens the second, so the off-beat notes come later and notes in between keep their order. Applying again sets the new amount from straight, and **Straighten** puts the notes back exactly. The panel stays open to try amounts. |
| Humanize | | Small random changes to timing and velocity: **a little**, **some**, **a lot**, or **timing only** / **velocity only**. |
| Transpose | | A semitone or an octave up or down. |
| Clean up | | **Fix overlapping notes** (a note that runs into the next one on its key ends there) or **Remove duplicate notes** (of notes starting together on one key, the longest stays). Handy after an import. |
| Arpeggiate | | A panel: notes played together (a chord: notes starting within a 1/64 of each other) become a run, one note at a time for as long as the chord lasts, up to the next chord. Pick the **pattern** (up, down, up and down, or random), how often (**every** 1/8, 1/8T, 1/16, 1/16T or 1/32), how many **octaves** it climbs (with 2 or 3, single notes run over their octaves too; with 1 they stay as they are), and the **length** of each note as part of a step. Each key keeps its velocity and values. |
| Strum | | A panel: the notes of each chord start one after another, like a strummed guitar, each keeping its end. **Low first**, **high first**, **both ways** (low first on the eighth notes of the beat, high first between them) or **random**, and how many ticks **apart** (the panel says how many milliseconds that is). Strumming again starts from the chord as it was, so amounts can be tried one after another. |
| Scale | | A panel with a **key** and **scale** (from the scale highlight when it is on, otherwise guessed from the notes; **Detect** guesses again). **Fit to the scale** moves each note outside it to the nearest note in it (halfway between two, the lower one). **Move by steps** takes every note up or down that many steps of the scale, so a tune moved up a third stays in key. Two notes that end up on one key at the same moment become one, the longer. |
| Chance | | A panel: each note plays with the chance you set; the others are taken out. |
| Duplicate | Ctrl+D | Copies the selected notes right after themselves. |
| Delete | Delete | Deletes the selected notes. |
| Loop selection | | Sets the loop region around the selected notes, out to the grid, and switches the loop on. |

Duplicate, Delete and Loop selection are dimmed while nothing is selected.

### Selecting across layers

A selection can hold notes from several layers. Deleting, moving, duplicating and pasting keep each note in its own layer.

- **Shift+click a key** on the keyboard to select every note on that key, in every layer you can edit.
- **Shift+drag along the time ruler** to select every note starting in that stretch, in every layer. A Shift+click on the ruler selects the bar.
- **Ctrl+Shift+A** selects every note in every layer.
- Hold **Alt** to select in every layer while you hold it (a selection box, Ctrl+A), or press **M** (*Select across layers* in the note toolbar) to keep it that way. Letting go of Alt goes back to how the button was.
- Hold **Ctrl** as well to add to the selection instead of replacing it.

Copied notes from several layers are pasted back into their own layers; notes from one layer go into the selected layer.

### Note info bar

With notes selected, the bar under the roll shows their **pitch, start, length, velocity, pan, reverb and muffle**, and you can type new values there. A note without its own pan, reverb or muffle uses its layer's. The small reset buttons set a note back to that.
---

## Layers

Each layer is a card in the layer panel. Click a card to select that layer: new notes go there, and its card shows all its controls.

- **Header:** the arrow at its left collapses the card to just this strip (Alt+click: every card), and opens it again. A collapsed card still shows whether the layer is hidden, locked, muted or solo; click one of those to turn it off. Then the name (click and type), with one button to move the layer up (its top half) or down (its bottom half), delete, and **⋯** for more.
- **Instrument:** any General MIDI instrument, grouped by family, or drums.
- **Switches:** show/hide, lock (locked layers can't be edited or clicked), mute and solo. Switched on, they light up: hidden and locked in the accent colour, muted in red, solo in yellow. On the other layers they sit beside the instrument.
- **Sliders**, in two sets. Pick one with **New / All**, to the left of the switches.
  - **New:** the layer's Volume, then the Velocity, Pan, Reverb and Muffle that notes you draw or record in this layer start with. Existing notes are never changed. Playing on your keyboard also uses these.
  - **All:** Volume, Pan (moves every note left or right), and Velocity, Reverb and Muffle as a percentage of each note's own value (100 = unchanged). These change how the whole layer sounds, in playback, in WAV and MIDI export and when merging. The notes' own values stay as they are.

  Other layers show only their Volume slider.
- **Color:** a colour box with its hex code. **More colors ▾**, at the right of that row, gives white-key and black-key notes their own colours. The box opens the app's colour picker: Hex, RGB, HSL, HSV or OKLCH, a screen eyedropper and recent colours. In a slim layer panel the hex code is left out; the picker shows it.

Above the layers:

- **Show all** shows every layer.
- **Only this** shows only the selected layer, and keeps following your selection.
- **Other layers** sets how faintly the layers you are not editing are drawn. At 0 they can't be clicked.

The **⋯** menu, or a right-click on a card, has:

- **Duplicate layer**, **Duplicate as reference** (see [References](#references)), **Copy layer** and **Paste layer below**. A copied layer can also be pasted into another tab.
- **Split into right and left hand:** divides a piano layer the way a pianist would play it, into "… – right hand" (keeping the colour) and "… – left hand" (a contrasting colour). It works on the whole piece at once: each hand can only stretch so far, chords struck together stay together, and each hand stays near where it has been playing. On a test set of 29 piano scores, about 96% of notes land in the hand they're written for. Ctrl+Z undoes it.
- **Merge with the layer below** and **Merge layers…**. The merged notes move into one layer. With "Keep how each layer sounds", each note keeps its volume, pan, reverb and muffle.
- **Delete layer** (optionally with a confirmation; Ctrl+click on the delete button skips it). A layer with references asks what to do with them.
- **Collapse every layer** and **Expand every layer**.

On a reference, the menu starts with **Go to the original** and **Make independent**. Splitting into hands and merging into it are not available.

### References

**Duplicate as reference** adds a layer that plays the notes of the original: the same notes with the same values, and the same sustain pedal. Change the notes of the original and the reference follows straight away. A reference has its own name, instrument, colour, switches and sliders, so the same part can be doubled on another instrument, or played again later and higher.

- **On its card**, a dashed button names the original; click it to select that layer. A reference has no new notes, so its sliders are always the whole-layer set, without the New / All switch. A layer with references has a dashed button beside its instrument showing how many; click it to list them and pick one.
- **In the note area**, a reference's notes are striped, and they move together:
  - drag a note to move the whole reference in time and pitch;
  - drag a note's end to stretch the reference in time, with its start staying put, or a note's start, with its end staying put. The dragged edge snaps to the Fine grid (Alt: the main grid);
  - **Ctrl**+drag a note's end (or start) to make every note longer or shorter by the same factor, each keeping its start;
  - the arrow keys and **Transpose** move the selected reference too;
  - grabbing the notes of a reference that is not selected selects it first, as for any layer.
- **Swing, Humanize, Legato, Snap, Clean up, Arpeggiate, Strum, Scale and Chance** work on a selected reference too. They don't change its notes. Each is kept as a change to how it plays, worked out again whenever the original's notes change, so a new note in the original is swung (or snapped, or arpeggiated) as well. Applying one again changes it (Humanize rolls new random nudges); they apply in the order added, so an arpeggio can be humanized, or a part moved along its scale and then thinned out by chance. Humanize gives each note the same nudge every time, also after moving the reference or reopening the file; in the same way Chance leaves out the same notes, and a random arpeggio or strum keeps its order, until rolled again. These are its **modifiers**. A reference with modifiers has a button beside its switches showing how many; click it for their list (it doesn't select the layer). The list says what each one does, with the times in milliseconds, and how many of the reference's notes it changes. There each one's settings can be changed (the amount and grid of a swing, the timing and velocity of Humanize, and so on), it can be applied earlier or later or taken off, and Humanize, Chance and a random arpeggio or strum can **Reroll**. For an arpeggio it says how many chords became how many notes, for Chance how many notes it leaves out. In Layer View the block shows them by name (or how many) in its top strip; click there for the same list. The block's right-click menu has it too.
- **Changing single notes** happens in the original. Clicking a reference's note without dragging, right-clicking it, or trying to draw in a reference opens a menu: **Edit this note in the original** selects that layer and the note there, and **Make this layer independent** turns the notes it plays into its own. You can still select a reference's notes to copy them.
- **A reference of a reference** links to the same original.
- **Deleting an original** asks whether to delete its references too. If you keep them, the first one keeps the notes it plays as its own and becomes the original of the others.
- **Files:** project files keep the links. MIDI, MusicXML, WAV and Keys get every reference as an ordinary layer with its notes.

**Show the notes of references** in Settings can hide the notes of references among the other layers (the selected layer always shows its notes). They still play.

### Layer colours

A layer's colour can come from its name. Name a layer "Blue right hand" or "Melody #ff8800" and it takes that colour. This also works for track names in imported MIDI files.

---

## Layer View

**Layers** at the left of the second bar (or **Tab**) switches from Note View to Layer View: every layer as a block on a horizontal timeline, to arrange the song. **Notes** (or Tab again) switches back.

- **Blocks** span a layer's notes, out to whole bars. Along the top: the layer's name and instrument, how far the block is stretched (×1.5; ⇄ when backwards) and a speaker button to mute it. Below: its notes in miniature, with its lowest and highest C marked to show which octaves it covers.
  - References are striped and dashed, with a link mark.
  - Muted layers are grey with a red speaker. Layers that aren't playing because others are soloed are faint.
  - Selected blocks have an accent outline.
  - A layer with a volume curve shows it as a soft area behind its notes (127% at the top), fades included, and **∿** with its curves' names along the top (click that to edit them). The small handles on the top edge make fades (see [Fades](#fades)).
  - Hovering a block shows its name, instrument, bars and key range in the status line.
- **Rows** go down the view. The row a block is in changes nothing about how it sounds. Until you move a block, the layers pack into rows by themselves: each in the first row where it fits, so a reference later in the song shares its original's row. Once you move one, every layer keeps its row. Two blocks never overlap in one row.

### Blocks and references

Changing an original's block here leaves its references as they are: moving, trimming, lengthening, stretching, splitting, transposing and removing stretches. Only changes to its notes (in Note View) reach them. The references keep their own block from then on, and are moved or stretched back by as much as the original. So an original never loses notes to these changes:
- **Trimmed off:** notes trimmed off its block are kept, left out. They don't play and aren't exported, show faint and dashed in Note View, and come back when you drag the end over them again.
- **Removed stretches:** notes in a removed stretch are kept with it, to put back.

### Selecting and moving

- Click a block to select it (and its layer). Ctrl+click adds a block, or takes a selected one out. Drag over an empty spot for a selection box (Ctrl: added to the selection). Ctrl+A selects every block, Esc lets go.
- Drag a block to move it, with the other selected blocks, in time: snapped to the Grid (hold Alt for the Fine grid). A single block can also go to another row. A row that's full at that time is skipped for the nearest free one. While you drag, a label shows where the block starts; **Esc** puts it back.
- Moving a layer moves its notes; its references stay where they are.
- **Ctrl+drag** moves copies of the blocks instead, leaving the blocks where they were. **Ctrl+Alt+drag** moves new references to them.
- The arrow keys move the selected blocks: ← and → a grid step (Shift: a bar), ↑ and ↓ a row (one block).
- **Double-click** a block to edit its notes in Note View, starting at the block.

### Trimming, lengthening and stretching

Drag a block's start or end (the cursor shows ↔). The dragged end snaps to the Grid (hold Shift for the Fine grid) and stops at the next block in its row. A label shows where it ends up.

- **Trim:** dragging an end inward leaves out the notes beyond it. Dragging it back out brings them back.
- **Lengthen:** dragging the end past the last note makes the block repeat. An original repeats as copies, notes of its own, with its muted parts. A reference repeats its original and keeps following it. A dashed seam with a small mark on the name strip shows where each repeat starts.
- **Stretch:** **Ctrl**+drag an end to stretch the whole block, notes and all, from its other end. Drag it over the other end to play the block backwards. The block shows how far it is stretched.

### Splitting, removing stretches and muting

- **Split here** (right-click menu) or **Ctrl+E** (at the playhead) splits blocks in two. The second half is a new layer beside the first in its row. An original's notes from that point go to the new layer; a note running across the point stays in the first half. The first half keeps the second half's notes, left out. A reference becomes two references of the same original.
- **Pick a stretch of time:** Shift+drag anywhere, on the ruler or across the blocks. It snaps to the Fine grid (hold Alt for the main Grid), and a label shows where it runs and how long it is. It shows as a highlighted band. Shift+click on an empty spot, or Esc, lets it go; Shift+click on a block adds it to the selection.
- **Remove the picked stretch** (right-click menu, or **Delete**) takes it out of the selected blocks, and what came after moves up against what came before. Notes are cut precisely: a note running into the stretch is cut short where it starts, one running out of it keeps its part after, one across it loses the stretch, and one inside it goes. A red zigzag marks where the two sides now meet; right-click it and choose **Restore this removed stretch** to put that one back, with its notes whole again. Hovering the zigzag says so in the status line.
- **Mute the picked stretch** silences it in the selected blocks without removing anything: their notes there don't play, as in a muted layer. Muted parts are darkened, with a crossed speaker, and their notes are faint in Note View. **Unmute the picked stretch**, or right-click inside a muted part and choose **Unmute this part**, brings it back. Like a muted layer, a muted part still goes into MIDI, MusicXML and Keys; only playback and WAV leave it out.
- Muted parts and removed stretches stay with the same notes: they move, stretch and close up with the block.

### The toolbar, the menu and shortcuts

- **The toolbar** works on the selected blocks, or on the selected layer when none are selected:
  - The note tools as in Note View: **Snap** (Q; the arrow beside it has ends, starts and ends, and lengths), **Legato**, **Swing**, **Humanize**, **Transpose**, **Clean up**, **Arpeggiate**, **Strum**, **Scale** and **Chance**. Each changes the whole layer. On a reference it changes how the reference plays (see [References](#references)); Transpose moves it. Used on several blocks, it is one step to undo.
  - **Split** at the playhead, **Duplicate** right after, **Reference** (a reference of each block right after it), **Mute** (or unmute), **Loop** (the loop region around the blocks, or around the picked stretch), **Merge** (see below) and **Delete**.
  - While a stretch is picked: **Remove stretch** and **Mute stretch**. Also **Copy to playhead** and **Reference at playhead**, for every block in the stretch (see [Sections](#sections)).
  - **Library** opens the layer library (see [The library](#the-library)).
- **Keys and mouse**, in the bottom right corner, lists what the mouse and keys do here. Click its title to fold it away (it stays that way).
- **Right-click** a block for its menu. With several blocks selected and one of them clicked, it works on all of them.
  - Editing: **Edit the notes**, **Transpose** (−12, −1, +1, +12 semitones; the menu stays open to click again), **Notes** (Swing, Humanize, Legato, Snap and Clean up on the whole layer; on a reference as it plays, see [References](#references)), **More** (Arpeggiate, Strum, Scale and Chance, the same way), and **Modifiers…** (a reference's list of them).
  - Playing: **Mute** and **Solo**.
  - Cutting: **Split here** and **Split at the playhead**, **Merge into one layer**, the picked stretch's **Remove**, **Mute**, **Copy** and **Reference**, and **Restore this removed stretch** (on a zigzag).
  - **References together:** on an original, **Select its references** and **Select it and its references**; on a reference, **Select its original** and **Select the original and its references**.
  - Then the usual layer menu.
- **Merge into one layer** turns the selected blocks into one new layer in their place, in the first one's row and on its instrument (drums can only be merged with drums).
  - It holds the notes they play: a reference's as it plays them, without notes trimmed off a block or in a muted part.
  - Each note keeps the velocity, pan, reverb and muffle it played with, layer volumes, whole-layer values and curves included, so it sounds the same.
  - References of a merged original keep the notes they play, as their own. Undo puts everything back.
- **Delete** deletes the selected layers (or removes the picked stretch from them). **Ctrl+D** puts copies of the selected blocks right after them. **Ctrl+C**, **Ctrl+X** and **Ctrl+V** copy, cut and paste layers; pasted ones start at the playhead.

### Sections

A bookmark starts a section, which runs to the next bookmark (or the end of the song). **Right-click a bookmark** on the ruler for its section:
- **Pick this section:** as if you Shift+dragged over it, for removing, muting, copying or referencing.
- **Select its blocks.**
- **Loop it.**
- **Copy it to the playhead:** every block in it, cut to the section, so the section starts at the playhead. Originals become copies with just the notes starting there; references become references.
- **Reference it at the playhead:** the same, but every block becomes a reference that shows just that stretch, so later changes to the originals reach it.
- **Duplicate it in place:** time as long as the section is put in right after it, with a copy of every block in it there, so the section plays twice and everything later moves on. **Reference it in place** does the same with references.
- **Delete it, closing the gap:** the section is taken out of the whole song (see [Inserting and deleting time](#inserting-and-deleting-time)).
- **Rename or recolor the bookmark.**

The copies land in the nearest free rows, and their curves come along. A picked stretch can be copied or referenced the same way, from the toolbar or a block's menu.

### Inserting and deleting time

**Right-click the ruler** (in Layer View or Note View) for **Insert bars before bar …** (+1, +2, +4 or +8) and **Delete bar …**. A picked stretch can also be deleted from the whole song, duplicated in place, or have as much time put in before it, from a block's menu. Each is one step to undo.
- **Inserting** moves everything from that point on later: blocks, bookmarks, tempo and time-signature changes, the song's curves, the loop and the playhead.
  - A block across that point is split there and its second half moves on, so its references don't change.
  - An original without references simply gets the gap among its notes and stays one block.
- **Deleting** takes the stretch out and closes up:
  - Blocks inside it are deleted.
  - Blocks across it lose that stretch as a removed stretch, which you can put back on the block.
  - Bookmarks in it go. Of the tempo and time-signature changes in it, the last one moves to where the stretch was, so what follows keeps its tempo.

### Fades

Each block has two round handles on its top edge: one near its start for a fade in, one near its end for a fade out. They show on the selected block, on the block under the pointer, and on any block with a fade; the one under the pointer grows and takes the accent color. What a fade takes away is shaded, above the volume curve.
- Drag one inward to fade in or out (on the grid; Alt: the fine grid). The status line and the readout say how long the fade is.
- A fade is made of points on the layer's **volume curve**, so it shows and can be fine-tuned in the Values strip like any curve. Points of the curve inside a fade give way to it.
- Fades stay at the block's ends when it is trimmed, move and stretch with it, and are kept in project files.
- A note held through a fade fades with it (see glide under [Curves](#curves)), so a fade in on a long first note swells in.

### The library

**Library** in the toolbar opens a list of your layers (the originals, not references) at the left of Layer View. Each shows its name, instrument, length and how many references it has.
- **Drag one into the timeline** to place a reference to it there. Its block starts on the grid where you drop it, in that row or the nearest free one; while dragging, a dashed outline shows where it will land. Hold **Ctrl** as you let go to place a copy instead.
- **Double-click** one (or press **Enter**) to place a reference at the playhead.
- **Click** one to select that layer.

The library starts closed each time the app opens.

### The Values strip

Along the bottom of Layer View, on the same time axis as the blocks, the **Values** strip shows the notes of the selected layer, each as a stem with a dot on top. The pill in its header picks what they show, the same choice as the Values sidebar of Note View: **Velocity**, **Pan** (stems from the middle), **Reverb**, **Muffle** or **Pedal**, plus **Volume** and **Tempo**, which are curves only (see [Curves](#curves) and [the tempo curve](#tempo-and-time-signature-changes)). A dot is solid where the note has its own value, and hollow where it takes the layer's.

- **Drag a dot** up or down to set that note's value; with it selected among others, they all move by as much.
- **Drag anywhere else** to paint the value at the pointer over every note you pass.
- **Double-click** a stem to type its value. Values snap to the sidebar's **Step**.
- **Pedal:** drag to add a pedal region, drag an end or the middle to change it, right-click to remove it.
- **References** show their original's notes as they play (modifiers included), striped and read-only. **Edit the original** in the header selects the original.
- The strip changes the notes themselves, so Note View shows the same values. Notes left out of a block aren't shown.
- Drag the line above the strip to make it taller or shorter (double-click: back to the default), or click the arrow at its left to fold it away. Both are remembered.

### Curves

A curve changes a value over time. Each layer has one for each of velocity, pan, reverb, muffle and volume, and so does the whole song. You edit them in two places, which always show the same choice:
- **Layer View's Values strip:** **Curve** in its header switches from the notes to the curve, and **Layer** or **Global** picks whose curve.
- **Note View's Values sidebar:** the choice at its bottom right picks **Notes**, **Curve** or **Song curve**.

**Volume** and **Tempo** have only a curve, so picking them always shows one. The tempo is the song's, and its points are the song's tempo changes (see [Tempo and time-signature changes](#tempo-and-time-signature-changes)).

- **How they work with the notes:** a curve scales the notes' own values, like the whole-layer sliders but changing over time. Velocity, reverb, muffle and volume are a percentage (100% leaves them as they are, up to 127%); pan is moved left or right. The song's curve applies on top of the layer's. A note starts with the curves' values where it starts.
- **Glide:** while a note sounds (its pedal and its release too), its volume, pan, reverb and muffle go on following their curves, so a long note swells, fades or pans as the curve does. Velocity is how hard the note is struck, so it stays as it was at the start.
- **On screen:**
  - In the strip, the curve's scale is at the right. In the sidebar, it is the same 0 to 127 scale as the bars, so 100% lines up with a value of 100.
  - A dashed line marks 100% (pan: the centre).
  - The notes stay in view, faint, as they will play, so you can see them follow the curve.
  - The other curve (the song's while you edit a layer's, and the other way round) shows dashed.
  - In Note View's notes mode, the layer's and the song's curves show as lines over the bars.
- **Points:**
  - Click to add one (it takes the kind of the point before it) and drag it into place.
  - Click a point to select it, or **Ctrl+click** to add it to the selection (or take it out). **Ctrl+drag** over empty space selects the points in a box.
  - Dragging moves the selected points together: in time, without passing a point that stays put, and in value. Hold **Shift** to put them on the grid and on steps of 5.
  - Double-click a point to type its value (pan: `L20`, `C`, `R12`).
- **Kinds:** right-click a point to choose how the curve goes on from it to the next point (for every selected point, when it is one of them). Each kind has its own point shape:
  - **Smooth** (circle): a spline through the points that never overshoots them;
  - **Linear** (diamond);
  - **Exponential** (triangle up): slowly, then faster;
  - **Logarithmic** (triangle down): quickly, then slower;
  - **Hold** (square): stays, then steps at the next point.
- **More in that menu:**
  - Put points back to 100% (or the centre), copy them, or delete them.
  - Right-click empty space to select all points, paste, clear the whole curve, draw freehand or shape it (below).
  - Before its first point and after its last, a curve stays level.
- **Drawing and shaping:** with a curve in view, the strip's header has **Draw** and **Shape…** (in the sidebar: the pencil and the wave).
  - **Draw** on: drag across the curve to draw it freehand. The points where you pass give way, and when you let go the line keeps only the points it needs. Going back over a stretch draws it again. Click Draw again to stop.
  - **Shape…** makes **a ramp** (from one value to another: straight, smooth, slowly then fast, or fast then slowly) or **a wave** that repeats, an LFO: sine, triangle, square, saw up, saw down or random steps, every 1/16 to 2 bars, around a middle value and as deep as you set. Use it for tremolo on the volume, auto-pan, a filter sweep on muffle, or a drifting tempo.
  - It works over the stretch picked on the ruler (Layer View), the selected notes (Note View) or the loop, or else the layer's block (for the song's curves and the tempo: the whole song). The panel says which. It takes the place of the curve's points there, the curve goes on after it as before, and it is one step to undo.
- **Keys**, after clicking the strip or sidebar with a curve in view:
  - **Delete** deletes the selected points; **Esc** lets go of them.
  - **Ctrl+A** selects all of them.
  - **Ctrl+C**, **Ctrl+X** and **Ctrl+V** copy, cut and paste them. Pasted points start at the playhead, on whichever curve is in view, in place of its points there.
- **Blocks:**
  - A layer with curves shows **∿** and their names on its block; click that to open them in the strip.
  - Its curves move and stretch with the block (stretched backwards, they run the other way).
  - Removing a stretch takes the curve's points there with it and closes the curve up. The values either side of the join stay as they were, and putting the stretch back gives the curve back as it was.
  - Copies and references start with the curves of the layer they come from.
  - The song's curves stay where they are.
- **From MIDI files:** volume (controller 7), pan (10), reverb (91) and brightness (74) changes while a channel plays become its layer's curves. The layer takes the highest value (pan: the one at its first note) and the curve the rest as a share of it. A run of quick changes, like a fade drawn in another program, becomes a straight line with only the points it needs.
- **Everywhere:** curves are heard in playback and in WAV export. MIDI export writes what they do as controllers 7, 10, 91 and 74, also while notes are held. Project files keep them, and undo works as for everything else.

### The ruler and the view

- **The ruler** works as in Note View:
  - Each bar shows its number and the time it starts.
  - Click or drag it to move the playhead.
  - The thin strip along its top is the loop: drag along it to set the loop, click it to switch the loop on or off.
  - Right-click it to add or change a tempo or time signature there, or to add a bookmark there (on the beat).
  - Tempo and time-signature changes and bookmarks show as tags. Click a tempo or time-signature tag to change or remove it, and a bookmark to jump there (Shift+click or double-click to rename it). Bookmarks also show as dashed lines across the rows.
- **Bookmarks:**
  - The bookmark button in the bar above adds one at the playhead (or press **B**), and **Bookmarks** beside it lists them, to jump to, loop, rename, move or remove, as in Note View.
  - Drag a bookmark's tag along the ruler to move it (on the grid; Alt: the fine grid). Right-click one for its section (see [Sections](#sections)).
- **Viewing:**
  - The wheel scrolls through time (down: back towards the start), Shift+wheel through the rows, Ctrl+wheel zooms the time. Drag with the middle mouse button to pan.
  - The bar above has Follow, time and row-height zoom, and **Fit Song**.
  - The view and zoom are remembered.

Note tools, the note info bar and the Values sidebar belong to Note View and are hidden here. Full-screen playback (5) switches to Note View.

---

## The Values sidebar

The **Values** tab on the right shows a bar for every note of the selected layer, lined up with the notes beside it. The lane picker at the bottom chooses what the bars show:

- **Velocity**, **Pan**, **Reverb** or **Muffle:** drag a bar sideways to set it. Drag up or down over empty space to paint values across several notes. Double-click a bar to type a value. **Step** sets what the values snap to.
- **Pedal:** sustain pedal regions. Drag to add one; drag its ends to change it.
- **Volume**, **Tempo** and the choice at the bottom right (**Notes**, **Curve** or **Song curve**): the curves that the notes follow over time, edited here as in Layer View (see [Curves](#curves)). With **Notes** picked, the curves still show as lines over the bars. With a curve in view, the pencil draws it freehand and the wave opens **Shape…**.

The **Undo history** tab lists every change. Click any step to jump back or forward to it. **Clear** forgets the history.

---

## Playing, listening and recording

- **Space** plays and pauses. **Home** goes back to the start. **Stop** returns to where playback began, or to the loop start (see Settings).
- **Metronome** (the metronome icon) clicks on every beat, louder on the first beat of a bar. Its volume is in Settings.
- **BPM** and the **time signature** in the second bar show the ones in effect at the playhead. Typing a new BPM speeds up or slows down the whole song, keeping any tempo changes in proportion. Choosing a time signature changes the one in effect there.

### Tempo and time-signature changes

**Right-click the time ruler** where a change should start, then choose:
- **Change the tempo from bar … beat …** (it starts on that beat);
- **Change the time signature from bar …** (it starts at the start of that bar; any number of beats from 1 to 32, over 1, 2, 4, 8, 16 or 32).

The same menu has **Add a bookmark here…**, **Insert bars before bar …** and **Delete bar …** (see [Inserting and deleting time](#inserting-and-deleting-time)).

Each change shows as a tag just under its moment on the roll: "♩ = 90" or "3/4". **Click a tag** to change or remove it.

**A tempo can glide** to the next tempo change instead of jumping there, for an accelerando or a ritardando: in the tempo's box, **Then** picks whether it stays until the next change or glides there (straight, smoothly, slowly then faster, or quickly then slower). Its tag shows where it goes: "♩ = 120 ↘ 80". The playhead, bar times, the metronome and WAV export follow the glide exactly; MIDI files get it as many small tempo steps.

**The tempo curve:** pick **Tempo** in Layer View's Values strip (or Note View's Values sidebar) to see and edit the tempo changes as a curve, from 20 to 300 BPM. A point is a tempo change; its kind (right-click) is whether it holds until the next one or glides there. You can add, drag, type, draw and shape it like any curve. There is always one from the start of the song, and points in the middle of a glide drawn by hand get no tag of their own on the ruler. Bar numbers, the grid, the metronome, the position readout, bookmarks, MIDI and MusicXML all follow the changes.
- **Fancy playback** swaps the standard synthesizer for realistic instruments: piano, electric piano, guitars, basses, harp, mallets and drums. The first time, they are calculated on your device, which takes a few seconds. *Piano tweaks* in Settings adjust the Fancy piano's brightness, low-note balance, bass and hammer knock. Switch it with the **Sound** menu (Standard or Fancy) under the master volume and reverb at the bottom of the layer panel, or in Settings.
- **Master** volume (type up to 300 for extra loudness), **Reverb mix** and **Reverb space** (small room, hall, cathedral) are at the bottom of the layer panel.

### Your computer keyboard as a piano

The letter rows play one and a half octaves. **A S D F G H J K L ; '** are the white keys and **W E T Y U O P** the black keys. **Z** and **X** move the octave down and up. The octave is shown at the right of the note toolbar as **⌨ ‹ C4 ›** (A plays that C); its arrows do the same as Z and X.

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

**Loop:** turn on **Loop**, then drag along the thin strip at the right edge of the time ruler to set the region. Bookmarks can set the loop region for you too, and so can **Loop selection** in the note toolbar.

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
- **Notes move** (falling-notes mode): **Auto**, **Down** or **Up**. Auto measures the direction. It ignores things that only flicker or pulse, such as an animated end screen, and when sparks or glow rising from the keys make it unsure, it picks the direction toward the keys. If the summary says the notes move the wrong way, force the direction. The result updates without analysing the video again.
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

**Split each color into right and left hand** is for videos that use one colour for both hands: each colour group becomes a right-hand and a left-hand layer (see *Split into right and left hand* under Layers).

**Put notes** on new layers in this project, or in a new tab, and press **Import notes**.

### Checking and fixing the result

Before importing, you can check the result against the video:

- **Show the notes on the video** draws what was found over the video, as you play it or jump around.
  - Each sounding key gets a bar.
  - In falling-notes mode, every note also gets an outline as it falls, with ticks at its start and end.
  - Outlines use a colour opposite the note's own, so they stand out on the video.
- **Play them along** plays the found notes while the video plays, so wrong or missing notes are easy to hear.
- **Next to check** jumps to each note worth a second look, outlined in red on the video and in the preview, with the reason under it. These are:
  - notes the keyboard or glow check shortened, or left out when it was a close call;
  - a black key and the white key beside it starting together;
  - one key struck twice in a row where one part is only a sliver.

  Notes that were left out are drawn dashed.
- **The result preview** under the video can be edited:
  - Click a note to select it; the video jumps there.
  - Drag a note's left or right end to change its start or end.
  - Press **Delete** (or the **Delete note** button) to remove it.
  - The wheel zooms, dragging empty space pans, and a double-click shows the whole result again.
  - On the Result tab you can also click a note's outline on the video to select it, and in falling-notes mode drag its top (end) or bottom (start) edge.
  - **Ctrl+Z** takes back the last change. Your changes stay when you adjust the settings above and the notes are found again.

### Tips for good results

- Use the best quality video you have, 1080p if possible.
- Check the dots after Auto-position, especially at the far left and right.
- In falling-notes mode, keep the scan area clear of the effects just above the keys, and put the keys line on the top edge of the keys.
- For more precision, raise **Rows read** and **Samples per second**. The analysis takes longer.
- If the summary says the notes move up while they fall down (or the other way round), set **Notes move** under *Advanced position tuning*.
- If a video keeps the keys dark (no lighting), use falling-notes mode. The keyboard check then switches itself off.

---

## Opening, saving and sharing

### Opening

**Open…**, or drag a file onto the window, opens it in a new tab:

- **MIDI files** (`.mid`, `.midi`). Every track and channel becomes a layer, with its instrument, volume, pan, reverb, muffle (brightness), sustain pedal, tempo changes, time signature, markers (as bookmarks) and layer colours. Volume, pan, reverb and brightness that change while it plays become curves (see [Curves](#curves)).
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
| **Save score** | Sheet music (MusicXML) for MuseScore, Finale, Sibelius and other notation programs. See below. |
| **Save project** | A `.json` file with everything: every layer and note value, both slider sets, colours, bookmarks, tempos and time signatures. Use this to keep working later. |
| **Export WAV** | An audio recording of the song, with Fancy playback when it's on. |

### Sheet music (MusicXML)

**Save score** writes one part per layer:
- Two layers named "… – right hand" and "… – left hand" with the same instrument become one piano part on a grand staff, and split back into those two layers when you open the file here.
- Notes are written on a grid of 32nd notes and tied over bar lines. Notes struck together share a stem; other overlapping notes go into separate voices. Triplets are rounded to the nearest 32nd.
- The key signature is guessed from the notes, and sharps or flats follow it.
- Tempo and time-signature changes, bookmarks (as rehearsal marks), the sustain pedal, drums, and each layer's instrument, volume and pan are included.
- Opening a score saved by MIDI-Creator keeps every note's velocity exactly.

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
| **Appearance** | Color mode (auto/light/dark); color theme; base and accent color saturation; layer panel position; note names on notes; the notes of references; which keys show labels; note area brightness; preview of the note under the cursor. |
| **Sound** | Fancy playback; *Piano tweaks*: brightness, low-note volume and focus, bass reduction, hammer knock. |
| **Editing** | Anti-resize delay (so a fresh note isn't stretched by accident); Values lane grab delay; stretch handle size; how close to an edge a drag must come to scroll the view; value bar and black-key hitboxes; play notes while editing; confirm before deleting a layer. |
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
| Tab | Switch between Note View and Layer View |
| 5 | Full-screen playback (Esc also leaves it) |
| Ctrl+Z, Ctrl+Shift+Z or Ctrl+Y | Undo, redo |
| Ctrl+A | Select all notes in the layer (every layer while *Select across layers* is on) |
| Ctrl+Shift+A | Select every note in every layer |
| M | Select across layers on / off |
| Hold Alt | Select across layers while held (a selection box, Ctrl+A) |
| Q / Shift+Q | Snap note starts / starts and ends to the grid |
| Ctrl+C / Ctrl+X / Ctrl+V | Copy / cut / paste at the playhead |
| Ctrl+D | Duplicate the selection |
| Ctrl+E | Split the selected notes at the playhead |
| Ctrl+J | Join the selected notes on the same key |
| Ctrl+S | Save MIDI |
| Delete / Backspace | Delete the selected notes |
| Arrow left / right | Move the selection (or the selected reference) down / up by a semitone (Shift: an octave) |
| Arrow up / down | Move the selection (or the selected reference) later / earlier (Shift: by the main grid) |
| Arrow keys in Layer View | Move the selected blocks a grid step (Shift: a bar) earlier or later, or one block a row up or down |
| Ctrl+D, Ctrl+E, Ctrl+C / X / V in Layer View | Copy the selected blocks right after themselves, split them at the playhead, copy / cut / paste layers |
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
- **Can't edit a layer?** It may be hidden, locked or a reference of another layer. The card shows which.
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
  "sigs": [{ "tick": 7680, "n": 3, "d": 4 }],
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

- Times are in ticks, at **480 ticks per quarter note**. `tempos` lists the tempo changes (`c`, when one glides to the next: `linear`, `smooth`, `exp` or `log`); `ts` is the time signature at the start and `sigs` the changes after it, each at the start of a bar.
- Notes have start `s`, length `d`, pitch `p` (MIDI note number) and velocity `v`. They may also have their own `pan`, `rev` and `muf`; when missing, the layer's values count.
- A layer may also hold:
  - its new-note values: `nvV`, `nvPan`, `nvRev`, `nvMuf`;
  - its whole-layer values: `mxV`, `mxPan`, `mxRev`, `mxMuf`;
  - separate note colours: `colorWhite`, `colorBlack`.
- A reference has `link`: the place of its original in `tracks`, counting from 0. `str` stretches it in time (2 = twice as long) and `len` makes its notes longer again, each 1 when missing; then `off` moves it later in ticks and `tp` up in semitones. Its `notes` and `pedal` hold what it plays, so older versions open it as an ordinary layer; on opening they are worked out again from the original. `fx` lists its note changes in order: `swing` (`pct`, grid `g`), `human` (`time`, `vel`, `seed`), `legato` (`longer`, `gap`), `snap` (`kind`: `start`, `end`, `both` or `len`; grid `g`) and `clean` (`kind`: `overlaps` or `dupes`), each with `k` naming it (and `gl`, the grid's name, where it has one).
- A collapsed layer card has `fold: true`.
- Curves are in `auto`, on a layer for its own and at the top of the file for the song's: for each of `vel`, `pan`, `rev`, `muf` and `vol`, a list of points `{ "t": ticks, "v": value, "c": kind }` in time order. Values are percentages (0 to 127; pan -64 to 64), and `c` is `smooth`, `linear`, `exp`, `log` or `hold`, how the curve goes on to the next point.
- Layer View keeps a layer's `row` (from 0) and, once its block has been moved, `blk`: where the block starts and ends (`s`, `e`, in ticks). Notes left out of the block have `out: 1`. A lengthened original has `seams` (ticks), a stretched one `sx` (how far, below 0 backwards). Muted parts are in `mutes` (a list of `{ "s", "e" }`), removed stretches in `cuts` (`at`, `len`, `dir`, and for an original the `notes`, `pedal`, `mutes` and `seams` to put back, and a `tag` that the parts left of the notes it cut carry as `cut`). A reference arranged in Layer View has `win` (its block before its removed stretches) and `per` and `ph` (the stretch of its original it repeats: how long, and where it starts).

### MIDI extensions

Saved MIDI files stay fully standard. Two extras ride along in ways other programs ignore:

- **Bookmarks** are Marker meta events (`FF 06`). Each is followed by a sequencer-specific event (`FF 7F`) holding its colour, tagged with the non-commercial manufacturer ID `7D` and `MCBM`.
- **Layer colours** are sequencer-specific events with the same `7D` tag.

[`docs/keys-bookmarks.js`](docs/keys-bookmarks.js) shows how another app (Keys) reads the bookmarks, from the share link or from the MIDI file.

### Tests

Open `index.html#test` (or [`tests/index.html`](tests/index.html)) to run the test suite inside the app.
- **Built-in tests** need no files and take a few seconds. They cover a synthetic falling-notes video, file round trips, time signatures, tempo changes, selection, split/join, references, Layer View, hands and the layer sliders.
- **Video tests** check the video import note by note against recorded results on six real tutorials, which you supply yourself.

See [`tests/README.md`](tests/README.md).

### Contributing

Work happens on the `beta` branch and reaches `main` through pull requests. Run the built-in tests before opening one, and the video tests after changing the video import.
