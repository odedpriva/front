import React, { useState } from "react";
import styles from './EntriesList.module.sass';
import ScrollableFeedVirtualized from "react-scrollable-feed-virtualized";
import down from "./assets/downImg.svg";
import { useRecoilValue } from "recoil";
import queryAtom from "../../recoil/query";
import Moment from "moment";
import { useInterval } from "../../helpers/interval";
import { EntryItem } from "../EntryListItem/EntryListItem";

interface EntriesListProps {
  entries: typeof EntryItem[];
  listEntryREF: React.LegacyRef<HTMLDivElement>;
  onSnapBrokenEvent: () => void;
  isSnappedToBottom: boolean;
  setIsSnappedToBottom: (state: boolean) => void;
  openWebSocket: (leftOff: string, query: string, resetEntries: boolean, fetch: number, fetchTimeoutMs: number) => void;
  scrollableRef: React.MutableRefObject<ScrollableFeedVirtualized>;
  ws: React.MutableRefObject<WebSocket>;
}

export const EntriesList: React.FC<EntriesListProps> = ({
  entries,
  listEntryREF,
  onSnapBrokenEvent,
  isSnappedToBottom,
  setIsSnappedToBottom,
  openWebSocket,
  scrollableRef,
  ws
}) => {

  const query = useRecoilValue(queryAtom);
  const isWsConnectionClosed = ws?.current?.readyState !== WebSocket.OPEN;
  const [totalTcpStreams, setTotalTcpStreams] = useState(0);

  const [startTime] = useState(0);

  useInterval(async () => {
    fetch('http://localhost:8898/pcaps/total-tcp-streams')
      .then(response => response.json())
      .then(data => setTotalTcpStreams(data.total));
  }, 3000, true);

  return <React.Fragment>
    <div className={styles.list}>
      <div id="list" ref={listEntryREF} className={styles.list}>
        <ScrollableFeedVirtualized ref={scrollableRef} itemHeight={48} marginTop={10} onSnapBroken={onSnapBrokenEvent}>
          {false /* It's because the first child is ignored by ScrollableFeedVirtualized */}
          {entries}
        </ScrollableFeedVirtualized>
        <button type="button"
          title="Snap to bottom"
          className={`${styles.btnLive} ${isSnappedToBottom && !isWsConnectionClosed ? styles.hideButton : styles.showButton}`}
          onClick={() => {
            if (isWsConnectionClosed) {
              openWebSocket("", query, false, 0, 0);
            }
            scrollableRef.current.jumpToBottom();
            setIsSnappedToBottom(true);
          }}>
          <img alt="down" src={down} />
        </button>
      </div>

      <div className={styles.footer}>
        <div>Showing <b id="item-count">{entries.length}</b> items from a total of <b
          id="total-tcp-streams">{totalTcpStreams}</b> TCP streams
        </div>
        {startTime !== 0 && <div>First traffic entry time <span style={{
          marginRight: 5,
          fontWeight: 600,
          fontSize: 13
        }}>{Moment(startTime).utc().format('MM/DD/YYYY, h:mm:ss.SSS A')}</span>
        </div>}
      </div>
    </div>
  </React.Fragment>;
};
