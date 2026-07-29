import { Quote } from 'lucide-react';
import { Seo } from '@/components/seo/Seo';
import { Card } from '@/components/ui/Card';
import { Reveal } from '@/components/ui/Reveal';
import { Section, SectionHeading } from '@/components/ui/Section';
import { Timeline } from '@/components/experience/Timeline';

/**
 * Testimonials are left empty on purpose until there are real ones.
 * An invented quote is the fastest way to lose a recruiter's trust, and the
 * honest placeholder reads better than three fabricated five-star reviews.
 */
export default function Experience() {
  return (
    <>
      <Seo
        title="Experience & Education | Clark Kirby Normor"
        description="Work history, Information Technology degree progress, and certifications including IT Specialist Python and Cybersecurity."
        path="/experience"
      />

      <Section>
        <SectionHeading
          eyebrow="Track record"
          title="Experience & education"
          description="Short, because I am early in my career. What is here is accurate and I can talk through every line of it."
        />

        <Timeline />
      </Section>

      <Section width="narrow" className="pt-0">
        <Reveal>
          <Card className="flex flex-col items-start gap-4 p-8">
            <Quote className="h-6 w-6 text-accent/50" aria-hidden />
            <p className="text-lg leading-relaxed text-fog-300">
              References from my supervisor at BNB Car Rental and from project advisers are
              available on request.
            </p>
            <p className="text-sm text-fog-500">
              
            </p>
          </Card>
        </Reveal>
      </Section>
    </>
  );
}
