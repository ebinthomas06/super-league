import { useLeague } from '../context/LeagueContext';
import { mockData } from '../data/mockData';
import { PlayerCard } from '../components/PlayerCard';

export function Players() {
  const { division } = useLeague();
  const players = mockData[division].players;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between px-2 gap-4">
        <div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tighter uppercase">Player Database</h2>
          <p className="text-zinc-400 mt-1 font-medium">Scout the top talents across the league.</p>
        </div>
        
        <div className="flex gap-2">
          {/* Mock filters for aesthetic */}
          <select className="bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-zinc-300 outline-none focus:border-white/30 transition-colors">
            <option>All Positions</option>
            <option>Forwards</option>
            <option>Midfielders</option>
            <option>Defenders</option>
          </select>
          <select className="bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-zinc-300 outline-none focus:border-white/30 transition-colors">
            <option>Highest OVR</option>
            <option>Highest PAC</option>
            <option>Highest SHO</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {players.map(player => (
          <PlayerCard key={player.id} player={player} />
        ))}
      </div>
    </div>
  );
}
