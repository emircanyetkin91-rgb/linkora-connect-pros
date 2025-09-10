import { NavLink, useLocation } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';

export function TopNav() {
  const location = useLocation();
  const isMobile = useIsMobile();

  // Don't show nav on welcome and application pages
  if (location.pathname === '/' || location.pathname === '/application') {
    return null;
  }

  // Hide on mobile - use bottom nav instead
  if (isMobile) {
    return (
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-14 items-center justify-center px-4">
          <h1 className="text-heading-medium text-primary">Nexa</h1>
        </div>
      </header>
    );
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <h1 className="text-heading-medium text-primary">Nexa</h1>
          </div>
        </div>
      </div>
    </nav>
  );
}