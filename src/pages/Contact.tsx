import { ArrowUpRight, Github, Linkedin, Mail } from 'lucide-react';
import { Seo } from '@/components/seo/Seo';
import { Card } from '@/components/ui/Card';
import { Reveal } from '@/components/ui/Reveal';
import { Section, SectionHeading } from '@/components/ui/Section';
import { ContactForm } from '@/components/contact/ContactForm';
import { profile } from '@/data/profile';

const channels = [
  {
    Icon: Mail,
    label: 'Email',
    value: profile.email,
    href: `mailto:${profile.email}`,
    note: 'Fastest route. I reply within a couple of days.',
  },
  {
    Icon: Linkedin,
    label: 'LinkedIn',
    value: '/in/clarknormor',
    href: profile.links.linkedin,
    note: 'Good for a quick look at my background.',
  },
  {
    Icon: Github,
    label: 'GitHub',
    value: `@${profile.githubUsername}`,
    href: profile.links.github,
    note: 'The code behind everything on this site.',
  },
];

export default function Contact() {
  return (
    <>
      <Seo
        title="Contact | Clark Kirby Normor"
        description="Get in touch about junior developer roles, internships, or anything on this site."
        path="/contact"
      />

      <Section>
        <SectionHeading
          eyebrow="Contact"
          title="Say hello"
          description={`${profile.availability}. Tell me what you're building and I'll tell you honestly whether I'd be useful on it.`}
        />

        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:gap-14">
          <Reveal>
            <ContactForm />
          </Reveal>

          <Reveal delay={0.08}>
            <div className="flex flex-col gap-4">
              {channels.map(({ Icon, label, value, href, note }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith('mailto:') ? undefined : '_blank'}
                  rel="noreferrer"
                  className="group block rounded-[var(--radius-card)]"
                >
                  <Card interactive className="p-6">
                    <div className="flex items-start gap-4">
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-accent/25 bg-accent/[0.08] text-accent-bright">
                        <Icon className="h-[18px] w-[18px]" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className="eyebrow">{label}</p>
                          <ArrowUpRight className="h-4 w-4 text-fog-500 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent-bright" />
                        </div>
                        <p className="mt-1 truncate text-sm text-fog-50">{value}</p>
                        <p className="mt-1.5 text-xs leading-relaxed text-fog-500">{note}</p>
                      </div>
                    </div>
                  </Card>
                </a>
              ))}

              <Card className="p-6">
                <p className="eyebrow mb-2">In a hurry?</p>
                <p className="text-sm leading-relaxed text-fog-300">
                  The assistant in the bottom-right corner can answer questions about my projects
                  and stack instantly, with no waiting on a reply.
                </p>
              </Card>
            </div>
          </Reveal>
        </div>
      </Section>
    </>
  );
}
