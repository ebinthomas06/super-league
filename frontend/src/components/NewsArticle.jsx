import { GlassPanel } from './GlassPanel';
import { useLeague } from '../context/LeagueContext';

export function NewsArticle({ article }) {
  const { setView, setSelectedArticle } = useLeague();
  
  return (
    <GlassPanel 
      className="overflow-hidden group cursor-pointer transition-all duration-300 hover:border-white/30 active:scale-[0.98]"
      onClick={() => {
        setSelectedArticle(article);
        setView('article');
      }}
    >
      <div className="relative h-48 sm:h-56 overflow-hidden">
        <img 
          src={article.imgUrl} 
          alt={article.headline}
          className="w-full h-full object-cover md:grayscale opacity-100 md:opacity-80 md:group-hover:grayscale-0 md:group-hover:opacity-100 md:group-hover:scale-105 transition-all duration-700 ease-out"
        />
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
