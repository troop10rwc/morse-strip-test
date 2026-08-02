// NOTE FOR TROOP LEADERS: these lines are written in the spirit of Robert
// Baden-Powell's Scouting writings (public domain, e.g. "Scouting for Boys",
// 1908, and his 1941 Farewell Message). Wording is paraphrased for reliable
// exact-word-count matching in the app. For official/ceremonial use, feel
// free to swap in verbatim text you've verified against a primary source.
export const QUOTE_BANK = [
  "Try and leave this world a little better than you found it and when your turn comes to die you can die happy in feeling that you have not wasted your time but have done your best",
  "A Scout smiles and whistles under all circumstances even when things go wrong and life feels difficult that is the mark of a true Scout spirit worth carrying every single day",
  "Character is the sum total of a habit formed through daily choices and Scouting builds that character one small honest action at a time in camp and at home",
  "Be prepared is the Scout motto and its meaning is that a Scout must prepare himself by previous thinking out and practicing how to act on any accident or emergency",
  "Scouting is a game for boys and girls under the leadership of older friends who guide them toward good citizenship self reliance and service to others in their community",
  "The most worthwhile things in life are the hardest to achieve and a Scout learns patience skill and courage by practicing them again and again until they become second nature",
  "Self education and not education handed down by others is what our young people truly need and Scouting gives every young person the chance to teach themselves through doing",
  "A Scout's duty is to be useful and to help others especially those nearest at hand at home in camp and wherever the need for a helping hand appears"
];

export function wordsForWpm(wpm){
  // roughly a 2-minute message: words = wpm * 2
  return Math.max(8, Math.round(wpm * 2));
}

export function buildCopyMessage(wpm){
  const pool = QUOTE_BANK.join(' ').split(/\s+/);
  const startMax = Math.max(0, pool.length - wordsForWpm(wpm));
  const start = Math.floor(Math.random() * (startMax+1));
  return pool.slice(start, start + wordsForWpm(wpm)).join(' ');
}

export const SENDING_PASSAGE = (function(){
  const words = QUOTE_BANK[0].split(/\s+/).concat(QUOTE_BANK[3].split(/\s+/));
  return words.slice(0,25).join(' ');
})();
