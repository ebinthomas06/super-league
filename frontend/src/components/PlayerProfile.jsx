import React from 'react';
import { useLeague } from '../context/LeagueContext';
import { ArrowLeft, Star, Hexagon } from 'lucide-react'; // Make sure lucide-react is installed!

// DUMMY DATA: Perfectly matching your "Jess Park" screenshot
const playerData = {
  name: "Jess",
  lastName: "Park",
  rating: 81,
  position: "CM",
  altPositions: ["RW", "RM"],
  weakFoot: 3,
  skillMoves: 4,
  preferredFoot: "Right",
  height: "161cm / 5'3\"",
  weight: "56kg / 123lb",
  image: "https://ui-avatars.com/api/?name=Jess+Park&background=transparent&color=000&size=512", // Replace with real transparent PNG
  stats: {
    Pace: { total: 83, subs: { Acceleration: 84, 'Sprint Speed': 82 } },
    Shooting: { total: 73, subs: { Positioning: 80, Finishing: 78, 'Shot Power': 71, 'Long Shots': 70, Volleys: 63, Penalties: 60 } },
    Passing: { total: 77, subs: { Vision: 81, Crossing: 72, 'Free Kick': 48, 'Short Pass': 82, 'Long Pass': 77, Curve: 66 } },
    Dribbling: { total: 86, subs: { Agility: 86, Balance: 80, Reactions: 80, 'Ball Control': 88, Dribbling: 87, Composure: 75 } },
    Defending: { total: 59, subs: { Interceptions: 75, 'Heading Acc': 49, 'Def Awareness': 37, 'Stand Tackle': 73, 'Slide Tackle': 58 } },
    Physicality: { total: 63, subs: { Jumping: 67, Stamina: 81, Strength: 56, Aggression: 57 } }
  },
  playStyles: [
    { name: "First Touch", desc: "Reduced trapping error, faster dribbling transition." },
    { name: "Inventive", desc: "Fancy and Trivela passes are performed with improved accuracy." },
    { name: "Quick Step", desc: "Faster acceleration during Explosive Sprint." }
  ]
};

// 1. DYNAMIC COLOR ALGORITHM for the Stat Bars
const getStatColor = (val) => {
  if (val >= 80) return 'bg-[#00e676]'; // Bright Green
  if (val >= 70) return 'bg-[#ffc400]'; // Yellow
  if (val >= 60) return 'bg-[#ff9100]'; // Orange
  return 'bg-[#ff1744]'; // Red
};

