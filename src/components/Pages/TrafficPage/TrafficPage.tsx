import React from "react";
import { TrafficViewer } from "../../TrafficViewer/TrafficViewer"
import "../../../index.sass"
import { REPLAY_ENABLED } from "../../../consts";

export const TrafficPage: React.FC = () => {
  return (
    <>
      <TrafficViewer
        entryDetailedConfig={{
          isReplayEnabled: REPLAY_ENABLED
        }} />
    </>
  );
};
