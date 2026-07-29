import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Search, X } from 'lucide-react';
import { Seo } from '@/components/seo/Seo';
import { ProjectCard } from '@/components/projects/ProjectCard';
import { Section, SectionHeading } from '@/components/ui/Section';
import { projectCategories, projects } from '@/data/projects';
import { EASE_SMOOTH, cn } from '@/lib/utils';

export default function Projects() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<string>('All');

  /**
   * Search covers name, tagline, summary and stack, so typing "firebase"
   * finds the projects that use it even though it is never in a title.
   */
  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();

    return projects.filter((project) => {
      const matchesCategory = category === 'All' || project.category === category;
      if (!matchesCategory) return false;
      if (!needle) return true;

      return [project.name, project.tagline, project.summary, ...project.stack]
        .join(' ')
        .toLowerCase()
        .includes(needle);
    });
  }, [category, query]);

  return (
    <>
      <Seo
        title="Projects | Clark Kirby Normor"
        description="Case studies for LumenFact, NETQUEST, AR History Explorer and Eatsy: the problem, the build, the trade-offs, and the lessons."
        path="/projects"
      />

      <Section width="wide">
        <SectionHeading
          eyebrow="Everything I've built"
          title="Projects"
          description="Four case studies. Filter by what you're hiring for, or search by a technology you use."
        />

        {/* Controls */}
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
            {projectCategories.map((option) => {
              const active = category === option;
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => setCategory(option)}
                  aria-pressed={active}
                  className={cn(
                    'relative rounded-full px-4 py-2 font-mono text-xs tracking-wide transition-colors duration-200',
                    active ? 'text-fog-50' : 'text-fog-500 hover:text-fog-300',
                  )}
                >
                  {active && (
                    <motion.span
                      layoutId="filter-pill"
                      className="absolute inset-0 rounded-full border border-accent/35 bg-accent/15"
                      transition={{ duration: 0.35, ease: EASE_SMOOTH }}
                    />
                  )}
                  <span className="relative">{option}</span>
                </button>
              );
            })}
          </div>

          <div className="relative w-full md:w-72">
            <Search
              className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-fog-500"
              aria-hidden
            />
            <label htmlFor="project-search" className="sr-only">
              Search projects
            </label>
            <input
              id="project-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by name or technology"
              className="w-full rounded-full border border-fog-50/10 bg-ink-850/60 py-2.5 pl-11 pr-10 text-sm text-fog-50 placeholder:text-fog-500 transition-colors hover:border-fog-50/20 focus:border-accent/50 focus:outline-none"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 grid h-6 w-6 -translate-y-1/2 place-items-center rounded-full text-fog-500 hover:text-fog-50"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Results */}
        <motion.div layout className="grid gap-6 md:grid-cols-2">
          <AnimatePresence mode="popLayout">
            {visible.map((project) => (
              <motion.div
                key={project.slug}
                layout
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.3, ease: EASE_SMOOTH }}
              >
                <ProjectCard project={project} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty state: says what to do next, not just that nothing matched. */}
        {visible.length === 0 && (
          <div className="flex flex-col items-center gap-4 py-24 text-center">
            <p className="font-display text-2xl text-fog-50">Nothing matches “{query}”</p>
            <p className="max-w-sm text-sm text-fog-300">
              Try a broader term, or clear the filters to see all four projects.
            </p>
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setCategory('All');
              }}
              className="font-mono text-xs tracking-wide text-accent-bright hover:text-fog-50"
            >
              Reset filters
            </button>
          </div>
        )}
      </Section>
    </>
  );
}
