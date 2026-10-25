import React, { useEffect, useState } from 'react';
import { About, Footer, Header, Skills, Testimonial, Work } from './container';
import { Navbar, ScrollProgress, BackToTop, ConnectWidget } from './components';
import './App.scss';

const App = () => {
  const [language, setLanguage] = useState(() => {
    if (typeof window === 'undefined') {
      return 'en';
    }

    return window.localStorage.getItem('portfolio-language') || 'en';
  });

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
      <Testimonial language={language} />
      <Footer language={language} />
      <ConnectWidget language={language} />
      <BackToTop label={language === 'de' ? 'Nach oben' : 'Back to top'} />
    </div>
  );
};

export default App;