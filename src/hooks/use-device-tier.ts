import { useEffect, useState } from 'react';

export type DeviceTier = 'light' | 'full';

/**
 * Detects whether the current device should run heavy effects (WebGL, complex scroll
 * animations) or a simplified "light" variant. Decision factors:
 * - viewport width < 768
 * - hardwareConcurrency < 4
 * - deviceMemory < 4
 * - prefers-reduced-motion: reduce
 * - effectiveType in ['slow-2g', '2g', '3g']
 */
export function useDeviceTier(): DeviceTier {
  const [tier, setTier] = useState<DeviceTier>(() => {
    if (typeof window === 'undefined') return 'full';
    return computeTier();
  });

  useEffect(() => {
    const onResize = () => setTier(computeTier());
    window.addEventListener('resize', onResize);

    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onMq = () => setTier(computeTier());
    mq.addEventListener?.('change', onMq);

    return () => {
      window.removeEventListener('resize', onResize);
      mq.removeEventListener?.('change', onMq);
    };
  }, []);

  return tier;
}

function computeTier(): DeviceTier {
  if (typeof window === 'undefined') return 'full';
  if (window.innerWidth < 768) return 'light';

  const nav = navigator as Navigator & {
    deviceMemory?: number;
    connection?: { effectiveType?: string; saveData?: boolean };
  };

  if (typeof nav.hardwareConcurrency === 'number' && nav.hardwareConcurrency < 4) return 'light';
  if (typeof nav.deviceMemory === 'number' && nav.deviceMemory < 4) return 'light';

  const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  if (reduced) return 'light';

  const conn = nav.connection;
  if (conn?.saveData) return 'light';
  if (conn?.effectiveType && ['slow-2g', '2g', '3g'].includes(conn.effectiveType)) return 'light';

  return 'full';
}
