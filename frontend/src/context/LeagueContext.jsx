import { createContext, useContext, useState } from 'react';

const LeagueContext = createContext(undefined);

export function LeagueProvider({ children }) {
  const [division, setDivision] = useState('mens'); // 'mens' | 'womens'
  const [view, setView] = useState('home'); // 'home' | 'matches' | 'standings' | 'players' | 'news' | 'legends' | 'rules'

  return (
    <LeagueContext.Provider value={{ division, setDivision, view, setView }}>
      {children}
    </LeagueContext.Provider>
  );
}

export function useLeague() {
  const context = useContext(LeagueContext);
  if (context === undefined) {
    throw new Error('useLeague must be used within a LeagueProvider');
  }
  return context;
}
