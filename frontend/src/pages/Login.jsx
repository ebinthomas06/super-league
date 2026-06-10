import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { GlassPanel } from '../components/GlassPanel';
import { LogIn } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

export function Login() {
  const { signInWithGoogle, loading, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // 1. Grab the intended destination (defaults to "/")
  const from = location.state?.from?.pathname || "/";

  // 2. Save the destination to sessionStorage BEFORE they leave for Google
  useEffect(() => {
    if (from !== "/") {
      sessionStorage.setItem('authRedirect', from);
    }
  }, [from]);

  // 3. When the user comes back and is authenticated, send them to the saved route
  useEffect(() => {
    if (user) {
      // Check if we have a saved destination, otherwise go to home
      const finalDestination = sessionStorage.getItem('authRedirect') || "/";
      
      // Clean up the storage so it doesn't mess with future logins
      sessionStorage.removeItem('authRedirect'); 
      
      navigate(finalDestination, { replace: true });
    }
  }, [user, navigate]);
  
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background aesthetics */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-white/5 rounded-full blur-[120px] -z-10 mix-blend-screen" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-zinc-500/10 rounded-full blur-[100px] -z-10 mix-blend-screen" />

      <GlassPanel className="max-w-md w-full p-8 sm:p-12 text-center relative z-10 border border-white/10 bg-black/60 backdrop-blur-2xl">
        <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tighter mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-500">
          Super League
        </h1>
        <p className="text-zinc-400 font-medium mb-12 tracking-wide uppercase text-sm">
          IIIT Kottayam Official App
        </p>

        <button
          onClick={signInWithGoogle}
          disabled={loading}
          className="group relative w-full overflow-hidden rounded-2xl p-[1px] transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
        >
          <span className="absolute inset-0 bg-gradient-to-r from-zinc-500 via-white to-zinc-500 opacity-50 group-hover:opacity-100 transition-opacity" />
          <div className="relative flex items-center justify-center gap-3 bg-black px-8 py-5 rounded-2xl h-full w-full">
            <LogIn className="w-5 h-5 text-white" />
            <span className="font-bold text-lg text-white uppercase tracking-widest">
              {loading ? "Connecting..." : "Sign in with Google"}
            </span>
          </div>
        </button>

        <p className="mt-8 text-xs text-zinc-600 uppercase tracking-widest font-black">
          Restricted to @iiitkottayam.ac.in domains
        </p>
      </GlassPanel>
    </div>
  );
}