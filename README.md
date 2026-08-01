
# Morse Code Interpreter Strip Trainer

A free, self-contained web app for Scouts practicing and self-testing for the official **Morse Code Interpreter Strip**. It walks a Scout through all three ARRL/BSA requirements, tracks progress on their own device, and generates a printable completion certificate for their unit leader or counselor to sign off on.

The entire app is a single file, `index.html` — no build step, no server, no account required. It can be downloaded and run offline, or accessed at [https://troop10rwc.github.io/morse-strip-test/]

## What it covers

The app mirrors the official Interpreter Strip requirements:

1. **5-minute conversation** — hold a guided Morse exchange at 5+ wpm, with a scratchpad for notes and a key (mouse, touch, or spacebar) to reply.
2. **2-minute copy** — listen to a historical Scouting passage sent in Morse and type the translation as you decode it by ear.
3. **25-word sending** — send a set passage in Morse using a press-and-hold key; the app measures your actual speed and accuracy rather than assuming a fixed rate.

Along the way it also includes:

- A **Settings** tab for choosing practice speed (5–25 wpm) and volume.
- A **Resources** tab with the full Morse alphabet and punctuation (tap any character to hear it), plus links to the official ARRL/BSA requirements PDF, Google's Morse trainer, and Morsle.
- A **Certificate** tab that unlocks once all three requirements pass, pre-filled with the Scout's name, troop, and council, ready to print or save as a PDF.
- All progress is saved locally in the browser (`localStorage`) — nothing is sent to a server.

## Try it locally

1. Download `index.html` from this repository.
2. Double-click it (or drag it into a browser tab). It opens and runs fully offline.
3. Work through Setup → Settings → the three requirement tabs → Certificate.

## Hosting it on GitHub Pages

This repository is set up to be published with **GitHub Pages**, so you can share one link with your whole troop instead of emailing a file around.

1. Make sure `index.html` sits at the root of this repository (GitHub Pages looks for that file name by default).
2. Go to the repository's **Settings → Pages**.
3. Under **Build and deployment**, set the source to **Deploy from a branch**.
4. Choose the `main` branch and the `/ (root)` folder, then save.
5. GitHub will publish the site within a couple of minutes at:

   ```
   https://<your-github-username>.github.io/<this-repository-name>/
   ```

6. Share that link with your Scouts. To update the app later, just commit a new version of `index.html` to `main` — GitHub Pages redeploys automatically, no separate build or release step needed.

## What's graded automatically vs. not

- The **copy** and **sending** tests are auto-graded: the app measures typing/keying accuracy and effective words-per-minute and marks pass/fail.
- The **conversation** test is timed and logged (a transcript is kept), but conversational proficiency is a judgment call the app doesn't try to grade — treat the in-app session as guided practice, and have a unit leader or counselor review the transcript (or observe live) before signing off.
- The certificate includes a blank signature line for that reason. This app is a self-practice and record-keeping tool, not a substitute for your council's official advancement process.

## Notes on content

The 2-minute copy passages are written in the spirit of Robert Baden-Powell's Scouting writings (public domain: *Scouting for Boys*, 1908, and his 1941 Farewell Message), lightly paraphrased so the app can reliably match exact words.

## License

Free to use, modify, and share for Scouting purposes. No warranty — this is a self-practice tool, not an official Scouting America product.
