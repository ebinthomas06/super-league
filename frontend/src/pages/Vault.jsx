import { useLeague } from '../context/LeagueContext';
import { mockData } from '../data/mockData';
import { NewsArticle } from '../components/NewsArticle';

export function Vault() {
  const { division } = useLeague();
  const articles = mockData[division].vault;

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
