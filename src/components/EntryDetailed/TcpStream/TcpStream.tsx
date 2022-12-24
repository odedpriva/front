import React from "react";
import styles from './TcpStream.module.sass';
import Queryable from "../../UI/Queryable/Queryable";
import { Button } from "@mui/material";
import { toast } from "react-toastify";
import { HubBaseUrl } from "../../../consts";

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

  return <React.Fragment>
    <div
      className={`${styles.row}`}
    >
      <span
        className={`${styles.title}`}
      >
        TCP Stream:
      </span>
      <Queryable
        query={`worker == "${worker}" and stream == "${stream}"`}
        displayIconOnMouseOver={true}
        flipped={true}
        iconStyle={{ marginRight: "20px" }}
      >
        <span
          style={{ color: color }}
          title={`TCP Stream in worker: ${worker}`}
        >
          {worker}/{stream}
        </span>
      </Queryable>

      <span
        className={`${styles.title} ${styles.marginLeft40}`}
      >
        Index:
      </span>
      <Queryable
        query={`index == ${index}`}
        displayIconOnMouseOver={true}
        flipped={true}
        iconStyle={{ marginRight: "20px" }}
      >
        <a style={{ textDecoration: "none" }} href={`${HubBaseUrl}/item/${worker}/${stream}-${index}`}>
          <span
            style={{ color: color }}
            title={`The index of the item in the stream: ${stream}`}
          >
            {index}
          </span>
        </a>
      </Queryable>

      <span
        className={`${styles.title} ${styles.marginLeft40}`}
      >
        Node:
      </span>
      <Queryable
        query={`node == ${node}`}
        displayIconOnMouseOver={true}
        flipped={true}
        iconStyle={{ marginRight: "20px" }}
      >
        <span
          style={{ color: color }}
          title={`The node that this worker runs on: ${stream}`}
        >
          {node}
        </span>
      </Queryable>

      <Button
        variant="contained"
        className={`${styles.marginLeft80}`}
        style={{
          backgroundColor: color,
          fontWeight: 600,
          borderRadius: "4px",
          color: "#fff",
          textTransform: "none",
          fontSize: "12px",
          height: "24px",
        }}
        onClick={replayTcpStream}
        title={`Replay this whole TCP stream to the default network interface of the node: ${node}`}
      >
        TCP Replay
      </Button>

      <Button
        variant="contained"
        style={{
          margin: "0px 0px 0px 30px",
          backgroundColor: color,
          fontWeight: 600,
          borderRadius: "4px",
          color: "#fff",
          textTransform: "none",
          fontSize: "12px",
          height: "24px",
        }}
        href={`${HubBaseUrl}/pcaps/download/${worker}/${stream}`}
        title={`Download the this TCP stream in PCAP format: ${stream}`}
      >
        Download PCAP
      </Button>

    </div>
  </React.Fragment>
}
