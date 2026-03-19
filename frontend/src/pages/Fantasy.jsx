import { useState, useEffect } from 'react';
import { useLeague } from '../context/LeagueContext';
import { useAuth } from '../context/AuthContext';
import { useApi } from '../hooks/useApi';
import { Send, CheckCircle2, Goal, RefreshCw, Crown, Loader2 } from 'lucide-react';
import { cn } from '../utils/cn';
import { Login } from './Login';

// Calculation Logic inside frontend to demonstrate backend mechanics
function calculatePredictionPoints(prediction, actual) {
  let points = 0;
  let correctScorers = 0;
  let correctAssists = 0;

  if (prediction.homeScore === actual.homeScore && prediction.awayScore === actual.awayScore) {
    points += 3;
  } else {
    const predResult = prediction.homeScore > prediction.awayScore ? 'home' : prediction.homeScore < prediction.awayScore ? 'away' : 'draw';
    const actualResult = actual.homeScore > actual.awayScore ? 'home' : actual.homeScore < actual.awayScore ? 'away' : 'draw';
    if (predResult === actualResult) {
      points += 1;
    }
  }

  const predScorersFreq = {};
  const actualScorersFreq = {};
  [...prediction.homeGoals, ...prediction.awayGoals].forEach(g => {
    if (g.scorer) predScorersFreq[g.scorer] = (predScorersFreq[g.scorer] || 0) + 1;
  });
  [...actual.homeGoals, ...actual.awayGoals].forEach(g => {
    if (g.scorer) actualScorersFreq[g.scorer] = (actualScorersFreq[g.scorer] || 0) + 1;
  });

  for (const player in predScorersFreq) {
    if (actualScorersFreq[player]) {
      const correctTimes = Math.min(predScorersFreq[player], actualScorersFreq[player]);
      correctScorers += correctTimes;
      points += correctTimes * 2;
    }
  }

  const predAssistsFreq = {};
  const actualAssistsFreq = {};
  [...prediction.homeGoals, ...prediction.awayGoals].forEach(g => {
    if (g.assist && g.assist !== 'Unassisted') predAssistsFreq[g.assist] = (predAssistsFreq[g.assist] || 0) + 1;
  });
  [...actual.homeGoals, ...actual.awayGoals].forEach(g => {
    if (g.assist && g.assist !== 'Unassisted') actualAssistsFreq[g.assist] = (actualAssistsFreq[g.assist] || 0) + 1;
  });

  for (const player in predAssistsFreq) {
    if (actualAssistsFreq[player]) {
      const correctTimes = Math.min(predAssistsFreq[player], actualAssistsFreq[player]);
      correctAssists += correctTimes;
      points += correctTimes * 1;
    }
  }

  return { points, correctScorers, correctAssists };
}

