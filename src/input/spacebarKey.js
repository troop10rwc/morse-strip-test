import {
  isConvCalibratingKeyActive, conversationCalibKeyDown, conversationCalibKeyUp,
  isConversationKeyActive, conversationKeyDown, conversationKeyUp
} from '../ui/conversationTab.js';
import { isSendingKeyActive, sendingKeyDown, sendingKeyUp } from '../ui/sendingTab.js';

// Only hijack the spacebar when the user isn't typing into a text field —
// otherwise it's impossible to type a space into Notes, "Type what you
// copied", or the name/troop/council fields.
function isTypingTarget(el){
  return !!el && (el.tagName === 'TEXTAREA' || el.tagName === 'INPUT' || el.isContentEditable);
}

export function initSpacebarKey(){
  document.addEventListener('keydown', e => {
    if(e.code !== 'Space' || e.repeat) return;
    if(isTypingTarget(document.activeElement)) return;
    if(isConvCalibratingKeyActive()){
      e.preventDefault();
      conversationCalibKeyDown();
    } else if(isConversationKeyActive()){
      e.preventDefault();
      conversationKeyDown();
    } else if(isSendingKeyActive()){
      e.preventDefault();
      sendingKeyDown();
    }
  });
  document.addEventListener('keyup', e => {
    if(e.code !== 'Space') return;
    if(isTypingTarget(document.activeElement)) return;
    if(isConvCalibratingKeyActive()){
      e.preventDefault();
      conversationCalibKeyUp();
    } else if(isConversationKeyActive()){
      e.preventDefault();
      conversationKeyUp();
    } else if(isSendingKeyActive()){
      e.preventDefault();
      sendingKeyUp();
    }
  });
}
