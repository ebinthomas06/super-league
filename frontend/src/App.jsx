import { useState, useEffect } from 'react';
import { LeagueProvider } from './context/LeagueContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Layout } from './Layout';
import { Loader } from './components/Loader';
import { Onboarding } from './pages/Onboarding';

function AuthGuard() {
  const { user, profile, loading } = useAuth();
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    // Keep minimal artificial delay to prevent raw state flashing
    const timer = setTimeout(() => setInitialLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  if (loading || initialLoading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center">
        <Loader className="w-24 h-24 mb-4 drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]" />
        <h2 className="text-xl sm:text-2xl font-black tracking-[0.2em] text-white/90 uppercase animate-pulse">
          Loading...
        </h2>
      </div>
    );
  }

  // Force onboarding if logged in but no profile
  if (user && !profile) {
    return <Onboarding />;
  }

  // Allow app access to everyone (Login happens voluntarily or on restricted pages)
  return (
    <LeagueProvider>
      <Layout />
    </LeagueProvider>
  );
}

function App() {
  return (
    <AuthProvider>
      <AuthGuard />
    </AuthProvider>
  );
}

export default App;
