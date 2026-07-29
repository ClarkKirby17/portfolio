/**
 * Single source of truth for identity, links and headline copy.
 * Edit this file first; the whole site reads from it.
 */

export const profile = {
  name: 'Clark Kirby Normor',
  firstName: 'Clark',
  role: 'Junior Full Stack Developer',
  secondaryRole: 'Information Technology Student',
  location: 'Valenzuela, Metro Manila, Philippines',
  availability: 'Open to internships and junior roles',

  /** Hero paragraph. Concrete, no adjectives doing the work. */
  intro:
    'I build web applications, AI-assisted tools, and AR experiences, from database schema to the last hover state. Currently finishing a Computer Science degree and shipping projects that solve problems I actually care about.',

  /** Two-sentence version used for meta descriptions and the AI assistant. */
  shortBio:
    'Junior full stack developer and Information Technology student in Valenzuela, Metro Manila. I work across React, TypeScript, Flutter, PHP and Unity, and I care most about making complicated things feel simple.',

  email: 'clarkkirbynormor2005@gmail.com',
  phone: '+63 951 723 0071',

  links: {
    github: 'https://github.com/ClarkKirby17',
    linkedin: 'https://www.linkedin.com/in/clark-kirby-normor-588979393',
    resume: '/Clark-Kirby-Normor-Resume.pdf',
  },

  githubUsername: 'ClarkKirby17',

  /** Shown in the hero strip. Keep these honest and easy to defend in an interview. */
  stats: [
    { value: 4, suffix: '', label: 'Projects shipped end to end' },
    { value: 3, suffix: '', label: 'Years writing code' },
    { value: 12, suffix: '+', label: 'Languages & frameworks used' },
    { value: 2027, suffix: '', label: 'Expected graduation', raw: true },
  ],
} as const;

export type Profile = typeof profile;
