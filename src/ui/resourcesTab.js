import { MORSE } from '../morse/alphabet.js';
import { playText } from '../morse/audioPlayer.js';
import { currentWpm, currentVol } from '../shared/audioSession.js';

const ALPHABET_ORDER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.split('');
const PUNCT_ORDER = ['.', ',', '?', '!', "'", '"', '-', '/', ':', ';', '(', ')', '='];
const PUNCT_NAMES = { '.':'period', ',':'comma', '?':'question mark', '!':'exclamation point',
  "'":'apostrophe', '"':'quotation mark', '-':'hyphen', '/':'slash', ':':'colon', ';':'semicolon',
  '(':'open parenthesis', ')':'close parenthesis', '=':'equals (break)' };

function buildGrid(container, chars, titleFor){
  chars.forEach(ch => {
    const cell = document.createElement('div');
    cell.className = 'morseCell';
    cell.innerHTML = '<div class="letter">'+ch+'</div><div class="pattern">'+MORSE[ch]+'</div>';
    cell.title = 'Tap to hear ' + titleFor(ch);
    cell.addEventListener('click', () => playText(ch, currentWpm(), currentVol()));
    container.appendChild(cell);
  });
}

export function initResourcesTab(){
  buildGrid(document.getElementById('morseGrid'), ALPHABET_ORDER, ch => ch);
  document.getElementById('playAlphabet').addEventListener('click', () => {
    playText(ALPHABET_ORDER.join(' '), currentWpm(), currentVol());
  });

  buildGrid(document.getElementById('morseGridPunct'), PUNCT_ORDER, ch => PUNCT_NAMES[ch] || ch);
  document.getElementById('playPunctuation').addEventListener('click', () => {
    playText(PUNCT_ORDER.join(' '), currentWpm(), currentVol());
  });
}
