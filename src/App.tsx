import './App.sass';
import React from "react";
import { Header } from "./components/Header/Header";
import { TrafficPage } from "./components/Pages/TrafficPage/TrafficPage";
import { ThemeProvider, StyledEngineProvider, createTheme } from '@mui/material';

const App: React.FC = () => {
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={createTheme(({}))}>
        <div className="kubesharkApp">
          <Header />
          <TrafficPage />
        </div>
      </ThemeProvider>
    </StyledEngineProvider>
  );
}

export default App;
