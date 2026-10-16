# Changelog

This project follows [Semantic Versioning](https://semver.org/) (MAJOR.MINOR[.PATCH]). The current version is shown in the app footer (`APP_VERSION`).

## 2.5
- More reliable Requirement 1 conversation. The small model was producing nonsense ("JK SO K" repeated), so: it is no longer asked to type the K itself (code adds it); it gets hidden example exchanges and natural lower-case text so it copies a short, plain radio style; garbled Scout replies (shown as "?") get a realistic "PSE AGN K" instead of being fed to the model; and every model reply passes a quality check (real words, no repeats, not cut off mid-sentence, no "as an AI" talk) before it is sent, with a sensible scripted line used if the model fails twice. The end-of-session answer key now tags each line (opener / model / again / script) so you can see what the AI actually did.
- New Calibrate & Practice tab. Calibrate once (key A, pause like between words, key A) and the app saves how you key — dot/dash lengths and your three kinds of pause — on this device. The Conversation and Sending tests reuse it instead of asking you to calibrate each time; if nothing is saved they still offer a quick calibration, and save it. A practice area below the calibration lets a Scout key free text or a practice word, see the decoded text and raw dots/dashes, check the result, and see their own timing. Saved calibration can be redone or cleared.
- Requirement 1 transcript for the leader: the Notes box is now per message (saved with each exchange and cleared when the Scout sends a reply). At the end of the session the transcript lists every message BASE CAMP sent with what the Scout wrote and the actual text in parentheses, followed by the message the app recorded from the Scout's key (including a message that was heard but not answered). A Copy transcript button is included, and the full transcript is saved with the result. Answers are shown only after the session so they are not visible during the test.
- Conversation is plain text again: no K prosign, no "over," and no abbreviations in BASE CAMP's lines, the built-in script, or the AI instructions ("PSE AGN" is now "SAY AGAIN"). The built-in script was rewritten in plain words that fit the 24-second line cap at 5 wpm.

## 2.4
- Rebuilt key-gap detection. The decoder now clusters the Scout's actual gaps into three groups (inside a letter, between letters, between words) on a log scale, seeds them from the calibration tap, and re-fits them from all recent gaps on every press, instead of relying on fixed multiples of the dot length. In simulation this fixes letters splitting or merging and words running together for consistent keyers.
- The AI operator now ends each turn with the prosign K ("go ahead") instead of the word "over"; opening lines and the fallback script follow suit.
- Added prosign playback (run-together characters such as AR, SK, KN) and decoding of AR, SK, AS and the error signal.
- Resources tab: timing basics and study tips, a prosign table, common abbreviations and Q-codes, and a sample exchange, all tap-to-play. The conversation instructions now remind Scouts to end their turns with K.
- Requirement 3 can now be passed two ways (plus the 5 wpm minimum): the decoded text scores 80%+, or the Scout's dots and dashes, aligned to the known passage and ignoring gaps, get 80%+ of words with every element correct and 80%+ of elements. The result screen shows both scores and flags a pass earned the second way; the certificate notes it too.
- Resources: added a short note on Farnsworth timing.
- Shorter BASE CAMP lines for more back-and-forth: every line (opening, AI reply, and built-in fallback script) is now capped at about 24 seconds of Morse at the Scout's current speed (was 40; the old first scripted line took nearly a minute at 5 wpm). The model is told how many words fit, over-long replies are trimmed at sentence boundaries, and the fallback script was rewritten with short standard abbreviations (UR, WX, FB, TNX, QTH).

## 2.3
- Each requirement can be retried after a failed attempt without affecting the other requirements; the start button relabels to "Try … Again" and the result screen explains how to retry.
- A previously passed requirement is no longer overwritten by a later failed attempt (retake, early Stop, or leaving the tab mid-session), so the certificate stays unlocked. Attempt counts are recorded per requirement.

## 2.2
- Requirements 2 and 3 now score accuracy with word-level edit distance (word error rate) instead of position-by-position word matching, so a single missed word gap or extra word no longer misaligns the rest of the passage. Pass bar unchanged (80%).
- Result screens also show a letter-level match percentage for context.

## 2.1
- Added the AI-powered conversation partner for Requirement 1 (in-browser Transformers.js + Qwen), with fallback to the built-in script.
- Improved key-gap detection: calibration now learns the Scout's pause inside a letter and uses the average between-words pause for word breaks.
- Added footer with version, copyright year, organization, and license; added favicon.

## 1.4
- Shortened the Requirement 1 conversation script (e.g. "YOUR NAME", "SCOUT MOTTO") so a Scout keying at the 5 wpm minimum has time to reach the 4-exchange bar within 5 minutes; longer lines used up most of the session just playing back.

## 1.3
- Applied the same key calibration step to Requirement 1 (Conversation), so replies are decoded using the Scout's own dot/dash and word-gap timing from the start.

## 1.2
- Added a calibration step to Requirement 3 (Sending): key "A", pause as you would between two words, key "A" again. The demonstrated pause can raise (never lower) the word-break threshold, which stopped words from splitting into single letters.

## 1.1
- Replaced fixed-timing key decoding with an adaptive decoder: dot/dash clustering over a sliding window of recent presses, a smoothed unit length for pause detection, contact debounce, and a raw dot/dash display for troubleshooting.

## 1.0
- Initial release: single-file practice and self-test app for the Morse Code Interpreter Strip with Setup, Settings and Resources tabs; Requirement 1 (5-minute scripted conversation), Requirement 2 (2-minute copy, auto-graded), and Requirement 3 (25-word sending, auto-graded); printable certificate; progress saved in the browser; Scouting America branding.
