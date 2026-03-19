import { useLeague } from '../context/LeagueContext';
import { useApi } from '../hooks/useApi';
import { GlassPanel } from '../components/GlassPanel';
import { cn } from '../utils/cn';
import { Loader2 } from 'lucide-react';

export function Leaderboard() {
  const { division } = useLeague();
  const { data: apiResponse, loading } = useApi('/leaderboard');
  
  const players = apiResponse?.data || [];

  const topScorers = [...players]
    .sort((a, b) => b.goalsScored - a.goalsScored)
    .map(p => ({ ...p, stat: p.goalsScored }));

  const topAssists = [...players]
    .sort((a, b) => (b.assists || 0) - (a.assists || 0))
    .map(p => ({ ...p, stat: p.assists || 0 }));

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-zinc-500 animate-pulse space-y-4">
        <Loader2 className="w-12 h-12 animate-spin text-white/20" />
        <span className="font-black tracking-[0.3em] uppercase text-sm">Aggregating Player Stats...</span>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-12 animate-in fade-in duration-500 pb-12">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl sm:text-6xl font-black tracking-tighter uppercase text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-500">
          Global Leaderboard
        </h1>
        <p className="text-zinc-400 font-medium tracking-widest uppercase">
          {division === 'mens' ? "Men's" : "Women's"} Division Top Players
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Top Scorers */}
        <GlassPanel className="p-6 sm:p-10 flex flex-col h-full">
          <div className="flex items-center gap-4 mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-widest text-white">Golden Boot</h2>
              <p className="text-zinc-400 text-sm tracking-wider uppercase">Top Goalscorers</p>
            </div>
          </div>

          <div className="space-y-4 flex-1">
            <div className="grid grid-cols-[3rem_1fr_4rem] gap-4 px-4 pb-2 border-b border-white/10 text-xs font-bold tracking-widest text-zinc-500">
              <div className="text-center">RNK</div>
              <div>PLAYER</div>
              <div className="text-right">GLS</div>
            </div>
            
            {topScorers.map((player, index) => (
              <div 
                key={player.id} 
                className={cn(
                  "grid grid-cols-[3rem_1fr_4rem] gap-4 items-center p-4 rounded-2xl transition-all duration-300",
                  index === 0 ? "bg-white/5 border border-white/20 shadow-[0_0_15px_rgba(255,255,255,0.05)]" : "bg-black/40 hover:bg-white/5 border border-white/5"
                )}
              >
                <div className={cn(
                  "font-black text-xl text-center",
                  index === 0 ? "text-white" : "text-zinc-500"
                )}>
                  {index + 1}
                </div>
                <div>
                  <h4 className="font-bold text-lg text-white transition-colors">{player.name}</h4>
                  <p className="text-sm font-medium text-zinc-400 truncate">{player.club}</p>
                </div>
                <div className="text-right">
                  <span className={cn(
                    "text-2xl font-black",
                    index === 0 ? "text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-400 drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]" : "text-white"
                  )}>
                    {player.stat}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </GlassPanel>

        {/* Top Assists */}
        <GlassPanel className="p-6 sm:p-10 flex flex-col h-full">
          <div className="flex items-center gap-4 mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-widest text-white">Playmaker</h2>
              <p className="text-zinc-400 text-sm tracking-wider uppercase">Top Assists</p>
            </div>
          </div>

          <div className="space-y-4 flex-1">
            <div className="grid grid-cols-[3rem_1fr_4rem] gap-4 px-4 pb-2 border-b border-white/10 text-xs font-bold tracking-widest text-zinc-500">
              <div className="text-center">RNK</div>
              <div>PLAYER</div>
              <div className="text-right">AST</div>
            </div>
            
            {topAssists.map((player, index) => (
              <div 
                key={player.id} 
                className={cn(
                  "grid grid-cols-[3rem_1fr_4rem] gap-4 items-center p-4 rounded-2xl transition-all duration-300",
                  index === 0 ? "bg-white/5 border border-white/20 shadow-[0_0_15px_rgba(255,255,255,0.05)]" : "bg-black/40 hover:bg-white/5 border border-white/5"
                )}
              >
                <div className={cn(
                  "font-black text-xl text-center",
                  index === 0 ? "text-white" : "text-zinc-500"
                )}>
                  {index + 1}
                </div>
                <div>
                  <h4 className="font-bold text-lg text-white transition-colors">{player.name}</h4>
                  <p className="text-sm font-medium text-zinc-400 truncate">{player.club}</p>
                </div>
                <div className="text-right">
                  <span className={cn(
                    "text-2xl font-black",
                    index === 0 ? "text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-400 drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]" : "text-white"
                  )}>
                    {player.stat}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </GlassPanel>
      </div>

    </div>
  );
}
