import './App.sass';
import React, { useState } from "react";
import { Header } from "./components/Header/Header";
import { TrafficPage } from "./components/Pages/TrafficPage/TrafficPage";
import { ThemeProvider, StyledEngineProvider, createTheme } from '@mui/material';
import { useRecoilState } from "recoil";
import serviceMapModalOpenAtom from "./recoil/serviceMapModalOpen";
import trafficStatsModalOpenAtom from "./recoil/trafficStatsModalOpen";
import { ServiceMapModal } from './components/modals/ServiceMapModal/ServiceMapModal';
import { TrafficStatsModal } from './components/modals/TrafficStatsModal/TrafficStatsModal';
import { Entry } from "./components/EntryListItem/Entry";

const App: React.FC = () => {

  const [entries, setEntries] = useState([] as Entry[]);
  const [lastUpdated, setLastUpdated] = useState(0);
  const [serviceMapModalOpen, setServiceMapModalOpen] = useRecoilState(serviceMapModalOpenAtom);
  const [trafficStatsModalOpen, setTrafficStatsModalOpen] = useRecoilState(trafficStatsModalOpenAtom);

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={createTheme(({}))}>
        <div className="kubesharkApp">
          <Header />
          <TrafficPage
            entries={entries}
            setEntries={setEntries}
            setLastUpdated={setLastUpdated}
          />
          <ServiceMapModal
            entries={entries}
            lastUpdated={lastUpdated}
            isOpen={serviceMapModalOpen}
            onClose={() => setServiceMapModalOpen(false)}
          />
          <TrafficStatsModal
            entries={entries}
            lastUpdated={lastUpdated}
            isOpen={trafficStatsModalOpen}
            onClose={() => setTrafficStatsModalOpen(false)}
          />
        </div>
      </ThemeProvider>
    </StyledEngineProvider>
  );
}

export default App;
