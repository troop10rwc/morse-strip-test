import { REVERSE_MORSE } from './alphabet.js';

// ---------- Key input (press-and-hold telegraph key, mouse/touch/spacebar) ----------
// Used by both the conversation and sending tests.
//
// This does NOT assume the Scout is keying at the Settings wpm. Instead it
// records the raw duration of every press, then figures out which durations
// are "short" (dots) and which are "long" (dashes) using simple clustering.
// Calibration is based on a SLIDING WINDOW of the most recent presses (not
// the whole message) so the decoder tracks the sender's *current* speed —
// real people speed up, slow down, and pause unevenly as they go, and a
// whole-message average gets stale and misreads everything once speed
// drifts. The window is seeded with a couple of placeholder "assumed dot"
// values at the Settings speed, so an early keystroke that happens to be a
// dash can't badly skew the very first few letters before real data arrives.
//
// Pauses are judged relative to that same recency-weighted unit estimate,
// using boundary ratios a bit more forgiving than the textbook 1:3:7 unit
// spacing: hand-sent pauses between words are often shorter than "ideal"
// spacing, especially for beginners, so a strict threshold misses real word
// breaks and runs words together. (An earlier version of this tried
// clustering the gaps themselves into three groups instead of using fixed
// ratios — it turned out to be more fragile under simultaneous speed drift,
// since a word-gap and character-gap cluster can end up too close together
// to separate reliably. The simple ratio approach below tracks drift fine
// already, since it's a multiple of the same live-updating unit estimate.)
//
// Display only ever grows: a letter is decided ONCE — the moment a pause
// confirms it's finished — using the best calibration available at that
// instant, and is then locked in and never re-evaluated. Nothing is shown
// mid-letter, so already-displayed text never changes or flickers as more
// of the message comes in.
export function makeKeyInput(getWpm){
  const WINDOW_SIZE = 12; // recent presses used for calibration
  const state = { down:false, downAt:0, upAt:0, durationWindow:[], pendingDurations:[], text:'', rawText:'', pollTimer:null, calibrating:false, maxCalGap:0 };

  // A Scout's real "let me think of the next letter" pause between letters
  // doesn't shrink just because the Settings speed is set higher — it's
  // roughly constant in real seconds. That means a purely proportional
  // word-gap threshold (a fixed multiple of the dot length) can misread an
  // ordinary hesitation as "must be a new word," especially at faster
  // Settings speeds where the unit is tiny. Testing this directly (a
  // simulated beginner who pauses a few times longer between letters while
  // recalling each one) reproduced exactly that: whole messages shattered
  // into one-letter "words".
  //
  // Fix: during the calibration tap (Scout keys "A", pauses like they would
  // between two words, then keys "A" again), we measure that demonstrated
  // pause directly and let it RAISE the word-break threshold above the
  // default — but never lower it. Only raising it means a Scout whose own
  // natural word-pause is clearly longer than the safe default gets more
  // headroom against false word-breaks, while a Scout who didn't pause much
  // (or skipped calibration) still gets the proven-reliable default rather
  // than a threshold weakened by one noisy sample.
  let calibratedWordGap = null;
  function startCalibrating(){ state.calibrating = true; state.maxCalGap = 0; }
  function endCalibrating(){
    state.calibrating = false;
    if(state.maxCalGap > 0) calibratedWordGap = state.maxCalGap;
  }

  // Deliberately NOT pre-seeded with a placeholder duration: if the Settings
  // wpm differs a lot from the sender's actual speed, a fake sample can bias
  // classification of the first several real keystrokes in the wrong
  // direction (e.g. sending slower than Settings makes real dots look like
  // dashes next to an artificially fast placeholder). Leaving the window
  // empty means the very first keystroke is judged only against the
  // Settings-derived guess as a one-time fallback (see twoMeans below), and
  // every keystroke after that is calibrated purely from real data.
  function seedWindow(){
    state.durationWindow = [];
  }
  seedWindow();

  // Damped estimate of the current dot-length, used ONLY for judging
  // char/word pause boundaries (see currentUnit below). It updates once per
  // real keystroke rather than snapping straight to the latest raw cluster
  // mean, so a short unlucky run of fast (or slow) real presses can't swing
  // the pause thresholds enough to misread a letter-gap as a word-gap —
  // testing showed exactly that: with realistic hand jitter, an ordinary
  // letter-to-letter gap could occasionally land just past the word-gap
  // ratio because the raw per-keystroke unit estimate is noisy on its own.
  let smoothedUnit = null;
  function pushDuration(dur){
    state.durationWindow.push(dur);
    if(state.durationWindow.length > WINDOW_SIZE) state.durationWindow.shift();
    const raw = twoMeans(state.durationWindow).dot;
    smoothedUnit = (smoothedUnit === null) ? raw : smoothedUnit*0.65 + raw*0.35;
  }

  // 1-D "2-means" clustering: splits recent press durations into a short
  // (dot) group and a long (dash) group, regardless of absolute speed.
  //
  // IMPORTANT: clustering alone cannot tell short from long without some
  // *contrast* in the sample — a run of same-length presses (e.g. testing a
  // dash-only letter like "T" or "O" by itself) is equally consistent with
  // "these are all dots" or "these are all dashes." Naively assuming
  // "whatever I've seen so far must be a dot" (the old behavior here) meant
  // a single press was ALWAYS read as a dot no matter how long it was held.
  // So: when there isn't enough spread in the data to safely trust
  // clustering, fall back to the Settings-implied absolute timing to decide
  // whether the uniform cluster looks more like dots or dashes, instead of
  // blindly labeling it "dot".
  function twoMeans(durations){
    const seed = 1200/getWpm();
    if(durations.length === 0) return { dot: seed, dash: seed*3 };
    let dot = Math.min(...durations);
    let dash = Math.max(...durations);
    for(let i=0;i<8;i++){
      const dotGroup=[], dashGroup=[];
      durations.forEach(d => (Math.abs(d-dot) <= Math.abs(d-dash) ? dotGroup : dashGroup).push(d));
      if(dotGroup.length) dot = dotGroup.reduce((a,b)=>a+b,0)/dotGroup.length;
      if(dashGroup.length) dash = dashGroup.reduce((a,b)=>a+b,0)/dashGroup.length;
    }
    if(dash < dot * 1.8){
      // Not enough contrast to trust the split above — decide against the
      // absolute Settings-implied unit instead of assuming "dot".
      const uniform = (dot + dash) / 2;
      if(uniform < seed * 2){
        dot = uniform; dash = seed * 3;
      } else {
        dot = seed; dash = uniform;
      }
    }
    return { dot, dash };
  }

  function currentUnit(){ return smoothedUnit === null ? twoMeans(state.durationWindow).dot : smoothedUnit; }

  // Debounce: mice, trackpads, and touchscreens occasionally misfire a
  // spurious extra down/up blip around a single real click — the same
  // "switch bounce" problem hardware debounce circuits exist to solve for
  // noisy analog contacts. A press, or the gap right after a release, this
  // short is physically impossible to send intentionally even at the
  // fastest supported speed (25 wpm => a dot is ~48ms), so anything under
  // this is treated as contact noise and dropped rather than fed to the
  // decoder as a (very wrong) extra dot.
  const DEBOUNCE_MS = 15;

  function keyDown(){
    if(state.down) return;
    const now = performance.now();
    if(state.upAt && (now - state.upAt) < DEBOUNCE_MS) return; // bounce right after release — ignore
    state.down = true;
    if(state.upAt){
      const gap = now - state.upAt;
      const unit = currentUnit();
      if(state.calibrating) state.maxCalGap = Math.max(state.maxCalGap, gap);
      const defaultWordThresh = unit*4.2;
      const wordThresh = calibratedWordGap !== null ? Math.max(defaultWordThresh, calibratedWordGap*0.75) : defaultWordThresh;
      if(gap >= wordThresh){
        finalizePending();
        state.text += ' ';
        state.rawText += ' / ';
      } else if(gap >= unit*2){
        finalizePending();
      }
      // else: intra-character gap — keep accumulating the same letter
    }
    state.downAt = now;
  }

  function keyUp(){
    if(!state.down) return;
    state.down = false;
    const now = performance.now();
    const dur = now - state.downAt;
    if(dur < DEBOUNCE_MS){
      // Spurious blip too short to be a real press — discard it without
      // recording a duration or moving the release-time anchor, so gap
      // timing for the next real press is unaffected.
      return;
    }
    pushDuration(dur);
    state.pendingDurations.push(dur);
    state.upAt = now;
  }

  // Locks in the letter currently being keyed. Uses the best calibration
  // available right now, then never revisits this decision.
  function finalizePending(){
    if(state.pendingDurations.length === 0) return;
    const { dot, dash } = twoMeans(state.durationWindow);
    const symbols = state.pendingDurations.map(d => (Math.abs(d-dot) <= Math.abs(d-dash) ? '.' : '-')).join('');
    state.text += (REVERSE_MORSE[symbols] || '?');
    state.rawText += (state.rawText && !state.rawText.endsWith(' ') ? ' ' : '') + symbols;
    state.pendingDurations = [];
  }

  function displayString(){ return state.text; }
  // Shows exactly what the app measured as dots/dashes, letter-by-letter —
  // lets a Scout (or leader) see whether a specific press was read as the
  // wrong symbol, instead of only seeing the final decoded letters.
  function rawString(){ return state.rawText; }

  function startPolling(onUpdate){
    stopPolling();
    state.pollTimer = setInterval(() => {
      // auto-finalize a trailing letter if the key has been idle long enough
      if(!state.down && state.upAt && state.pendingDurations.length){
        const gap = performance.now() - state.upAt;
        if(gap >= currentUnit()*2) finalizePending();
      }
      onUpdate(displayString());
    }, 150);
  }
  function stopPolling(){ if(state.pollTimer) clearInterval(state.pollTimer); state.pollTimer = null; }

  function reset(){ state.down=false; state.downAt=0; state.upAt=0; seedWindow(); smoothedUnit=null; calibratedWordGap=null; state.calibrating=false; state.maxCalGap=0; state.pendingDurations=[]; state.text=''; state.rawText=''; }
  function finalizeNow(){ finalizePending(); }
  // Clears decoded text/pending strokes WITHOUT wiping the calibrated
  // durationWindow — used when moving from a practice/calibration tap into
  // the graded message, or on "Start Over", so the speed contrast already
  // learned isn't thrown away.
  function clearText(){ state.pendingDurations=[]; state.text=''; state.rawText=''; state.upAt=0; }

  return { keyDown, keyUp, startPolling, stopPolling, reset, finalizeNow, clearText, state, displayString, rawString, startCalibrating, endCalibrating };
}
