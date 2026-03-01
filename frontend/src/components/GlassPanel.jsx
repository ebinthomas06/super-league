import { cn } from '../utils/cn'; 

export function GlassPanel({ children, className = '' }) {
  return (
    <div className={cn("bg-white/5 backdrop-blur-md border border-white/10 rounded-xl", className)}>
      {children}
    </div>
  );
}
