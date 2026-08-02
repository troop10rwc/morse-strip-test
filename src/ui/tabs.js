import { stopCurrentPlayback } from '../morse/audioPlayer.js';
import { keySidetone } from '../shared/audioSession.js';
import { stopConversationIfActive } from './conversationTab.js';
import { stopCopyIfActive } from './copyTab.js';
import { stopSendingIfActive } from './sendingTab.js';

export function showTab(name){
  document.querySelectorAll('#tabs button').forEach(b => b.classList.toggle('active', b.dataset.tab===name));
  document.querySelectorAll('main > section').forEach(s => s.classList.remove('active'));
  document.getElementById('tab-'+name).classList.add('active');
}

// Stop whatever's running in a test when the Scout navigates away. Without
// this, e.g. a conversation line (or the copy-test message) kept playing in
// the background after switching tabs, and the live-decode polling loop for
// the sending test kept ticking too.
function stopActiveTabProcesses(name){
  stopCurrentPlayback();
  keySidetone.off();
  if(name === 'conversation') stopConversationIfActive();
  if(name === 'copy') stopCopyIfActive();
  if(name === 'sending') stopSendingIfActive();
}

export function initTabs(){
  document.querySelectorAll('#tabs button').forEach(btn => btn.addEventListener('click', () => {
    const newTab = btn.dataset.tab;
    const current = document.querySelector('#tabs button.active')?.dataset.tab;
    if(current && current !== newTab) stopActiveTabProcesses(current);
    showTab(newTab);
  }));
}
