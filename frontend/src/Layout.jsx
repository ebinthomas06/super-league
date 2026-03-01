import { useLeague } from './context/LeagueContext';
import { TopNavbar } from './components/TopNavbar';
import { Home } from './pages/Home';
import { Standings } from './pages/Standings';
import { Players } from './pages/Players';
import { Vault } from './pages/Vault';

export function Layout() {
  const { view } = useLeague();

  const renderView = () => {
    switch(view) {
      case 'home': return <Home />;
      case 'standings': return <Standings />;
      case 'players': return <Players />;
      case 'vault': return <Vault />;
      default:
        return (
          <div className="flex-1 flex items-center justify-center min-h-[50vh]">
            <h2 className="text-2xl text-zinc-500 tracking-widest uppercase">{view} - Coming Soon</h2>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 max-w-7xl mx-auto selection:bg-white/20">
      <TopNavbar />
      <main className="animate-in fade-in zoom-in-95 duration-500">
        {renderView()}
      </main>
    </div>
  );
}
