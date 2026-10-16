# Changelog

This project follows [Semantic Versioning](https://semver.org/) (MAJOR.MINOR[.PATCH]). The current version is shown in the app footer (`APP_VERSION`).

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
