# Morse Code Interpreter Strip Trainer

A free, self-contained web app for Scouts BSA / Scouting America Scouts practicing and self-testing for the official **Morse Code Interpreter Strip**. It walks a Scout through all three ARRL/BSA requirements, tracks progress on their own device, and generates a printable completion certificate for their unit leader or counselor to sign off on.

The whole app is **one file, `index.html`** — no build step, no bundler, no server, no account, no API key. The 5-minute conversation is powered by a small AI language model that runs **inside the Scout's own browser**, so there is nothing to pay for and no backend to maintain.

> **Publishing note:** the AI-enabled build is the single file `index-ai.html`. Save/rename it as `index.html` at the root of your repository (replacing any older version) so GitHub Pages serves it.

## What it covers

The app mirrors the official Interpreter Strip requirements:

1. **5-minute conversation** — "BASE CAMP" (an AI radio operator) sends short lines in Morse code; the text is never shown. The Scout copies each line by ear, jots notes, and keys a reply (mouse, touch, or spacebar). The AI reads the decoded reply and answers it, so every session is different. The session runs for 5 minutes.
2. **2-minute copy** — listen to a historical Scouting passage sent in Morse and type the translation as you decode it by ear.
3. **25-word sending** — send a set passage in Morse using a press-and-hold key; the app measures your actual speed and accuracy rather than assuming a fixed rate.

Along the way it also includes:

- A **Settings** tab for choosing practice speed (5–25 wpm) and volume.
- A **Resources** tab with the full Morse alphabet and punctuation (tap any character to hear it), plus links to the official ARRL/BSA requirements PDF, Google's Morse trainer, and Morsle.
- A key-calibration step before the conversation and sending tests, so the decoder learns the Scout's own dot/dash and word-gap timing.
- A **Certificate** tab that unlocks once all three requirements pass, pre-filled with the Scout's name, troop, and council, ready to print or save as a PDF.
- All progress is saved locally in the browser (`localStorage`).

## How the AI conversation works

