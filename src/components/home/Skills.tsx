import { LayoutGrid, Server, Terminal, Wrench } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Reveal } from '@/components/ui/Reveal';
import { Section, SectionHeading } from '@/components/ui/Section';
import { skillGroups } from '@/data/resume';

const icons = {
  layout: LayoutGrid,
  server: Server,
  terminal: Terminal,
  wrench: Wrench,
} as const;

/**
 * No progress bars. A bar claiming "React 85%" is a number nobody can defend
 * in an interview. The note under each heading says more.
 */
export function Skills() {
  return (
    <Section id="skills">
      <SectionHeading
        eyebrow="Toolkit"
        title="What I build with"
        description="Grouped by what I actually use each one for, rather than by how confident I feel on a given day."
      />

      <div className="grid gap-5 sm:grid-cols-2">
        {skillGroups.map((group, index) => {
          const Icon = icons[group.icon];
          return (
            <Reveal key={group.title} delay={index * 0.07}>
              <Card interactive sheen className="h-full p-6 sm:p-7">
                <div className="flex items-start gap-4">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-accent/25 bg-accent/[0.08] text-accent-bright">
                    <Icon className="h-[18px] w-[18px]" />
                  </span>
                  <div className="flex flex-col gap-1.5">
                    <h3 className="text-lg font-medium text-fog-50">{group.title}</h3>
                    <p className="text-sm leading-relaxed text-fog-500">{group.note}</p>
                  </div>
                </div>

                <ul className="mt-6 flex flex-wrap gap-2">
                  {group.skills.map((skill) => (
                    <li key={skill}>
                      <Badge>{skill}</Badge>
                    </li>
                  ))}
                </ul>
              </Card>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}