export function Fantasy() {
  const { division } = useLeague();
  const { user } = useAuth();
  
  const { data: scheduleResp, loading, error } = useApi('/schedule');

  const upcomingMatches = scheduleResp?.data?.map(m => ({
    id: m.id, 
    homeTeam: m.home_team || m.homeTeam || "Team A", 
    awayTeam: m.away_team || m.awayTeam || "Team B"
  })) || [];

  // Temporary local mock for Phase 3 entities not yet rigidly defined in Postgres
  const players = division === 'womens' ? [
    { id: 1, name: 'Sarah Chen' }, { id: 2, name: 'Elena Rostova' }, { id: 3, name: 'Mia Santos' }
  ] : [
    { id: 1, name: 'Alex Vance' }, { id: 2, name: 'Marcus Cole' }, { id: 3, name: 'Julian Ray' }, { id: 4, name: 'Jin Tanaka' }
  ];

  const fantasyLeaderboard = division === 'womens' ? [
    { id: 1, name: 'ValkyrieFan1', points: 4300, correctScorers: 46, correctAssists: 24, form: 'SAME' },
    { id: 2, name: 'PhoenixRising', points: 4150, correctScorers: 38, correctAssists: 20, form: 'UP' },
  ] : [
    { id: 1, name: 'CyberShark99', points: 4250, correctScorers: 42, correctAssists: 21, form: 'UP' },
    { id: 2, name: 'GoalDigga', points: 4100, correctScorers: 45, correctAssists: 10, form: 'DOWN' },
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-zinc-500 animate-pulse space-y-4">
        <Loader2 className="w-12 h-12 animate-spin text-white/20" />
        <span className="font-black tracking-[0.3em] uppercase text-sm">Loading Predictor Engine...</span>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="animate-in fade-in zoom-in-95 duration-500">
        <Login />
      </div>
    );
  }

  const [selectedMatchId, setSelectedMatchId] = useState('');
  const [homeScore, setHomeScore] = useState('');
  const [awayScore, setAwayScore] = useState('');
  
  const [homeRows, setHomeRows] = useState([]);
  const [awayRows, setAwayRows] = useState([]);
  
  const [submitted, setSubmitted] = useState(false);
  const [calculationResult, setCalculationResult] = useState(null);
  const [localLeaderboard, setLocalLeaderboard] = useState([]);

  useEffect(() => {
    setLocalLeaderboard([...fantasyLeaderboard]);
    setSelectedMatchId('');
    setHomeScore('');
    setAwayScore('');
    setSubmitted(false);
    setCalculationResult(null);
  }, [division, fantasyLeaderboard]);

  const selectedMatch = upcomingMatches.find(m => m.id === selectedMatchId);

  useEffect(() => {
    const hs = parseInt(homeScore) || 0;
    setHomeRows(prev => {
      if (hs === prev.length) return prev;
      if (hs > prev.length) {
        return [...prev, ...Array.from({ length: hs - prev.length }, () => ({ scorer: '', assist: '' }))];
      }
      return prev.slice(0, hs);
    });
  }, [homeScore]);

  useEffect(() => {
    const as = parseInt(awayScore) || 0;
    setAwayRows(prev => {
      if (as === prev.length) return prev;
      if (as > prev.length) {
        return [...prev, ...Array.from({ length: as - prev.length }, () => ({ scorer: '', assist: '' }))];
      }
      return prev.slice(0, as);
    });
  }, [awayScore]);

  const handleUpdateRow = (team, index, field, value) => {
    if (team === 'home') {
      const newRows = [...homeRows];
      newRows[index] = { ...newRows[index], [field]: value };
      setHomeRows(newRows);
    } else {
      const newRows = [...awayRows];
      newRows[index] = { ...newRows[index], [field]: value };
      setAwayRows(newRows);
    }
  };

  const generateMockActuals = (hs, as) => {
    const pickRandomPlayer = () => players[Math.floor(Math.random() * players.length)].name;
    const hGoals = Array.from({length: hs}, () => ({ scorer: pickRandomPlayer(), assist: pickRandomPlayer() }));
    const aGoals = Array.from({length: as}, () => ({ scorer: pickRandomPlayer(), assist: pickRandomPlayer() }));
    return { homeScore: hs, awayScore: as, homeGoals: hGoals, awayGoals: aGoals };
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedMatch || homeScore === '' || awayScore === '') return;
    
    const prediction = {
      homeScore: parseInt(homeScore) || 0,
      awayScore: parseInt(awayScore) || 0,
      homeGoals: homeRows,
      awayGoals: awayRows
    };

    const actualHomeScore = Math.max(0, prediction.homeScore + Math.floor(Math.random() * 3) - 1);
    const actualAwayScore = Math.max(0, prediction.awayScore + Math.floor(Math.random() * 3) - 1);
    const actual = generateMockActuals(actualHomeScore, actualAwayScore);

    if (actual.homeGoals.length > 0 && prediction.homeGoals.length > 0) {
      actual.homeGoals[0].scorer = prediction.homeGoals[0].scorer;
    }

    const calculated = calculatePredictionPoints(prediction, actual);

    const myPos = {
      id: 'you',
      name: 'You (Current Session)',
      points: calculated.points,
      correctScorers: calculated.correctScorers,
      correctAssists: calculated.correctAssists,
      form: 'UP',
      isMe: true
    };
    
    setLocalLeaderboard(prev => [...prev.filter(u => u.id !== 'you'), myPos]);
    setCalculationResult({ prediction, actual, calculated });
    setSubmitted(true);
  };

  const displayedLeaderboard = [...localLeaderboard].sort((a, b) => b.points - a.points);

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 pb-12">
      <div className="text-center space-y-4 mb-8">
        <h1 className="text-4xl sm:text-6xl font-black tracking-tighter uppercase text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-500">
          Match Predictor
        </h1>
        <p className="text-zinc-400 max-w-xl mx-auto text-lg mb-6">
          Predict match outcomes to climb the global leaderboard.
        </p>
        
        {/* Detailed Points System Explanation */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8 backdrop-blur-md text-left mx-auto max-w-2xl mt-4">
          <h3 className="text-lg font-black uppercase tracking-widest text-white mb-4 border-b border-white/10 pb-2">How Scoring Works</h3>
          <div className="space-y-4 text-sm font-medium text-zinc-300">
            <div>
              <p className="text-white font-bold text-base mb-1">Match Result & Scoreline</p>
              <ul className="list-disc list-inside space-y-1 ml-2 text-zinc-400">
                <li><strong className="text-white">3 Points</strong> for predicting the exact final score.</li>
                <li><strong className="text-white">1 Point</strong> for predicting the correct Match Winner or Draw (if the exact score is wrong).</li>
              </ul>
            </div>
            <div>
              <p className="text-white font-bold text-base mb-1">Goalscorers & Assists</p>
              <ul className="list-disc list-inside space-y-1 ml-2 text-zinc-400">
                <li><strong className="text-white">2 Points</strong> for every correct Goalscorer pick.</li>
                <li><strong className="text-white">1 Point</strong> for every correct Assist pick (including 'Unassisted').</li>
              </ul>
              <div className="mt-3 bg-black/40 p-4 rounded-xl border border-white/5 text-xs text-zinc-400 leading-relaxed relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-yellow-500"></div>
                <strong className="text-white uppercase tracking-wider block mb-1">Important Rule: Frequency Strategy</strong>
                You can pick the same player multiple times across different goals! The system just counts how many times you picked them in total. For example: if you predict a player scores 3 times, but they only score 2 goals in real life, you'll still get points for 2 goals. The specific order of the rows does not matter!
              </div>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="relative z-10">
        <div className={cn(
          "bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-10 backdrop-blur-md transition-all duration-500",
          submitted ? "scale-[0.98] opacity-50 blur-sm pointer-events-none hidden" : ""
        )}>
          
          <div className="mb-10">
            <h3 className="text-xl font-bold uppercase tracking-widest mb-4 flex items-center gap-2 text-white">
              1. Select Match
            </h3>
            <select
              value={selectedMatchId}
              onChange={(e) => setSelectedMatchId(e.target.value)}
              className="w-full h-16 bg-black/60 border border-white/10 rounded-xl px-6 text-lg font-bold text-white appearance-none focus:outline-none focus:border-white/30 transition-colors cursor-pointer capitalize"
              required
            >
              <option value="" disabled>Choose an upcoming match...</option>
              {upcomingMatches.map(m => (
                <option key={m.id} value={m.id} className="bg-zinc-900">
                  {m.homeTeam} VS {m.awayTeam}
                </option>
              ))}
            </select>
          </div>

          <hr className="border-white/5 mb-10" />

          {selectedMatch && (
            <div className="animate-in fade-in zoom-in-95 duration-300">
              <div className="mb-10">
                <h3 className="text-xl font-bold uppercase tracking-widest mb-6 flex items-center gap-2 text-white">
                  2. Predict Match Score
                </h3>
                
                <div className="flex items-center justify-center gap-4 sm:gap-8 bg-black/30 p-6 rounded-2xl border border-white/5">
                  <div className="text-right flex-1">
                    <p className="text-sm sm:text-xl font-black uppercase text-zinc-300 mb-4 truncate">{selectedMatch.homeTeam}</p>
                    <input 
                      type="number" 
                      min="0" max="20"
                      value={homeScore}
                      onChange={(e) => setHomeScore(e.target.value)}
                      className="w-16 sm:w-24 h-16 sm:h-24 text-4xl sm:text-5xl text-center font-black bg-black/70 border border-white/10 rounded-2xl focus:outline-none focus:border-white/30 transition-all text-white"
                      placeholder="0"
                      required
                    />
                  </div>
                  <div className="text-lg sm:text-2xl font-black text-zinc-600 mt-10">VS</div>
                  <div className="text-left flex-1">
                    <p className="text-sm sm:text-xl font-black uppercase text-zinc-300 mb-4 truncate">{selectedMatch.awayTeam}</p>
                    <input 
                      type="number" 
                      min="0" max="20"
                      value={awayScore}
                      onChange={(e) => setAwayScore(e.target.value)}
                      className="w-16 sm:w-24 h-16 sm:h-24 text-4xl sm:text-5xl text-center font-black bg-black/70 border border-white/10 rounded-2xl focus:outline-none focus:border-white/30 transition-all text-white"
                      placeholder="0"
                      required
                    />
                  </div>
                </div>
              </div>

              {(homeRows.length > 0 || awayRows.length > 0) && (
                <div className="mb-10 space-y-8 animate-in fade-in slide-in-from-top-4 duration-300">
                  <h3 className="text-xl font-bold uppercase tracking-widest mb-6 flex items-center gap-2 text-white">
                    3. Select Match Events
                  </h3>
                  
                  {homeRows.length > 0 && (
                    <div className="space-y-4">
                      <h4 className="font-bold text-zinc-400 capitalize flex items-center gap-2 bg-white/5 p-3 rounded-xl">
                        <span className="w-2 h-2 rounded-full bg-white"></span>
                        {selectedMatch.homeTeam} Goals ({homeRows.length})
                      </h4>
                      <div className="space-y-3">
                        {homeRows.map((row, i) => (
                          <div key={`home-${i}`} className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-black/40 p-4 rounded-xl border border-white/5 relative">
                            <select
                              value={row.scorer}
                              onChange={(e) => handleUpdateRow('home', i, 'scorer', e.target.value)}
                              className="w-full h-12 bg-black/60 border border-white/10 rounded-lg px-4 text-sm font-bold text-white uppercase focus:outline-none focus:border-white/30 transition-colors"
                              required
                            >
                              <option value="" disabled>Select Goalscorer...</option>
                              {players.map(p => <option key={p.id} value={p.name} className="bg-zinc-900">{p.name}</option>)}
                            </select>
                            <select
                              value={row.assist}
                              onChange={(e) => handleUpdateRow('home', i, 'assist', e.target.value)}
                              className="w-full h-12 bg-black/60 border border-white/10 rounded-lg px-4 text-sm font-bold text-white uppercase focus:outline-none focus:border-white/30 transition-colors"
                              required
                            >
                              <option value="" disabled>Select Assist...</option>
                              <option value="Unassisted" className="bg-zinc-900 font-black text-zinc-400">Unassisted</option>
                              {players.map(p => <option key={`a-${p.id}`} value={p.name} className="bg-zinc-900">{p.name}</option>)}
                            </select>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {awayRows.length > 0 && (
                    <div className="space-y-4">
                      <h4 className="font-bold text-zinc-400 capitalize flex items-center gap-2 bg-white/5 p-3 rounded-xl">
                        <span className="w-2 h-2 rounded-full bg-zinc-500"></span>
                        {selectedMatch.awayTeam} Goals ({awayRows.length})
                      </h4>
                      <div className="space-y-3">
                        {awayRows.map((row, i) => (
                          <div key={`away-${i}`} className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-black/40 p-4 rounded-xl border border-white/5 relative">
                            <select
                              value={row.scorer}
                              onChange={(e) => handleUpdateRow('away', i, 'scorer', e.target.value)}
                              className="w-full h-12 bg-black/60 border border-white/10 rounded-lg px-4 text-sm font-bold text-white uppercase focus:outline-none focus:border-white/30 transition-colors"
                              required
                            >
                              <option value="" disabled>Select Goalscorer...</option>
                              {players.map(p => <option key={p.id} value={p.name} className="bg-zinc-900">{p.name}</option>)}
                            </select>
                            <select
                              value={row.assist}
                              onChange={(e) => handleUpdateRow('away', i, 'assist', e.target.value)}
                              className="w-full h-12 bg-black/60 border border-white/10 rounded-lg px-4 text-sm font-bold text-white uppercase focus:outline-none focus:border-white/30 transition-colors"
                              required
                            >
                              <option value="" disabled>Select Assist...</option>
                              <option value="Unassisted" className="bg-zinc-900 font-black text-zinc-400">Unassisted</option>
                              {players.map(p => <option key={`a-${p.id}`} value={p.name} className="bg-zinc-900">{p.name}</option>)}
                            </select>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              <button
                type="submit"
                className="w-full group h-16 bg-white text-black hover:bg-zinc-200 rounded-xl font-bold text-lg uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-3"
              >
                SUBMIT
                <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          )}
        </div>
        
        {submitted && calculationResult && selectedMatch && (
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-10 backdrop-blur-md animate-in fade-in zoom-in-95 duration-500 text-center relative overflow-hidden mb-12">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-white/30 via-white to-white/30"></div>
            
            <CheckCircle2 className="w-16 h-16 text-white mx-auto mb-4" />
            <h3 className="text-3xl font-black uppercase tracking-tighter text-white mb-2">Match Calculated!</h3>
            <p className="text-zinc-400 mb-8 max-w-lg mx-auto">
              We simulated the match outcome right here in the client to show you the points logic in action!
            </p>

            <div className="flex items-center justify-center gap-8 mb-8">
              <div className="text-right">
                <p className="text-sm font-bold text-zinc-500 uppercase">{selectedMatch.homeTeam}</p>
                <p className="text-5xl font-black text-white">{calculationResult.actual.homeScore}</p>
              </div>
              <div className="text-xl font-black text-zinc-600">-</div>
              <div className="text-left">
                <p className="text-sm font-bold text-zinc-500 uppercase">{selectedMatch.awayTeam}</p>
                <p className="text-5xl font-black text-white">{calculationResult.actual.awayScore}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <div className="bg-black/30 p-4 rounded-xl border border-white/5">
                <p className="text-zinc-400 font-bold uppercase text-sm mb-1">Total Points</p>
                <p className="text-3xl font-black text-white">+{calculationResult.calculated.points}</p>
              </div>
              <div className="bg-black/30 p-4 rounded-xl border border-white/5">
                <p className="text-zinc-400 font-bold uppercase text-sm mb-1">Correct Scorers</p>
                <p className="text-3xl font-black text-zinc-300">{calculationResult.calculated.correctScorers}</p>
              </div>
              <div className="bg-black/30 p-4 rounded-xl border border-white/5">
                <p className="text-zinc-400 font-bold uppercase text-sm mb-1">Correct Assists</p>
                <p className="text-3xl font-black text-zinc-300">{calculationResult.calculated.correctAssists}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setSubmitted(false);
                setHomeScore('');
                setAwayScore('');
                setSelectedMatchId('');
              }}
              className="flex items-center gap-2 mx-auto px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-bold uppercase tracking-widest rounded-full transition-all text-sm"
            >
              <RefreshCw className="w-4 h-4" /> Predict Another Match
            </button>
          </div>
        )}

      </form>

      <div id="leaderboard" className="mt-16 bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-10 backdrop-blur-md">
        <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-widest text-white mb-8">
          Leaderboard
        </h2>

        <div className="space-y-4">
          {displayedLeaderboard.map((user, index) => (
            <div 
              key={user.id} 
              className={cn(
                "flex items-center justify-between p-4 sm:p-6 bg-black/40 border rounded-2xl transition-all group",
                user.isMe ? "bg-white/10 border-white/50" : index === 0 ? "border-white/30 bg-white/5" : "border-white/5 hover:bg-white/5 hover:border-white/10"
              )}
            >
              <div className="flex items-center gap-4 sm:gap-6">
                <div className={cn(
                  "w-10 h-10 sm:w-14 sm:h-14 flex items-center justify-center rounded-full font-black text-lg sm:text-xl transition-transform",
                  user.isMe ? "bg-white text-black" : index === 0 ? "bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.3)]" : "text-zinc-400 bg-white/5 group-hover:scale-110 group-hover:bg-white/10 group-hover:text-white"
                )}>
                  {index + 1}
                </div>
                <div>
                  <h4 className="font-bold text-lg sm:text-xl flex items-center gap-2 text-white">
                    {user.name} {user.isMe && <span className="text-[10px] bg-white text-black px-2 py-0.5 rounded-full uppercase tracking-widest font-black">NEW</span>}
                  </h4>
                </div>
              </div>
              <div className="text-right">
                <span className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-400">
                  {user.points.toLocaleString()}
                </span>
                <span className="text-xs sm:text-sm font-bold text-zinc-500 uppercase tracking-widest block">
                  PTS
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
