import { cn } from '../utils/cn';

export function FormGuide({ form = [] }) {
  return (
    <div className="flex items-center gap-1.5">
      {form.map((result, i) => {
        let baseClass = "w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold font-mono transition-transform hover:scale-110";
        if (result === 'W') baseClass = cn(baseClass, "bg-white text-black");
        else if (result === 'D') baseClass = cn(baseClass, "bg-transparent border border-white text-white");
        else if (result === 'L') baseClass = cn(baseClass, "bg-[#1A1A1A] text-zinc-400");
        return (
          <div key={`${result}-${i}`} className={baseClass}>
            {result}
          </div>
        );
      })}
    </div>
  );
}
