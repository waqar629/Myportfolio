import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FaLinkedin, FaGithub } from 'react-icons/fa';
import { HiOutlineMail, HiX } from 'react-icons/hi';

import { images } from '../../constants';
import './ConnectWidget.scss';

const EMAIL = 'waqarhassan630@gmail.com';

const text = {
  en: {
    pill: "Let's talk",
    role: 'Full Stack Developer',
    footer: 'Open to opportunities',
    open: 'Open contact card',
    close: 'Close contact card',
  },
  de: {
    pill: 'Lass uns reden',
    role: 'Full-Stack-Entwickler',
    footer: 'Offen für neue Möglichkeiten',
    open: 'Kontaktkarte öffnen',
    close: 'Kontaktkarte schließen',
  },
};

const links = [
  { key: 'linkedin', label: 'LinkedIn', href: 'https://www.linkedin.com/in/waqar628/', Icon: FaLinkedin, external: true },
  { key: 'github', label: 'GitHub', href: 'https://github.com/waqar629', Icon: FaGithub, external: true },
  { key: 'email', label: 'Email', href: `mailto:${EMAIL}`, Icon: HiOutlineMail, external: false },
];

const ConnectWidget = ({ language = 'en' }) => {
  const copy = text[language] || text.en;
  const [open, setOpen] = useState(false);
  const [showPill, setShowPill] = useState(false);
  const rootRef = useRef(null);

  // Pill teases the card shortly after load, then steps aside.
  useEffect(() => {
    const show = setTimeout(() => setShowPill(true), 1800);
    const hide = setTimeout(() => setShowPill(false), 9000);
    return () => {
      clearTimeout(show);
      clearTimeout(hide);
    };
  }, []);

  useEffect(() => {
    if (!open) return undefined;

    const onKey = (event) => event.key === 'Escape' && setOpen(false);
    const onClick = (event) => {
      if (rootRef.current && !rootRef.current.contains(event.target)) setOpen(false);
    };

    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onClick);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onClick);
    };
  }, [open]);

  return (
    <div className="connect" ref={rootRef}>
      <AnimatePresence>
        {open && (
          <motion.div
            className="connect__card"
            role="dialog"
            aria-label="Contact"
            initial={{ opacity: 0, y: 24, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.92 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="connect__photo">
              <img src={images.profile} alt="Waqar Hassan" />
              <button type="button" className="connect__close" aria-label={copy.close} onClick={() => setOpen(false)}>
                <HiX />
              </button>
            </div>

            <div className="connect__body">
              <h3>Waqar Hassan</h3>
              <p className="connect__role">{copy.role}</p>

              <div className="connect__links">
                {links.map(({ key, label, href, Icon, external }, index) => (
                  <motion.a
                    key={key}
                    className={`connect__link connect__link--${key}`}
                    href={href}
                    {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
                    initial={{ opacity: 0, x: -14 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.12 + index * 0.07 }}
                    whileHover={{ x: 4 }}
                  >
                    <Icon />
                    <span>{label}</span>
                  </motion.a>
                ))}
              </div>

              <p className="connect__footer">{copy.footer} <span role="img" aria-label="wave">👋</span></p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="connect__dock">
        <AnimatePresence>
          {showPill && !open && (
            <motion.button
              type="button"
              className="connect__pill"
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 24 }}
              onClick={() => setOpen(true)}
            >
              {copy.pill} <span role="img" aria-label="chat">💬</span>
            </motion.button>
          )}
        </AnimatePresence>

        <motion.button
          type="button"
          className="connect__avatar"
          aria-label={open ? copy.close : copy.open}
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
          whileHover={{ scale: 1.07 }}
          whileTap={{ scale: 0.94 }}
        >
          <img src={images.profile} alt="" />
        </motion.button>
      </div>
    </div>
  );
};

export default ConnectWidget;
