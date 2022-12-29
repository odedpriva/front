import React from "react";
import { TrafficViewer } from "../../TrafficViewer/TrafficViewer"
import "../../../index.sass"
import { Entry } from "../../EntryListItem/Entry";
import { useCommonStyles } from "../../../helpers/commonStyle"
import { useSetRecoilState } from "recoil";
import trafficStatsModalOpenAtom from "../../../recoil/trafficStatsModalOpen";
import { Button } from "@mui/material";
import trafficStatsIcon from "../../../assets/trafficStats.svg";

interface TrafficPageProps {
  entries: Entry[];
  setEntries: React.Dispatch<React.SetStateAction<Entry[]>>;
}

export const TrafficPage: React.FC<TrafficPageProps> = ({ entries, setEntries }) => {
  const commonClasses = useCommonStyles();
  const setTrafficStatsModalOpen = useSetRecoilState(trafficStatsModalOpenAtom);

  const handleOpenStatsModal = () => {

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
      <TrafficViewer
        entries={entries}
        setEntries={setEntries}
        actionButtons={actionButtons}
      />
    </>
  );
};
