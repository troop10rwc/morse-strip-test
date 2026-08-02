import { getCtx } from './audioContext.js';

// Audible "beep" heard while a key is held down, like a real telegraph/CW key.
export function makeSidetone(getVolume){
  let ctx=null, osc=null, gain=null;
  function ensure(){
    if(!ctx){
      ctx = getCtx();
      osc = ctx.createOscillator();
      gain = ctx.createGain();
      osc.frequency.value = 620;
      gain.gain.value = 0.0001;
      osc.connect(gain).connect(ctx.destination);
      osc.start();
    }
  }
  function on(){
    ensure();
    const vol = Math.max(0.0001, getVolume()/100 * 0.35);
    gain.gain.cancelScheduledValues(ctx.currentTime);
    gain.gain.setTargetAtTime(vol, ctx.currentTime, 0.005);
  }
  function off(){
    if(!ctx) return;
    gain.gain.cancelScheduledValues(ctx.currentTime);
    gain.gain.setTargetAtTime(0.0001, ctx.currentTime, 0.01);
  }
  function stop(){
    if(osc){ try{ osc.stop(); }catch(e){} }
    osc=null; gain=null; ctx=null;
  }
  return { on, off, stop };
}
