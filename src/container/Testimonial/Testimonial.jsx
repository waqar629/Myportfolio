import React, { useState, useEffect, useCallback } from 'react';
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi';
import { AnimatePresence, motion } from 'framer-motion';

import { AppWrap, MotionWrap } from '../../wrapper';
import { urlFor, client } from '../../client';
import { translateText } from '../../locales';
import './Testimonial.scss';

const AUTOPLAY_MS = 8000;

const copyByLanguage = {
  en: {
    prefix: 'Kind words from',
    emphasis: 'colleagues',
    studied: 'Studied together',
    team: 'Worked on the same team',
    previous: 'Previous recommendation',
    next: 'Next recommendation',
    source: 'LinkedIn recommendations',
  },
  de: {
    prefix: 'Worte von',
    emphasis: 'Kollegen',
    studied: 'Gemeinsam studiert',
    team: 'Im selben Team gearbeitet',
    previous: 'Vorherige Empfehlung',
    next: 'Nächste Empfehlung',
    source: 'LinkedIn-Empfehlungen',
  },
};

const initials = (name = '') => name
  .split(/\s+/)
  .filter(Boolean)
  .slice(0, 2)
  .map((part) => part[0].toUpperCase())
  .join('');

const Avatar = ({ person, large }) => (
  <span className={`app__rec-avatar ${large ? 'is-large' : ''}`}>
    {person.imgurl ? <img src={urlFor(person.imgurl)} alt={person.name} /> : initials(person.name)}
  </span>
);

const Testimonial = ({ language }) => {
  const copy = copyByLanguage[language] || copyByLanguage.en;
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [paused, setPaused] = useState(false);
  const [testimonials, setTestimonials] = useState([]);
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    client.fetch('*[_type == "testimonials"] | order(order asc)').then(setTestimonials);
    client.fetch('*[_type == "brands"]').then(setBrands);
  }, []);

  const go = useCallback((target, step = 1) => {
    if (!testimonials.length) return;
    setDirection(step);
    setIndex((target + testimonials.length) % testimonials.length);
  }, [testimonials.length]);

  useEffect(() => {
    if (paused || testimonials.length < 2) return undefined;
    const timer = setTimeout(() => go(index + 1, 1), AUTOPLAY_MS);
    return () => clearTimeout(timer);
  }, [index, paused, testimonials.length, go]);

  const current = testimonials[index];

  return (
    <>
      <h2 className="head-text">
        {copy.prefix} <span>{copy.emphasis}</span>
      </h2>

      {current && (
        <div
          className="app__rec"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
        >
          <span className="app__rec-glow" aria-hidden="true" />

          <div className="app__rec-stage">
            <AnimatePresence mode="wait" initial={false} custom={direction}>
              <motion.figure
                key={current._id}
                className="app__rec-card"
                custom={direction}
                initial={{ opacity: 0, x: direction * 60, scale: 0.98 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: direction * -60, scale: 0.98 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              >
                <span className="app__rec-quote" aria-hidden="true">“</span>
                <blockquote>{translateText(language, current.feedback)}</blockquote>

                <figcaption>
                  <Avatar person={current} large />
                  <div>
                    <strong>{current.name}</strong>
                    <span>{current.company}</span>
                    {current.relation && <em>{copy[current.relation]}</em>}
                  </div>
                </figcaption>
              </motion.figure>
            </AnimatePresence>
          </div>

          <div className="app__rec-controls">
            <button type="button" aria-label={copy.previous} onClick={() => go(index - 1, -1)}>
              <HiChevronLeft />
            </button>

            <div className="app__rec-people" role="tablist">
              {testimonials.map((person, i) => (
                <button
                  key={person._id}
                  type="button"
                  role="tab"
                  aria-selected={i === index}
                  aria-label={person.name}
                  title={person.name}
                  className={i === index ? 'is-active' : ''}
                  onClick={() => go(i, i >= index ? 1 : -1)}
                >
                  <Avatar person={person} />
                </button>
              ))}
            </div>

            <button type="button" aria-label={copy.next} onClick={() => go(index + 1, 1)}>
              <HiChevronRight />
            </button>
          </div>

          <p className="app__rec-source">{copy.source}</p>
        </div>
      )}

      {brands.length > 0 && (
        <div className="app__testimonial-brands app__flex">
          {brands.map((brand) => (
            <motion.div
              whileInView={{ opacity: [0, 1] }}
              transition={{ duration: 0.5, type: 'tween' }}
              key={brand._id}
            >
              <img src={urlFor(brand.imgUrl)} alt={brand.name} />
            </motion.div>
          ))}
        </div>
      )}
    </>
  );
};

export default AppWrap(
  MotionWrap(Testimonial, 'app__testimonial'),
  'testimonial',
  'app__primarybg',
);
