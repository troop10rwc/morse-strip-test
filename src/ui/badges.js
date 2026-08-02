import { loadState } from '../state/storage.js';
import { updateCertificate } from './certificateTab.js';

export function setBadge(id, state, text){
  const el = document.getElementById(id);
  el.className = 'badge ' + state;
  el.textContent = text;
}

export function refreshBadges(){
  const s = loadState();
  if(s.convResult) setBadge('convBadge', s.convResult.pass ? 'pass' : 'fail', s.convResult.pass ? 'Completed' : 'Incomplete');
  if(s.copyResult) setBadge('copyBadge', s.copyResult.pass ? 'pass' : 'fail', s.copyResult.pass ? 'Passed ('+s.copyResult.accuracy+'%)' : 'Try again ('+s.copyResult.accuracy+'%)');
  if(s.sendResult) setBadge('sendBadge', s.sendResult.pass ? 'pass' : 'fail', s.sendResult.pass ? 'Passed' : 'Try again');
  updateCertificate();
}
