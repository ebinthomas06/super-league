import { useState, useEffect } from 'react';
import { GlassPanel } from './GlassPanel';

export function MatchPoll({ homeTeam, awayTeam, initialHomePercent, initialAwayPercent }) {
  const [voted, setVoted] = useState(false);
  const [percents, setPercents] = useState({ home: initialHomePercent, away: initialAwayPercent });

  useEffect(() => {
    setVoted(false);
    setPercents({ home: initialHomePercent, away: initialAwayPercent });
  }, [homeTeam, awayTeam, initialHomePercent, initialAwayPercent]);

  const handleVote = (team) => {
    if (voted) return;
    setVoted(true);
    if (team === 'home') {
      setPercents(p => ({ home: Math.min(99, p.home + 2), away: Math.max(1, p.away - 2) }));
    } else {
      setPercents(p => ({ home: Math.max(1, p.home - 2), away: Math.min(99, p.away + 2) }));
    }
  };

  return (
    <GlassPanel className="p-6 sm:p-8">
      <h3 className="text-lg sm:text-xl font-bold tracking-widest text-center mb-6 text-zinc-300">WHO TAKES THE POINTS?</h3>
      <div className="flex flex-col gap-4">
        {!voted ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button 
              onClick={() => handleVote('home')}
              className="py-3 px-4 border border-white/20 hover:bg-white/10 rounded-xl font-bold text-lg transition-all hover:scale-[1.02]"
            >
              {homeTeam}
            </button>
            <button 
              onClick={() => handleVote('away')}
              className="py-3 px-4 border border-white/20 hover:bg-white/10 rounded-xl font-bold text-lg transition-all hover:scale-[1.02]"
            >
              {awayTeam}
            </button>
          </div>
        ) : (
          <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
            <div>
              <div className="flex justify-between items-end mb-2">
                <span className="font-bold text-lg sm:text-xl">{homeTeam}</span>
                <span className="text-xl sm:text-2xl font-black">{percents.home}%</span>
              </div>
              <div className="w-full h-3 bg-[#1A1A1A] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-white rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${percents.home}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-end mb-2">
                <span className="font-bold text-lg sm:text-xl text-zinc-300">{awayTeam}</span>
                <span className="text-xl sm:text-2xl font-black text-zinc-500">{percents.away}%</span>
              </div>
              <div className="w-full h-3 bg-[#1A1A1A] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-zinc-600 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${percents.away}%` }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </GlassPanel>
  );
}
