import React from "react";
import styles from './TcpStream.module.sass';
import Queryable from "../../UI/Queryable/Queryable";
import { Button } from "@mui/material";
import { HubBaseUrl } from "../../../consts";
import useWindowDimensions, { useTcpStreamTextsByWidth } from "../../../hooks/WindowDimensionsHook";
import { TcpReplayDialog } from "./TcpReplayDialog";
import { Node } from "../../EntryListItem/Entry";

interface EntryProps {
  index: number;
  stream: string;
  worker: string;
  node: Node;
  color: string;
  ip: string;
  port: string;
}

export const TcpStream: React.FC<EntryProps> = ({ index, stream, worker, node, color, ip, port }) => {

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
          query={`node.ip == "${node.ip}" and stream == "${stream}"`}
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
            href={`${HubBaseUrl}/item/${worker}/${stream}-${index}?field=data`}
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
          query={`node.name == "${node.name}"`}
          displayIconOnMouseOver={true}
          flipped={true}
          iconStyle={{ marginRight: "20px" }}
        >
          <span
            style={{ color: color }}
            title={`The node which this worker runs on: ${stream}`}
          >
            {node.name}
          </span>
        </Queryable>
      </div>

      <div className={`${styles.separator} ${styles.replayButtonWrapper}`}>
        <TcpReplayDialog
          color={color}
          node={node.name}
          tcpReplay={tcpReplay}
          stream={stream}
          worker={worker}
          ip={ip}
          port={port}
        />
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
