import { playText, pauseCurrentPlayback, resumeCurrentPlayback, isCurrentPlaybackPaused } from '../morse/audioPlayer.js';
import { currentWpm, currentVol } from '../shared/audioSession.js';
import { saveState } from '../state/storage.js';
import { buildCopyMessage } from '../content/practicePassages.js';
import { setBadge } from './badges.js';
import { updateCertificate } from './certificateTab.js';

let copyMessage = '';
let copyTimerEl, copyPauseBtn;
let copyInterval = null, copySecondsElapsed = 0;

function startCopyTimer(){
  copyInterval = setInterval(() => {
    copySecondsElapsed++;
    const m = String(Math.floor(copySecondsElapsed/60)).padStart(2,'0');
    const s = String(copySecondsElapsed%60).padStart(2,'0');
    copyTimerEl.textContent = m+':'+s;
  }, 1000);
}

export function initCopyTab(){
  copyTimerEl = document.getElementById('copyTimer');
  copyPauseBtn = document.getElementById('copyPause');

  document.getElementById('copyStart').addEventListener('click', async () => {
    const btn = document.getElementById('copyStart');
    btn.disabled = true;
    document.getElementById('copyInput').value = '';
    document.getElementById('copyResult').textContent = '';
    copyMessage = buildCopyMessage(currentWpm());
    copySecondsElapsed = 0;
    copyTimerEl.style.display = 'block';
    copyTimerEl.textContent = '00:00';
    copyPauseBtn.style.display = 'inline-block';
    copyPauseBtn.textContent = '⏸ Pause';
    startCopyTimer();
    await playText(copyMessage, currentWpm(), currentVol());
    clearInterval(copyInterval);
    copyPauseBtn.style.display = 'none';
    btn.disabled = false;
    document.getElementById('copySubmit').disabled = false;
  });

  copyPauseBtn.addEventListener('click', () => {
    if(isCurrentPlaybackPaused()){
      resumeCurrentPlayback();
      startCopyTimer();
      copyPauseBtn.textContent = '⏸ Pause';
    } else {
      pauseCurrentPlayback();
      clearInterval(copyInterval);
      copyPauseBtn.textContent = '▶ Resume';
    }
  });

  document.getElementById('copySubmit').addEventListener('click', () => {
    const typed = document.getElementById('copyInput').value.toUpperCase().replace(/[^A-Z0-9\s]/g,'').split(/\s+/).filter(Boolean);
    const truth = copyMessage.toUpperCase().split(/\s+/).filter(Boolean);
    let correct = 0;
    for(let i=0;i<truth.length;i++){ if(typed[i] === truth[i]) correct++; }
    const accuracy = truth.length ? Math.round((correct/truth.length)*100) : 0;
    const pass = accuracy >= 80;
    saveState({ copyResult: { pass, accuracy, date: new Date().toISOString() } });
    setBadge('copyBadge', pass ? 'pass' : 'fail', pass ? 'Passed ('+accuracy+'%)' : 'Try again ('+accuracy+'%)');
    document.getElementById('copyResult').innerHTML =
      'Accuracy: '+accuracy+'% (need 80%+ to pass)<br>Correct message: <em>'+copyMessage+'</em>';
    document.getElementById('copySubmit').disabled = true;
    updateCertificate();
  });
}

export function stopCopyIfActive(){
  if(copyInterval){
    clearInterval(copyInterval);
    copyInterval = null;
    copyPauseBtn.style.display = 'none';
    document.getElementById('copyStart').disabled = false;
  }
}
