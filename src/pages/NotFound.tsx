import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Seo } from '@/components/seo/Seo';
import { Button } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <>
      <Seo
        title="Page not found | Clark Kirby Normor"
        description="That page does not exist."
        path="/404"
      />

      <div className="mx-auto flex min-h-[70vh] max-w-2xl flex-col items-center justify-center gap-6 px-5 text-center">
        <p className="font-mono text-sm tracking-widest text-accent-bright">404</p>

        <h1 className="font-display text-5xl leading-tight tracking-tight text-fog-50 sm:text-6xl">
          Nothing lives here
        </h1>

        <p className="max-w-md text-fog-300">
          The link is broken or the page moved. The projects are the reason you came, so start
          there.
        </p>

        <div className="flex flex-wrap justify-center gap-3 pt-2">
          <Button asChild>
            <Link to="/projects">
              View projects
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>
          </Button>
          <Button asChild variant="secondary">
            <Link to="/">Back home</Link>
          </Button>
        </div>
      </div>
    </>
  );
}
