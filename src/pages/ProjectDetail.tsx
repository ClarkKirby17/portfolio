import type { ReactNode } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Github, Layers, Play } from 'lucide-react';
import { Seo } from '@/components/seo/Seo';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Reveal } from '@/components/ui/Reveal';
import { getProjectBySlug, projects } from '@/data/projects';

/** Shared heading treatment for the narrative blocks below. */
function Block({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <Reveal>
      <section className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <span className="h-px w-6 bg-accent/60" aria-hidden />
          <span className="eyebrow">{eyebrow}</span>
        </div>
        <h2 className="font-display text-3xl leading-tight tracking-tight text-fog-50">{title}</h2>
        <div className="flex flex-col gap-4 text-[0.9375rem] leading-relaxed text-fog-300">
          {children}
        </div>
      </section>
    </Reveal>
  );
}

export default function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>();
  const project = slug ? getProjectBySlug(slug) : undefined;

  // Unknown slug: send to the index rather than showing a 404 for a link
  // that was probably just renamed.
  if (!project) return <Navigate to="/projects" replace />;

  const index = projects.findIndex((item) => item.slug === project.slug);
  const next = projects[(index + 1) % projects.length];

  return (
    <>
      <Seo
        title={`${project.name} | Case study by Clark Kirby Normor`}
        description={project.summary}
        path={`/projects/${project.slug}`}
        image={project.thumbnail}
      />

      <article className="mx-auto max-w-6xl px-5 py-16 sm:px-8 md:py-24">
        <Link
          to="/projects"
          className="group mb-10 inline-flex items-center gap-2 font-mono text-xs tracking-wide text-fog-500 transition-colors hover:text-accent-bright"
        >
          <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-1" />
          All projects
        </Link>

        {/* Title block */}
        <header className="flex flex-col gap-6">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="accent">{project.category}</Badge>
            <Badge variant="muted">{project.year}</Badge>
            <Badge variant="muted">{project.status}</Badge>
          </div>

          <h1 className="font-display text-[clamp(2.75rem,7vw,4.5rem)] leading-[1.02] tracking-tight text-fog-50">
            {project.name}
          </h1>

          <p className="max-w-2xl text-lg leading-relaxed text-fog-300">{project.tagline}</p>

          <div className="flex flex-wrap gap-3 pt-2">
            {project.links.github && (
              <Button asChild variant="secondary">
                <a href={project.links.github} target="_blank" rel="noreferrer">
                  <Github className="h-4 w-4" />
                  Source code
                </a>
              </Button>
            )}
            {project.links.demo && (
              <Button asChild>
                <a href={project.links.demo} target="_blank" rel="noreferrer">
                  <Play className="h-4 w-4" />
                  Live demo
                </a>
              </Button>
            )}
          </div>
        </header>

        {/* Hero image */}
        <Reveal className="mt-14">
          <div className="relative aspect-[16/9] overflow-hidden rounded-[2rem] border border-fog-50/[0.07] bg-ink-900">
            <div className="absolute inset-0 grid place-items-center">
              <span className="font-display text-5xl text-fog-500/25">{project.name}</span>
            </div>
            <img
              src={project.thumbnail}
              alt={project.thumbnailAlt}
              loading="lazy"
              decoding="async"
              className="relative h-full w-full object-cover"
              onError={(event) => {
                event.currentTarget.style.display = 'none';
              }}
            />
          </div>
        </Reveal>

        {/* Body: narrative left, specification rail right. */}
        <div className="mt-16 grid gap-14 lg:grid-cols-[1fr_18rem] lg:gap-16">
          <div className="flex flex-col gap-16">
            <Block eyebrow="The problem" title="What was actually broken">
              <p>{project.problem}</p>
            </Block>

            <Block eyebrow="The build" title="What I made">
              <p>{project.solution}</p>
            </Block>

            <Block eyebrow="Features" title="What it does">
              <ul className="flex flex-col gap-3">
                {project.features.map((feature) => (
                  <li key={feature} className="flex gap-3">
                    <span
                      className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-accent-bright"
                      aria-hidden
                    />
                    {feature}
                  </li>
                ))}
              </ul>
            </Block>

            <Block eyebrow="Challenges" title="What went wrong first">
              <div className="flex flex-col gap-4">
                {project.challenges.map((challenge) => (
                  <Card key={challenge.title} className="p-6">
                    <h3 className="mb-2.5 font-medium text-fog-50">{challenge.title}</h3>
                    <p className="text-sm leading-relaxed text-fog-300">{challenge.body}</p>
                  </Card>
                ))}
              </div>
            </Block>

            <Block eyebrow="Takeaways" title="What I'd carry into the next one">
              <ul className="flex flex-col gap-4">
                {project.lessons.map((lesson, lessonIndex) => (
                  <li key={lesson} className="flex gap-4">
                    <span className="font-mono text-xs text-accent-bright">
                      {String(lessonIndex + 1).padStart(2, '0')}
                    </span>
                    <span>{lesson}</span>
                  </li>
                ))}
              </ul>
            </Block>
          </div>

          {/* Spec rail: the scannable version for anyone who reads nothing else. */}
          <aside className="lg:sticky lg:top-28 lg:h-fit">
            <Card className="flex flex-col gap-7 p-6">
              <div className="flex flex-col gap-2">
                <p className="eyebrow">My role</p>
                <p className="text-sm leading-relaxed text-fog-50">{project.role}</p>
                <p className="text-xs text-fog-500">{project.context}</p>
              </div>

              <div className="rule-fade" />

              <div className="flex flex-col gap-3">
                <p className="eyebrow">Stack</p>
                <ul className="flex flex-wrap gap-1.5">
                  {project.stack.map((tech) => (
                    <li key={tech}>
                      <Badge size="sm">{tech}</Badge>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rule-fade" />

              <div className="flex flex-col gap-3">
                <p className="eyebrow flex items-center gap-2">
                  <Layers className="h-3.5 w-3.5" aria-hidden />
                  Architecture
                </p>
                <ul className="flex flex-col gap-3">
                  {project.architecture.map((layer) => (
                    <li key={layer.layer} className="flex flex-col gap-1">
                      <span className="font-mono text-[0.6875rem] tracking-wide text-accent-bright">
                        {layer.layer}
                      </span>
                      <span className="text-xs leading-relaxed text-fog-300">{layer.detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
          </aside>
        </div>

        {/* Next project */}
        {next && next.slug !== project.slug && (
          <Reveal className="mt-24">
            <Link
              to={`/projects/${next.slug}`}
              className="group flex flex-wrap items-center justify-between gap-4 rounded-[var(--radius-card)] border border-fog-50/[0.07] bg-ink-850/60 p-8 transition-colors hover:border-accent/25 hover:bg-ink-800/60"
            >
              <div>
                <p className="eyebrow">Next project</p>
                <p className="mt-2 font-display text-3xl tracking-tight text-fog-50">{next.name}</p>
              </div>
              <ArrowRight className="h-6 w-6 text-fog-500 transition-all duration-300 group-hover:translate-x-1 group-hover:text-accent-bright" />
            </Link>
          </Reveal>
        )}
      </article>
    </>
  );
}
