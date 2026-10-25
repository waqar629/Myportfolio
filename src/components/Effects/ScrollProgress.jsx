import React from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';

import './Effects.scss';

const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 28, restDelta: 0.001 });

  return <motion.div className="fx__progress" style={{ scaleX }} aria-hidden="true" />;
};

export default ScrollProgress;
