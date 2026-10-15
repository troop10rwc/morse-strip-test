# Morse Code Interpreter Strip App — Build, Host & Deploy Guide

This guide assumes no coding background. The whole app is **one file, `index.html`**. There is nothing to compile, no database, no server, and no API key. The 5-minute conversation is powered by a small AI model that runs **inside each Scout's own web browser**, so it costs nothing to run.

## 1. Try it right now (no hosting needed)

Double-click `index.html` to open it in a recent browser (Chrome or Edge recommended), or use a free test link:

- **Easiest, no terminal:** go to [Netlify Drop](https://app.netlify.com/drop) and drag `index.html` into the browser window. You get a working link in seconds.
- **If you're comfortable with a terminal:** open one in the folder containing `index.html` and run `python3 -m http.server 8000`, then open `http://localhost:8000`.

Opening the file directly works for everything except the AI model's download and caching, which are more reliable over `http://` or `https://`. For the real test of the AI conversation, use a hosted link or the local server.

Test the flow yourself: Setup → Settings → the three requirement tabs → Certificate.

Anything you want changed lives in plain text inside `index.html` (open it in any text editor and search for these names):

- Practice quotes and the sending passage: `QUOTE_BANK`
- The fallback conversation script: `CONV_SCRIPT`
- AI behavior: `AI_SYSTEM_PROMPT`, `AI_OPENERS`, `AI_MAX_LINE_SECONDS`, `AI_LAZY_LOAD`, and the model list in `chooseAiAttempts()`
- Colors: the `--navy`, `--red`, and related variables at the top of the `<style>` block
- Passing scores: search for `pass =`

You can ask an AI assistant like Claude to make edits for you — share `index.html` and describe the change.

## 2. Hosting it publicly (pick one)

All options are free, need no server maintenance, and only ever host one static file.

### Option A — GitHub Pages (recommended default)
1. Create a free account at github.com.
2. Create a new repository (e.g. `morse-strip-test`) and choose "Add file → Upload files." Upload `index.html`, plus `README.md` and `LICENSE`.
3. Confirm `index.html` is at the root of the repository, not inside a subfolder.
4. Go to **Settings → Pages**, set the source to **Deploy from a branch**, choose `main` and `/ (root)`, then save.
5. Within a couple of minutes GitHub gives you a public URL like `https://yourusername.github.io/morse-strip-test/`. Share that link with your Scouts.
6. To update the app later, upload the replacement `index.html` — GitHub Pages redeploys automatically.

### Option B — Netlify Drop
1. Go to app.netlify.com/drop.
2. Drag `index.html` into the browser window.
3. Netlify gives you a live public URL. Create a free account if you want to keep the site and update it later.

### Option C — Replit
1. Create a free account at replit.com.
2. Create a new "Static" or "HTML/CSS/JS" Repl and paste in or upload `index.html`.
3. Click "Run," then use the provided webview URL as your public link.

Any of the three works fine for a troop's internal use — choose whichever account you or a fellow leader already has.

## 3. How the AI conversation works (Requirement 1)

- **What runs where:** the page loads the free Transformers.js library (version 3.8.1, from the jsDelivr CDN) and a small Qwen chat model (from Hugging Face), then runs the model on the Scout's own device. Nothing the Scout keys is sent to a server, and you pay nothing.
- **First load:** about **0.5 GB** is downloaded once and then cached by that browser. A progress bar is shown, and **Start Conversation** stays disabled until the engine is ready. The download begins the first time a Scout opens the Conversation tab, so Scouts who only do Copy or Sending never download it. To download on page load instead, set `AI_LAZY_LOAD = false`.
- **Speed and fallbacks:** the app uses the graphics chip (WebGPU) when the browser supports it, otherwise the regular processor (WebAssembly), then a backup model. If every attempt fails (no internet, blocked network, old browser), the status line says so and the app uses the original built-in practice script instead, so the test always works.
- **Morse only:** the AI's reply is sent straight to the Morse audio player and is never shown on screen during playback. After the session ends, an "answer key" of what BASE CAMP actually sent appears in the transcript for the leader to review.
- **Short lines:** each reply is cleaned up in code — only characters Morse can send, capped to about 40 seconds of playback at the Scout's current speed, and always ending in "OVER". This keeps several exchanges possible inside the 5-minute window.

### Things to check before a troop meeting
- **Network:** the page must be able to reach `cdn.jsdelivr.net` and `huggingface.co`. Some school, church, or library networks block one or both. If the status line shows the "unavailable" message, the AI is blocked and the built-in script is in use.
- **First-time download:** have Scouts load the Conversation tab on Wi-Fi ahead of time. Cached models don't need to be downloaded again in the same browser, but clearing browser data or using private/incognito windows removes the cache.
- **Devices:** a laptop or Chromebook with a recent browser works best. Older phones and tablets may be slow or run out of memory; they will fall back to the built-in script if the model can't load.
- **Reply quality:** a half-billion-parameter model can occasionally give an odd reply. The Scout can replay the line or just answer naturally.
- **Privacy:** the downloads come from third-party servers (jsDelivr and Hugging Face), which can see the visitor's IP address like any website. The Scout's keyed messages stay on their device.
- **Licenses:** the library and primary model are Apache-2.0. The backup model (`Xenova/Qwen1.5-0.5B-Chat`) uses the more restrictive Tongyi Qianwen Research License. To avoid it, delete its line in `chooseAiAttempts()`. See `LICENSE` for details.

## 4. Branding notes

The app uses official Scouting America colors (Scouts BSA Red #CE1126, Scouts BSA Tan #B39475/#AD9D7B, Scouting America Dark Blue #003366) per the org's published brand guide, plus approved alternate typefaces: Montserrat for headlines (loaded free from Google Fonts) and Verdana for body text, with Times New Roman for the printed certificate. The Interpreter Strip images are embedded directly inside `index.html`, so there are no separate image files to upload. To swap in a different strip photo, ask an AI assistant to replace the embedded image.

## 5. What the app does and does not verify

- **Requirement 2 (copy)** and **Requirement 3 (sending)** are auto-graded: the app measures typing/keying accuracy and effective words-per-minute and marks pass/fail.
- **Requirement 1 (conversation)** is timed and logged (a transcript is kept). The app counts completed exchanges but does not judge whether the Scout's replies make sense. Treat the in-app session as guided practice, and have a unit leader or merit badge counselor observe the Scout (in person, live, or by reviewing the transcript and answer key) before signing off.
- The certificate screen includes a blank "Verified by (unit leader / counselor signature)" line for this reason. Nothing here replaces your council's official advancement / sign-off process.
- The 2-minute passage is drawn from lines written in the spirit of Robert Baden-Powell's Scouting writings (public domain: *Scouting for Boys*, 1908, and his 1941 Farewell Message), lightly paraphrased so the app can reliably match exact words. For verbatim historical quotes, swap the `QUOTE_BANK` text for text you've checked against a primary source.

## 6. Adjusting speed and pass thresholds

- The Settings tab lets each Scout pick 5–25 wpm before testing.
- Copy and sending pass thresholds are plain constants in the code (currently 80% accuracy, plus a small timing tolerance around the chosen wpm). Search for `>= 80` or `pass =` to adjust them.
- The conversation bar is the line `const pass = convExchanges >= 4`. At slow speeds (around 5 wpm), four exchanges can be tight inside 5 minutes because each Morse line and each keyed reply takes real time. If Scouts often come up just short, lower the 4 to 3.

## 7. Quick pre-launch checklist

- [ ] Rename `index-ai.html` to `index.html`.
- [ ] Open the hosted link on a laptop and wait for "🟢 AI Engine Ready" in the Conversation tab; run a full 5-minute conversation.
- [ ] Complete all three tests yourself at a few different wpm settings.
- [ ] Confirm audio plays clearly on a laptop and, if Scouts will use them, a phone or tablet.
- [ ] Check that your meeting location's network can reach `cdn.jsdelivr.net` and `huggingface.co`, or plan to use the built-in script.
- [ ] Read through `QUOTE_BANK` and `CONV_SCRIPT` and adjust wording to your troop's taste.
- [ ] Publish (Section 2) and share the link. Let leaders know the certificate is a self-practice record, not a substitute for their sign-off.
