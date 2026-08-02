
# Morse Code Interpreter Strip Trainer

A free, self-contained web app for Scouts BSA / Scouting America Scouts practicing and self-testing for the official **Morse Code Interpreter Strip**. It walks a Scout through all three ARRL/BSA requirements, tracks progress on their own device, and generates a printable completion certificate for their unit leader or counselor to sign off on.

The app is organized as a small set of static files — `index.html` plus a `src/` folder (styles and JS modules) and a `public/` folder (the strip icon image) — no build step, no bundler, no account required. Because browsers block loading JavaScript modules from a page opened directly off disk (a `file://` security restriction, not a bug), it needs to be served over `http://`/`https://` rather than opened by double-clicking. Any static host works — see "Try it locally" below for a zero-setup way to test it, and "Hosting it on GitHub Pages" for a permanent link.

## Project layout

```
index.html          shell: markup + links to src/styles/index.css and src/main.js
public/
  strip-icon.png     the Interpreter Strip photo
src/
  styles/            theme, layout, component, and print CSS
  morse/             Morse alphabet, audio playback, sidetone, key/decoder logic
  state/              localStorage persistence
  shared/            shared wpm/volume/sidetone session state
  content/           practice quotes, passages, and the conversation script
  ui/                one controller module per tab (setup, settings, resources,
                      conversation, copy, sending, certificate)
  input/             spacebar-as-telegraph-key handling
  main.js            wires everything up on page load
```

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

Because the app loads its JavaScript as ES modules (separate files under `src/`), double-clicking `index.html` won't work — that's a browser security rule for `file://` pages, not a bug. Pick whichever is easiest:

- **Easiest, no terminal:** drag the whole project folder into [Netlify Drop](https://app.netlify.com/drop) — you get a real, working link in seconds, and it behaves identically to the hosted version.
- **If you have Python installed:** open a terminal in this folder and run `python3 -m http.server 8000`, then visit `http://localhost:8000` in a browser.

Either way, work through Setup → Settings → the three requirement tabs → Certificate.

Anything you'd like to customize lives in plain text in a few specific files:

- Practice quotes and the sending passage: `src/content/practicePassages.js` (`QUOTE_BANK`)
- The conversation script: `src/content/conversationScript.js` (`CONV_SCRIPT`)
- Colors and fonts: `src/styles/theme.css`
- Pass/fail thresholds: search for `pass =` in `src/ui/copyTab.js`, `src/ui/sendingTab.js`, and `src/ui/conversationTab.js`

Edit these directly, or with the help of an AI coding assistant — point it at the specific file above rather than pasting the whole project.

## Hosting it on GitHub Pages

This repository is set up to be published with **GitHub Pages**, so you can share one link with your whole troop instead of emailing a file around.

1. Make sure `index.html` sits at the root of this repository, alongside the `src/` and `public/` folders (GitHub Pages looks for `index.html` at the root by default).
2. Go to the repository's **Settings → Pages**.
3. Under **Build and deployment**, set the source to **Deploy from a branch**.
4. Choose the `main` branch and the `/ (root)` folder, then save.
5. GitHub will publish the site within a couple of minutes at:

   ```
   https://<your-github-username>.github.io/<this-repository-name>/
   ```

6. Share that link with your Scouts. To update the app later, just commit whichever files changed to `main` — GitHub Pages redeploys automatically, no separate build or release step needed.

## What's graded automatically vs. not

- The **copy** and **sending** tests are auto-graded: the app measures typing/keying accuracy and effective words-per-minute and marks pass/fail.
- The **conversation** test is timed and logged (a transcript is kept), but conversational proficiency is a judgment call the app doesn't try to grade — treat the in-app session as guided practice, and have a unit leader or counselor review the transcript (or observe live) before signing off.
- The certificate includes a blank signature line for that reason. This app is a self-practice and record-keeping tool, not a substitute for your council's official advancement process.

## Notes on content

The 2-minute copy passages are written in the spirit of Robert Baden-Powell's Scouting writings (public domain: *Scouting for Boys*, 1908, and his 1941 Farewell Message), lightly paraphrased so the app can reliably match exact words. Swap in verbatim historical text if you want it for ceremonial use.

## License

Licensed under the [PolyForm Noncommercial License 1.0.0](LICENSE) — free to use, modify, and share for any noncommercial purpose (which covers all Scouting, educational, and personal use); commercial use requires permission from the copyright holder. No warranty — this is a self-practice tool, not an official BSA/Scouting America product. See the [LICENSE](LICENSE) file for the full terms and trademark notice.
