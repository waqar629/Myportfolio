import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { HiArrowUp } from 'react-icons/hi';

import './Effects.scss';

const BackToTop = ({ label = 'Back to top' }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          className="fx__top"
          aria-label={label}
          title={label}
          initial={{ opacity: 0, y: 24, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, scale: 0.8 }}
          whileHover={{ y: -4 }}
          whileTap={{ scale: 0.92 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <HiArrowUp />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default BackToTop;
