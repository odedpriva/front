import React, { useState, useCallback, useEffect, useMemo } from "react"
import SectionsRepresentation from "./SectionsRepresentation";
import { ReactComponent as ReplayIcon } from './replay.svg';
import styles from './EntryViewer.module.sass';
import { Tabs } from "../../UI";
import { toast } from "react-toastify";
import { HubBaseUrl } from "../../../consts";

export enum TabsEnum {
  Request = 0,
  Response = 1
}

interface AutoRepresentationProps {
  id: string;
  worker: string;
  representation: string;
  color: string;
  openedTab?: TabsEnum;
}

const replayTcpStream = (id: string, worker: string) => {
  fetch(`${HubBaseUrl}/pcaps/replay/${worker}/${id}`)
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

export const AutoRepresentation: React.FC<AutoRepresentationProps> = ({ id, worker, representation, color, openedTab = TabsEnum.Request }) => {
  const { request, response } = JSON.parse(representation);

  const TABS = useMemo(() => {
    const arr = [
      {
        tab: 'Request',
        badge: null
      }]

    if (response && response.length > 0) {
      arr.push({
        tab: 'Response',
        badge: null
      });
    }

    return arr
  }, [response]);

  const [currentTab, setCurrentTab] = useState(TABS[0].tab);

  const getOpenedTabIndex = useCallback(() => {
    const currentIndex = TABS.findIndex(current => current.tab === currentTab)
    return currentIndex > -1 ? currentIndex : 0
  }, [TABS, currentTab])

  useEffect(() => {
    if (openedTab) {
      setCurrentTab(TABS[openedTab].tab)
    }
  }, [])

  // Don't fail even if `representation` is an empty string
  if (!representation) {
    return <React.Fragment></React.Fragment>;
  }

  return <div className={styles.Entry}>
    {<div className={styles.body}>
      <div className={styles.bodyHeader}>
        <Tabs tabs={TABS} currentTab={currentTab} color={color} onChange={setCurrentTab} leftAligned />
        <span title="Replay this TCP stream"><ReplayIcon fill={color} stroke={color} style={{ marginLeft: "10px", cursor: "pointer", height: "22px" }} onClick={() => replayTcpStream(id, worker)} /></span>
      </div>
      {getOpenedTabIndex() === TabsEnum.Request && <React.Fragment>
        <SectionsRepresentation data={request} color={color} />
      </React.Fragment>}
      {response && response.length > 0 && getOpenedTabIndex() === TabsEnum.Response && <React.Fragment>
        <SectionsRepresentation data={response} color={color} />
      </React.Fragment>}
    </div>}
  </div>;
}
