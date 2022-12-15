import React, { useState } from "react";
import { Button } from "@mui/material";
import { KubesharkWebsocketURL } from "../../../helpers/api";
import debounce from 'lodash/debounce';
import { useSetRecoilState } from "recoil";
import { useCommonStyles } from "../../../helpers/commonStyle"
import serviceMapModalOpenAtom from "../../../recoil/serviceMapModalOpen";
import { TrafficViewer } from "../../TrafficViewer/TrafficViewer"
import "../../../index.sass"
import serviceMap from "./assets/serviceMap.svg";
import trafficStatsIcon from "./assets/trafficStats.svg";
import trafficStatsModalOpenAtom from "../../../recoil/trafficStatsModalOpen";
import { REPLAY_ENABLED } from "../../../consts";

export const TrafficPage: React.FC = () => {
  const commonClasses = useCommonStyles();
  const setServiceMapModalOpen = useSetRecoilState(serviceMapModalOpenAtom);
  const setTrafficStatsModalOpen = useSetRecoilState(trafficStatsModalOpenAtom);
  const [shouldCloseWebSocket, setShouldCloseWebSocket] = useState(false);

  const handleOpenStatsModal = () => {
    setShouldCloseWebSocket(true)
    setTrafficStatsModalOpen(true);
  }

  const openServiceMapModalDebounce = debounce(() => {
    setShouldCloseWebSocket(true)
    setServiceMapModalOpen(true)
  }, 500);

  const actionButtons = <div style={{ display: 'flex', height: "100%" }}>
    <Button
      startIcon={<img src={serviceMap} className="custom" alt="service-map" style={{ marginRight: "8%" }} />}
      size="large"
      variant="contained"
      className={commonClasses.outlinedButton + " " + commonClasses.imagedButton}
      onClick={openServiceMapModalDebounce}
      style={{ marginRight: 25, textTransform: 'unset' }}>
      Service Map
    </Button>
    <Button
      startIcon={<img className="custom" src={trafficStatsIcon} alt="services" />}
      size="large"
      variant="contained"
      className={commonClasses.outlinedButton + " " + commonClasses.imagedButton}
      style={{ textTransform: 'unset' }}
      onClick={handleOpenStatsModal}>
      Traffic Stats
    </Button>
  </div>

  return (
    <>
      <TrafficViewer webSocketUrl={KubesharkWebsocketURL} shouldCloseWebSocket={shouldCloseWebSocket} setShouldCloseWebSocket={setShouldCloseWebSocket}
        actionButtons={actionButtons} entryDetailedConfig={{
          isReplayEnabled: REPLAY_ENABLED
        }} />
    </>
  );
};