- **Engine:** [Transformers.js](https://github.com/huggingface/transformers.js) v3 (pinned to 3.8.1, loaded from the jsDelivr CDN) running a small Qwen chat model locally.
- **Models:** `onnx-community/Qwen2.5-0.5B-Instruct` — on WebGPU (4-bit) when the browser supports it with `shader-f16`, otherwise on WebAssembly (8-bit). If that fails, it tries `Xenova/Qwen1.5-0.5B-Chat`. If every attempt fails, the app quietly falls back to the original built-in practice script, so the test always works.
- **First load:** about **0.5 GB** is downloaded once from Hugging Face and then cached by the browser. A progress bar shows the download, and the **Start Conversation** button stays disabled until the engine is ready. The download begins the first time a Scout opens the Conversation tab, so Scouts who only do Copy/Sending never download it. (Set `AI_LAZY_LOAD = false` in the script to download on page load instead.)
- **Morse only:** the AI's text goes straight to the Morse audio player. It is not displayed while playing. After the session ends, an "answer key" of what BASE CAMP actually sent is added to the transcript for the counselor to review.
- **Short lines:** small models don't reliably follow length rules, so each reply is cleaned up in code — restricted to characters Morse can send, capped so it plays in about 40 seconds at the Scout's current speed (`AI_MAX_LINE_SECONDS`), and always ended with "OVER".
- **Privacy:** the Scout's keyed replies are processed on their own device and are not sent to any server. The only network requests are the one-time downloads of the library (jsDelivr) and model files (Hugging Face), which, like any web request, expose the visitor's IP address to those services.

### Requirements for the AI conversation

- A recent desktop or laptop browser (Chrome, Edge, Firefox, or Safari). WebGPU is optional but makes replies faster.
- About 0.5 GB of free storage and a few hundred MB of free memory.
- An internet connection for the first load. Phones on cellular data may want to wait for Wi-Fi.
- Without AI support, requirements 2 and 3 work fully, and requirement 1 uses the built-in script.

## Try it locally

Open `index.html` in a browser, or serve the folder with `python3 -m http.server 8000` and visit `http://localhost:8000`. Serving over `http(s)` is recommended for the AI model download and caching. Work through Setup → Settings → the three requirement tabs → Certificate.

Anything you'd like to customize lives in plain text near the top of the script or in the conversation section:

- Practice quotes and the sending passage: `QUOTE_BANK`
- The fallback conversation script: `CONV_SCRIPT`
- AI behavior: `AI_SYSTEM_PROMPT`, `AI_OPENERS`, `AI_MAX_LINE_SECONDS`, `AI_LAZY_LOAD`, and the model list in `chooseAiAttempts()`
- Colors and fonts: the CSS variables at the top of the `<style>` block
- Pass/fail thresholds: search for `pass =` (the conversation requires 4 exchanges — see the note below)

## Hosting it on GitHub Pages

1. Put `index.html` at the root of this repository.
2. Go to the repository's **Settings → Pages**.
3. Under **Build and deployment**, set the source to **Deploy from a branch**.
4. Choose the `main` branch and the `/ (root)` folder, then save.
5. GitHub will publish the site within a couple of minutes at:

   ```
   https://<your-github-username>.github.io/<this-repository-name>/
   ```

6. Share that link with your Scouts. To update the app later, commit the changed file to `main` — GitHub Pages redeploys automatically.

## What's graded automatically vs. not

- The **copy** and **sending** tests are auto-graded: the app measures typing/keying accuracy and effective words-per-minute and marks pass/fail.
- The **conversation** test is timed and logged. It counts completed exchanges (4 needed to mark "Completed"); it does not judge the quality of the Scout's replies. At slow speeds (around 5 wpm) four exchanges can be tight inside 5 minutes — lower the threshold if your Scouts hit it too often. A unit leader or counselor should review the transcript and notes (or observe live) before signing off.
- The certificate includes a blank signature line for that reason. This app is a self-practice and record-keeping tool, not a substitute for your council's official advancement process.

## Known limitations

- The AI engine has not been exercised across browsers/devices yet; report issues you find. A 0.5B-parameter model can occasionally give an odd or off-topic reply — the Scout can use **Replay** or simply respond naturally.
- The dot/dash decoder is custom, tuned for human keying, and may misread very erratic timing. Calibrating before each test helps.

## Notes on content

The 2-minute copy passages are written in the spirit of Robert Baden-Powell's Scouting writings (public domain: *Scouting for Boys*, 1908, and his 1941 Farewell Message), lightly paraphrased so the app can reliably match exact words. Swap in verbatim historical text if you want it for ceremonial use.

## License

The app's own code is licensed under the [PolyForm Noncommercial License 1.0.0](LICENSE) — free to use, modify, and share for any noncommercial purpose (which covers all Scouting, educational, and personal use); commercial use requires permission from the copyright holder. No warranty — this is a self-practice tool, not an official BSA/Scouting America product.

**Third-party components are not bundled and are not covered by that license.** They are fetched at runtime under their own terms:

| Component | Source | License |
|---|---|---|
| Transformers.js 3.8.1 | jsDelivr CDN | Apache-2.0 |
| Qwen2.5-0.5B-Instruct (ONNX build by onnx-community) | Hugging Face | Apache-2.0 |
| Qwen1.5-0.5B-Chat (ONNX build by Xenova), fallback only | Hugging Face | Tongyi Qianwen Research License |

The fallback model's license is more restrictive than Apache-2.0 and is aimed at research use. If you want to avoid it entirely, remove the `Xenova/Qwen1.5-0.5B-Chat` line from `chooseAiAttempts()`; the app will use the built-in script if the primary model can't load. See the [LICENSE](LICENSE) file for full details and the trademark notice.
