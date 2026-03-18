import { useState, useMemo } from 'react';
import { useLeague } from '../context/LeagueContext';
import { useApi } from '../hooks/useApi';
import { ArrowLeft, Shield } from 'lucide-react';

export function Teams() {
  const { division } = useLeague();
  const [selectedTeam, setSelectedTeam] = useState(null);

  const { data: standingsResp } = useApi('/standings');
  const standings = standingsResp?.data || [];

  // Extract unique teams from standings
  const teams = useMemo(() => {
    return standings.map(s => ({
      id: s.club,
      name: s.club,
    }));
  }, [standings]);

  // Local fallback players list for Phase 3 UI preview
  const data = { players: [
    { id: 1, name: 'Alex Vance', club: 'Neon Strikers FC', rating: 89, pace: 92, shooting: 88, passing: 85, imgUrl: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80' },
    { id: 2, name: 'Marcus Cole', club: 'Spartan FC', rating: 87, pace: 80, shooting: 91, passing: 82, imgUrl: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80' },
  ] };

  // Filter players for selected team
  const teamPlayers = useMemo(() => {
    if (!selectedTeam) return [];
    return data.players.filter(p => p.club === selectedTeam);
  }, [selectedTeam]);

  // Generate a mock team logo background gradient based on the club name
  const generateGradient = (name) => {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = Math.abs(hash % 360);
    return `linear-gradient(135deg, hsl(${hue}, 80%, 20%), hsl(${(hue + 40) % 360}, 60%, 10%))`;
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl sm:text-5xl font-black tracking-tighter uppercase">
          {selectedTeam ? selectedTeam : "Teams"} <span className="text-zinc-600">Overview</span>
        </h1>
        {selectedTeam && (
          <button
            onClick={() => setSelectedTeam(null)}
            className="flex items-center gap-2 px-4 py-2 border border-white/10 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
          >
            <ArrowLeft size={16} />
            <span className="hidden sm:inline">Back to Teams</span>
          </button>
        )}
      </div>

      {!selectedTeam ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {teams.map((team) => (
            <div
              key={team.id}
              onClick={() => setSelectedTeam(team.id)}
              className="group relative cursor-pointer overflow-hidden rounded-2xl border border-white/5 bg-white/5 transition-all duration-300 hover:border-white/20 hover:scale-[1.02]"
            >
              <div 
                className="absolute inset-0 opacity-20 group-hover:opacity-40 transition-opacity duration-300"
                style={{ background: generateGradient(team.name) }}
              />
              <div className="relative p-8 flex flex-col items-center justify-center text-center gap-4 h-48">
                <Shield className="w-12 h-12 text-white/80 group-hover:text-white transition-colors" />
                <h3 className="text-xl sm:text-2xl font-bold tracking-widest uppercase">{team.name}</h3>
                <p className="text-sm text-zinc-400"></p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {teamPlayers.length > 0 ? (
            teamPlayers.map((player) => (
              <div key={player.id} className="relative group overflow-hidden rounded-2xl bg-zinc-900 border border-white/10 active:scale-[0.98] transition-transform duration-200">
                <div className="aspect-[4/5] relative">
                  <img src={player.imgUrl} alt={player.name} className="w-full h-full object-cover md:grayscale md:opacity-70 md:group-hover:grayscale-0 md:group-hover:opacity-100 transition-all duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                </div>
                <div className="absolute bottom-0 w-full p-6 text-center">
                  <h3 className="text-2xl font-black uppercase mb-1">{player.name}</h3>
                  <p className="text-zinc-400 tracking-widest text-sm">{player.club}</p>
                  <div className="mt-4 flex justify-between px-4 py-2 bg-white/5 rounded-lg border border-white/10">
                    <div className="text-center">
                      <div className="text-xs text-zinc-500 uppercase">Pace</div>
                      <div className="font-mono text-zinc-300">{player.pace}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-zinc-500 uppercase">Shoot</div>
                      <div className="font-mono text-zinc-300">{player.shooting}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-zinc-500 uppercase">Pass</div>
                      <div className="font-mono text-zinc-300">{player.passing}</div>
                    </div>
                  </div>
                </div>
                <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20">
                  <span className="font-mono font-bold">{player.rating}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-12 text-center border border-white/5 bg-white/5 rounded-2xl">
              <Shield className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
              <p className="text-zinc-400">No players found for this team in mock data.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
