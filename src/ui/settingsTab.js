import { loadState, clearState } from '../state/storage.js';
import { currentWpm, currentVol, setWpm, setVolume } from '../shared/audioSession.js';
import { playText } from '../morse/audioPlayer.js';

export function initSettingsTab(){
  const wpmRange = document.getElementById('wpmRange');
  const wpmVal = document.getElementById('wpmVal');
  const volRange = document.getElementById('volRange');
  // The Resources tab has its own speed slider (for auditioning alphabet
  // letters at different speeds) that stays in sync with this one — both
  // just read/write the same shared wpm value, so they're wired together here.
  const resWpmRange = document.getElementById('resWpmRange');
  const resWpmVal = document.getElementById('resWpmVal');

  const s = loadState();
  wpmRange.value = s.wpm || 5;
  wpmVal.textContent = wpmRange.value;
  resWpmRange.value = wpmRange.value;
  resWpmVal.textContent = wpmRange.value;
  volRange.value = s.volume != null ? s.volume : 60;

  function syncWpm(v){
    wpmRange.value = v; wpmVal.textContent = v;
    resWpmRange.value = v; resWpmVal.textContent = v;
    setWpm(v);
  }
  wpmRange.addEventListener('input', () => syncWpm(wpmRange.value));
  resWpmRange.addEventListener('input', () => syncWpm(resWpmRange.value));
  volRange.addEventListener('input', () => setVolume(volRange.value));

  document.getElementById('testTone').addEventListener('click', () => {
    playText('PARIS', currentWpm(), currentVol());
  });

  document.getElementById('resetProgress').addEventListener('click', () => {
    if(confirm('Clear all saved profile, settings, and results on this device?')){
      clearState();
      location.reload();
    }
  });
}
