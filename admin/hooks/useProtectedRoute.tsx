'use client';

import { useEffect, ComponentType } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from './useAuth';

export const useProtectedRoute = (): void => {
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace('/login');
    }
  }, [router]);
};

export const withProtectedRoute = <P extends object>(
  WrappedComponent: ComponentType<P>
): ComponentType<P> => {
  const WithProtectedRoute = (props: P) => {
    useProtectedRoute();
    return <WrappedComponent {...props} />;
  };

  const wrapped = WithProtectedRoute as ComponentType<P> & {
    displayName?: string;
    WrappedComponent?: ComponentType<P>;
  };

  wrapped.displayName = `withProtectedRoute(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;
  wrapped.WrappedComponent = WrappedComponent;

  return wrapped;
};

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  useProtectedRoute();
  return <>{children}</>;
}

export default useProtectedRoute;
