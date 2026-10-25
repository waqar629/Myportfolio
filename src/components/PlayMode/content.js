export const zones = [
  { id: 'about', x: -40, z: -2, radius: 7 },
  { id: 'skills', x: 40, z: -2, radius: 7 },
  { id: 'projects', x: 0, z: -64, radius: 8 },
  { id: 'certificates', x: -42, z: -76, radius: 7 },
  { id: 'contact', x: 42, z: -76, radius: 7 },
];

export const CONTACT_LINKS = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/waqar628/', external: true },
  { label: 'GitHub', href: 'https://github.com/waqar629', external: true },
  { label: 'Email', href: 'mailto:waqarhassan630@gmail.com', external: false },
  { label: 'CV', href: 'https://drive.google.com/file/d/15dNSnHsnFqvZQcfzBFp9VOWF6fdDfYqu/view?usp=sharing', external: true },
];

const skills = ['Artificial Intelligence', 'Prompt Engineering', 'Agentic Coding', 'Claude AI', 'OpenAI Codex', 'GitHub Copilot', 'React', 'Next.js', 'TypeScript', 'JavaScript', 'Node.js', 'Python', 'Docker', 'Redux', 'Tailwind', 'SCSS', 'Strapi CMS', 'PostgreSQL', 'MongoDB', 'Playwright', 'Jest', 'Cypress', 'CI/CD', 'Docker', 'Figma'];

export const content = {
  en: {
    title: 'Drive my portfolio',
    exit: 'Exit game',
    progress: 'Zones visited',
    help: 'Drive to the glowing pads to explore. Cross the river by bridge and collect the coins. Esc to exit.',
    coins: 'Coins collected',
    cv: 'View CV',
    hide: 'Hide',
    soundOn: 'Turn sound on',
    soundOff: 'Turn sound off',
    back: 'All projects',
    openProject: 'Open project',
    openCode: 'View code',
    about: 'Full stack developer based in Germany with 3+ years building scalable web apps in React and Next.js. I focus on performance, clean APIs and interfaces people enjoy using.',
    skills,
    zones: {
      about: { title: 'About', tag: 'Who I am' },
      projects: { title: 'Projects', tag: 'Things I built' },
      skills: { title: 'Skills', tag: 'My toolbox' },
      certificates: { title: 'Certificates', tag: 'What I earned' },
      contact: { title: 'Contact', tag: "Let's talk" },
    },
  },
  de: {
    title: 'Fahr durch mein Portfolio',
    exit: 'Spiel beenden',
    progress: 'Besuchte Zonen',
    help: 'Fahre zu den leuchtenden Plattformen. Überquere den Fluss über die Brücken und sammle die Münzen. Esc zum Beenden.',
    coins: 'Gesammelte Münzen',
    cv: 'Lebenslauf ansehen',
    hide: 'Ausblenden',
    soundOn: 'Ton einschalten',
    soundOff: 'Ton ausschalten',
    back: 'Alle Projekte',
    openProject: 'Projekt öffnen',
    openCode: 'Code ansehen',
    about: 'Full-Stack-Entwickler in Deutschland mit über 3 Jahren Erfahrung in skalierbaren Web-Apps mit React und Next.js. Mein Fokus: Performance, saubere APIs und Oberflächen, die Spaß machen.',
    skills,
    zones: {
      about: { title: 'Über mich', tag: 'Wer ich bin' },
      projects: { title: 'Projekte', tag: 'Was ich gebaut habe' },
      skills: { title: 'Skills', tag: 'Mein Werkzeugkasten' },
      certificates: { title: 'Zertifikate', tag: 'Meine Abschlüsse' },
      contact: { title: 'Kontakt', tag: 'Lass uns reden' },
    },
  },
};
