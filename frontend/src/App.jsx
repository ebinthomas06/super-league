import { LeagueProvider } from './context/LeagueContext';
import { Layout } from './Layout';

function App() {
  return (
    <LeagueProvider>
      <Layout />
    </LeagueProvider>
  );
}

export default App;
