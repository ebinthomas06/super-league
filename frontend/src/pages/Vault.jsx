import { useLeague } from '../context/LeagueContext';
import { useApi } from '../hooks/useApi';
import { NewsArticle } from '../components/NewsArticle';
import { Loader2 } from 'lucide-react';

export function Vault() {
  const { division } = useLeague();
  const { data: apiResponse, loading, error } = useApi('/news');

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-zinc-500 animate-pulse space-y-4">
        <Loader2 className="w-12 h-12 animate-spin text-white/20" />
        <span className="font-black tracking-[0.3em] uppercase text-sm">Fetching Latest Stories...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-red-500/80 space-y-4">
        <span className="font-black tracking-[0.3em] uppercase text-sm">Publishing Server Offline</span>
      </div>
    );
  }

  const articles = apiResponse?.data || [];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between px-2 gap-4">
        <div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tighter uppercase">Onion Newsletter</h2>
          <p className="text-zinc-400 mt-1 font-medium">Satire, reports, and exclusive stories.</p>
        </div>
        
        <div className="flex gap-2">
          <select className="bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-zinc-300 outline-none focus:border-white/30 transition-colors focus:ring-2 focus:ring-white/20">
            <option>Latest News</option>
            <option>Match Reports</option>
            <option>Satire</option>
            <option>Features</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {articles.map(article => (
          <NewsArticle key={article.id} article={article} />
        ))}
      </div>
    </div>
  );
}
