import { GlassPanel } from './GlassPanel';
import { useLeague } from '../context/LeagueContext';

export function NewsArticle({ article }) {
  const { setView, setSelectedArticle } = useLeague();

  // Support both DB field names (title/image_url) and legacy aliases
  const headline = article.headline || article.title;
  const imgUrl = article.imgUrl || article.image_url;

  return (
    <GlassPanel 
      className="overflow-hidden group cursor-pointer transition-all duration-300 hover:border-white/30 active:scale-[0.98] flex flex-col h-full"
      onClick={() => {
        setSelectedArticle(article);
        setView('article');
      }}
    >
      {/* Image Section */}
      {imgUrl && (
        <div className="relative h-48 sm:h-56 overflow-hidden shrink-0">
          <img 
            src={imgUrl}
            alt={headline}
            className="w-full h-full object-cover md:grayscale opacity-100 md:opacity-80 md:group-hover:grayscale-0 md:group-hover:opacity-100 md:group-hover:scale-105 transition-all duration-700 ease-out"
          />
        </div>
      )}
      
      {/* Headline Only Section */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-center">
        <h4 className="text-lg sm:text-xl font-black text-white leading-tight group-hover:text-zinc-200 transition-colors uppercase tracking-tight line-clamp-3">
          {headline}
        </h4>
      </div>
    </GlassPanel>
  );
}