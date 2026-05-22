import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export type CtaLocation =
  | 'hero'
  | 'header'
  | 'fullscreen_menu'
  | 'cta_section'
  | 'footer'
  | 'portfolio_card';

interface TrackCtaOptions {
  location: CtaLocation;
  label?: string;
}

/**
 * Analytics hook for tracking CTA clicks.
 * Sends to Supabase (own backend) and GA4 (if gtag is present).
 */
export function useAnalytics() {
  const trackCtaClick = useCallback(
    async ({ location, label }: TrackCtaOptions) => {
      const pagePath = typeof window !== 'undefined' ? window.location.pathname : '/';

      // 1. Send to GA4 (if available)
      try {
        const gtag = (window as unknown as Record<string, unknown>).gtag as
          | ((...args: unknown[]) => void)
          | undefined;
        if (typeof gtag === 'function') {
          gtag('event', 'cta_click', {
            cta_location: location,
            cta_label: label ?? location,
            page_path: pagePath,
          });
        }
      } catch {
        // GA4 not available — silently ignore
      }

      // 2. Send to own backend (Supabase)
      try {
        await supabase.from('analytics_events').insert({
          event_type: 'cta_click',
          cta_location: location,
          page_path: pagePath,
          user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : null,
        });
      } catch {
        // Backend unavailable — silently ignore
      }
    },
    []
  );

  return { trackCtaClick };
}