export default function PlayerProfile() {
  const { setView } = useLeague();

  return (
    <div className="w-full bg-[#0F0E13] min-h-screen text-white p-4 md:p-8 font-sans pb-20">
      
      {/* Back Button */}
      <button 
        onClick={() => setView('home')} // Or 'roster' depending on where they came from
        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6 group"
      >
        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        Back to Squad
      </button>

      {/* Main Layout Grid */}
      <div className="flex flex-col xl:flex-row gap-8 max-w-7xl mx-auto">
        
        {/* LEFT COLUMN: The Gold Card & Bio */}
        <div className="flex flex-col lg:flex-row xl:flex-col gap-6 w-full xl:w-1/3">
          
          {/* Top Section: Name & The Ultimate Team Card */}
          <div className="flex gap-6 items-start">
            {/* The Gold Card */}
            <div className="w-48 h-64 rounded-xl bg-gradient-to-br from-[#E8C881] via-[#C9A050] to-[#966E2D] p-1 shadow-2xl relative overflow-hidden shrink-0 flex flex-col items-center">
              {/* Overall & Position */}
              <div className="absolute top-3 left-3 flex flex-col items-center text-[#2A1E04]">
                <span className="text-3xl font-black leading-none">{playerData.rating}</span>
                <span className="text-sm font-bold">{playerData.position}</span>
              </div>
              {/* Player Image (Transparent PNG) */}
              <img src={playerData.image} alt={playerData.name} className="w-full h-full object-cover mt-8 drop-shadow-lg opacity-80 mix-blend-multiply" />
              {/* Card Bottom Stats */}
              <div className="absolute bottom-2 w-full flex justify-center gap-2 text-[#2A1E04] font-bold text-[10px] uppercase">
                <div className="flex flex-col items-center"><span>PAC</span><span>{playerData.stats.Pace.total}</span></div>
                <div className="flex flex-col items-center"><span>SHO</span><span>{playerData.stats.Shooting.total}</span></div>
                <div className="flex flex-col items-center"><span>PAS</span><span>{playerData.stats.Passing.total}</span></div>
                <div className="flex flex-col items-center"><span>DRI</span><span>{playerData.stats.Dribbling.total}</span></div>
                <div className="flex flex-col items-center"><span>DEF</span><span>{playerData.stats.Defending.total}</span></div>
                <div className="flex flex-col items-center"><span>PHY</span><span>{playerData.stats.Physicality.total}</span></div>
              </div>
            </div>

            {/* Huge Name Plate */}
            <div className="flex flex-col mt-4">
              <span className="text-3xl font-bold text-gray-300 leading-tight">{playerData.name}</span>
              <span className="text-5xl font-black leading-none">{playerData.lastName}</span>
            </div>
          </div>

          {/* Bio Data Panel */}
          <div className="bg-[#1A1820] rounded-2xl p-6 grid grid-cols-2 gap-y-6 border border-white/5">
            <div>
              <p className="text-xs text-gray-400 mb-1">Position</p>
              <span className="bg-white/10 px-2 py-1 rounded text-sm font-bold">{playerData.position}</span>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1">Weak Foot</p>
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => <Star key={i} size={14} className={i < playerData.weakFoot ? "fill-white text-white" : "text-gray-600"} />)}
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1">Skill Moves</p>
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => <Star key={i} size={14} className={i < playerData.skillMoves ? "fill-white text-white" : "text-gray-600"} />)}
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1">Preferred Foot</p>
              <p className="font-bold">{playerData.preferredFoot}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1">Height</p>
              <p className="font-bold">{playerData.height}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1">Weight</p>
              <p className="font-bold">{playerData.weight}</p>
            </div>
            <div className="col-span-2">
              <p className="text-xs text-gray-400 mb-2">Alt Positions</p>
              <div className="flex gap-2">
                {playerData.altPositions.map(pos => (
                  <span key={pos} className="bg-white/10 px-2 py-1 rounded text-xs font-bold">{pos}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: The 6 Attribute Bars & Playstyles */}
        <div className="flex-1 flex flex-col gap-6">
          
          {/* Stats Grid */}
          <div className="bg-[#1A1820] rounded-2xl p-6 border border-white/5">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Object.entries(playerData.stats).map(([category, data]) => (
                <div key={category} className="flex flex-col gap-3">
                  {/* Category Header (e.g., Pace 83) */}
                  <div className="flex justify-between items-center border-b border-white/10 pb-1">
                    <span className="font-bold text-lg">{category}</span>
                    <span className="font-black text-xl">{data.total}</span>
                  </div>
                  {/* Sub-stats with Linear Progress Bars */}
                  {Object.entries(data.subs).map(([statName, val]) => (
                    <div key={statName} className="flex flex-col gap-1 text-sm">
                      <div className="flex justify-between text-gray-400">
                        <span>{statName}</span>
                        <span className="text-white font-medium">{val}</span>
                      </div>
                      {/* The Linear Progress Bar */}
                      <div className="w-full h-1 bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${getStatColor(val)}`} 
                          style={{ width: `${val}%` }} 
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Signature Play Styles */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {playerData.playStyles.map(style => (
              <div key={style.name} className="bg-[#1A1820] rounded-xl p-4 border border-white/5 flex flex-col gap-2 hover:bg-white/5 transition-colors">
                <div className="flex items-center gap-2">
                  <Hexagon size={20} className="text-[#E8C881]" />
                  <span className="font-bold">{style.name}</span>
                </div>
                <p className="text-xs text-gray-400 leading-relaxed">{style.desc}</p>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}