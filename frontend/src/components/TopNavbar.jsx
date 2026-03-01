import { useState } from 'react';
import { Menu, X, User } from 'lucide-react';
import { useLeague } from '../context/LeagueContext';
import { cn } from '../utils/cn';

export function TopNavbar() {
  const { division, setDivision, view, setView } = useLeague();
  const [menuOpen, setMenuOpen] = useState(false);

  const views = [
    { id: 'home', label: 'Home' },
    { id: 'matches', label: 'Matches' },
    { id: 'standings', label: 'Standings' },
    { id: 'players', label: 'Players' },
    { id: 'vault', label: 'Onion Newsletter' },
    { id: 'legends', label: 'Legends' },
    { id: 'rules', label: 'Rules' }
  ];

  const handleNav = (v) => {
    setView(v);
    setMenuOpen(false);
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 h-16 bg-black/40 backdrop-blur-xl border-b border-white/10 flex items-center justify-between px-4 sm:px-6">
        {/* Left: Logo */}
        <div 
          className="text-lg sm:text-xl font-bold text-white tracking-widest cursor-pointer whitespace-nowrap"
          onClick={() => setView('home')}
        >
          SUPER LEAGUE
        </div>

        {/* Center: Division Toggle */}
        <div className="absolute left-1/2 -translate-x-1/2 flex items-center bg-white/5 p-1 rounded-full border border-white/10 hidden sm:flex">
          <button
            onClick={() => setDivision('mens')}
            className={cn(
              "px-4 py-1.5 rounded-full text-sm font-medium transition-colors duration-300 w-24",
              division === 'mens' ? "bg-white text-black drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]" : "text-zinc-400 hover:text-white"
            )}
          >
            Men's
          </button>
          <button
            onClick={() => setDivision('womens')}
            className={cn(
              "px-4 py-1.5 rounded-full text-sm font-medium transition-colors duration-300 w-24",
              division === 'womens' ? "bg-white text-black drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]" : "text-zinc-400 hover:text-white"
            )}
          >
            Women's
          </button>
        </div>

        {/* Right: Login & Hamburger */}
        <div className="flex items-center gap-4">
          <button className="hidden md:flex items-center gap-2 px-4 py-1.5 border border-white/20 rounded-full text-sm font-medium hover:bg-white/5 transition-colors">
            <User size={16} />
            <span>Login</span>
          </button>
          <button 
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 text-white hover:bg-white/10 rounded-full transition-colors relative z-50"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Dropdown Menu Overlay */}
      <div className={cn(
        "fixed inset-0 z-40 bg-black/90 backdrop-blur-xl transition-opacity duration-300 flex flex-col pt-24 pb-8 px-6",
        menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      )}>
        {/* Mobile top division toggle (visible only on small screens inside menu) */}
        <div className="flex sm:hidden items-center justify-center bg-white/5 p-1 rounded-full border border-white/10 mb-8 w-fit mx-auto">
          <button
            onClick={() => setDivision('mens')}
            className={cn(
              "px-4 py-1.5 rounded-full text-sm font-medium transition-colors duration-300",
              division === 'mens' ? "bg-white text-black" : "text-zinc-400 hover:text-white"
            )}
          >
            Men's
          </button>
          <button
            onClick={() => setDivision('womens')}
            className={cn(
              "px-4 py-1.5 rounded-full text-sm font-medium transition-colors duration-300",
              division === 'womens' ? "bg-white text-black" : "text-zinc-400 hover:text-white"
            )}
          >
            Women's
          </button>
        </div>

        <div className="flex flex-col items-center justify-center flex-1 gap-6 sm:gap-8">
          {views.map(v => (
            <button
              key={v.id}
              onClick={() => handleNav(v.id)}
              className={cn(
                "text-2xl sm:text-4xl font-bold tracking-widest transition-all duration-300 hover:scale-110",
                view === v.id ? "text-white" : "text-zinc-600 hover:text-white"
              )}
            >
              {v.label.toUpperCase()}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
