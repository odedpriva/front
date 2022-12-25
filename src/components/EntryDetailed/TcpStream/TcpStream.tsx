import React from "react";
import styles from './TcpStream.module.sass';
import Queryable from "../../UI/Queryable/Queryable";
import { Button } from "@mui/material";
import { toast } from "react-toastify";
import { HubBaseUrl } from "../../../consts";
import useWindowDimensions, { useTcpStreamTextsByWidth } from "../../../hooks/WindowDimensionsHook";

interface EntryProps {
  index: number;
  stream: string;
  worker: string;
  node: string;
  color: string;
}

export const TcpStream: React.FC<EntryProps> = ({ index, stream, worker, node, color }) => {

  const replayTcpStream = () => {
    fetch(`${HubBaseUrl}/pcaps/replay/${worker}/${stream}`)
      .then(response => {
        if (response.status === 200) {
          toast.info("TCP replay was successful.", {
            theme: "colored"
          });
        } else {
          toast.error("TCP replay was failed!", {
            theme: "colored"
          });
        }
      })
      .catch(err => {
        console.error(err);
        toast.error(err.toString(), {
          theme: "colored"
        });
      });
  }

  const { width } = useWindowDimensions();
  const { tcpStream, indexText, nodeText, tcpReplay, downloadPcap } = useTcpStreamTextsByWidth(width)

  return <React.Fragment>
    <div className={`${styles.row}`}>

      <div className={`${styles.separator}`}>
        <span
          className={`${styles.title}`}
        >
          {tcpStream}
        </span>
        <Queryable
          query={`worker == "${worker}" and stream == "${stream}"`}
          displayIconOnMouseOver={true}
          flipped={true}
          iconStyle={{ marginRight: "20px" }}
        >
          <a
            style={{ textDecoration: "none" }}
            href={`${HubBaseUrl}/pcaps/download/${worker}/${stream}`}
          >
            <span
              style={{ color: color }}
              title={`TCP stream in the worker: ${worker}`}
            >
              {worker}/{stream}
            </span>
          </a>
        </Queryable>
      </div>

      <div className={`${styles.separator}`}>
        <span
          className={`${styles.title} ${styles.marginLeft10}`}
        >
          {indexText}
        </span>
        <Queryable
          query={`index == ${index}`}
          displayIconOnMouseOver={true}
          flipped={true}
          iconStyle={{ marginRight: "20px" }}
        >
          <a
            style={{ textDecoration: "none" }}
            href={`${HubBaseUrl}/item/${worker}/${stream}-${index}`}
            target="_blank"
            rel="noreferrer"
          >
            <span
              style={{ color: color }}
              title={`The index of the item in this TCP stream: ${stream}`}
            >
              {index}
            </span>
          </a>
        </Queryable>
      </div>

      <div className={`${styles.separator} ${styles.nodeWrapper}`}>
        <span
          className={`${styles.title} ${styles.marginLeft10}`}
        >
          {nodeText}
        </span>
        <Queryable
          query={`node == ${node}`}
          displayIconOnMouseOver={true}
          flipped={true}
          iconStyle={{ marginRight: "20px" }}
        >
          <span
            style={{ color: color }}
            title={`The node which this worker runs on: ${stream}`}
          >
            {node}
          </span>
        </Queryable>
      </div>

      <div className={`${styles.separator} ${styles.replayButtonWrapper}`}>
        <Button
          variant="contained"
          className={`${styles.marginLeft10} ${styles.button}`}
          style={{
            backgroundColor: color,
          }}
          onClick={replayTcpStream}
          title={`Replay this TCP stream to the default network interface of the node: ${node}`}
        >
          {tcpReplay}
        </Button>
      </div>

      <div className={`${styles.separator} ${styles.pcapButtonWrapper}`}>
        <Button
          variant="contained"
          className={`${styles.marginLeft10} ${styles.button}`}
          style={{
            backgroundColor: color,
          }}
          href={`${HubBaseUrl}/pcaps/download/${worker}/${stream}`}
          title={`Download this TCP stream in PCAP format: ${stream}`}
        >
          {downloadPcap}
        </Button>
      </div>

    </div>
  </React.Fragment>
}
