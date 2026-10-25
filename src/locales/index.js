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
    'Full Stack Development': 'Full-Stack-Entwicklung',
    'End-to-end web applications, from polished React and Next JS interfaces to Node JS APIs, Prisma data models and Strapi CMS back offices.': 'Durchgängige Webanwendungen, von ausgefeilten React- und Next-JS-Oberflächen bis zu Node-JS-APIs, Prisma-Datenmodellen und Strapi-CMS-Backends.',
    'AI Interview Coach (Personal Project)': 'AI Interview Coach (Privatprojekt)',
    'Built an AI-powered mock interview platform supporting HR, technical and coding interviews with adaptive follow-up questions, CV and job-based personalization, voice interaction and automated evaluation reports.': 'KI-gestützte Plattform für Probe-Vorstellungsgespräche (HR, Technik, Coding) mit adaptiven Folgefragen, Personalisierung nach Lebenslauf und Stelle, Sprachinteraktion und automatischen Auswertungsberichten.',
    'K Club Golf Booking Platform': 'K Club Golf-Buchungsplattform',
    'Developed a golf tee time booking platform for The K Club, Ireland. Golfers select players, holes, date and time, complete a secure checkout and reserve online, while content and booking operations are managed through Strapi CMS.': 'Golf-Buchungsplattform für The K Club, Irland. Golfer wählen Spieler, Löcher, Datum und Uhrzeit, bezahlen sicher und reservieren online; Inhalte und Buchungen werden über das Strapi CMS verwaltet.',
    'Cascais Golf Multi-Club Booking': 'Cascais Golf Multi-Club-Buchung',
    'Built a multi-club golf booking platform for clubs in Cascais, Portugal. Users select clubs, players, date and time slots and complete payment through a unified reservation flow.': 'Multi-Club-Buchungsplattform für Golfclubs in Cascais, Portugal. Nutzer wählen Club, Spieler, Datum und Zeit und bezahlen in einem einheitlichen Reservierungsablauf.',
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
