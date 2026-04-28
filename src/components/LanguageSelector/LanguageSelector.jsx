import React from 'react';

import './LanguageSelector.scss';

const LanguageSelector = ({ language, onChange, compact = false }) => (
  <div className={`app__language-switcher ${compact ? 'app__language-switcher--compact' : ''}`} role="group" aria-label="Language switcher">
    <button
      type="button"
      className={`app__language-switcher-option ${language === 'en' ? 'active' : ''}`}
      onClick={() => onChange('en')}
      aria-pressed={language === 'en'}
    >
      EN
    </button>
    <span className="app__language-switcher-divider" aria-hidden="true" />
    <button
      type="button"
      className={`app__language-switcher-option ${language === 'de' ? 'active' : ''}`}
      onClick={() => onChange('de')}
      aria-pressed={language === 'de'}
    >
      DE
    </button>
  </div>
);

export default LanguageSelector;
