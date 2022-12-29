import './App.sass';
import React, { useState } from "react";
import { Header } from "./components/Header/Header";
import { TrafficPage } from "./components/Pages/TrafficPage/TrafficPage";
import { ThemeProvider, StyledEngineProvider, createTheme } from '@mui/material';
import { useRecoilState } from "recoil";
import trafficStatsModalOpenAtom from "./recoil/trafficStatsModalOpen";
import { TrafficStatsModal } from './components/modals/TrafficStatsModal/TrafficStatsModal';
import { Entry } from "./components/EntryListItem/Entry";

const App: React.FC = () => {

  const [entries, setEntries] = useState([] as Entry[]);
  const [trafficStatsModalOpen, setTrafficStatsModalOpen] = useRecoilState(trafficStatsModalOpenAtom);

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={createTheme(({}))}>
        <div className="kubesharkApp">
          <Header />
          <TrafficPage
            entries={entries}
            setEntries={setEntries}
          />
          <TrafficStatsModal entries={entries} isOpen={trafficStatsModalOpen} onClose={() => setTrafficStatsModalOpen(false)} />
        </div>
      </ThemeProvider>
    </StyledEngineProvider>
  );
}

export default App;
