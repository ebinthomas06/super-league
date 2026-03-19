import { useState, useEffect } from 'react';
import { GlassPanel } from './GlassPanel';
import { useLeague } from '../context/LeagueContext';
import { ArrowRight } from 'lucide-react';

export function MatchPoll({ homeTeam, awayTeam, initialHomePercent, initialAwayPercent }) {
  const { setView, setFantasyPrediction, view, globalPollState, setGlobalPollState, division } = useLeague();
  
  const currentPoll = globalPollState[division];
  
  const [voted, setVoted] = useState(!!currentPoll);
  const [percents, setPercents] = useState(
    currentPoll ? currentPoll.finalPercents : { home: initialHomePercent, away: initialAwayPercent }
  );

  useEffect(() => {
    if (currentPoll) {
      setVoted(true);
      setPercents(currentPoll.finalPercents);
    } else {
      setVoted(false);
      setPercents({ home: initialHomePercent, away: initialAwayPercent });
    }
  }, [currentPoll, initialHomePercent, initialAwayPercent]);

  const handleVote = (team) => {
    if (voted) return;
    setVoted(true);
    setFantasyPrediction(team);
    
    let newPercents;
    if (team === 'home') {
      newPercents = { home: Math.min(99, percents.home + 2), away: Math.max(1, percents.away - 2) };
    } else {
      newPercents = { home: Math.max(1, percents.home - 2), away: Math.min(99, percents.away + 2) };
    }
    
    setPercents(newPercents);
    setGlobalPollState(prev => ({ 
      ...prev, 
      [division]: { hasVoted: true, selection: team, finalPercents: newPercents } 
    }));
    
    if (view !== 'fantasy') {
      setView('fantasy');
    }
  };

  return (
    <GlassPanel className="p-6 sm:p-8">
      <h3 className="text-lg sm:text-xl font-bold tracking-widest text-center mb-6 text-zinc-300">
        WHO TAKES THE POINTS?
      </h3>
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
        
        {view !== 'fantasy' && (
          <button
            onClick={() => setView('fantasy')}
            className="mt-6 w-full py-3 sm:py-4 bg-white text-black hover:bg-zinc-200 font-bold text-lg tracking-widest uppercase rounded-xl transition-all duration-300 flex items-center justify-center gap-3 group drop-shadow-[0_0_10px_rgba(255,255,255,0.2)] hover:drop-shadow-[0_0_20px_rgba(255,255,255,0.4)]"
          >
            Predict & Win
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        )}
      </div>
    </GlassPanel>
  );
}
