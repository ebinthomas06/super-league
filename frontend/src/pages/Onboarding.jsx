import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { GlassPanel } from '../components/GlassPanel';
import { Send, User } from 'lucide-react';

export function Onboarding() {
  const { user, setProfile, signOut } = useAuth();
  const [nickname, setNickname] = useState('');
  const [mensFlair, setMensFlair] = useState('');
  const [womensFlair, setWomensFlair] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  
  const [mensTeams, setMensTeams] = useState([]);
  const [womensTeams, setWomensTeams] = useState([]);

  useEffect(() => {
    const fetchAllTeams = async () => {
      const { data } = await supabase.from('teams').select('*').order('name');
      if (data) {
        setMensTeams(data.filter(t => t.division === 'mens'));
        setWomensTeams(data.filter(t => t.division === 'womens'));
      }
    };
    fetchAllTeams();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nickname.trim() || !mensFlair || !womensFlair) return;
    
    setSaving(true);
    setError(null);

    const updatedProfile = {
      id: user.id,
      email: user.email, // <--- ADD THIS LINE!
      nickname: nickname.trim(),
      mens_team_flair: mensFlair,
      womens_team_flair: womensFlair,
      team_flair_id: mensFlair 
    };

    // 1. USE UPSERT: This guarantees it saves
    const { error: updateError } = await supabase
      .from('user_profiles')
      .upsert(updatedProfile);

    if (updateError) {
      console.error("Profile saving error:", updateError.message);
      setError("Failed to save profile. Are you sure you are online?");
      setSaving(false);
      return;
    }

    // 2. Update local state
    setProfile({ id: user.id, email: user.email, ...updatedProfile });
    
    // 3. THE URL RESCUE: Force them out of the ?view=onboarding URL!
    window.location.href = '/'; 
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-white/5 rounded-full blur-[120px] -z-10 mix-blend-screen" />

      <GlassPanel className="max-w-lg w-full p-8 text-center relative z-10 border border-white/10 bg-black/60 backdrop-blur-2xl">
        <User className="w-12 h-12 text-white mx-auto mb-6" />
        <h1 className="text-3xl font-black uppercase tracking-tighter mb-2 text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-500">
          Welcome to Super League
        </h1>
        <p className="text-zinc-400 font-medium mb-8 text-sm">
          You logged in with {user.email}. Complete your profile to access predictions and leaderboards.
        </p>

        {error && (
          <div className="bg-red-500/20 border border-red-500/50 text-red-200 p-3 rounded-lg mb-6 text-sm font-bold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 text-left">
          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-zinc-500 mb-2 ml-1">
              Choose Nickname
            </label>
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="e.g. MasterPredictor99"
              className="w-full bg-black/50 border border-white/10 rounded-xl px-5 py-4 text-white font-bold placeholder-zinc-700 outline-none focus:border-white/40 transition-colors"
              required
              maxLength={20}
              minLength={3}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2 ml-1">
                Men's Team Flair
              </label>
              <select
                value={mensFlair}
                onChange={(e) => setMensFlair(e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white font-bold outline-none focus:border-white/40 transition-colors appearance-none cursor-pointer"
                required
              >
                <option value="" disabled>Select Club...</option>
                {mensTeams.map((t) => <option key={t.id} value={t.name} className="bg-zinc-900">{t.name}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2 ml-1">
                Women's Team Flair
              </label>
              <select
                value={womensFlair}
                onChange={(e) => setWomensFlair(e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white font-bold outline-none focus:border-white/40 transition-colors appearance-none cursor-pointer"
                required
              >
                <option value="" disabled>Select Club...</option>
                {womensTeams.map((t) => <option key={t.id} value={t.name} className="bg-zinc-900">{t.name}</option>)}
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={saving || !nickname || !mensFlair || !womensFlair}
            className="w-full group h-14 bg-white text-black hover:bg-zinc-200 rounded-xl font-bold uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Enter The League"}
            <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <button 
          onClick={() => signOut()}
          className="mt-8 text-xs text-zinc-600 hover:text-white uppercase tracking-widest font-bold transition-colors"
        >
          Cancel & Log Out
        </button>
      </GlassPanel>
    </div>
  );
}