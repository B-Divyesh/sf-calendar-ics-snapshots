# Demo sandbox

Open `/?demo=1` in the desktop app browser entry point, or visit `/demo/` on the landing site. The landing page's **Try it with sample data** action opens `/demo/` directly into the browser-rendered desktop sample.

The desktop sample has two calendar copies of “Northstar studio week.” Copy 002 moves “Planning review” and removes “Airport train.” Select the cancelled event and export it to make a calendar restore file (.ics).

Demo state is stored only in the separate browser database `demo:calendar-snapshotter`. It never reads or writes `calendar-snapshotter`, the real vault database, or real license storage. Scheduling is disabled in the sample. **Reset demo** deletes and reseeds only the demo database. **Leave demo** deletes the demo database before returning to the download page without copying its data.
