# MIDI-Creator tests

The tests run inside the app. Open `index.html#test` (or `tests/index.html`, which takes you there) and a panel appears in the bottom-right corner. It works straight from your disk; no server needed.

While the tests run, auto-save is switched off and your saved video settings are put back afterwards, so your tabs and preferences don't change.

## Built-in tests

**Run built-in tests** needs no files and takes a few seconds. It covers:

| Test | What it checks |
|---|---|
| Synthetic falling-notes video | A video drawn on the fly has 16 known notes with glow, outlines, labels and sparks. The falling-notes reader must find every one, with no extras, within 15 ms. |
| MIDI file | A song with layers, drums, the pedal, tempo and time-signature changes and a bookmark is saved as MIDI and read back unchanged. |
| MusicXML score | The same song is exported as sheet music (with the two hands as one grand staff) and read back unchanged, velocities included. |
| Project file | The song is saved as a project, slider values included, and read back unchanged. |
| Time signatures | Bar lines, beats and positions follow time-signature changes. |
| Tempo changes | Times follow the tempo map. |
| Split, join and select | Selecting by key and by time across layers, splitting at the playhead, joining, and copy/paste back into each note's own layer. |
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
