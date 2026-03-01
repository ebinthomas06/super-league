import { useLeague } from '../context/LeagueContext';
import { mockData } from '../data/mockData';
import { GlassPanel } from '../components/GlassPanel';
import { FormGuide } from '../components/FormGuide';

export function Standings() {
  const { division } = useLeague();
  const standings = mockData[division].standings;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-end justify-between px-2">
        <div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tighter uppercase">League Standings</h2>
          <p className="text-zinc-400 mt-1 font-medium">Top 4 qualify for the playoffs.</p>
        </div>
      </div>

      <GlassPanel className="overflow-x-auto">
        <div className="min-w-[800px] w-full">
          <div className="grid grid-cols-[4rem_1.5fr_3rem_3rem_3rem_3rem_3rem_3rem_3rem_4rem_10rem] gap-2 p-4 border-b border-white/10 text-xs font-bold tracking-wider text-zinc-500 bg-black/60 uppercase">
            <div className="text-center">Rank</div>
            <div>Club</div>
            <div className="text-center">MP</div>
            <div className="text-center">W</div>
            <div className="text-center">D</div>
            <div className="text-center">L</div>
            <div className="text-center">GF</div>
            <div className="text-center">GA</div>
            <div className="text-center text-zinc-300">GD</div>
            <div className="text-center text-white">Pts</div>
            <div className="pl-4">Form</div>
          </div>
          
          <div className="flex flex-col">
            {standings.map((team, idx) => {
              const promotes = idx < 4;
              return (
                <div 
                  key={team.club} 
                  className={`
                    grid grid-cols-[4rem_1.5fr_3rem_3rem_3rem_3rem_3rem_3rem_3rem_4rem_10rem] gap-2 p-4 items-center 
                    ${idx !== standings.length - 1 ? 'border-b border-white/5' : ''} 
                    hover:bg-white/5 transition-colors
                    ${promotes ? 'bg-white/[0.02]' : ''}
                  `}
                >
                  <div className="font-mono text-xl font-bold text-center text-zinc-400">{team.rank}</div>
                  <div className="font-bold text-lg">{team.club}</div>
                  <div className="text-center text-zinc-400">{team.mp}</div>
                  <div className="text-center text-zinc-400">{team.w}</div>
                  <div className="text-center text-zinc-400">{team.d}</div>
                  <div className="text-center text-zinc-400">{team.l}</div>
                  <div className="text-center text-zinc-400">{team.gf}</div>
                  <div className="text-center text-zinc-400">{team.ga}</div>
                  <div className="text-center font-mono text-zinc-300">{team.gd > 0 ? `+${team.gd}` : team.gd}</div>
                  <div className="text-center font-black text-2xl">{team.pts}</div>
                  <div className="pl-4 hidden sm:block">
                    <FormGuide form={team.form} />
                  </div>
                  {/* Small form indicator for tiny screens */}
                  <div className="pl-4 block sm:hidden text-xs tracking-widest text-zinc-400">
                    {team.form.join('')}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </GlassPanel>
    </div>
  );
}
