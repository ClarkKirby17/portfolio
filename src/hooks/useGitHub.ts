import { useEffect, useState } from 'react';
import { profile } from '@/data/profile';

export interface ContributionDay {
  date: string;
  count: number;
  /** 0–4, matching GitHub's own intensity buckets. */
  level: number;
}

interface ContributionsState {
  days: ContributionDay[];
  total: number;
  status: 'idle' | 'loading' | 'ready' | 'unavailable';
}

/**
 * Live contribution data from a public, unauthenticated proxy of GitHub's
 * contributions graph.
 *
 * Deliberate decision: if the request fails, the section renders an honest
 * empty state and links to the real profile. It never falls back to generated
 * squares: a recruiter who cross-checks a fabricated graph has learned
 * something about the candidate that no amount of design can undo.
 */
export function useGitHubContributions(year: number = new Date().getFullYear()) {
  const [state, setState] = useState<ContributionsState>({
    days: [],
    total: 0,
    status: 'idle',
  });

  useEffect(() => {
    const controller = new AbortController();
    setState((previous) => ({ ...previous, status: 'loading' }));

    fetch(
      `https://github-contributions-api.jogruber.de/v4/${profile.githubUsername}?y=${year}`,
      { signal: controller.signal },
    )
      .then((response) => {
        if (!response.ok) throw new Error(String(response.status));
        return response.json() as Promise<{
          total: Record<string, number>;
          contributions: ContributionDay[];
        }>;
      })
      .then((data) => {
        setState({
          days: data.contributions ?? [],
          total: data.total?.[String(year)] ?? 0,
          status: 'ready',
        });
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === 'AbortError') return;
        setState({ days: [], total: 0, status: 'unavailable' });
      });

    return () => controller.abort();
  }, [year]);

  return state;
}
