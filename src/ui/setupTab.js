import { loadState, saveState } from '../state/storage.js';
import { showTab } from './tabs.js';

function updateHeader(){
  const s = loadState();
  const h = document.getElementById('whoHeader');
  if(s.name) h.textContent = s.name + (s.troop ? ' — '+s.troop : '');
  else h.textContent = 'Not set up yet';
}

export function initSetupTab(){
  const s = loadState();
  const scoutName = document.getElementById('scoutName');
  const scoutTroop = document.getElementById('scoutTroop');
  const scoutCouncil = document.getElementById('scoutCouncil');
  scoutName.value = s.name || '';
  scoutTroop.value = s.troop || '';
  scoutCouncil.value = s.council || '';
  updateHeader();

  document.getElementById('saveSetup').addEventListener('click', () => {
    saveState({ name: scoutName.value.trim(), troop: scoutTroop.value.trim(), council: scoutCouncil.value.trim() });
    updateHeader();
    showTab('settings');
  });
}
