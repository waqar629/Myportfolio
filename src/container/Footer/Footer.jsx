import React from 'react';
import { motion } from 'framer-motion';
import { HiOutlineMail } from 'react-icons/hi';
import { FaLinkedin, FaGithub, FaWhatsapp } from 'react-icons/fa';

import { AppWrap, MotionWrap } from '../../wrapper';
import { getCopy } from '../../locales';
import './Footer.scss';

const playCopy = {
  en: {
    kicker: 'Not ready to leave yet?',
    title: "Let's play a game",
    text: "Hop in the driver's seat and explore my portfolio on four wheels. Find all the zones.",
    button: 'Start the game',
    pick: 'Pick whatever is easiest for you',
    whatsapp: 'WhatsApp',
  },
  de: {
    kicker: 'Noch nicht bereit zu gehen?',
    title: 'Lass uns ein Spiel spielen',
    text: 'Setz dich ans Steuer und entdecke mein Portfolio auf vier Rädern. Finde alle Zonen.',
    button: 'Spiel starten',
    pick: 'Wähle, was für dich am einfachsten ist',
    whatsapp: 'WhatsApp',
  },
};

const Footer = ({ language, onPlay }) => {
  const play = playCopy[language] || playCopy.en;
  const copy = getCopy(language);

  const options = [
    { key: 'email', label: 'Email', value: 'waqarhassan630@gmail.com', href: 'mailto:waqarhassan630@gmail.com', Icon: HiOutlineMail },
    { key: 'linkedin', label: 'LinkedIn', value: 'in/waqar628', href: 'https://www.linkedin.com/in/waqar628/', Icon: FaLinkedin, external: true },
    { key: 'github', label: 'GitHub', value: 'waqar629', href: 'https://github.com/waqar629', Icon: FaGithub, external: true },
    { key: 'whatsapp', label: play.whatsapp, value: '+49 1523 1383828', href: 'https://wa.link/fwe1c2', Icon: FaWhatsapp, external: true },
  ];

  return (
    <>
      <h2 className="head-text">{copy.footer.title}</h2>
      <p className="app__contact-sub">{play.pick}</p>

      <div className="app__contact-grid">
        {options.map(({ key, label, value, href, Icon, external }, index) => (
          <motion.a
            key={key}
            className={`app__contact-card app__contact-card--${key}`}
            href={href}
            {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="app__contact-icon app__flex"><Icon /></span>
            <span className="app__contact-text">
              <strong>{label}</strong>
              <em>{value}</em>
            </span>
            <span className="app__contact-arrow" aria-hidden="true">↗</span>
          </motion.a>
        ))}
      </div>

      {onPlay && (
        <div className="app__play-cta">
          <p className="app__play-cta-kicker">{play.kicker}</p>
          <h3>{play.title} <span aria-hidden="true">🎮</span></h3>
          <p className="app__play-cta-text">{play.text}</p>
          <button type="button" onClick={onPlay}>{play.button} →</button>
        </div>
      )}
    </>
  );
};

export default AppWrap(
  MotionWrap(Footer, 'app__footer'),
  'contact',
  'app__whitebg',
);
