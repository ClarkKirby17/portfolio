import { useEffect } from 'react';

interface SeoProps {
  title: string;
  description: string;
  /** Path only, e.g. "/projects". Combined with the site origin. */
  path?: string;
  image?: string;
}

/** Create the tag if it does not exist yet, then set its content. */
function setMeta(selector: string, attribute: 'name' | 'property', key: string, content: string) {
  let tag = document.head.querySelector<HTMLMetaElement>(selector);
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute(attribute, key);
    document.head.appendChild(tag);
  }
  tag.setAttribute('content', content);
}

/**
 * Per-route document head. A dedicated helmet library would work too, but for
 * five routes and four tags this is 40 lines instead of a dependency, and it
 * avoids the React 19 peer-dependency friction those libraries currently have.
 *
 * Note: this runs client-side. For crawlers that do not execute JavaScript,
 * `index.html` carries a complete default set of tags. See the README section
 * on prerendering if the site ever needs true per-route SSR metadata.
 */
export function Seo({ title, description, path = '/', image }: SeoProps) {
  useEffect(() => {
    const fullTitle = title;
    const url = `${window.location.origin}${path}`;

    document.title = fullTitle;

    setMeta('meta[name="description"]', 'name', 'description', description);
    setMeta('meta[property="og:title"]', 'property', 'og:title', fullTitle);
    setMeta('meta[property="og:description"]', 'property', 'og:description', description);
    setMeta('meta[property="og:url"]', 'property', 'og:url', url);
    setMeta('meta[name="twitter:title"]', 'name', 'twitter:title', fullTitle);
    setMeta('meta[name="twitter:description"]', 'name', 'twitter:description', description);

    if (image) {
      setMeta('meta[property="og:image"]', 'property', 'og:image', `${window.location.origin}${image}`);
    }

    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = url;
  }, [title, description, path, image]);

  return null;
}
