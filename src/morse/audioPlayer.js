import { getCtx } from './audioContext.js';
import { buildTimeline } from './alphabet.js';

// Tracks whatever playText() call is currently sounding, so a new call can
// cut it off cleanly instead of overlapping (e.g. hitting "Play test tone"
// again, or changing the speed slider mid-playback and pressing play again).
let currentPlayback = null;

export function playText(text, wpm, volume){
  // Stop whatever's currently playing before starting the new one.
  if(currentPlayback){ currentPlayback.stop(); currentPlayback = null; }

  return new Promise(resolve => {
    const ctx = getCtx();
    const events = buildTimeline(text);
    const unitSec = 1.2/wpm; // standard PARIS timing: unit(ms) = 1200/wpm
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.frequency.value = 620;
    gain.gain.value = 0.0001;
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    let t = ctx.currentTime + 0.15;
    const vol = Math.max(0.0001, volume/100 * 0.35);
    events.forEach(ev => {
      const dur = ev.units * unitSec;
      if(ev.on){
        gain.gain.setValueAtTime(vol, t);
        gain.gain.setValueAtTime(0.0001, t + Math.max(dur-0.008, 0.001));
      }
      t += dur;
    });
    osc.stop(t + 0.05);

    let settled = false;
    let paused = false;
    // AudioContext.suspend()/resume() freeze and resume all scheduled gain
    // automation exactly where it left off, so pausing doesn't need to
    // re-schedule the tone timeline — but the completion timer is wall-clock
    // (setTimeout), so it has to be tracked/restarted around the pause too.
    let remainingMs = (t - ctx.currentTime) * 1000;
    let segmentStartedAt = Date.now();
    let timer = setTimeout(finish, remainingMs);

    function finish(){
      if(settled) return;
      settled = true;
      currentPlayback = null;
      resolve();
    }

    currentPlayback = {
      stop(){
        if(settled) return;
        settled = true;
        clearTimeout(timer);
        try{
          gain.gain.cancelScheduledValues(ctx.currentTime);
          gain.gain.setValueAtTime(0.0001, ctx.currentTime);
          osc.stop(ctx.currentTime + 0.02);
        }catch(e){ /* already stopped */ }
        resolve();
      },
      pause(){
        if(settled || paused) return;
        paused = true;
        remainingMs -= (Date.now() - segmentStartedAt);
        clearTimeout(timer);
        ctx.suspend();
      },
      resume(){
        if(settled || !paused) return;
        paused = false;
        ctx.resume();
        segmentStartedAt = Date.now();
        timer = setTimeout(finish, Math.max(remainingMs, 0));
      },
      isPaused(){ return paused; }
    };
  });
}

// Force-stops any Morse audio currently playing (used by the Stop Conversation
// button, so ending the test early doesn't leave a line playing in the background).
export function stopCurrentPlayback(){
  if(currentPlayback){ currentPlayback.stop(); currentPlayback = null; }
}

export function pauseCurrentPlayback(){ if(currentPlayback) currentPlayback.pause(); }
export function resumeCurrentPlayback(){ if(currentPlayback) currentPlayback.resume(); }
export function isCurrentPlaybackPaused(){ return !!currentPlayback && currentPlayback.isPaused(); }
