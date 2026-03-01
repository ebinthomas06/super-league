import { GlassPanel } from './GlassPanel';

export function PlayerCard({ player }) {
  return (
    <GlassPanel className="p-5 flex flex-col items-center group cursor-pointer hover:scale-105 transition-all duration-300 hover:border-white/30 relative overflow-hidden bg-gradient-to-br from-[#111] to-black">
      {/* Decorative metallic sheen */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
      
      <div className="w-28 h-28 rounded-full overflow-hidden border border-white/20 mb-5 group-hover:border-white/50 transition-colors bg-zinc-900 shadow-2xl">
        <img 
          src={player.imgUrl} 
          alt={player.name} 
          className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500 transform group-hover:scale-110" 
        />
      </div>
      
      <h4 className="text-xl font-black tracking-tight text-white mb-1 whitespace-nowrap">{player.name}</h4>
      <p className="text-xs text-zinc-400 font-bold uppercase tracking-widest mb-6">{player.club}</p>
      
      <div className="w-full flex justify-between items-center mb-5 px-3">
        <div className="flex flex-col items-center">
          <span className="text-[10px] text-zinc-500 font-bold">PAC</span>
          <span className="font-mono font-bold text-white tracking-tighter">{player.pace}</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-[10px] text-zinc-500 font-bold">SHO</span>
          <span className="font-mono font-bold text-white tracking-tighter">{player.shooting}</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-[10px] text-zinc-500 font-bold">PAS</span>
          <span className="font-mono font-bold text-white tracking-tighter">{player.passing}</span>
        </div>
      </div>
      
      <div className="w-full pt-4 border-t border-white/10 flex justify-between items-end relative z-10">
        <span className="text-[10px] font-bold text-zinc-500 tracking-widest">OVR</span>
        <span className="text-4xl font-black tabular-nums tracking-tighter drop-shadow-md">{player.rating}</span>
      </div>
    </GlassPanel>
  );
}
