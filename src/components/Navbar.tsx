import React, { useState } from 'react';
import { PageTab, StudentProfile } from '../types';
import { VertoRideLogo } from './VertoRideLogo';
import { UserAvatar } from './UserAvatar';
import { VertoPayWidget } from './VertoPayWidget';
import { 
  Car, 
  MapPin, 
  Radio, 
  Users, 
  CalendarCheck, 
  User, 
  PlusCircle, 
  Menu, 
  X, 
  ShieldCheck, 
  Search, 
  Navigation,
  LogOut
} from 'lucide-react';

interface NavbarProps {
  currentTab: PageTab;
  onSelectTab: (tab: PageTab) => void;
  onOpenCreateRide: () => void;
  activeRidesCount: number;
  myActiveBookingsCount: number;
  currentUser?: StudentProfile | null;
  onSignOut?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  onOpenCreateRide,
  activeRidesCount,
  myActiveBookingsCount,
  currentUser,
  onSignOut
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const getInitials = (name?: string) => {
    if (!name) return 'VT';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const navItemsRaw: { id: PageTab; label: string; icon: React.ReactNode; badge?: number; isLive?: boolean }[] = [
    { id: 'home', label: 'Dashboard', icon: <Car className="w-4 h-4" /> },
    { id: 'book', label: 'Find Rides', icon: <Search className="w-4 h-4" /> },
    { id: 'live', label: 'Auto Paths', icon: <Navigation className="w-4 h-4" />, badge: 5 },
    { id: 'find-students', label: 'Find Students', icon: <Users className="w-4 h-4" /> },
    { id: 'my-rides', label: 'My Rides', icon: <CalendarCheck className="w-4 h-4" />, badge: myActiveBookingsCount },
  ];

  const isDriver = currentUser?.accountType === 'driver';
  const isPassenger = !currentUser?.accountType || currentUser?.accountType === 'passenger';

  const navItems = navItemsRaw.filter(item => {
    if (isDriver && item.id === 'book') return false; // Drivers don't use old book tab
    if (isPassenger && item.id === 'find-students') return false; // Passengers don't need to find other students to give rides
    return true;
  });

  const handleNavClick = (tab: PageTab) => {
    onSelectTab(tab);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Top student advisory banner */}
      <div className="bg-gradient-to-r from-indigo-700 via-purple-700 to-indigo-800 text-white text-xs py-1.5 px-4 text-center font-medium flex items-center justify-center gap-2">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
        <span>Official Lovely Professional University Student Ride Pool • Verified LPU IDs only</span>
        <span className="hidden md:inline text-indigo-200">| Emergency Security: 01824-444444</span>
      </div>

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 w-full gap-2 sm:gap-4">
          
          {/* Brand Logo */}
          <div 
            onClick={() => handleNavClick('home')}
            className="cursor-pointer select-none group shrink-0"
            id="brand-logo-btn"
          >
            <VertoRideLogo size={38} showSubtitle={true} />
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-1 2xl:gap-1.5 shrink-0 mx-2">
            {navItems.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => handleNavClick(item.id)}
                  className={`relative flex items-center gap-1.5 px-3 py-1.5 2xl:px-3.5 2xl:py-2 rounded-lg text-xs 2xl:text-sm font-semibold transition-all cursor-pointer shrink-0 whitespace-nowrap ${
                    isActive
                      ? 'text-indigo-700 bg-indigo-50/90 border border-indigo-100/50 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }`}
                >
                  <span className={isActive ? 'text-indigo-600' : 'text-slate-500'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>

                  {item.isLive && (
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                  )}

                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="ml-1 text-[10px] 2xl:text-[11px] px-1.5 py-0.2 rounded-full font-bold bg-indigo-600 text-white">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action: VertoPay Widget, Create Ride Button & Profile */}
          <div className="hidden xl:flex items-center gap-2.5 2xl:gap-3 shrink-0 ml-auto">
            {/* VertoPay Topbar Widget with Balance & Recharge */}
            <VertoPayWidget variant="topbar-pill" />

            {isDriver && (
              <button
                id="header-create-ride-btn"
                onClick={onOpenCreateRide}
                className="flex items-center gap-1.5 2xl:gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs 2xl:text-sm font-bold px-3.5 2xl:px-4 py-2 rounded-xl transition-all shadow-md shadow-indigo-600/20 hover:shadow-indigo-600/30 cursor-pointer active:scale-98 shrink-0 whitespace-nowrap"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Create Ride</span>
              </button>
            )}

            {/* Quick Profile Pill & Sign Out */}
            <div className="flex items-center gap-1.5 pl-1 border-l border-slate-200/80">
              <button
                id="header-profile-quick-pill"
                onClick={() => handleNavClick('profile')}
                className="flex items-center gap-2 pl-1.5 pr-2.5 2xl:pl-2 2xl:pr-3 py-1.5 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-slate-50 transition-all cursor-pointer text-left shrink-0"
                title="View Student Profile"
              >
                <UserAvatar
                  name={currentUser?.name}
                  avatar={currentUser?.avatar}
                  size="sm"
                />
                <div className="hidden 2xl:block leading-tight">
                  <span className="text-xs font-bold text-slate-800 block truncate max-w-[110px]">
                    {currentUser?.name || 'Verto Student'}
                  </span>
                  <span className="text-[10px] text-emerald-600 font-semibold">
                    ★ {currentUser?.rating?.toFixed(1) || '5.0'} Verified
                  </span>
                </div>
              </button>

              {onSignOut && (
                <button
                  type="button"
                  id="header-signout-btn"
                  onClick={onSignOut}
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-colors cursor-pointer"
                  title="Sign Out of VERTORIDE"
                  aria-label="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Mobile & Tablet menu controls: VertoPay & Menu Toggle */}
          <div className="flex items-center gap-2 xl:hidden shrink-0 ml-auto">
            <VertoPayWidget variant="topbar-pill" />

            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 focus:outline-hidden transition-colors cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="xl:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3 shadow-lg animate-in slide-in-from-top-2">
          
          {/* Mobile VertoPay Widget */}
          <div className="pb-1">
            <VertoPayWidget variant="compact" />
          </div>

          {/* Quick Create / Offer Ride button in mobile menu */}
          <button
            id="mobile-drawer-create-ride-btn"
            onClick={() => {
              onOpenCreateRide();
              setIsMobileMenuOpen(false);
            }}
            className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white py-2.5 rounded-xl font-bold text-sm shadow-sm transition-colors cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create / Offer a Ride</span>
          </button>

          <div className="space-y-1 pt-1">
            {navItems.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`mobile-nav-link-${item.id}`}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'text-indigo-700 bg-indigo-50 font-bold'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={isActive ? 'text-indigo-600' : 'text-slate-500'}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {item.isLive && (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Live
                      </span>
                    )}
                    {item.badge !== undefined && item.badge > 0 && (
                      <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-indigo-600 text-white">
                        {item.badge}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="pt-2 mt-2 border-t border-slate-100">
            {currentUser && (
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => handleNavClick('profile')}
                  className="flex items-center gap-2.5 min-w-0 text-left hover:opacity-80 transition-opacity cursor-pointer"
                  title="View Profile"
                >
                  <UserAvatar
                    name={currentUser.name}
                    avatar={currentUser.avatar}
                    size="md"
                  />
                  <div className="min-w-0">
                    <span className="text-xs font-bold text-slate-900 block truncate">
                      {currentUser.name}
                    </span>
                    <span className="text-[10px] text-slate-500 block truncate">
                      {currentUser.regNumber} • {currentUser.blockOrHostel || 'Hostel'}
                    </span>
                  </div>
                </button>

                {onSignOut && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      onSignOut();
                    }}
                    className="p-2 rounded-xl text-rose-600 hover:bg-rose-100 bg-rose-50 border border-rose-200 text-xs font-bold shrink-0 flex items-center gap-1 cursor-pointer"
                    title="Sign Out"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Exit</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
