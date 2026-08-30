# Demo sandbox

Open `/?demo=1` in the desktop app browser entry point, or visit `/demo/` on the landing site for the walkthrough and launch link.

The desktop sample has two editions of “Northstar studio week.” Edition 002 moves “Planning review” and removes “Airport train.” Select the cancelled event and export it to make a real ICS restore file.

Demo state is stored only in the separate IndexedDB database `demo:calendar-snapshotter`. It never reads or writes `calendar-snapshotter`, the real vault database. The persistent demo banner offers **Reset demo**, which deletes only that demo database, and **Start for real**, which leaves demo mode without copying its data.
