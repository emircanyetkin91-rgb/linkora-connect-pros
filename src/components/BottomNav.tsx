import { NavLink, useLocation } from 'react-router-dom';
import { Search, Heart, MessageCircle, User, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

export function BottomNav() {
  const location = useLocation();
  
  const navItems = [
    { to: '/explore', icon: Search, label: 'Explore' },
    { to: '/home', icon: Heart, label: 'Swipe' },
    { to: '/chat', icon: MessageCircle, label: 'Matches' },
    { to: '/profile', icon: User, label: 'Profile' },
    { to: '/settings', icon: Settings, label: 'Settings' },
  ];

  // Don't show nav on welcome and application pages
  if (location.pathname === '/' || location.pathname === '/application') {
    return null;
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 pb-safe-area-inset-bottom">
      <div className="flex h-16 items-center justify-around px-2">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                "flex flex-col items-center justify-center min-w-[48px] min-h-[48px] rounded-lg transition-all duration-200 flex-1 max-w-[80px]",
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground'
              )
            }
          >
            <Icon className="h-5 w-5 mb-1" />
            <span className="text-xs font-medium">{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}