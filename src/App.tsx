import './App.sass';
import React from "react";
import { Header } from "./components/Header/Header";
import { TrafficPage } from "./components/Pages/TrafficPage/TrafficPage";
import { useRecoilState } from "recoil";
import trafficStatsModalOpenAtom from "./recoil/trafficStatsModalOpen";
import Api from './helpers/api';
import { ThemeProvider, StyledEngineProvider, createTheme } from '@mui/material';
import { TrafficStatsModal } from './components/modals/TrafficStatsModal/TrafficStatsModal';

const api = Api.getInstance()

const App: React.FC = () => {

  const [trafficStatsModalOpen, setTrafficStatsModalOpen] = useRecoilState(trafficStatsModalOpenAtom);

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={createTheme(({}))}>
        <div className="kubesharkApp">
          <Header />
          <TrafficPage />
          <TrafficStatsModal isOpen={trafficStatsModalOpen} onClose={() => setTrafficStatsModalOpen(false)} getTrafficStatsDataApi={api.getTrafficStats} />
        </div>
      </ThemeProvider>
    </StyledEngineProvider>
  );
}

export default App;
