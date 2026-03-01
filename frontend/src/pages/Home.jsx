import { useLeague } from '../context/LeagueContext';
import { mockData } from '../data/mockData';
import { GlassPanel } from '../components/GlassPanel';
import { FormGuide } from '../components/FormGuide';
import { MatchPoll } from '../components/MatchPoll';
import { NewsArticle } from '../components/NewsArticle';
import { ChevronRight } from 'lucide-react';

export function Home() {
  const { division, setView } = useLeague();
  const data = mockData[division];
  const match = data.liveMatch;
  const top4 = data.standings.slice(0, 4);
  const latestNews = data.vault[0]; // Just showing the top one for split bottom

  return (
    <div className="space-y-8 sm:space-y-12 animate-in fade-in duration-500 pb-12">
      
      {/* Hero Section: Live Match */}
      <GlassPanel className="p-6 sm:p-10 md:p-16 relative overflow-hidden">
        {/* Subtle glow effect behind hero */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-white/5 blur-[100px] rounded-full pointer-events-none" />
        
        <div className="relative z-10 flex flex-col items-center">
          <div className="flex items-center gap-3 mb-8 sm:mb-12 px-5 py-2 rounded-full bg-black/60 border border-white/10 backdrop-blur-md">
            <span className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" />
            <span className="text-xs sm:text-sm font-bold tracking-widest text-zinc-200">LIVE &bull; {match.minute}'</span>
          </div>

          <div className="w-full flex justify-between items-center px-0 sm:px-8 md:px-12">
            <div className="flex flex-col items-center gap-4 w-1/3">
              <h2 className="text-xl sm:text-3xl lg:text-5xl font-extrabold text-center tracking-tight leading-none">{match.homeTeam}</h2>
              <div className="hidden sm:block"><FormGuide form={match.homeForm} /></div>
            </div>

            <div className="text-4xl sm:text-6xl lg:text-8xl font-black tracking-tighter w-1/3 text-center tabular-nums text-white drop-shadow-2xl">
              {match.homeScore} - {match.awayScore}
            </div>

            <div className="flex flex-col items-center gap-4 w-1/3">
              <h2 className="text-xl sm:text-3xl lg:text-5xl font-extrabold text-center tracking-tight leading-none text-zinc-400">{match.awayTeam}</h2>
              <div className="hidden sm:block"><FormGuide form={match.awayForm} /></div>
            </div>
          </div>
          
          {/* Mobile Form Guides */}
          <div className="flex sm:hidden w-full justify-between px-4 mt-8">
            <FormGuide form={match.homeForm} />
            <FormGuide form={match.awayForm} />
          </div>
        </div>
      </GlassPanel>

      {/* Poll Widget */}
      <div className="max-w-3xl mx-auto">
        <MatchPoll 
          homeTeam={match.homeTeam} 
          awayTeam={match.awayTeam} 
          initialHomePercent={match.poll.homePercent} 
          initialAwayPercent={match.poll.awayPercent} 
        />
      </div>

      {/* Split Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left: Top 4 Standings */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-lg sm:text-xl font-bold tracking-widest text-zinc-200">TOP 4 STANDINGS</h3>
            <button 
              onClick={() => setView('standings')}
              className="text-sm font-medium text-zinc-400 hover:text-white flex items-center transition-colors group"
            >
              Full Table <ChevronRight size={16} className="transition-transform group-hover:translate-x-1" />
            </button>
          </div>
          <GlassPanel className="overflow-hidden">
            <div className="grid grid-cols-[3rem_1fr_3rem_3rem] gap-2 p-4 border-b border-white/10 text-[10px] sm:text-xs font-bold tracking-wider text-zinc-500 bg-black/40">
              <div className="text-center">RNK</div>
              <div>CLUB</div>
              <div className="text-right">GD</div>
              <div className="text-right">PTS</div>
            </div>
            <div className="flex flex-col">
              {top4.map((team, idx) => (
                <div key={team.club} className={`grid grid-cols-[3rem_1fr_3rem_3rem] gap-2 p-4 items-center ${idx !== top4.length - 1 ? 'border-b border-white/5' : ''} hover:bg-white/5 transition-colors cursor-pointer`} onClick={() => setView('standings')}>
                  <div className="font-mono text-base sm:text-lg font-bold text-center text-zinc-400">{team.rank}</div>
                  <div className="font-bold text-base sm:text-lg truncate">{team.club}</div>
                  <div className="text-right text-zinc-400 font-mono text-sm sm:text-base">{team.gd > 0 ? `+${team.gd}` : team.gd}</div>
                  <div className="text-right font-black text-lg sm:text-xl">{team.pts}</div>
                </div>
              ))}
            </div>
          </GlassPanel>
        </div>

        {/* Right: Latest from Onion Newsletter */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-lg sm:text-xl font-bold tracking-widest text-zinc-200">LATEST FROM ONION NEWSLETTER</h3>
            <button 
              onClick={() => setView('vault')}
              className="text-sm font-medium text-zinc-400 hover:text-white flex items-center transition-colors group"
            >
              All News <ChevronRight size={16} className="transition-transform group-hover:translate-x-1" />
            </button>
          </div>
          <NewsArticle article={latestNews} />
        </div>

      </div>

    </div>
  );
}
