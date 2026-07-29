import { Link } from 'react-router-dom';
import { ArrowUpRight, Github, Linkedin, Mail } from 'lucide-react';
import { profile } from '@/data/profile';

const columns = [
  {
    title: 'Site',
    links: [
      { label: 'Home', to: '/' },
      { label: 'Projects', to: '/projects' },
      { label: 'About', to: '/about' },
    ],
  },
  {
    title: 'More',
    links: [
      { label: 'Experience', to: '/experience' },
      { label: 'Resume', to: '/resume' },
      { label: 'Contact', to: '/contact' },
    ],
  },
];

const social = [
  { label: 'GitHub', href: profile.links.github, Icon: Github },
  { label: 'LinkedIn', href: profile.links.linkedin, Icon: Linkedin },
  { label: 'Email', href: `mailto:${profile.email}`, Icon: Mail },
];

export function Footer() {
  return (
    <footer className="relative mt-24 border-t border-fog-50/[0.07] bg-ink-900/40">
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
        <div className="grid gap-12 md:grid-cols-[1.6fr_1fr_1fr]">
          <div className="flex flex-col gap-5">
            <p className="eyebrow">Currently</p>
            <p className="max-w-sm font-display text-2xl leading-snug text-fog-50">
              {profile.availability}. If you are hiring, the fastest route is email.
            </p>
            <a
              href={`mailto:${profile.email}`}
              className="group inline-flex w-fit items-center gap-2 text-accent-bright transition-colors hover:text-fog-50"
            >
              {profile.email}
              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>

          {columns.map((column) => (
            <nav key={column.title} aria-label={column.title} className="flex flex-col gap-4">
              <p className="eyebrow">{column.title}</p>
              <ul className="flex flex-col gap-2.5">
                {column.links.map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="text-sm text-fog-300 transition-colors hover:text-fog-50"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="rule-fade my-12" />

        <div className="flex flex-col-reverse items-start justify-between gap-6 sm:flex-row sm:items-center">
          <p className="font-mono text-xs text-fog-500">
            © {new Date().getFullYear()} {profile.name} · Built with React, TypeScript and Tailwind
          </p>

          <ul className="flex items-center gap-2">
            {social.map(({ label, href, Icon }) => (
              <li key={label}>
                <a
                  href={href}
                  target={href.startsWith('mailto:') ? undefined : '_blank'}
                  rel="noreferrer"
                  aria-label={label}
                  className="grid h-10 w-10 place-items-center rounded-xl border border-fog-50/[0.07] text-fog-300 transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/30 hover:text-accent-bright"
                >
                  <Icon className="h-4 w-4" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
