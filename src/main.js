import { initFromState } from './shared/audioSession.js';
import { initTabs } from './ui/tabs.js';
import { initSetupTab } from './ui/setupTab.js';
import { initSettingsTab } from './ui/settingsTab.js';
import { initResourcesTab } from './ui/resourcesTab.js';
import { initConversationTab } from './ui/conversationTab.js';
import { initCopyTab } from './ui/copyTab.js';
import { initSendingTab } from './ui/sendingTab.js';
import { initCertificateTab } from './ui/certificateTab.js';
import { refreshBadges } from './ui/badges.js';
import { initSpacebarKey } from './input/spacebarKey.js';

document.addEventListener('DOMContentLoaded', () => {
  initFromState();
  initTabs();
  initSetupTab();
  initSettingsTab();
  initResourcesTab();
  initConversationTab();
  initCopyTab();
  initSendingTab();
  initCertificateTab();
  initSpacebarKey();
  refreshBadges();
});
