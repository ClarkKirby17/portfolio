import { useRef } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { Award, Briefcase, GraduationCap } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Reveal } from '@/components/ui/Reveal';
import { certificates, education, experience } from '@/data/resume';

/**
 * A real chronology, so the vertical rule and the numbering are earned.
 * The order carries information rather than decorating the list.
 * The rule fills as you scroll, which is the only "wow" moment on this page.
 */
export function Timeline() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.75', 'end 0.6'],
  });
  const scaleY = useSpring(scrollYProgress, { stiffness: 90, damping: 26, restDelta: 0.001 });

  return (
    <div ref={ref} className="relative pl-8 sm:pl-12">
      {/* Track + fill */}
      <div className="absolute bottom-0 left-[11px] top-2 w-px bg-fog-50/[0.08] sm:left-[19px]" aria-hidden />
      <motion.div
        aria-hidden
        style={{ scaleY }}
        className="absolute bottom-0 left-[11px] top-2 w-px origin-top bg-gradient-to-b from-accent-bright to-accent sm:left-[19px]"
      />

      <ol className="flex flex-col gap-12">
        {experience.map((item) => (
          <li key={`${item.organisation}-${item.period}`} className="relative">
            <Node Icon={Briefcase} />
            <Reveal>
              <Card className="p-6 sm:p-8">
                <div className="flex flex-wrap items-baseline justify-between gap-3">
                  <div>
                    <h3 className="text-xl font-medium text-fog-50">{item.role}</h3>
                    <p className="mt-1 text-fog-300">{item.organisation}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-mono text-xs tracking-wider text-accent-bright">
                      {item.period}
                    </p>
                    <p className="mt-1 text-xs text-fog-500">{item.location}</p>
                  </div>
                </div>

                <ul className="mt-6 flex flex-col gap-3">
                  {item.achievements.map((achievement) => (
                    <li key={achievement} className="flex gap-3 text-sm leading-relaxed text-fog-300">
                      <span
                        className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent-bright"
                        aria-hidden
                      />
                      {achievement}
                    </li>
                  ))}
                </ul>

                <ul className="mt-6 flex flex-wrap gap-1.5">
                  {item.stack.map((tool) => (
                    <li key={tool}>
                      <Badge size="sm" variant="muted">
                        {tool}
                      </Badge>
                    </li>
                  ))}
                </ul>
              </Card>
            </Reveal>
          </li>
        ))}

        {education.map((item) => (
          <li key={item.qualification} className="relative">
            <Node Icon={GraduationCap} />
            <Reveal>
              <Card className="p-6 sm:p-8">
                <div className="flex flex-wrap items-baseline justify-between gap-3">
                  <div>
                    <h3 className="text-xl font-medium text-fog-50">{item.qualification}</h3>
                    <p className="mt-1 text-fog-300">{item.institution}</p>
                  </div>
                  <p className="font-mono text-xs tracking-wider text-accent-bright">
                    {item.period}
                  </p>
                </div>
                <p className="mt-5 text-sm leading-relaxed text-fog-300">{item.detail}</p>
              </Card>
            </Reveal>
          </li>
        ))}

        <li className="relative">
          <Node Icon={Award} />
          <Reveal>
            <Card className="p-6 sm:p-8">
              <h3 className="text-xl font-medium text-fog-50">Certifications</h3>
              <ul className="mt-6 flex flex-col divide-y divide-fog-50/[0.07]">
                {certificates.map((cert) => (
                  <li
                    key={cert.name}
                    className="flex flex-wrap items-baseline justify-between gap-2 py-3 first:pt-0 last:pb-0"
                  >
                    <span className="text-sm text-fog-50">{cert.name}</span>
                    <span className="font-mono text-xs text-fog-500">
                      {cert.issuer} · {cert.year}
                    </span>
                  </li>
                ))}
              </ul>
            </Card>
          </Reveal>
        </li>
      </ol>
    </div>
  );
}

function Node({ Icon }: { Icon: typeof Briefcase }) {
  return (
    <span
      aria-hidden
      className="absolute -left-8 top-6 grid h-6 w-6 place-items-center rounded-full border border-accent/30 bg-ink-900 text-accent-bright sm:-left-12 sm:h-10 sm:w-10"
    >
      <Icon className="h-3 w-3 sm:h-4 sm:w-4" />
    </span>
  );
}
