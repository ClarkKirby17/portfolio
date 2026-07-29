import { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Project } from '@/types';
import { ProjectCard } from './ProjectCard';
import { cn } from '@/lib/utils';
import { usePrefersReducedMotion } from '@/hooks/useMediaQuery';

/**
 * Featured work as a slider instead of a stack.
 *
 * Built on native scroll-snap rather than a transform carousel, which buys
 * three things for free: touch swiping, momentum scrolling, and correct
 * behaviour when a keyboard user tabs to a link inside an off-screen card
 * (the browser scrolls it into view). A transform carousel has to reimplement
 * all three, usually badly.
 *
 * Cards per view: 1 on phones, 2 on tablets, 3 on desktop. Widths come from
 * flex-basis rather than JavaScript, so the layout is correct before any
 * script runs and never flashes at the wrong size.
 */
export function ProjectCarousel({ projects }: { projects: Project[] }) {
  const scroller = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [steps, setSteps] = useState(0);
  const reducedMotion = usePrefersReducedMotion();

  /**
   * One card plus one gap: the distance a single arrow press should travel.
   *
   * Cached in a ref rather than measured on demand. getComputedStyle and
   * offsetWidth both force the browser to flush pending layout, so calling
   * them inside a scroll handler triggers a synchronous reflow on every
   * frame of every swipe. Measuring once per resize costs nothing.
   */
  const stepRef = useRef(0);

  const measure = useCallback(() => {
    const element = scroller.current;
    if (!element) return;

    const first = element.firstElementChild as HTMLElement | null;
    const gap = Number.parseFloat(getComputedStyle(element).columnGap) || 0;
    stepRef.current = first ? first.offsetWidth + gap : element.clientWidth || 1;

    const overflow = element.scrollWidth - element.clientWidth;
    setSteps(overflow > 1 ? Math.ceil(overflow / stepRef.current) : 0);
    setActive(Math.round(element.scrollLeft / stepRef.current));
  }, []);

  const goTo = useCallback(
    (target: number) => {
      const element = scroller.current;
      if (!element) return;
      element.scrollTo({
        left: Math.max(0, target) * (stepRef.current || element.clientWidth),
        behavior: reducedMotion ? 'auto' : 'smooth',
      });
    },
    [reducedMotion],
  );

  useEffect(() => {
    const element = scroller.current;
    if (!element) return;

    measure();

    // Derive the active card from scroll position rather than tracking it
    // separately, so swiping, arrows and dots can never disagree. Reads only
    // the cached step, so this stays free of layout work.
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const step = stepRef.current || element.clientWidth || 1;
        setActive(Math.round(element.scrollLeft / step));
      });
    };

    const observer = new ResizeObserver(measure);
    observer.observe(element);
    element.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      observer.disconnect();
      element.removeEventListener('scroll', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [measure, projects.length]);

  const atStart = active <= 0;
  const atEnd = active >= steps;

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label="Featured projects"
      className="relative"
      onKeyDown={(event) => {
        if (event.key === 'ArrowRight') {
          event.preventDefault();
          goTo(active + 1);
        }
        if (event.key === 'ArrowLeft') {
          event.preventDefault();
          goTo(active - 1);
        }
      }}
    >
      {/* Track. The negative margin plus padding lets the hover lift and glow
          spill past the container edge without being clipped by overflow. */}
      <div
        ref={scroller}
        className="no-scrollbar -mx-2 flex snap-x snap-mandatory gap-5 overflow-x-auto overscroll-x-contain px-2 py-3"
      >
        {projects.map((project, index) => (
          <div
            key={project.slug}
            role="group"
            aria-roledescription="slide"
            aria-label={`${index + 1} of ${projects.length}: ${project.name}`}
            className="w-[85%] shrink-0 snap-start sm:w-[calc((100%-1.25rem)/2)] xl:w-[calc((100%-2.5rem)/3)]"
          >
            <ProjectCard project={project} />
          </div>
        ))}
      </div>

      {/* Side arrows, hidden on touch-sized screens where swiping is the
          natural gesture and an overlay button would just cover content. */}
      <Arrow
        direction="previous"
        onClick={() => goTo(active - 1)}
        disabled={atStart}
        className="-left-4"
      />
      <Arrow
        direction="next"
        onClick={() => goTo(active + 1)}
        disabled={atEnd}
        className="-right-4"
      />

      {/* Dots, one per scroll position rather than one per card, so they stop
          when the track stops instead of pointing at unreachable positions. */}
      {steps > 0 && (
        <div className="mt-8 flex items-center justify-center gap-2">
          {Array.from({ length: steps + 1 }, (_, index) => {
            const current = index === active;
            return (
              <button
                key={index}
                type="button"
                onClick={() => goTo(index)}
                aria-label={`Go to position ${index + 1} of ${steps + 1}`}
                aria-current={current}
                className="group grid h-8 place-items-center px-1"
              >
                <span
                  className={cn(
                    'block h-1.5 rounded-full transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]',
                    current ? 'w-7 bg-accent-bright' : 'w-1.5 bg-fog-50/20 group-hover:bg-fog-50/40',
                  )}
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function Arrow({
  direction,
  onClick,
  disabled,
  className,
}: {
  direction: 'previous' | 'next';
  onClick: () => void;
  disabled: boolean;
  className?: string;
}) {
  const Icon = direction === 'previous' ? ChevronLeft : ChevronRight;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={`${direction === 'previous' ? 'Previous' : 'Next'} projects`}
      className={cn(
        'glass-strong absolute top-[38%] z-10 hidden h-11 w-11 -translate-y-1/2 place-items-center rounded-full',
        'text-fog-300 transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]',
        'hover:border-accent/30 hover:text-accent-bright',
        'disabled:pointer-events-none disabled:opacity-0',
        'lg:grid',
        className,
      )}
    >
      <Icon className="h-5 w-5" />
    </button>
  );
}
