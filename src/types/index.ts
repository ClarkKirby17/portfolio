/**
 * Domain types for every piece of content on the site.
 * Content lives in `src/data`; nothing here should know about the DOM.
 */

export type ProjectCategory = 'Web' | 'Mobile' | 'AI' | 'AR / Game' | 'Full Stack';

export type ProjectStatus = 'Shipped' | 'In development' | 'Prototype';

export interface ArchitectureLayer {
  /** e.g. "Client", "API", "Data" */
  layer: string;
  /** What actually runs in that layer. */
  detail: string;
}

export interface Project {
  /** URL segment: /projects/:slug */
  slug: string;
  name: string;
  /** One line a recruiter can scan in under two seconds. */
  tagline: string;
  /** 2–3 sentences for the card and meta description. */
  summary: string;
  category: ProjectCategory;
  status: ProjectStatus;
  year: string;
  /** Ordered highest-signal first; the card shows the first four. */
  stack: string[];
  /** Path under /public. 16:10 works best with the card layout. */
  thumbnail: string;
  /** Alt text is content, not an afterthought. */
  thumbnailAlt: string;
  role: string;
  /** Team size and shape, e.g. "4-person capstone team". */
  context: string;
  problem: string;
  solution: string;
  features: string[];
  challenges: { title: string; body: string }[];
  lessons: string[];
  architecture: ArchitectureLayer[];
  links: {
    github?: string;
    demo?: string;
    caseStudy?: boolean;
  };
  /** Pinned to the home page. */
  featured: boolean;
}

export interface SkillGroup {
  title: string;
  /** Short line explaining how these are actually used. */
  note: string;
  icon: 'layout' | 'server' | 'terminal' | 'wrench';
  skills: string[];
}

export interface ExperienceItem {
  role: string;
  organisation: string;
  period: string;
  location: string;
  /** Achievements, not a job description. */
  achievements: string[];
  stack: string[];
}

export interface EducationItem {
  qualification: string;
  institution: string;
  period: string;
  detail: string;
}

export interface Certificate {
  name: string;
  issuer: string;
  year: string;
}

export interface Repository {
  name: string;
  description: string;
  language: string;
  /** Hex colour matching GitHub's language palette. */
  languageColor: string;
  stars: number;
  forks: number;
  url: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}
