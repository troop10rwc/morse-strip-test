const STORAGE_KEY = 'morseAppState_v1';

export function loadState(){
  try{
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  }catch(e){ return {}; }
}

export function saveState(patch){
  const s = Object.assign(loadState(), patch);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
  return s;
}

export function clearState(){
  localStorage.removeItem(STORAGE_KEY);
}
