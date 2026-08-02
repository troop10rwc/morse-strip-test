export const MORSE = {
  A:'.-', B:'-...', C:'-.-.', D:'-..', E:'.', F:'..-.', G:'--.', H:'....',
  I:'..', J:'.---', K:'-.-', L:'.-..', M:'--', N:'-.', O:'---', P:'.--.',
  Q:'--.-', R:'.-.', S:'...', T:'-', U:'..-', V:'...-', W:'.--', X:'-..-',
  Y:'-.--', Z:'--..',
  '0':'-----','1':'.----','2':'..---','3':'...--','4':'....-',
  '5':'.....','6':'-....','7':'--...','8':'---..','9':'----.',
  '.':'.-.-.-', ',':'--..--', '?':'..--..', "'":'.----.', '-':'-....-', '/':'-..-.',
  '!':'-.-.--', '"':'.-..-.', '(':'-.--.', ')':'-.--.-', ':':'---...', ';':'-.-.-.',
  '=':'-...-', '@':'.--.-.'
};

export const REVERSE_MORSE = {};
Object.keys(MORSE).forEach(k => REVERSE_MORSE[MORSE[k]] = k);

export function textToMorseWords(text){
  return text.toUpperCase().trim().split(/\s+/).filter(Boolean).map(word =>
    [...word].map(ch => MORSE[ch]).filter(Boolean)
  );
}

// Build a timeline of on/off events (in "units") for a phrase.
export function buildTimeline(text){
  const words = textToMorseWords(text);
  const events = [];
  words.forEach((letters, wi) => {
    letters.forEach((code, li) => {
      [...code].forEach((sym, si) => {
        events.push({on:true, units: sym==='.' ? 1 : 3});
        if(si < code.length-1) events.push({on:false, units:1});
      });
      if(li < letters.length-1) events.push({on:false, units:3});
    });
    if(wi < words.length-1) events.push({on:false, units:7});
  });
  return events;
}
