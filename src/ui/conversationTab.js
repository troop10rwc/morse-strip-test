import { playText, stopCurrentPlayback } from '../morse/audioPlayer.js';
import { makeKeyInput } from '../morse/keyDecoder.js';
import { currentWpm, currentVol, keySidetone } from '../shared/audioSession.js';
import { saveState } from '../state/storage.js';
import { CONV_SCRIPT } from '../content/conversationScript.js';
import { setBadge } from './badges.js';
import { updateCertificate } from './certificateTab.js';

let convTimerEl, convTranscript, convBody, convIncomingNote, convReplay, convNotes, convKeyArea, convKeyBtn, convDecoded;
let convStartBtn, convStopBtn;
let convCalibrateArea, convCalibKeyBtn, convCalibDecoded, convCalibRaw, convCalibrateDoneBtn;
let convInterval = null, convSecondsLeft = 300, convScriptIndex = 0, convExchanges = 0, currentAiLine = '', convPlaying = false, convActive = false, convCalibrating = false;
let convKey;

function updateConvCalibDisplay(){
  convCalibDecoded.textContent = convKey.displayString();
  convCalibRaw.textContent = convKey.rawString();
}

function logLine(cls, text){
  const p = document.createElement('div');
  p.className = cls;
  p.textContent = (cls==='ai' ? 'BASE CAMP: ' : 'YOU: ') + text;
  convTranscript.appendChild(p);
  convTranscript.scrollTop = convTranscript.scrollHeight;
}

function cancelConvCalibration(){
  convCalibrating = false;
  convKey.stopPolling();
  convKeyBtn.classList.remove('down');
  convCalibKeyBtn.classList.remove('down');
  keySidetone.stop();
  convCalibrateArea.style.display = 'none';
  convStartBtn.style.display = '';
  convStopBtn.style.display = 'none';
}

function tickConvTimer(){
  convSecondsLeft--;
  const m = String(Math.max(0,Math.floor(convSecondsLeft/60))).padStart(2,'0');
  const sec = String(Math.max(0,convSecondsLeft%60)).padStart(2,'0');
  convTimerEl.textContent = m+':'+sec;
  if(convSecondsLeft <= 0){
    finishConversation();
  }
}

async function playCurrentLine(){
  if(!convActive || !currentAiLine) return;
  convPlaying = true;
  convReplay.disabled = true;
  convIncomingNote.textContent = '🔊 Sending now — listen closely...';
  await playText(currentAiLine, currentWpm(), currentVol());
  if(!convActive) return; // conversation was stopped while this line was playing
  convPlaying = false;
  convReplay.disabled = false;
  convIncomingNote.textContent = '✅ Line finished. Replay it if you need to, then key your reply below.';
  if(convSecondsLeft > 0){
    convKeyArea.style.display = 'block';
    // clearText (not reset) so the calibrated dot/dash contrast and
    // demonstrated word-gap length carry through the whole 5-minute
    // conversation instead of every single reply starting cold again.
    convKey.clearText();
    convDecoded.textContent = '';
    convKey.startPolling(str => convDecoded.textContent = str);
  }
}

async function playNextAiLine(){
  if(!convActive || convSecondsLeft <= 0) return;
  currentAiLine = CONV_SCRIPT[convScriptIndex % CONV_SCRIPT.length];
  convScriptIndex++;
  logLine('ai', '🔊 (Morse line sent — copy it by ear, not shown here)');
  convKeyArea.style.display = 'none';
  await playCurrentLine();
}

function finishConversation(){
  if(!convActive) return; // already finished/stopped
  const stoppedEarly = convSecondsLeft > 0;
  convActive = false;
  stopCurrentPlayback();
  clearInterval(convInterval);
  convCalibrateArea.style.display = 'none';
  convKeyArea.style.display = 'none';
  convBody.style.display = 'none';
  convKey.stopPolling();
  keySidetone.stop();
  convStartBtn.disabled = false;
  convStartBtn.style.display = '';
  convStopBtn.style.display = 'none';
  const notes = convNotes.value.trim();
  const pass = convExchanges >= 4; // reasonable participation across the 5 minutes
  saveState({ convResult: { pass, exchanges: convExchanges, notes, date: new Date().toISOString() } });
  setBadge('convBadge', pass ? 'pass' : 'fail', pass ? 'Completed' : 'Incomplete — practice again');
  if(notes) logLine('you', '📝 Final notes: ' + notes);
  logLine('ai', stoppedEarly
    ? '--- Conversation ended early. Review this transcript (and the notes above) with your unit leader or counselor. ---'
    : '--- 5 minutes complete. Review this transcript (and the notes above) with your unit leader or counselor. ---');
  updateCertificate();
}

