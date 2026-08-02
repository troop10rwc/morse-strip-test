import { loadState } from '../state/storage.js';

export function updateCertificate(){
  const s = loadState();
  const allDone = s.convResult && s.convResult.pass && s.copyResult && s.copyResult.pass && s.sendResult && s.sendResult.pass;
  document.getElementById('certLocked').style.display = allDone ? 'none' : 'block';
  document.getElementById('certUnlocked').style.display = allDone ? 'block' : 'none';
  if(allDone){
    document.getElementById('certName').textContent = s.name || '—';
    document.getElementById('certTroop').textContent = s.troop || '—';
    document.getElementById('certCouncil').textContent = s.council || '—';
    document.getElementById('certConv').textContent = 'Completed — ' + s.convResult.exchanges + ' exchanges over 5 minutes';
    document.getElementById('certCopy').textContent = 'Passed — ' + s.copyResult.accuracy + '% accuracy';
    document.getElementById('certSend').textContent = 'Passed — ' + s.sendResult.wpm + ' wpm, ' + s.sendResult.accuracy + '% accuracy';
    const latest = [s.convResult.date, s.copyResult.date, s.sendResult.date].sort().pop();
    document.getElementById('certDate').textContent = new Date(latest).toLocaleDateString(undefined, { year:'numeric', month:'long', day:'numeric' });
  }
}

export function initCertificateTab(){
  document.getElementById('printCert').addEventListener('click', () => window.print());
  updateCertificate();
}
