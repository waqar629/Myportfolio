import React, { Suspense, lazy, useCallback, useEffect, useState } from 'react';
import { About, Certificates, Footer, Header, Skills, Testimonial, Work } from './container';
import { Navbar, ScrollProgress, ConnectWidget } from './components';
import './App.scss';

const PlayMode = lazy(() => import('./components/PlayMode/PlayMode'));

const App = () => {
  const [language, setLanguage] = useState(() => {
    if (typeof window === 'undefined') {
      return 'en';
    }

    return window.localStorage.getItem('portfolio-language') || 'en';
  });

  const [playing, setPlaying] = useState(false);
  const closePlay = useCallback(() => setPlaying(false), []);

  useEffect(() => {
    window.localStorage.setItem('portfolio-language', language);
    document.documentElement.lang = language;
  }, [language]);

  return (
    <div className="app">
      <ScrollProgress />
      <Navbar language={language} onLanguageChange={setLanguage} />
      <Header language={language} />
      <About language={language} />
      <Work language={language} />
      <Skills language={language} />
      <Certificates language={language} />
      <Testimonial language={language} />
      <Footer language={language} onPlay={() => setPlaying(true)} />
      <button type="button" className="app__play-btn" onClick={() => setPlaying(true)}>
        <span aria-hidden="true">🎮</span> {language === 'de' ? 'Fahr durch mein Portfolio' : 'Drive my portfolio'}
      </button>
      {playing && (
        <Suspense fallback={null}>
          <PlayMode language={language} onClose={closePlay} />
        </Suspense>
      )}
      <ConnectWidget language={language} />
    </div>
  );
};

export default App;