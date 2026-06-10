import { Outlet, useLocation } from 'react-router-dom';
import { TopNavbar } from './components/TopNavbar';

export function Layout() {
  const location = useLocation();
  const isFantasy = location.pathname === '/fantasy';

  return (
    <div className={`min-h-screen pt-24 pb-12 px-4 sm:px-6 mx-auto selection:bg-white/20 ${isFantasy ? 'max-w-[1800px]' : 'max-w-7xl'}`}>
      <TopNavbar />
      
      <main className="animate-in fade-in zoom-in-95 duration-500">
        {/* <Outlet /> is where React Router injects the current page (Home, Standings, etc.) */}
        <Outlet />
      </main>
    </div>
  );
}