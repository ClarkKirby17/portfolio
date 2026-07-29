import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Download, Github, Linkedin } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { profile } from '@/data/profile';
import { EASE_SMOOTH } from '@/lib/utils';

/**
 * The hero's thesis: the name is the largest thing on the page, set in a
 * serif that appears nowhere else at this size, against an otherwise
 * technical sans/mono system. The contrast is the identity.
 */

/**
 * Entrance timing is deliberately tight.
 *
 * An element animating from opacity 0 does not count as a Largest Contentful
 * Paint candidate until it actually paints, so a long staggered hero delays
 * the headline and Chrome scores the page on whatever painted first. The
 * sequence still reads as choreographed; it just does not cost half a second
 * of the metric that matters most on this page.
 */
const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.04 } },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE_SMOOTH } },
};

export function Hero() {
  return (
    <section className="relative mx-auto max-w-6xl px-5 pb-16 pt-16 sm:px-8 md:pb-24 md:pt-24">
      <motion.div
        variants={container}
        initial="hidden"
        animate="visible"
        className="grid items-center gap-14 lg:grid-cols-[1.35fr_1fr] lg:gap-20"
      >
        {/* Copy */}
        <div className="flex flex-col gap-7">
          <motion.div variants={item} className="flex items-center gap-3">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-bright opacity-60 [animation-duration:2.6s]" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent-bright" />
            </span>
            <span className="eyebrow text-fog-300">{profile.availability}</span>
          </motion.div>

          <motion.div variants={item} className="flex flex-col gap-3">
            <p className="font-mono text-sm text-fog-500">
              Hello, I&apos;m
              <span className="ml-1 inline-block h-4 w-[1.5px] translate-y-0.5 animate-caret bg-accent-bright" />
            </p>

            <h1 className="font-display text-[clamp(3rem,9vw,5.75rem)] leading-[0.95] tracking-[-0.02em] text-fog-50">
              Clark Kirby
              <br />
              <span className="text-gradient">Normor</span>
            </h1>
          </motion.div>

          <motion.div variants={item} className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <span className="text-lg text-fog-50 sm:text-xl">{profile.role}</span>
            <span className="h-1 w-1 rounded-full bg-fog-500" aria-hidden />
            <span className="text-lg text-fog-300 sm:text-xl">{profile.secondaryRole}</span>
          </motion.div>

          <motion.p
            variants={item}
            className="max-w-xl text-base leading-relaxed text-fog-300 sm:text-lg"
          >
            {profile.intro}
          </motion.p>

          <motion.div variants={item} className="flex flex-wrap items-center gap-3 pt-2">
            <Button asChild size="lg">
              <Link to="/projects">
                View projects
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
              </Link>
            </Button>

            <Button asChild variant="secondary" size="lg">
              <a href={profile.links.resume} download>
                <Download className="h-4 w-4" />
                Resume
              </a>
            </Button>

            <div className="flex items-center gap-2">
              {[
                { href: profile.links.github, Icon: Github, label: 'GitHub' },
                { href: profile.links.linkedin, Icon: Linkedin, label: 'LinkedIn' },
              ].map(({ href, Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="glass grid h-13 w-13 place-items-center rounded-full text-fog-300 transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/30 hover:text-accent-bright"
                >
                  <Icon className="h-[18px] w-[18px]" />
                </a>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Portrait.
            Replace /portrait.jpg with a real photo. The frame is deliberately
            plain: one rounded rectangle, one soft glow, no floating badges. */}
        <motion.div
          variants={item}
          className="relative mx-auto w-full max-w-sm lg:mx-0 lg:max-w-none"
        >
          <div
            aria-hidden
            className="absolute -inset-6 rounded-[2.5rem] blur-3xl"
            style={{ background: 'radial-gradient(circle, rgba(4,139,69,0.22), transparent 70%)' }}
          />

          <div className="glass relative aspect-[4/5] overflow-hidden rounded-[2rem]">
            {/* Monogram sits underneath and shows through until a real photo
                is dropped at /public/portrait.jpg. */}
            <div className="absolute inset-0 grid place-items-center bg-ink-850">
              <span className="font-display text-7xl text-fog-500/40">CN</span>
            </div>

            <img
              src="/portrait.png"
              alt={`Portrait of ${profile.name}`}
              width={640}
              height={800}
              loading="eager"
              className="relative h-full w-full object-cover"
              onError={(event) => {
                event.currentTarget.style.display = 'none';
              }}
            />

            <div
              aria-hidden
              className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-ink-950/80 to-transparent"
            />

            <div className="absolute inset-x-0 bottom-0 flex items-center justify-between px-5 py-4">
              <span className="font-mono text-[0.6875rem] tracking-widest text-fog-300 uppercase">
                Metro Manila
              </span>
              <span className="font-mono text-[0.6875rem] tracking-widest text-accent-bright uppercase">
                IT · 2027
              </span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
