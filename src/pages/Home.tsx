import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Seo } from '@/components/seo/Seo';
import { Hero } from '@/components/home/Hero';
import { Stats } from '@/components/home/Stats';
import { Skills } from '@/components/home/Skills';
import { GitHubSection } from '@/components/github/GitHubSection';
import { ProjectCarousel } from '@/components/projects/ProjectCarousel';
import { Section, SectionHeading } from '@/components/ui/Section';
import { Reveal } from '@/components/ui/Reveal';
import { Button } from '@/components/ui/Button';
import { featuredProjects } from '@/data/projects';
import { profile } from '@/data/profile';

export default function Home() {
  return (
    <>
      <Seo
        title="Clark Kirby Normor | Junior Full Stack Developer"
        description={profile.shortBio}
        path="/"
      />

      <Hero />
      <Stats />

      {/* About preview, short by design. The full version has its own page. */}
      <Section width="narrow">
        <Reveal>
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-accent/60" aria-hidden />
              <span className="eyebrow">Who I am</span>
            </div>

            <p className="font-display text-2xl leading-[1.35] text-fog-50 sm:text-3xl">
              I spent a year manually re-typing records that software should have handled. That job
              is the reason I write code.
            </p>

            <p className="text-base leading-relaxed text-fog-300">
              Since then I have built four projects end to end: a health misinformation checker, a
              networking learning platform, an AR history app, and a recipe site. Every one
              started with someone stuck on a problem. I care about the unglamorous parts: the query
              that got slow, the error state nobody designed, the input a real person actually
              typed.
            </p>

            <Button asChild variant="ghost" size="sm" className="w-fit px-0 hover:bg-transparent">
              <Link to="/about" className="text-accent-bright hover:text-fog-50">
                More about how I work
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </Reveal>
      </Section>

      <Skills />

      <Section id="work" width="wide">
        <SectionHeading
          eyebrow="Selected work"
          title="Four projects, start to finish"
          description="Swipe or use the arrows. Each one opens a full case study: the problem, what I built, what broke, and what I would do differently."
        />

        <Reveal>
          <ProjectCarousel projects={featuredProjects} />
        </Reveal>

        <div className="mt-12 flex justify-center">
          <Button asChild variant="secondary" size="lg">
            <Link to="/projects">
              Browse all projects
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>
          </Button>
        </div>
      </Section>

      <GitHubSection />

      {/* Closing call to action */}
      <Section width="narrow" className="pb-32">
        <Reveal>
          <div className="glass flex flex-col items-center gap-6 rounded-[2rem] px-8 py-14 text-center">
            <span className="eyebrow">{profile.availability}</span>
            <h2 className="font-display text-4xl leading-tight tracking-tight text-fog-50 sm:text-5xl">
              Let&apos;s talk about
              <br />
              <span className="text-gradient">what you&apos;re building</span>
            </h2>
            <p className="max-w-md text-fog-300">
              Junior roles, internships, or a question about something on this site. All welcome.
            </p>
            <div className="flex flex-wrap justify-center gap-3 pt-2">
              <Button asChild size="lg">
                <Link to="/contact">
                  Get in touch
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                </Link>
              </Button>
              <Button asChild variant="secondary" size="lg">
                <a href={profile.links.resume} download>
                  Download resume
                </a>
              </Button>
            </div>
          </div>
        </Reveal>
      </Section>
    </>
  );
}
