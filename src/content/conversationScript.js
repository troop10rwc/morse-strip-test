// Fixed practice script for Requirement 1 (5-minute conversation). Kept
// isolated in its own module on purpose: this is the exact seam where a real
// Claude-API-backed conversation partner will plug in later, without
// conversationTab.js needing to change anything else about timing, keying,
// or transcript logging.
//
// Kept deliberately short — real Morse traffic at slow speeds stays terse
// for exactly this reason. At the 5 wpm minimum this app is meant to
// certify, the ORIGINAL longer lines (e.g. "HELLO SCOUT THIS IS BASE CAMP
// DO YOU COPY") ate the vast majority of the 5-minute budget just being
// played back, leaving a beginner as little as ~20 seconds to think through
// and key EACH reply — nowhere near enough time to reliably reach the
// 4-exchange participation bar, so the test would fail almost every time
// regardless of how well a Scout actually sent Morse. Shortening the script
// leaves ~45+ seconds per reply at 5 wpm, which is realistic for someone
// still keying letter-by-letter.
export const CONV_SCRIPT = [
  "HELLO SCOUT BASE CAMP HERE",
  "YOUR NAME",
  "YOUR TROOP",
  "SCOUT MOTTO",
  "WEATHER THERE",
  "FAVORITE ACTIVITY",
  "GOOD COPY THANKS",
  "NEXT BADGE",
  "TROOP NUMBER AGAIN",
  "GREAT CONTACT BYE",
  "BASE CAMP OUT",
  "FINAL MESSAGE"
];
