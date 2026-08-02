import { makeKeyInput } from '../morse/keyDecoder.js';
import { currentWpm, keySidetone } from '../shared/audioSession.js';
import { saveState } from '../state/storage.js';
import { SENDING_PASSAGE } from '../content/practicePassages.js';
import { setBadge } from './badges.js';
import { updateCertificate } from './certificateTab.js';

let sendKeyArea, sendKeyBtn, sendDecoded, sendRaw, sendKey, sendStartTime = 0;
let sendPhaseNote, sendMistakeNote, sendCalibrateDone, sendMessageControls;

function updateSendDisplay(){
  sendDecoded.textContent = sendKey.displayString();
  sendRaw.textContent = sendKey.rawString();
}

function enterCalibrationPhase(){
  sendPhaseNote.style.display = 'block';
  sendMistakeNote.style.display = 'none';
  sendCalibrateDone.style.display = 'inline-block';
  sendMessageControls.style.display = 'none';
}
function enterMessagePhase(){
  sendPhaseNote.style.display = 'none';
  sendMistakeNote.style.display = 'block';
  sendCalibrateDone.style.display = 'none';
  sendMessageControls.style.display = 'flex';
}

export function initSendingTab(){
  document.getElementById('sendPassage').textContent = SENDING_PASSAGE;
  sendKeyArea = document.getElementById('sendKeyArea');
  sendKeyBtn = document.getElementById('sendKeyBtn');
  sendDecoded = document.getElementById('sendDecoded');
  sendRaw = document.getElementById('sendRaw');
  sendKey = makeKeyInput(currentWpm);

  sendPhaseNote = document.getElementById('sendPhaseNote');
  sendMistakeNote = document.getElementById('sendMistakeNote');
  sendCalibrateDone = document.getElementById('sendCalibrateDone');
  sendMessageControls = document.getElementById('sendMessageControls');

  document.getElementById('sendStart').addEventListener('click', () => {
    document.getElementById('sendStart').disabled = true;
    sendKeyArea.style.display = 'block';
    sendKey.reset();
    sendKey.startCalibrating();
    updateSendDisplay();
    enterCalibrationPhase();
    // Live decode during calibration too, so tapping "A" (•–) gives
    // immediate visual confirmation — both the decoded letter and the raw
    // dot/dash pattern the app actually measured — before grading starts.
    sendKey.startPolling(updateSendDisplay);
  });

  // Calibration taps (e.g. "A" = dot-dash) feed real durations into the
  // decoder's window before grading starts, so it has dot/dash contrast
  // from the very first character of the graded message — this is what
  // fixes the "first letter guessed wrong" issue seen with a cold start.
  // The demonstrated pause between the two "A"s is also captured (see
  // endCalibrating/makeKeyInput) and can only make the word-break threshold
  // MORE forgiving than the safe default, never less — so it helps Scouts
  // who naturally pause longer while thinking, without risking false word
  // breaks for everyone else.
  sendCalibrateDone.addEventListener('click', () => {
    sendKey.finalizeNow();
    sendKey.endCalibrating();
    sendKey.clearText();
    updateSendDisplay();
    sendStartTime = performance.now();
    enterMessagePhase();
    sendKey.startPolling(updateSendDisplay);
  });

  sendKeyBtn.addEventListener('mousedown', () => { sendKeyBtn.classList.add('down'); sendKey.keyDown(); keySidetone.on(); });
  sendKeyBtn.addEventListener('mouseup', () => { sendKeyBtn.classList.remove('down'); sendKey.keyUp(); keySidetone.off(); });
  sendKeyBtn.addEventListener('mouseleave', () => { if(sendKeyBtn.classList.contains('down')){ sendKeyBtn.classList.remove('down'); sendKey.keyUp(); keySidetone.off(); } });
  sendKeyBtn.addEventListener('touchstart', e => { e.preventDefault(); sendKeyBtn.classList.add('down'); sendKey.keyDown(); keySidetone.on(); });
  sendKeyBtn.addEventListener('touchend', e => { e.preventDefault(); sendKeyBtn.classList.remove('down'); sendKey.keyUp(); keySidetone.off(); });

  document.getElementById('sendRestart').addEventListener('click', () => {
    sendKeyBtn.classList.remove('down');
    keySidetone.off();
    sendKey.clearText(); // keep the calibrated speed window, just clear the message
    updateSendDisplay();
    sendStartTime = performance.now();
    document.getElementById('sendResult').textContent = '';
  });

  document.getElementById('sendFinish').addEventListener('click', () => {
    sendKey.finalizeNow();
    sendKey.stopPolling();
    keySidetone.stop();
    updateSendDisplay();
    const elapsedMin = (performance.now() - sendStartTime) / 60000;
    const sentWords = sendKey.state.text.trim().split(/\s+/).filter(Boolean);
    const truthWords = SENDING_PASSAGE.toUpperCase().split(/\s+/);
    let correct = 0;
    for(let i=0;i<truthWords.length;i++){ if(sentWords[i] === truthWords[i]) correct++; }
    const accuracy = Math.round((correct/truthWords.length)*100);
    const effectiveWpm = elapsedMin > 0 ? (25/elapsedMin) : 0;
    const pass = accuracy >= 80 && effectiveWpm >= 4.5; // small tolerance around 5 wpm
    saveState({ sendResult: { pass, accuracy, wpm: Math.round(effectiveWpm*10)/10, date: new Date().toISOString() } });
    setBadge('sendBadge', pass ? 'pass' : 'fail', pass ? 'Passed' : 'Try again');
    document.getElementById('sendResult').innerHTML =
      'Decoded: <em>'+ (sendKey.state.text || '(nothing decoded)') +'</em><br>'+
      'Raw pattern: <code>'+ (sendKey.rawString() || '(none)') +'</code><br>'+
      'Accuracy vs. passage: '+accuracy+'%<br>'+
      'Effective speed: '+ (Math.round(effectiveWpm*10)/10) +' wpm (need 5+, some tolerance given)';
    sendKeyArea.style.display = 'none';
    document.getElementById('sendStart').disabled = false;
    updateCertificate();
  });
}

export function stopSendingIfActive(){
  if(sendKeyArea.style.display === 'block'){
    sendKeyBtn.classList.remove('down');
    sendKey.stopPolling();
  }
}

// ----- spacebar-as-key support (see input/spacebarKey.js) -----
export function isSendingKeyActive(){ return sendKeyArea.style.display === 'block'; }
export function sendingKeyDown(){ sendKeyBtn.classList.add('down'); sendKey.keyDown(); keySidetone.on(); }
export function sendingKeyUp(){ sendKeyBtn.classList.remove('down'); sendKey.keyUp(); keySidetone.off(); }
