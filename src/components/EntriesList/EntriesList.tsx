import React, { useRef, useEffect, useMemo, useState } from "react";
import styles from './EntriesList.module.sass';
import ScrollableFeedVirtualized from "react-scrollable-feed-virtualized";
import { Entry, EntryItem } from "../EntryListItem/EntryListItem";
import down from "./assets/downImg.svg";
import { useRecoilState, useRecoilValue } from "recoil";
import entriesAtom from "../../recoil/entries";
import entriesBufferAtom from "../../recoil/entriesBuffer";
import queryAtom from "../../recoil/query";
import focusedEntryIdAtom from "../../recoil/focusedEntryId";
import focusedEntryWorkerAtom from "../../recoil/focusedEntryWorker";
import Moment from "moment";

interface EntriesListProps {
  listEntryREF: React.LegacyRef<HTMLDivElement>;
  onSnapBrokenEvent: () => void;
  isSnappedToBottom: boolean;
  setIsSnappedToBottom: (state: boolean) => void;
  openWebSocket: (leftOff: string, query: string, resetEntries: boolean, fetch: number, fetchTimeoutMs: number) => void;
  scrollableRef: React.MutableRefObject<ScrollableFeedVirtualized>;
  ws: React.MutableRefObject<WebSocket>;
}

const useInterval = (callback, interval, immediate) => {
  const ref = useRef();

  // keep reference to callback without restarting the interval
  useEffect(() => {
    ref.current = callback;
  }, [callback]);

  useEffect(() => {
    // when this flag is set, closure is stale
    let cancelled = false;

    // wrap callback to pass isCancelled getter as an argument
    const fn = () => {
      // @ts-expect-error: What?
      ref.current(() => cancelled);
    };

    // set interval and run immediately if requested
    const id = setInterval(fn, interval);
    if (immediate) fn();

    // define cleanup logic that runs
    // when component is unmounting
    // or when or interval or immediate have changed
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [interval, immediate]);
};

export const EntriesList: React.FC<EntriesListProps> = ({
  listEntryREF,
  onSnapBrokenEvent,
  isSnappedToBottom,
  setIsSnappedToBottom,
  openWebSocket,
  scrollableRef,
  ws
}) => {

  const [entries, setEntries] = useRecoilState(entriesAtom);
  const [entriesBuffer, setEntriesBuffer] = useRecoilState(entriesBufferAtom);
  const query = useRecoilValue(queryAtom);
  const isWsConnectionClosed = ws?.current?.readyState !== WebSocket.OPEN;
  const [focusedEntryId, setFocusedEntryId] = useRecoilState(focusedEntryIdAtom);
  const [focusedEntryWorker, setFocusedEntryWorker] = useRecoilState(focusedEntryWorkerAtom);
  const [totalTcpStreams, setTotalTcpStreams] = useState(0);

  const [startTime] = useState(0);

  const memoizedEntries: Entry[] = useMemo(() => {
    return entries;
  }, [entries]);

  useEffect(() => {
    if (!focusedEntryId && entries.length > 0) {
      setFocusedEntryId(entries[0].id);
      setFocusedEntryWorker(entries[0].worker);
    }
  }, [focusedEntryId, focusedEntryWorker, entries, setFocusedEntryId, setFocusedEntryWorker])

  useInterval(async () => {
    fetch('http://localhost:8898/pcaps/total-tcp-streams')
      .then(response => response.json())
      .then(data => setTotalTcpStreams(data.total));
  }, 1000, true);

  useInterval(async () => {
    setEntries(entriesBuffer)
  }, 1000, true);

  if (ws.current && !ws.current.onmessage) {
    ws.current.onmessage = (e) => {
      if (!e?.data) return;
      const message = JSON.parse(e.data);
      setEntriesBuffer(entriesState => [...entriesState, message]);
    }
  }

  return <React.Fragment>
    <div className={styles.list}>
      <div id="list" ref={listEntryREF} className={styles.list}>
        <ScrollableFeedVirtualized ref={scrollableRef} itemHeight={48} marginTop={10} onSnapBroken={onSnapBrokenEvent}>
          {false /* It's because the first child is ignored by ScrollableFeedVirtualized */}
          {memoizedEntries.map(entry => <EntryItem
            key={`item-${entry.worker}-${entry.id}`}
            entry={entry}
            style={{}}
            headingMode={false}
          />)}
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
