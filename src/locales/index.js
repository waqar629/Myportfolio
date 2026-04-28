const portfolioCopy = {
  en: {
    navLinks: [
      { id: 'home', label: 'Home' },
      { id: 'about', label: 'About' },
      { id: 'work', label: 'Work' },
      { id: 'skills', label: 'Skills' },
      { id: 'contact', label: 'Contact' },
    ],
    header: {
      greeting: 'Hello, I am',
      roles: ['Frontend developer', 'Full-stack developer'],
      cvLabel: 'View CV',
    },
    about: {
      prefix: 'I Know that',
      emphasisOne: 'Good Design',
      middle: 'means',
      emphasisTwo: 'Good Business',
    },
    work: {
      prefix: 'My Creative',
      emphasis: 'Portfolio',
      suffix: 'Section',
      filters: [
        { label: 'React JS', value: 'React JS' },
        { label: 'Web App', value: 'Web App' },
        { label: 'Next JS', value: 'Next JS' },
        { label: 'All', value: 'All' },
      ],
    },
    skills: {
      title: 'Skills & Experiences',
    },
    footer: {
      title: 'Take a coffee & chat with me',
      placeholders: {
        name: 'Your Name',
        email: 'Your Email',
        message: 'Your Message',
      },
      submit: 'Send Message',
      submitting: 'Sending...',
      success: 'Thank you for getting in touch!',
    },
    copyright: {
      lineOne: '@2026 WAQAR',
      lineTwo: 'All rights reserved',
    },
    languageLabel: 'Deutsch',
  },
  de: {
    navLinks: [
      { id: 'home', label: 'Start' },
      { id: 'about', label: 'Über mich' },
      { id: 'work', label: 'Projekte' },
      { id: 'skills', label: 'Fähigkeiten' },
      { id: 'contact', label: 'Kontakt' },
    ],
    header: {
      greeting: 'Hallo, ich bin',
      roles: ['Frontend-Entwickler', 'Full-Stack-Entwickler'],
      cvLabel: 'Lebenslauf ansehen',
    },
    about: {
      prefix: 'Ich weiß, dass',
      emphasisOne: 'gutes Design',
      middle: 'bedeutet',
      emphasisTwo: 'gutes Geschäft',
    },
    work: {
      prefix: 'Mein kreativer',
      emphasis: 'Portfolio',
      suffix: 'Bereich',
      filters: [
        { label: 'React JS', value: 'React JS' },
        { label: 'Web-App', value: 'Web App' },
        { label: 'Next.js', value: 'Next JS' },
        { label: 'Alle', value: 'All' },
      ],
    },
    skills: {
      title: 'Fähigkeiten & Erfahrungen',
    },
    footer: {
      title: 'Lass uns einen Kaffee trinken und reden',
      placeholders: {
        name: 'Dein Name',
        email: 'Deine E-Mail',
        message: 'Deine Nachricht',
      },
      submit: 'Nachricht senden',
      submitting: 'Wird gesendet...',
      success: 'Danke für deine Nachricht!',
    },
    copyright: {
      lineOne: '@2026 WAQAR',
      lineTwo: 'Alle Rechte vorbehalten',
    },
    languageLabel: 'English',
  },
};

const sanityTextTranslations = {
  de: {
    'Hello, I am': 'Hallo, ich bin',
    'Frontend developer': 'Frontend-Entwickler',
    'Full-stack developer': 'Full-Stack-Entwickler',
    'I Know that Good Design means Good Business': 'Ich weiß, dass gutes Design gutes Geschäft bedeutet',
    'My Creative Portfolio Section': 'Mein kreativer Portfolio-Bereich',
    'Skills & Experiences': 'Fähigkeiten & Erfahrungen',
    'Take a coffee & chat with me': 'Lass uns einen Kaffee trinken und reden',
    'Your Name': 'Dein Name',
    'Your Email': 'Deine E-Mail',
    'Your Message': 'Deine Nachricht',
    'Send Message': 'Nachricht senden',
    'Sending...': 'Wird gesendet...',
    'Thank you for getting in touch!': 'Danke für deine Nachricht!',
    'All rights reserved': 'Alle Rechte vorbehalten',
    'All': 'Alle',
    'Web App': 'Web-App',
    'Next JS': 'Next.js',
  },
};

export const getCopy = (language = 'en') => portfolioCopy[language] || portfolioCopy.en;

export const translateText = (language, text) => {
  if (typeof text !== 'string') {
    return text;
  }

  const normalized = text.trim();
  const translation = sanityTextTranslations[language]?.[normalized];

  return translation || text;
};
