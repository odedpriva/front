import React from "react";
import { Backdrop, Box, Fade, Modal } from "@mui/material";
import styles from "./TrafficStatsModal.module.sass";
import closeIcon from "./assets/close.svg";
import { TrafficPieChart } from "./TrafficPieChart/TrafficPieChart";
import { Entry } from "../../EntryListItem/Entry";

const modalStyle = {
  position: 'absolute',
  top: '6%',
  left: '50%',
  transform: 'translate(-50%, 0%)',
  width: '60vw',
  height: '40vh',
  bgcolor: 'background.paper',
  borderRadius: '5px',
  boxShadow: 24,
  p: 4,
  color: '#000',
};

interface TrafficStatsModalProps {
  entries: Entry[];
  isOpen: boolean;
  onClose: () => void;
}

export const TrafficStatsModal: React.FC<TrafficStatsModalProps> = ({ entries, isOpen, onClose }) => {
  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={isOpen}
      onClose={onClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{ timeout: 500 }}>
      <Fade in={isOpen}>
        <Box sx={modalStyle}>
          <div className={styles.closeIcon}>
            <img src={closeIcon} alt="close" onClick={() => onClose()} style={{ cursor: "pointer", userSelect: "none" }} />
          </div>
          <div className={styles.headlineContainer}>
            <div className={styles.title}>Traffic Statistics</div>
          </div>
          <div className={styles.mainContainer}>
            <div>
              <TrafficPieChart entries={entries} />
            </div>
          </div>
        </Box>
      </Fade>
    </Modal>
  );
}
