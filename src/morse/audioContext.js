// Shared singleton AudioContext — playText() and the sidetone both need to
// play through the same context, not one each.
let audioCtx = null;

export function getCtx(){
  if(!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  return audioCtx;
}
