import React, { useState } from 'react';
import { HiMenuAlt4, HiX } from 'react-icons/hi';
import { motion } from 'framer-motion';

import { images } from '../../constants';
import { getCopy } from '../../locales';
import LanguageSelector from '../LanguageSelector/LanguageSelector';
import './Navbar.scss';

const Navbar = ({ language, onLanguageChange }) => {
  const [toggle, setToggle] = useState(false);
  const copy = getCopy(language);

  const handleLanguageChange = (nextLanguage) => {
    onLanguageChange(nextLanguage);
    setToggle(false);
  };

  return (
    <nav className="app__navbar">
      <div className="app__navbar-logo">
        <img src={images.logo} alt="logo" />
      </div>
      <ul className="app__navbar-links">
        {copy.navLinks.map((item) => (
          <li className="app__flex p-text" key={`link-${item.id}`}>
            <div />
            <a href={`#${item.id}`}>{item.label}</a>
          </li>
        ))}
      </ul>

      <div className="app__navbar-language">
        <LanguageSelector language={language} onChange={handleLanguageChange} />
      </div>

      <div className="app__navbar-menu">
        <HiMenuAlt4 onClick={() => setToggle(true)} />

        {toggle && <button type="button" className="app__navbar-backdrop" aria-label="Close mobile menu" onClick={() => setToggle(false)} />}

        {toggle && (
          <motion.div
            initial={{ x: 340, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 340, opacity: 0 }}
            transition={{ duration: 0.28, ease: 'easeOut' }}
            className="app__navbar-menu-panel"
          >
            <div className="app__navbar-menu-header">
              <div>
                <p className="app__navbar-menu-eyebrow">Menu</p>
                <h3 className="app__navbar-menu-title">Waqar Hassan</h3>
              </div>
              <button type="button" className="app__navbar-close" onClick={() => setToggle(false)} aria-label="Close mobile menu">
                <HiX />
              </button>
            </div>

            <ul className="app__navbar-menu-links">
              {copy.navLinks.map((item) => (
                <li key={item.id} className="app__navbar-menu-link-item">
                  <a href={`#${item.id}`} onClick={() => setToggle(false)}>
                    <span>{item.label}</span>
                    <span aria-hidden="true">→</span>
                  </a>
                </li>
              ))}
            </ul>

            <div className="app__navbar-menu-footer">
              <p className="app__navbar-menu-footer-label">Language</p>
              <LanguageSelector language={language} onChange={handleLanguageChange} compact />
              <a
                className="app__navbar-menu-cv"
                href="https://drive.google.com/file/d/1XgmgX-mzVGBwi4QIv8-Ls_XgJK2qXlZw/view?usp=sharing"
                target="_blank"
                rel="noreferrer"
                onClick={() => setToggle(false)}
              >
                {copy.header.cvLabel}
              </a>
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
