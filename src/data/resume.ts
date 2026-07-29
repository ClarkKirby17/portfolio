import type {
  Certificate,
  EducationItem,
  ExperienceItem,
  Repository,
  SkillGroup,
} from '@/types';

/**
 * Skills carry a note explaining how each group is actually used.
 * A list of nouns says nothing; "what I built with it" is the signal.
 */
export const skillGroups: SkillGroup[] = [
  {
    title: 'Frontend',
    note: 'Where I spend most of my time. Component architecture, state, and making interfaces that hold up on a mid-range phone.',
    icon: 'layout',
    skills: ['React', 'TypeScript', 'JavaScript', 'TailwindCSS', 'HTML', 'CSS', 'Framer Motion'],
  },
  {
    title: 'Backend',
    note: 'REST APIs, relational schema design, authentication, and keeping keys off the client.',
    icon: 'server',
    skills: ['PHP', 'Firebase', 'Cloud Functions', 'MySQL', 'PostgreSQL', 'REST APIs'],
  },
  {
    title: 'Languages',
    note: 'Picked up per project rather than per course: C# for Unity, Dart for Flutter, Python for scripting and coursework.',
    icon: 'terminal',
    skills: ['TypeScript', 'JavaScript', 'Python', 'C#', 'Dart', 'PHP', 'SQL', 'Lua'],
  },
  {
    title: 'Tools & Platforms',
    note: 'Version control on every project, Figma before the first component, Unity for anything with a camera in it.',
    icon: 'wrench',
    skills: ['Git', 'GitHub', 'Unity', 'VS Code', 'Figma', 'Firebase', 'Vite', 'Postman'],
  },
];

export const experience: ExperienceItem[] = [
  {
    role: 'Data Encoder',
    organisation: 'BNB Car Rental',
    period: '2022 to 2023',
    location: 'Metro Manila, Philippines',
    achievements: [
      'Rebuilt the booking and vehicle records from scattered spreadsheets into one structured workbook with validation rules, which removed the duplicate-entry problem that had been causing double-booked vehicles.',
      'Automated the recurring weekly report with formulas and templates, turning a manual afternoon of copy-paste into a repeatable process the rest of the team could run.',
      'Wrote a short handover guide for the record-keeping system so new staff could take it over without walkthroughs. It was still in use after I left.',
      'This is the job that made me a developer: I spent a year doing by hand what software should have been doing, and went looking for how to build that software.',
    ],
    stack: ['Excel', 'Data validation', 'Process documentation'],
  },
];

export const education: EducationItem[] = [
  {
    qualification: 'Bachelor of Science in Computer Science',
    institution: 'Expected graduation 2027',
    period: '2023 to 2027',
    detail:
      'Coursework across data structures, networking, database systems, and software engineering. Most of what is on this site started as a course requirement and kept going after the grade came in.',
  },
];

export const certificates: Certificate[] = [
  { name: 'IT Specialist: Python', issuer: 'Certiport', year: '2025' },
  { name: 'IT Specialist: Cybersecurity', issuer: 'Certiport', year: '2025' },
  { name: 'HealthForge 2026 Challenger', issuer: 'HealthForge', year: '2026' },
];

/**
 * Pinned repositories. Kept as static data so the page renders instantly and
 * never shows a broken card when the GitHub API rate-limits an anonymous visit.
 * `useGitHubRepos` will overlay live stats when the request succeeds.
 */
export const pinnedRepos: Repository[] = [
  {
    name: 'lumenfact',
    description: 'Retrieval-grounded health claim verification. Flutter client, Firebase backend.',
    language: 'Dart',
    languageColor: '#00B4AB',
    stars: 0,
    forks: 0,
    url: 'https://github.com/clarknormor/lumenfact',
  },
  {
    name: 'netquest',
    description: 'Interactive networking exercises with step-level validation and instructor analytics.',
    language: 'TypeScript',
    languageColor: '#3178C6',
    stars: 0,
    forks: 0,
    url: 'https://github.com/clarknormor/netquest',
  },
  {
    name: 'ar-history-explorer',
    description: 'Unity AR app that anchors historical reconstructions to real locations.',
    language: 'C#',
    languageColor: '#178600',
    stars: 0,
    forks: 0,
    url: 'https://github.com/clarknormor/ar-history-explorer',
  },
  {
    name: 'eatsy',
    description: 'Recipe platform with ingredient-first search and serving-size scaling.',
    language: 'TypeScript',
    languageColor: '#3178C6',
    stars: 0,
    forks: 0,
    url: 'https://github.com/clarknormor/eatsy',
  },
];

/** Rough language split across public repositories. Update when it drifts. */
export const languageBreakdown = [
  { name: 'TypeScript', percent: 34, color: '#3178C6' },
  { name: 'C#', percent: 22, color: '#178600' },
  { name: 'Dart', percent: 16, color: '#00B4AB' },
  { name: 'PHP', percent: 13, color: '#4F5D95' },
  { name: 'Python', percent: 9, color: '#3572A5' },
  { name: 'Other', percent: 6, color: '#7C8A85' },
];
