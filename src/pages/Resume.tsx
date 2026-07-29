import type { ReactNode } from 'react';
import { Download, ExternalLink, Github, Linkedin, Mail, MapPin } from 'lucide-react';
import { Seo } from '@/components/seo/Seo';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Reveal } from '@/components/ui/Reveal';
import { Section, SectionHeading } from '@/components/ui/Section';
import { profile } from '@/data/profile';
import { projects } from '@/data/projects';
import { certificates, education, experience, skillGroups } from '@/data/resume';

function Entry({
  title,
  meta,
  children,
}: {
  title: string;
  meta: string;
  children?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="font-medium text-fog-50">{title}</h3>
        <span className="font-mono text-xs text-fog-500">{meta}</span>
      </div>
      {children}
    </div>
  );
}

function Group({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Reveal>
      <section className="flex flex-col gap-5">
        <div className="flex items-center gap-3">
          <span className="eyebrow">{title}</span>
          <span className="h-px flex-1 bg-fog-50/[0.08]" aria-hidden />
        </div>
        {children}
      </section>
    </Reveal>
  );
}

/**
 * The web resume is the primary artefact. A PDF that needs downloading before
 * it can be read is friction at exactly the wrong moment. The download stays
 * one click away for the applicant-tracking system on the other end.
 */
export default function Resume() {
  return (
    <>
      <Seo
        title="Resume | Clark Kirby Normor"
        description="Full resume: skills, projects, work experience, education and certifications. Downloadable as PDF."
        path="/resume"
      />

      <Section width="narrow">
        <SectionHeading
          eyebrow="Resume"
          title="The one-page version"
          description="Everything below is on the PDF too. Read it here, or take it with you."
        />

        <Reveal>
          <div className="mb-12 flex flex-wrap items-center gap-3">
            <Button asChild size="lg">
              <a href={profile.links.resume} download>
                <Download className="h-4 w-4" />
                Download PDF
              </a>
            </Button>
            <Button asChild variant="secondary" size="lg">
              <a href={profile.links.resume} target="_blank" rel="noreferrer">
                <ExternalLink className="h-4 w-4" />
                Open in new tab
              </a>
            </Button>
          </div>
        </Reveal>

        <Card className="flex flex-col gap-12 p-7 sm:p-10">
          {/* Header */}
          <header className="flex flex-col gap-4">
            <h2 className="font-display text-4xl tracking-tight text-fog-50">{profile.name}</h2>
            <p className="text-fog-300">
              {profile.role} · {profile.secondaryRole}
            </p>
            <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-fog-500">
              <li className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5" aria-hidden />
                {profile.location}
              </li>
              <li>
                <a
                  href={`mailto:${profile.email}`}
                  className="flex items-center gap-2 transition-colors hover:text-accent-bright"
                >
                  <Mail className="h-3.5 w-3.5" aria-hidden />
                  {profile.email}
                </a>
              </li>
              <li>
                <a
                  href={profile.links.github}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 transition-colors hover:text-accent-bright"
                >
                  <Github className="h-3.5 w-3.5" aria-hidden />
                  GitHub
                </a>
              </li>
              <li>
                <a
                  href={profile.links.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 transition-colors hover:text-accent-bright"
                >
                  <Linkedin className="h-3.5 w-3.5" aria-hidden />
                  LinkedIn
                </a>
              </li>
            </ul>
          </header>

          <Group title="Summary">
            <p className="text-sm leading-relaxed text-fog-300">{profile.shortBio}</p>
          </Group>

          <Group title="Skills">
            <div className="flex flex-col gap-4">
              {skillGroups.map((group) => (
                <div key={group.title} className="flex flex-col gap-2 sm:flex-row sm:gap-6">
                  <span className="w-32 shrink-0 font-mono text-xs text-fog-500">
                    {group.title}
                  </span>
                  <span className="text-sm text-fog-300">{group.skills.join(' · ')}</span>
                </div>
              ))}
            </div>
          </Group>

          <Group title="Projects">
            <div className="flex flex-col gap-6">
              {projects.map((project) => (
                <Entry
                  key={project.slug}
                  title={project.name}
                  meta={`${project.year} · ${project.status}`}
                >
                  <p className="text-sm leading-relaxed text-fog-300">{project.tagline}</p>
                  <ul className="mt-1 flex flex-wrap gap-1.5">
                    {project.stack.map((tech) => (
                      <li key={tech}>
                        <Badge size="sm" variant="muted">
                          {tech}
                        </Badge>
                      </li>
                    ))}
                  </ul>
                </Entry>
              ))}
            </div>
          </Group>

          <Group title="Experience">
            <div className="flex flex-col gap-6">
              {experience.map((item) => (
                <Entry
                  key={item.organisation}
                  title={`${item.role}, ${item.organisation}`}
                  meta={item.period}
                >
                  <ul className="flex flex-col gap-2">
                    {item.achievements.slice(0, 3).map((achievement) => (
                      <li
                        key={achievement}
                        className="flex gap-3 text-sm leading-relaxed text-fog-300"
                      >
                        <span
                          className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent-bright"
                          aria-hidden
                        />
                        {achievement}
                      </li>
                    ))}
                  </ul>
                </Entry>
              ))}
            </div>
          </Group>

          <Group title="Education">
            {education.map((item) => (
              <Entry key={item.qualification} title={item.qualification} meta={item.period}>
                <p className="text-sm text-fog-300">{item.institution}</p>
              </Entry>
            ))}
          </Group>

          <Group title="Certifications">
            <ul className="flex flex-col gap-3">
              {certificates.map((cert) => (
                <li key={cert.name} className="flex flex-wrap items-baseline justify-between gap-2">
                  <span className="text-sm text-fog-50">{cert.name}</span>
                  <span className="font-mono text-xs text-fog-500">
                    {cert.issuer} · {cert.year}
                  </span>
                </li>
              ))}
            </ul>
          </Group>
        </Card>
      </Section>
    </>
  );
}
