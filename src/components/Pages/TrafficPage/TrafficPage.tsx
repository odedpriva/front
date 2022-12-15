import React, { useState } from "react";
import { Button } from "@mui/material";
import { KubesharkWebsocketURL } from "../../../helpers/api";
import { useSetRecoilState } from "recoil";
import { useCommonStyles } from "../../../helpers/commonStyle"
import { TrafficViewer } from "../../TrafficViewer/TrafficViewer"
import "../../../index.sass"
import trafficStatsIcon from "./assets/trafficStats.svg";
import trafficStatsModalOpenAtom from "../../../recoil/trafficStatsModalOpen";
import { REPLAY_ENABLED } from "../../../consts";

export const TrafficPage: React.FC = () => {
  const commonClasses = useCommonStyles();
  const setTrafficStatsModalOpen = useSetRecoilState(trafficStatsModalOpenAtom);
  const [shouldCloseWebSocket, setShouldCloseWebSocket] = useState(false);

  const handleOpenStatsModal = () => {
    setShouldCloseWebSocket(true)
    setTrafficStatsModalOpen(true);
  }

  const actionButtons = <div style={{ display: 'flex', height: "100%" }}>
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
