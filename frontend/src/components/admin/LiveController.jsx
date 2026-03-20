import React, { useState } from 'react';
import { useApi } from '../../hooks/useApi';
import { Activity, Trophy, Timer, CheckCircle, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function LiveController() {
  // 1. ADD DIVISION STATE
  const [division, setDivision] = useState('mens');

  // 2. PASS DIVISION TO HOOK & FETCH ALL PLAYERS
  const { data: resp, refetch } = useApi(`/admin/matches?status=live,scheduled&division=${division}`);
  const { data: playersResp } = useApi('/players?all=true'); 
  
  const matches = resp?.data || [];
  const allPlayers = playersResp?.data || [];

  const [selectedMatch, setSelectedMatch] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const [showGoalForm, setShowGoalForm] = useState(false);
  const [goalForm, setGoalForm] = useState({ 
    team_id: '', player_id: '', assist_id: '', minute: '', is_own_goal: false 
  });

  const handleAction = async (action, extraData = {}) => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();

      const res = await fetch('/api/admin/matches/live', {
        method: 'POST',
        credentials: 'include',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}` 
        },
        body: JSON.stringify({
          match_id: selectedMatch.id,
          action,
          ...extraData
        })
      });
      
      const result = await res.json();
      if (result.success) {
        alert(result.message);
        refetch(); 
        setShowGoalForm(false); 
      } else {
        alert("Error: " + result.message);
      }
    } catch (err) {
      alert("Action failed. Check console.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const submitGoal = (e) => {
    e.preventDefault();
    handleAction('add_goal', goalForm);
  };

  // Bulletproof filter
  const teamPlayers = allPlayers.filter(p => {
    const playerTeamId = p.team_id || p.teams?.id;
    return playerTeamId === goalForm.team_id;
  });

  // Handle Own Goal Toggle
  const toggleOwnGoal = (e) => {
    const isOwn = e.target.checked;
    setGoalForm(prev => ({
      ...prev,
      is_own_goal: isOwn,
      assist_id: isOwn ? '' : prev.assist_id // Instantly clear assist if own goal
    }));
  };

  // Helper to safely switch divisions and clear selected matches
  const handleDivisionSwitch = (newDiv) => {
    setDivision(newDiv);
    setSelectedMatch(null);
    setShowGoalForm(false);
  };

  return (
    <div className="p-6 space-y-8">
      
      {/* 3. ADD THE LEAGUE TOGGLE UI */}
      <div className="flex justify-center mb-4">
        <div className="bg-black/50 p-1 rounded-full border border-white/10 flex">
          <button 
            onClick={() => handleDivisionSwitch('mens')} 
            className={`px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all ${division === 'mens' ? 'bg-white text-black' : 'text-zinc-500 hover:text-white'}`}
          >
            Men's
          </button>
          <button 
            onClick={() => handleDivisionSwitch('womens')} 
            className={`px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all ${division === 'womens' ? 'bg-white text-black' : 'text-zinc-500 hover:text-white'}`}
          >
            Women's
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {matches.length > 0 ? matches.map(m => (
          <button 
            key={m.id}
            onClick={() => { setSelectedMatch(m); setShowGoalForm(false); }}
            className={`p-4 rounded-xl border transition-all ${selectedMatch?.id === m.id ? 'border-white bg-white/10' : 'border-white/10 bg-black/40 hover:bg-white/5'}`}
          >
            <div className="flex justify-between text-xs uppercase font-black text-zinc-500 mb-2">
              <span>{m.division}</span>
              <span className={m.status === 'live' ? 'text-red-500 animate-pulse' : ''}>{m.status}</span>
            </div>
            <div className="font-bold text-lg">{m.home_team_name} vs {m.away_team_name}</div>
          </button>
        )) : (
          <div className="col-span-1 md:col-span-2 text-center py-12 border border-white/5 rounded-2xl bg-black/20">
            <span className="text-zinc-500 font-bold uppercase tracking-widest text-sm">No active or scheduled matches found</span>
          </div>
        )}
      </div>

      {selectedMatch && (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 animate-in fade-in slide-in-from-bottom-4">
          <h3 className="text-center text-sm font-black uppercase tracking-widest text-zinc-500 mb-6">Control Center</h3>
          
          <div className="flex justify-center items-center gap-8 mb-10">
            <div className="text-center">
              <div className="text-4xl font-black">{selectedMatch.home_score}</div>
              <div className="text-xs font-bold text-zinc-400 uppercase mt-2">{selectedMatch.home_team_name}</div>
            </div>
            <div className="text-2xl font-black text-zinc-700">VS</div>
            <div className="text-center">
              <div className="text-4xl font-black">{selectedMatch.away_score}</div>
              <div className="text-xs font-bold text-zinc-400 uppercase mt-2">{selectedMatch.away_team_name}</div>
            </div>
          </div>

          {showGoalForm ? (
            <form onSubmit={submitGoal} className="bg-black/50 border border-white/10 rounded-xl p-6 mb-6 space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-black uppercase tracking-widest text-sm">Register Goal</h4>
                <button type="button" onClick={() => setShowGoalForm(false)} className="text-zinc-500 hover:text-white"><X size={18}/></button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* SELECT TEAM */}
                <div>
                  <label className={`block text-[10px] font-bold uppercase tracking-widest mb-2 ${goalForm.is_own_goal ? 'text-red-400' : 'text-zinc-500'}`}>
                    {goalForm.is_own_goal ? "Select Offending Team (Own Goal)" : "Select Scoring Team"}
                  </label>
                  <select required value={goalForm.team_id} onChange={e => setGoalForm({...goalForm, team_id: e.target.value, player_id: '', assist_id: ''})} className="w-full bg-white/5 border border-white/10 rounded-lg p-3 outline-none text-sm text-white">
                    <option value="" disabled className="bg-zinc-900 text-white">Select Team...</option>
                    <option value={selectedMatch.home_team_id} className="bg-zinc-900 text-white">{selectedMatch.home_team_name} (Home)</option>
                    <option value={selectedMatch.away_team_id} className="bg-zinc-900 text-white">{selectedMatch.away_team_name} (Away)</option>
                  </select>
                </div>

                {/* MINUTE */}
                <div>
                  <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Minute</label>
                  <input type="number" required placeholder="e.g. 45" value={goalForm.minute} onChange={e => setGoalForm({...goalForm, minute: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg p-3 outline-none text-sm text-white" />
                </div>

                {/* GOALSCORER */}
                <div>
                  <label className={`block text-[10px] font-bold uppercase tracking-widest mb-2 ${goalForm.is_own_goal ? 'text-red-400' : 'text-zinc-500'}`}>
                    {goalForm.is_own_goal ? "Player Who Scored Own Goal" : "Goalscorer"}
                  </label>
                  <select required disabled={!goalForm.team_id} value={goalForm.player_id} onChange={e => setGoalForm({...goalForm, player_id: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg p-3 outline-none text-sm text-white disabled:opacity-50">
                    <option value="" disabled className="bg-zinc-900 text-white">Select Player...</option>
                    {teamPlayers.map(p => <option key={p.id} value={p.id} className="bg-zinc-900 text-white">{p.first_name} {p.last_name}</option>)}
                  </select>
                </div>

                {/* ASSIST (DISABLED IF OWN GOAL) */}
                <div>
                  <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Assist (Optional)</label>
                  <select disabled={!goalForm.team_id || goalForm.is_own_goal} value={goalForm.assist_id} onChange={e => setGoalForm({...goalForm, assist_id: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg p-3 outline-none text-sm text-white disabled:opacity-50">
                    <option value="" className="bg-zinc-900 text-white">{goalForm.is_own_goal ? "No Assists on Own Goals" : "No Assist (Solo)"}</option>
                    {teamPlayers.filter(p => p.id !== goalForm.player_id).map(p => <option key={p.id} value={p.id} className="bg-zinc-900 text-white">{p.first_name} {p.last_name}</option>)}
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-3 py-2">
                <input type="checkbox" id="own_goal" checked={goalForm.is_own_goal} onChange={toggleOwnGoal} className="w-4 h-4 accent-red-500" />
                <label htmlFor="own_goal" className="text-xs font-bold uppercase tracking-widest text-red-400">Mark as Own Goal</label>
              </div>

              <button type="submit" disabled={loading} className="w-full bg-white text-black font-black uppercase tracking-widest py-3 rounded-lg hover:bg-zinc-200 transition-colors mt-2">
                {loading ? "Registering..." : "Confirm Goal"}
              </button>
            </form>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button onClick={() => setShowGoalForm(true)} className="flex items-center justify-center gap-3 bg-white text-black py-4 rounded-xl font-black uppercase hover:bg-zinc-200 transition-colors">
                <Trophy size={18} /> Add Goal
              </button>
              <button disabled={loading} onClick={() => handleAction('update_time')} className="flex items-center justify-center gap-3 bg-zinc-800 text-white py-4 rounded-xl font-black uppercase hover:bg-zinc-700 transition-colors">
                <Timer size={18} /> Kick Off / Live
              </button>
              <button disabled={loading} onClick={() => { if(confirm("End match and lock scores?")) handleAction('close_match'); }} className="flex items-center justify-center gap-3 bg-red-600/20 text-red-500 border border-red-500/50 py-4 rounded-xl font-black uppercase hover:bg-red-600/30 transition-colors sm:col-span-2">
                <CheckCircle size={18} /> Final Whistle
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}