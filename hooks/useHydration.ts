import { useState, useEffect } from 'react';

/**
 * Hook to prevent hydration mismatches by ensuring client-side only rendering
 * @returns boolean indicating if the component has been hydrated
 */
export function useHydration() {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  return isHydrated;
}

/**
 * Hook to safely access client-side APIs like window, localStorage, etc.
 * @returns boolean indicating if it's safe to access client-side APIs
 */
export function useClientSide() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient;
}
