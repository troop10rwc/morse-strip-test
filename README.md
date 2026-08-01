# morse-strip-test
**Morse Code Interpreter Strip Trainer
**
A free, self-contained web app for Scouts to practice and self-test for the official Morse Code Interpreter Strip. It walks a Scout through all three requirements, tracks progress on their own device, and generates a printable completion certificate for their unit leader or counselor to sign off on.

The entire app is a single file, index.html — no build step, no server, no account required. It runs completely offline once loaded.

**What it covers
**
The app mirrors the official Interpreter Strip requirements:

* 5-minute conversation — hold a guided Morse exchange at 5+ wpm, with a scratchpad for notes and a key (mouse, touch, or spacebar) to reply.
* 2-minute copy — listen to a historical Scouting passage sent in Morse and type the translation as you decode it by ear.
* 25-word sending — send a set passage in Morse using a press-and-hold key; the app measures your actual speed and accuracy rather than assuming a fixed rate.

Along the way it also includes:

* A Settings tab for choosing practice speed (5–25 wpm) and volume.
* A Resources tab with the full Morse alphabet and punctuation (tap any character to hear it), plus links to the official ARRL/BSA requirements PDF, Google's Morse trainer, and Morsle.
* A Certificate tab that unlocks once all three requirements pass, pre-filled with the Scout's name, troop, and council, ready to print or save as a PDF.
* All progress is saved locally in the browser (localStorage) — nothing is sent to a server.

Try it locally
Download index.html from this repository.
Double-click it (or drag it into a browser tab). It opens and runs fully offline.
Work through Setup → Settings → the three requirement tabs → Certificate.

Anything you'd like to customize — practice passages, colors, pass thresholds — lives in plain text inside the <script> section of index.html, and can be edited directly or with the help of an AI coding assistant.

**Hosting it on GitHub Pages
**
This repository is set up to be published with GitHub Pages, so you can share one link with your whole troop instead of emailing a file around.

Make sure index.html sits at the root of this repository (GitHub Pages looks for that file name by default).
Go to the repository's Settings → Pages.
Under Build and deployment, set the source to Deploy from a branch.
Choose the main branch and the / (root) folder, then save.
GitHub will publish the site within a couple of minutes at:
   https://<your-github-username>.github.io/<this-repository-name>/
Share that link with your Scouts. To update the app later, just commit a new version of index.html to main — GitHub Pages redeploys automatically, no separate build or release step needed.
What's graded automatically vs. not
The copy and sending tests are auto-graded: the app measures typing/keying accuracy and effective words-per-minute and marks pass/fail.
The conversation test is timed and logged (a transcript is kept), but conversational proficiency is a judgment call the app doesn't try to grade — treat the in-app session as guided practice, and have a unit leader or counselor review the transcript (or observe live) before signing off.
The certificate includes a blank signature line for that reason. This app is a self-practice and record-keeping tool, not a substitute for your council's official advancement process.
Notes on content

The 2-minute copy passages are written in the spirit of Robert Baden-Powell's Scouting writings (public domain: Scouting for Boys, 1908, and his 1941 Farewell Message), lightly paraphrased so the app can reliably match exact words. Swap in verbatim historical text if you want it for ceremonial use.

License

Free to use, modify, and share for Scouting purposes. No warranty — this is a self-practice tool, not an official Scouting America product.
