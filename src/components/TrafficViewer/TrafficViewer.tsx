import React, { useCallback, useEffect, useRef, useState } from "react";
import { Filters } from "../Filters/Filters";
import { EntriesList } from "../EntriesList/EntriesList";
import makeStyles from '@mui/styles/makeStyles';
import TrafficViewerStyles from "./TrafficViewer.module.sass";
import styles from '../EntriesList/EntriesList.module.sass';
import { EntryDetailed } from "../EntryDetailed/EntryDetailed";
import playIcon from "./assets/run.svg";
import pauseIcon from "./assets/pause.svg";
import variables from '../../variables.module.scss';
import { useRecoilState, useSetRecoilState } from "recoil";
import focusedEntryIdAtom from "../../recoil/focusedEntryId";
import focusedTcpKeyAtom from "../../recoil/focusedTcpKey";
import { StatusBar } from "../UI/StatusBar/StatusBar";
import { EntryItem } from "../EntryListItem/EntryListItem";
import { useInterval } from "../../helpers/interval";
import { toast } from "react-toastify";

const useLayoutStyles = makeStyles(() => ({
  details: {
    flex: "0 0 50%",
    width: "45vw",
    padding: "12px 24px",
    borderRadius: 4,
    marginTop: 15,
    background: variables.headerBackgroundColor,
  },

  viewer: {
    display: "flex",
    overflowY: "auto",
    height: "calc(100% - 70px)",
    padding: 5,
    paddingBottom: 0,
    overflow: "auto",
  },
}));

interface TrafficViewerProps {
  api?: unknown
}

