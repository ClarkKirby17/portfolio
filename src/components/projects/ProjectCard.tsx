import { Link } from 'react-router-dom';
import { ArrowUpRight, Github, Play } from 'lucide-react';
import type { Project } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

/**
 * Thumbnail with a slow zoom on hover and a graceful missing-image state.
 * The project name sits underneath the image, so a screenshot that has not
 * been added yet reads as a deliberate panel rather than a broken image icon.
 */
function Thumbnail({ project, className }: { project: Project; className?: string }) {
  return (
    <div className={cn('relative overflow-hidden bg-ink-900', className)}>
      <div className="absolute inset-0 grid place-items-center px-6 text-center">
        <span className="font-display text-3xl text-fog-500/25">{project.name}</span>
      </div>

      <img
        src={project.thumbnail}
        alt={project.thumbnailAlt}
        loading="lazy"
        decoding="async"
        width={1200}
        height={750}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
        onError={(event) => {
          event.currentTarget.style.display = 'none';
        }}
      />

      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-ink-950/70 via-transparent to-transparent"
      />
    </div>
  );
}

/**
 * The one project card, used in the home carousel and the projects grid.
 *
 * Fixed shape on purpose: thumbnail, metadata, name, one line, stack, actions.
 * Cards that vary their layout are harder to compare, and comparing is the
 * whole reason someone is looking at four of them side by side.
 */
export function ProjectCard({ project }: { project: Project }) {
  return (
    <Card as="article" interactive sheen className="group flex h-full flex-col">
      <Thumbnail project={project} className="aspect-[16/10] shrink-0" />

      <div className="flex flex-1 flex-col gap-4 p-6">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="accent">{project.category}</Badge>
          <Badge variant="muted">{project.year}</Badge>
          <Badge variant="muted">{project.status}</Badge>
        </div>

        <div className="flex flex-col gap-2">
          <h3 className="font-display text-2xl leading-tight tracking-tight text-fog-50">
            {project.name}
          </h3>
          <p className="text-sm leading-relaxed text-fog-300">{project.tagline}</p>
        </div>

        <ul className="flex flex-wrap gap-1.5">
          {project.stack.slice(0, 4).map((tech) => (
            <li key={tech}>
              <Badge size="sm">{tech}</Badge>
            </li>
          ))}
          {project.stack.length > 4 && (
            <li>
              <Badge size="sm" variant="muted">
                +{project.stack.length - 4}
              </Badge>
            </li>
          )}
        </ul>

        {/* mt-auto pins the actions to the bottom, so a short tagline never
            leaves one card's buttons floating higher than its neighbour's. */}
        <div className="mt-auto flex flex-wrap items-center gap-1 pt-2">
          <Button asChild size="sm" variant="secondary">
            <Link to={`/projects/${project.slug}`}>
              Case study
              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </Button>

          {project.links.github && (
            <Button asChild size="sm" variant="ghost">
              <a href={project.links.github} target="_blank" rel="noreferrer">
                <Github className="h-4 w-4" />
                Code
              </a>
            </Button>
          )}

          {project.links.demo && (
            <Button asChild size="sm" variant="ghost">
              <a href={project.links.demo} target="_blank" rel="noreferrer">
                <Play className="h-4 w-4" />
                Demo
              </a>
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
