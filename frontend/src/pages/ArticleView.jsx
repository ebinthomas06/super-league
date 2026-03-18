import { useLeague } from '../context/LeagueContext';
import { ArrowLeft, Calendar } from 'lucide-react';

export function ArticleView() {
  const { selectedArticle, setView } = useLeague();

  if (!selectedArticle) {
    // Failsafe in case of direct render without selection
    setView('vault');
    return null;
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      
      {/* Top Navigation */}
      <button 
        onClick={() => setView('vault')}
        className="group flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mb-6"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        <span className="text-xs font-bold uppercase tracking-widest">Back to Newsletter</span>
      </button>

      {/* Hero Header (Image Only) */}
      <div className="relative w-full h-[30vh] sm:h-[50vh] rounded-3xl overflow-hidden mb-10 border border-white/10">
        <img 
          src={selectedArticle.imgUrl} 
          alt={selectedArticle.headline}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Article Content */}
      <div className="max-w-3xl mx-auto px-2 sm:px-6">
        
        {/* Headline & Metadata */}
        <div className="mb-8 border-b border-white/10 pb-8 space-y-6">
          <div className="flex items-center gap-4">
            <span className="px-3 py-1 bg-white border border-white/20 text-black text-[10px] sm:text-xs font-black uppercase tracking-widest rounded-full">
              {selectedArticle.category}
            </span>
            <div className="flex items-center gap-2 text-zinc-400 text-xs font-bold uppercase tracking-widest">
              <Calendar size={14} />
              {selectedArticle.date}
            </div>
          </div>
          
          <h1 className="text-3xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-400 tracking-tighter leading-tight drop-shadow-sm">
            {selectedArticle.headline}
          </h1>

          <div className="flex items-center gap-3 pt-2">
            <div className="w-10 h-10 rounded-full bg-zinc-800 border border-white/20 flex items-center justify-center font-black text-white">
              SL
            </div>
            <div>
              <p className="text-sm font-bold text-white tracking-wide">Super League Media</p>
              <p className="text-xs text-zinc-500 font-mono">Official Editorial</p>
            </div>
          </div>
        </div>

        <div className="prose prose-invert prose-lg max-w-none">
          <p className="text-xl font-medium text-zinc-300 leading-relaxed mb-6">
            {selectedArticle.snippet}
          </p>
          
          {/* Simulated additional content for the mock UI */}
          <p className="text-zinc-400 leading-relaxed mb-6">
            The recent developments surrounding <strong>{selectedArticle.headline.split(' ').slice(0, 3).join(' ')}</strong> have sent shockwaves across the division. Coaches, players, and pundits alike are grappling with the implications of this event. Tactical systems are being questioned, and the fanbase is eager for answers.
          </p>

          <p className="text-zinc-400 leading-relaxed mb-6">
            Sources close to the team organization suggest that behind closed doors, intense meetings are taking place. The pressure is mounting as the season progresses towards its critical stages. Every point, every tackle, and every decision now carries exponential weight.
          </p>

          <div className="my-10 p-6 sm:p-8 bg-zinc-900 border-l-4 border-white/30 rounded-r-xl">
            <p className="text-xl sm:text-2xl font-bold italic text-white leading-snug">
              "This is undoubtedly one of the pivotal moments of the season. What happens next will define the legacy of this squad for years to come."
            </p>
          </div>

          <p className="text-zinc-400 leading-relaxed">
            As the League awaits an official statement, analysts predict a significant shift in the upcoming fixture odds. Whether this incident becomes a rallying cry or a stumbling block remains the ultimate question. We will continue to follow this story as it develops.
          </p>
        </div>
      </div>

    </div>
  );
}
