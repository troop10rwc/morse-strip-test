// Current wpm/volume + the shared keying sidetone, read by every tab that
// plays or keys Morse (Resources, Conversation, Copy, Sending). Settings tab
// is the only writer; everyone else just reads currentWpm()/currentVol().
import { makeSidetone } from '../morse/sidetone.js';
import { loadState, saveState } from '../state/storage.js';

let wpm = 5;
let volume = 60;

export function initFromState(){
  const s = loadState();
  wpm = s.wpm || 5;
  volume = s.volume != null ? s.volume : 60;
}

export function currentWpm(){ return wpm; }
export function currentVol(){ return volume; }

export function setWpm(v){
  wpm = Number(v);
  saveState({ wpm });
}

export function setVolume(v){
  volume = Number(v);
  saveState({ volume });
}

export const keySidetone = makeSidetone(currentVol);
