import React from "react";
import { TrafficViewer } from "../../TrafficViewer/TrafficViewer"
import "../../../index.sass"
import { Entry } from "../../EntryListItem/Entry";
import { useCommonStyles } from "../../../helpers/commonStyle"
import { useSetRecoilState } from "recoil";
import serviceMapModalOpenAtom from "../../../recoil/serviceMapModalOpen";
import trafficStatsModalOpenAtom from "../../../recoil/trafficStatsModalOpen";
import { Button } from "@mui/material";
import serviceMapIcon from "../../../assets/serviceMap.svg";
import trafficStatsIcon from "../../../assets/trafficStats.svg";

interface TrafficPageProps {
  entries: Entry[];
  setEntries: React.Dispatch<React.SetStateAction<Entry[]>>;
  setLastUpdated: React.Dispatch<React.SetStateAction<number>>;
}

export const TrafficPage: React.FC<TrafficPageProps> = ({ entries, setEntries, setLastUpdated }) => {
  const commonClasses = useCommonStyles();
  const setServiceMapModalOpen = useSetRecoilState(serviceMapModalOpenAtom);
  const setTrafficStatsModalOpen = useSetRecoilState(trafficStatsModalOpenAtom);

  const handleServiceMapModal = () => {
    setServiceMapModalOpen(true);
  }

  const handleOpenStatsModal = () => {
    setTrafficStatsModalOpen(true);
  }

  const actionButtons = <div style={{ display: 'flex', height: "100%" }}>
    <Button
      startIcon={<img className="custom" src={serviceMapIcon} alt="service-map" style={{ marginRight: "8%" }} />}
      size="large"
      variant="contained"
      className={commonClasses.outlinedButton + " " + commonClasses.imagedButton}
      onClick={handleServiceMapModal}
      style={{ marginRight: 25, textTransform: 'unset' }}>
      Service Map
    </Button>
    <Button
      startIcon={<img className="custom" src={trafficStatsIcon} alt="stats" />}
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
        setLastUpdated={setLastUpdated}
        actionButtons={actionButtons}
      />
    </>
  );
};
