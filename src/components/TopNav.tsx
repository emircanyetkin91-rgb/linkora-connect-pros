import { NavLink, useLocation } from 'react-router-dom';
import { Search, Heart, MessageCircle, User, Settings } from 'lucide-react';

export function TopNav() {
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
    <nav className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <h1 className="text-heading-medium text-primary">Nexa</h1>
          </div>
          
          <div className="flex space-x-1">
            {navItems.map(({ to, icon: Icon, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `inline-flex items-center justify-center rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`
                }
              >
                <Icon className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">{label}</span>
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}