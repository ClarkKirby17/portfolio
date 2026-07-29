import { useRef } from 'react';
import { useInView } from 'framer-motion';
import { profile } from '@/data/profile';
import { useCountUp } from '@/hooks/useCountUp';

function Stat({
  value,
  suffix,
  label,
  raw,
  active,
}: {
  value: number;
  suffix: string;
  label: string;
  raw?: boolean;
  active: boolean;
}) {
  // A year counting up from zero looks like a bug, so `raw` opts out.
  const animated = useCountUp(value, { active: active && !raw });
  const display = raw ? value : animated;

  return (
    <div className="flex flex-col gap-1.5">
      <span className="font-display text-4xl tracking-tight text-fog-50 sm:text-5xl">
        {display}
        <span className="text-accent-bright">{suffix}</span>
      </span>
      <span className="text-sm leading-snug text-fog-500">{label}</span>
    </div>
  );
}

export function Stats() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <div ref={ref} className="mx-auto max-w-6xl px-5 sm:px-8">
      <div className="rule-fade" />
      <div className="grid grid-cols-2 gap-8 py-12 sm:gap-6 md:grid-cols-4">
        {profile.stats.map((stat) => (
          <Stat
            key={stat.label}
            value={stat.value}
            suffix={stat.suffix}
            label={stat.label}
            raw={'raw' in stat ? stat.raw : false}
            active={inView}
          />
        ))}
      </div>
      <div className="rule-fade" />
    </div>
  );
}