export function initConversationTab(){
  convTimerEl = document.getElementById('convTimer');
  convTranscript = document.getElementById('convTranscript');
  convBody = document.getElementById('convBody');
  convIncomingNote = document.getElementById('convIncomingNote');
  convReplay = document.getElementById('convReplay');
  convNotes = document.getElementById('convNotes');
  convKeyArea = document.getElementById('convKeyArea');
  convKeyBtn = document.getElementById('convKeyBtn');
  convDecoded = document.getElementById('convDecoded');
  convStartBtn = document.getElementById('convStart');
  convStopBtn = document.getElementById('convStop');
  convCalibrateArea = document.getElementById('convCalibrateArea');
  convCalibKeyBtn = document.getElementById('convCalibKeyBtn');
  convCalibDecoded = document.getElementById('convCalibDecoded');
  convCalibRaw = document.getElementById('convCalibRaw');
  convCalibrateDoneBtn = document.getElementById('convCalibrateDone');
  convKey = makeKeyInput(currentWpm);

  // Same calibration this Scout does before the Sending test (requirement
  // 3): key "A" with a natural word-like pause in the middle. It seeds real
  // dot/dash contrast AND a demonstrated word-gap length before the timed
  // conversation begins, instead of every reply starting from a cold,
  // uncalibrated guess (see makeKeyInput for why that matters).
  convStartBtn.addEventListener('click', () => {
    convStartBtn.style.display = 'none';
    convStopBtn.style.display = 'inline-block';
    convCalibrating = true;
    convKey.reset();
    convKey.startCalibrating();
    updateConvCalibDisplay();
    convCalibrateArea.style.display = 'block';
    convKey.startPolling(updateConvCalibDisplay);
  });

  convCalibrateDoneBtn.addEventListener('click', async () => {
    convKey.finalizeNow();
    convKey.endCalibrating();
    convKey.clearText();
    convKey.stopPolling();
    convCalibrating = false;
    convCalibrateArea.style.display = 'none';

    convActive = true;
    convTranscript.innerHTML = '';
    convNotes.value = '';
    convBody.style.display = 'block';
    convSecondsLeft = 300; convScriptIndex = 0; convExchanges = 0;
    tickConvTimer();
    convInterval = setInterval(tickConvTimer, 1000);
    await playNextAiLine();
  });

  convCalibKeyBtn.addEventListener('mousedown', () => { convCalibKeyBtn.classList.add('down'); convKey.keyDown(); keySidetone.on(); });
  convCalibKeyBtn.addEventListener('mouseup', () => { convCalibKeyBtn.classList.remove('down'); convKey.keyUp(); keySidetone.off(); });
  convCalibKeyBtn.addEventListener('mouseleave', () => { if(convCalibKeyBtn.classList.contains('down')){ convCalibKeyBtn.classList.remove('down'); convKey.keyUp(); keySidetone.off(); } });
  convCalibKeyBtn.addEventListener('touchstart', e => { e.preventDefault(); convCalibKeyBtn.classList.add('down'); convKey.keyDown(); keySidetone.on(); });
  convCalibKeyBtn.addEventListener('touchend', e => { e.preventDefault(); convCalibKeyBtn.classList.remove('down'); convKey.keyUp(); keySidetone.off(); });

  convStopBtn.addEventListener('click', () => {
    if(convCalibrating) cancelConvCalibration();
    else finishConversation();
  });

  convReplay.addEventListener('click', () => { if(convActive && !convPlaying) playCurrentLine(); });

  convKeyBtn.addEventListener('mousedown', () => { convKeyBtn.classList.add('down'); convKey.keyDown(); keySidetone.on(); });
  convKeyBtn.addEventListener('mouseup', () => { convKeyBtn.classList.remove('down'); convKey.keyUp(); keySidetone.off(); });
  convKeyBtn.addEventListener('mouseleave', () => { if(convKeyBtn.classList.contains('down')){ convKeyBtn.classList.remove('down'); convKey.keyUp(); keySidetone.off(); } });
  convKeyBtn.addEventListener('touchstart', e => { e.preventDefault(); convKeyBtn.classList.add('down'); convKey.keyDown(); keySidetone.on(); });
  convKeyBtn.addEventListener('touchend', e => { e.preventDefault(); convKeyBtn.classList.remove('down'); convKey.keyUp(); keySidetone.off(); });

  document.getElementById('convSendLine').addEventListener('click', async () => {
    if(!convActive) return;
    convKey.finalizeNow();
    convKey.stopPolling();
    const said = convKey.state.text.trim();
    logLine('you', (said || '(no reply keyed)'));
    convKeyArea.style.display = 'none';
    convExchanges++;
    if(convSecondsLeft > 0) await playNextAiLine();
  });
}

export function stopConversationIfActive(){
  if(convActive) finishConversation(); // same cleanup + grading as pressing "Stop Conversation"
  else if(convCalibrating) cancelConvCalibration();
}

// ----- spacebar-as-key support (see input/spacebarKey.js) -----
export function isConvCalibratingKeyActive(){ return convCalibrateArea.style.display === 'block'; }
export function conversationCalibKeyDown(){ convCalibKeyBtn.classList.add('down'); convKey.keyDown(); keySidetone.on(); }
export function conversationCalibKeyUp(){ convCalibKeyBtn.classList.remove('down'); convKey.keyUp(); keySidetone.off(); }

export function isConversationKeyActive(){ return convKeyArea.style.display === 'block'; }
export function conversationKeyDown(){ convKeyBtn.classList.add('down'); convKey.keyDown(); keySidetone.on(); }
export function conversationKeyUp(){ convKeyBtn.classList.remove('down'); convKey.keyUp(); keySidetone.off(); }
