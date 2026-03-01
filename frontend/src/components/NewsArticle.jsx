import { GlassPanel } from './GlassPanel';
import { useLeague } from '../context/LeagueContext';

export function NewsArticle({ article }) {
  const { setView } = useLeague();
  
  return (
    <GlassPanel 
      className="overflow-hidden group cursor-pointer transition-all duration-300 hover:border-white/30"
      onClick={() => setView('vault')}
    >
      <div className="relative h-48 sm:h-56 overflow-hidden">
        <img 
          src={article.imgUrl} 
          alt={article.headline}
          className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 ease-out"
        />
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 bg-black/80 backdrop-blur-md border border-white/10 text-[10px] sm:text-xs font-bold uppercase tracking-widest text-white rounded-full">
            {article.category}
          </span>
        </div>
      </div>
      <div className="p-5">
        <p className="text-xs text-zinc-500 font-mono mb-2">{article.date}</p>
        <h4 className="text-lg sm:text-xl font-bold text-white mb-2 leading-tight group-hover:text-zinc-200 transition-colors">
          {article.headline}
        </h4>
        <p className="text-sm text-zinc-400 line-clamp-2">
          {article.snippet}
        </p>
      </div>
    </GlassPanel>
  );
}
