import React from 'react';
import { motion } from 'framer-motion';
import { FaCertificate } from 'react-icons/fa';
import { HiExternalLink } from 'react-icons/hi';

import { AppWrap, MotionWrap } from '../../wrapper';
import certificates from './certificateData';
import './Certificates.scss';

const copyByLanguage = {
  en: { prefix: 'Licenses &', emphasis: 'Certificates', view: 'View credential' },
  de: { prefix: 'Lizenzen &', emphasis: 'Zertifikate', view: 'Nachweis ansehen' },
};

const Certificates = ({ language }) => {
  const copy = copyByLanguage[language] || copyByLanguage.en;

  return (
    <>
      <h2 className="head-text">
        {copy.prefix} <span>{copy.emphasis}</span>
      </h2>

      <div className="app__certs">
        {certificates.map((cert, index) => (
          <motion.div
            key={cert.id}
            className="app__cert"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="app__cert-badge app__flex">
              <FaCertificate />
            </div>
            <div className="app__cert-info">
              <h4 className="bold-text">{cert.title}</h4>
              <p className="p-text">{cert.issuer}{cert.date ? ` · ${cert.date}` : ''}</p>
              {(language === 'de' ? cert.detailDe : cert.detail) && (
                <span className="app__cert-detail">{language === 'de' ? cert.detailDe : cert.detail}</span>
              )}
              {cert.url && (
                <a href={cert.url} target="_blank" rel="noreferrer">
                  {copy.view} <HiExternalLink />
                </a>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </>
  );
};

export default AppWrap(
  MotionWrap(Certificates, 'app__certificates'),
  'certificates',
  'app__whitebg',
);
