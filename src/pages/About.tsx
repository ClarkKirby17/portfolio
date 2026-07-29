import { Link } from 'react-router-dom';
import { ArrowRight, Compass, MessageSquare, Puzzle, Repeat } from 'lucide-react';
import { Seo } from '@/components/seo/Seo';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Reveal } from '@/components/ui/Reveal';
import { Section, SectionHeading } from '@/components/ui/Section';
import { profile } from '@/data/profile';

/** Four working principles, each tied to a real project decision. */
const principles = [
  {
    Icon: Puzzle,
    title: 'Start with the stuck person',
    body: 'Every project here began with someone blocked: a student failing a practical, a cook with half an ingredient list, a reader who could not tell whether a health claim was nonsense. The feature list comes after that, never before.',
  },
  {
    Icon: Compass,
    title: 'Design the failure states',
    body: 'The screens that decide whether people trust software are the empty one, the error one, and the "we are not sure" one. In LumenFact, redesigning the insufficient-evidence state turned the weakest screen into the most trusted one.',
  },
  {
    Icon: Repeat,
    title: 'Fix causes, not symptoms',
    body: 'When Eatsy could not match "tomato" to "tomatoes", the tempting fix was a bigger list of special cases. The real fix was normalising ingredients once, at the boundary, so every downstream feature stopped caring.',
  },
  {
    Icon: MessageSquare,
    title: 'Write it down',
    body: 'Case studies, README files, handover notes. If I cannot explain a decision plainly, I usually do not understand it yet, and the person maintaining it next definitely will not.',
  },
];

export default function About() {
  return (
    <>
      <Seo
        title="About | Clark Kirby Normor"
        description={profile.shortBio}
        path="/about"
      />

      <Section width="narrow">
        <SectionHeading
          eyebrow="About"
          title="How I got here, briefly"
        />

        <div className="flex flex-col gap-6 text-base leading-relaxed text-fog-300">
          <Reveal>
            <p className="font-display text-2xl leading-[1.35] text-fog-50 sm:text-[1.75rem]">
              I became a developer in a job that had nothing to do with development.
            </p>
          </Reveal>

          <Reveal delay={0.05}>
            <p>
              At a car rental company in 2022 I spent a year moving booking records between
              spreadsheets by hand. Vehicles got double-booked because two people typed the same
              plate slightly differently. I fixed it with validation rules and a rebuilt workbook,
              and it worked, but the whole time I was thinking that a piece of software should be
              doing this, and that somebody had to write it. That is when I started learning
              seriously.
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <p>
              Since then I have finished four projects end to end and I am three years into a Information Technology degree. I work across the stack because I like owning the whole path:
              the schema, the API, the interface, the deploy. Bugs are usually born at the
              seams between those layers. My most useful skill right now is not a framework: it is
              being willing to sit with something broken until I understand why, instead of moving
              the problem somewhere else.
            </p>
          </Reveal>

          <Reveal delay={0.15}>
            <p>
              I am looking for a junior or internship role on a team that reviews code seriously and
              lets me ship real things. I am comfortable being the least experienced person in the
              room; that is where the learning rate is highest.
            </p>
          </Reveal>
        </div>
      </Section>

      <Section width="default" className="pt-0">
        <SectionHeading
          eyebrow="How I work"
          title="Four things I keep coming back to"
        />

        <div className="grid gap-5 sm:grid-cols-2">
          {principles.map(({ Icon, title, body }, index) => (
            <Reveal key={title} delay={index * 0.06}>
              <Card interactive sheen className="h-full p-7">
                <span className="mb-5 grid h-10 w-10 place-items-center rounded-xl border border-accent/25 bg-accent/[0.08] text-accent-bright">
                  <Icon className="h-[18px] w-[18px]" />
                </span>
                <h3 className="mb-2.5 text-lg font-medium text-fog-50">{title}</h3>
                <p className="text-sm leading-relaxed text-fog-300">{body}</p>
              </Card>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <div className="mt-14 flex flex-wrap items-center gap-3">
            <Button asChild>
              <Link to="/projects">
                See the projects
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
              </Link>
            </Button>
            <Button asChild variant="secondary">
              <Link to="/experience">Experience &amp; education</Link>
            </Button>
          </div>
        </Reveal>
      </Section>
    </>
  );
}
