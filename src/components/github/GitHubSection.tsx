import { ArrowUpRight, GitFork, Github, Star } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Reveal } from '@/components/ui/Reveal';
import { Section, SectionHeading } from '@/components/ui/Section';
import { Button } from '@/components/ui/Button';
import { languageBreakdown, pinnedRepos } from '@/data/resume';
import { profile } from '@/data/profile';
import { useGitHubContributions } from '@/hooks/useGitHub';
import { cn } from '@/lib/utils';

/** Level 0 is a surface tint, not a colour. Empty days should recede. */
const levelClasses = [
  'bg-fog-50/[0.05]',
  'bg-accent/25',
  'bg-accent/50',
  'bg-accent/75',
  'bg-accent-bright',
];

function ContributionGrid() {
  const { days, total, status } = useGitHubContributions();

  if (status === 'unavailable') {
    return (
      <div className="flex flex-col items-start gap-4 py-8">
        <p className="text-sm text-fog-300">
          The contribution graph could not load right now. GitHub&apos;s public endpoint rate
          limits anonymous requests.
        </p>
        <Button asChild variant="secondary" size="sm">
          <a href={profile.links.github} target="_blank" rel="noreferrer">
            <Github className="h-4 w-4" />
            View the real graph on GitHub
          </a>
        </Button>
      </div>
    );
  }

  if (status !== 'ready') {
    return (
      <div
        className="h-[7.5rem] animate-pulse rounded-xl bg-fog-50/[0.04]"
        role="status"
        aria-label="Loading contribution activity"
      />
    );
  }

  return (
    <figure className="flex flex-col gap-4">
      {/* min-w-0 is load-bearing: a scroll container inside a grid item still
          reports its content width unless the item is allowed to shrink below
          it. Without this the 53-column grid widens the page past the viewport
          and mobile browsers respond by zooming the whole document out. */}
      <div className="min-w-0 max-w-full overflow-x-auto pb-2">
        {/* Column-wise grid: 7 rows, one column per week, exactly like GitHub. */}
        <div
          className="grid grid-flow-col grid-rows-7 gap-[3px]"
          role="img"
          aria-label={`${total} contributions in the last year`}
        >
          {days.map((day) => (
            <span
              key={day.date}
              title={`${day.count} contribution${day.count === 1 ? '' : 's'} on ${day.date}`}
              className={cn('h-[11px] w-[11px] rounded-[3px]', levelClasses[day.level] ?? levelClasses[0])}
            />
          ))}
        </div>
      </div>

      <figcaption className="flex min-w-0 flex-wrap items-center justify-between gap-3">
        <span className="text-sm text-fog-300">
          <span className="font-medium text-fog-50">{total.toLocaleString()}</span> contributions
          this year
        </span>
        <span className="flex items-center gap-1.5 font-mono text-[0.6875rem] text-fog-500">
          Less
          {levelClasses.map((className, index) => (
            <span key={index} className={cn('h-[11px] w-[11px] rounded-[3px]', className)} />
          ))}
          More
        </span>
      </figcaption>
    </figure>
  );
}

function LanguageBar() {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex h-2 w-full overflow-hidden rounded-full bg-fog-50/[0.05]">
        {languageBreakdown.map((language) => (
          <span
            key={language.name}
            style={{ width: `${language.percent}%`, backgroundColor: language.color }}
            title={`${language.name} ${language.percent}%`}
          />
        ))}
      </div>

      <ul className="flex flex-wrap gap-x-5 gap-y-2">
        {languageBreakdown.map((language) => (
          <li key={language.name} className="flex items-center gap-2 text-sm text-fog-300">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: language.color }}
              aria-hidden
            />
            {language.name}
            <span className="font-mono text-xs text-fog-500">{language.percent}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function GitHubSection() {
  return (
    <Section id="github">
      <SectionHeading
        eyebrow="Open source"
        title="On GitHub"
        description="Every project on this site is public. The commit history is the honest version of the case studies."
      />

      <div className="grid gap-5 lg:grid-cols-[1.5fr_1fr]">
        <Reveal className="min-w-0">
          <Card className="h-full p-6 sm:p-8">
            <h3 className="mb-6 text-lg font-medium text-fog-50">Contribution activity</h3>
            <ContributionGrid />
          </Card>
        </Reveal>

        <Reveal delay={0.08} className="min-w-0">
          <Card className="h-full p-6 sm:p-8">
            <h3 className="mb-6 text-lg font-medium text-fog-50">Most used languages</h3>
            <LanguageBar />
          </Card>
        </Reveal>
      </div>

      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        {pinnedRepos.map((repo, index) => (
          <Reveal key={repo.name} delay={index * 0.05}>
            <a
              href={repo.url}
              target="_blank"
              rel="noreferrer"
              className="group block h-full rounded-[var(--radius-card)]"
            >
              <Card interactive className="h-full p-6">
                <div className="flex items-start justify-between gap-4">
                  <span className="flex items-center gap-2 font-mono text-sm text-accent-bright">
                    <Github className="h-4 w-4" aria-hidden />
                    {repo.name}
                  </span>
                  <ArrowUpRight className="h-4 w-4 shrink-0 text-fog-500 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent-bright" />
                </div>

                <p className="mt-3 text-sm leading-relaxed text-fog-300">{repo.description}</p>

                <div className="mt-5 flex items-center gap-4 text-xs text-fog-500">
                  <span className="flex items-center gap-1.5">
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: repo.languageColor }}
                      aria-hidden
                    />
                    {repo.language}
                  </span>
                  <span className="flex items-center gap-1">
                    <Star className="h-3.5 w-3.5" aria-hidden /> {repo.stars}
                  </span>
                  <span className="flex items-center gap-1">
                    <GitFork className="h-3.5 w-3.5" aria-hidden /> {repo.forks}
                  </span>
                </div>
              </Card>
            </a>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