export const TrafficViewer: React.FC<TrafficViewerProps> = () => {

  const classes = useLayoutStyles();
  const [entries, setEntries] = useState([] as typeof EntryItem[]);
  const [entriesBuffer, setEntriesBuffer] = useState([] as typeof EntryItem[]);
  const [focusedEntryId, setFocusedEntryId] = useRecoilState(focusedEntryIdAtom);
  const setFocusedTcpKey = useSetRecoilState(focusedTcpKeyAtom);
  const [query, setQuery] = useState("");
  const [isSnappedToBottom, setIsSnappedToBottom] = useState(true);
  const [wsReadyState, setWsReadyState] = useState(0);

  const scrollableRef = useRef(null);
  const ws = useRef(null);
  const queryRef = useRef(null);
  queryRef.current = query;

  useEffect(() => {
    let init = false;
    if (!init) openWebSocket();
    return () => { init = true; }
  }, []);

  const closeWebSocket = useCallback(() => {
    ws.current.close(1000);
  }, [ws]);

  const sendQueryWhenWsOpen = () => {
    setTimeout(() => {
      if (ws?.current?.readyState === WebSocket.OPEN) {
        ws.current.send(queryRef.current);
      } else {
        sendQueryWhenWsOpen();
      }
    }, 500);
  };

  const listEntry = useRef(null);
  const openWebSocket = () => {
    setFocusedEntryId(null);
    setEntriesBuffer([]);
    setEntries([]);

    try {
      ws.current = new WebSocket("ws://localhost:8898/ws");
      sendQueryWhenWsOpen();

      ws.current.onopen = () => {
        setWsReadyState(ws?.current?.readyState);
        toast.success("Connected to Hub.", {
          theme: "colored",
          autoClose: 1000,
        });
      }

      ws.current.onclose = (e) => {
        console.log(e.code);
        setWsReadyState(ws?.current?.readyState);
        let delay = 3000;
        let msg = "Trying to reconnect...";
        if (e.code === 1006) {
          toast.warning("Workers are down!", {
            theme: "colored",
            autoClose: 1000,
          });
        } else if (e.code === 1000) {
          delay = 100;
          msg = "Connecting with the new filter..."
        }

        toast.info(msg, {
          theme: "colored",
          autoClose: 1000,
        });
        setTimeout(() => {
          openWebSocket();
        }, delay);
      }

      ws.current.onerror = (err) => {
        console.error("WebSocket error:", err);
        toast.error("Hub is down!", {
          theme: "colored",
          autoClose: 1000,
        });
        if (ws?.current?.readyState === WebSocket.OPEN) {
          ws.current.close();
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const toggleConnection = useCallback(async () => {
    if (ws?.current?.readyState === WebSocket.OPEN) {
      closeWebSocket();
    }
    scrollableRef.current.jumpToBottom();
    setIsSnappedToBottom(true);
  }, [scrollableRef, setIsSnappedToBottom, closeWebSocket]);

  const reopenConnection = useCallback(async () => {
    closeWebSocket();
    scrollableRef.current.jumpToBottom();
    setIsSnappedToBottom(true);
  }, [scrollableRef, setIsSnappedToBottom, closeWebSocket]);

  useEffect(() => {
    return () => {
      if (ws?.current?.readyState === WebSocket.OPEN) {
        ws.current.close();
      }
    };
  }, []);

  const getConnectionIndicator = () => {
    switch (wsReadyState) {
    case WebSocket.OPEN:
      return <div
        className={`${TrafficViewerStyles.indicatorContainer} ${TrafficViewerStyles.greenIndicatorContainer}`}>
        <div className={`${TrafficViewerStyles.indicator} ${TrafficViewerStyles.greenIndicator}`} />
      </div>
    default:
      return <div
        className={`${TrafficViewerStyles.indicatorContainer} ${TrafficViewerStyles.redIndicatorContainer}`}>
        <div className={`${TrafficViewerStyles.indicator} ${TrafficViewerStyles.redIndicator}`} />
      </div>
    }
  }

  const getConnectionTitle = () => {
    switch (wsReadyState) {
    case WebSocket.OPEN:
      return "streaming live traffic"
    default:
      return "streaming paused";
    }
  }

  const onSnapBrokenEvent = () => {
    setIsSnappedToBottom(false);
  }

  if (ws.current && !ws.current.onmessage) {
    ws.current.onmessage = (e) => {
      if (!e?.data) return;
      const entry = JSON.parse(e.data);
      const key = `${entry.worker}/${entry.id}`;
      const tcpKey = `${entry.worker}/${entry.id.split('-')[0]}`;

      setEntriesBuffer(
        // @ts-expect-error: Type?
        entriesState => [...entriesState,
          <EntryItem
            key={key}
            id={key}
            tcpKey={tcpKey}
            entry={entry}
            style={{}}
            headingMode={false}
          />
        ]
      );
    }
  }

  useInterval(async () => {
    setEntries(entriesBuffer);
    if (!focusedEntryId && entriesBuffer.length > 0) {
      // @ts-expect-error: Type?
      setFocusedEntryId(entriesBuffer[0].key);
      // @ts-expect-error: Type?
      setFocusedTcpKey(entriesBuffer[0].tcpKey);
    }
  }, 1000, true);

  return (
    <div className={TrafficViewerStyles.TrafficPage}>
      <StatusBar />
      <div className={TrafficViewerStyles.TrafficPageHeader}>
        <div className={TrafficViewerStyles.TrafficPageStreamStatus}>
          <img id="pause-icon"
            className={TrafficViewerStyles.playPauseIcon}
            style={{ visibility: wsReadyState === WebSocket.OPEN ? "visible" : "hidden" }}
            alt="pause"
            src={pauseIcon}
            onClick={toggleConnection} />
          <img id="play-icon"
            className={TrafficViewerStyles.playPauseIcon}
            style={{ position: "absolute", visibility: wsReadyState === WebSocket.OPEN ? "hidden" : "visible" }}
            alt="play"
            src={playIcon}
            onClick={toggleConnection} />
          <div className={TrafficViewerStyles.connectionText}>
            {getConnectionTitle()}
            {getConnectionIndicator()}
          </div>
        </div>
      </div>
      {<div className={TrafficViewerStyles.TrafficPageContainer}>
        <div className={TrafficViewerStyles.TrafficPageListContainer}>
          <Filters
            reopenConnection={reopenConnection}
            query={query}
            onQueryChange={(query) => { setQuery(query?.trim()); }}
          />
          <div className={styles.container}>
            <EntriesList
              entries={entries}
              listEntryREF={listEntry}
              onSnapBrokenEvent={onSnapBrokenEvent}
              isSnappedToBottom={isSnappedToBottom}
              setIsSnappedToBottom={setIsSnappedToBottom}
              scrollableRef={scrollableRef}
            />
          </div>
        </div>
        <div className={classes.details} id="rightSideContainer">
          <EntryDetailed />
        </div>
      </div>}
    </div>
  );
};
