import style from './StatusBar.module.sass';
import React, {useState} from "react";
import warningIcon from "./assets/warning_icon.svg";
import failIcon from "./assets/failed.svg";
import successIcon from "./assets/success.svg";
import {useRecoilValue} from "recoil";
import targettingStatusAtom, {targettingStatusDetails} from "../../../recoil/targettingStatus";
import Tooltip from "../Tooltip/Tooltip";

const pluralize = (noun: string, amount: number) => {
    return `${noun}${amount !== 1 ? 's' : ''}`
}

interface StatusBarProps {
   isDemoBannerView: boolean;
   disabled?: boolean;
  }

export const StatusBar: React.FC<StatusBarProps> = ({isDemoBannerView, disabled}) => {
    const targettingStatus = useRecoilValue(targettingStatusAtom);
    const [expandedBar, setExpandedBar] = useState(false);
    const {uniqueNamespaces, amountOfPods, amountOfTargettedPods, amountOfUntargettedPods} = useRecoilValue(targettingStatusDetails);
    return <div style={{opacity: disabled ? 0.4 : 1}} className={`${isDemoBannerView ? `${style.banner}` : ''} ${style.statusBar} ${(expandedBar && !disabled ? `${style.expandedStatusBar}` : "")}`} onMouseOver={() => setExpandedBar(true)} onMouseLeave={() => setExpandedBar(false)} data-cy="expandedStatusBar">
        <div className={style.podsCount}>
          {!disabled && targettingStatus.some(pod => !pod.isTargetted) && <img src={warningIcon} alt="warning"/>}
          {disabled && <Tooltip title={"Targetting status is not updated when streaming is paused"} isSimple><img src={warningIcon} alt="warning"/></Tooltip>}
            <span className={style.podsCountText} data-cy="podsCountText">
                {`Targetting ${amountOfUntargettedPods > 0 ? amountOfTargettedPods + " / " + amountOfPods : amountOfPods} ${pluralize('pod', amountOfPods)} in ${pluralize('namespace', uniqueNamespaces.length)} ${uniqueNamespaces.join(", ")}`}
            </span>
        </div>
        {expandedBar && !disabled && <div style={{marginTop: 20}}>
            <table>
                <thead>
                    <tr>
                        <th style={{width: "40%"}}>Pod name</th>
                        <th style={{width: "40%"}}>Namespace</th>
                        <th style={{width: "20%", textAlign: "center"}}>Targetting</th>
                    </tr>
                </thead>
                <tbody>
                    {targettingStatus.map(pod => <tr key={pod.name}>
                        <td style={{width: "40%"}}>{pod.name}</td>
                        <td style={{width: "40%"}}>{pod.namespace}</td>
                        <td style={{width: "20%", textAlign: "center"}}>{pod.isTargetted ? <img style={{height: 20}} alt="status" src={successIcon}/> : <img style={{height: 20}} alt="status" src={failIcon}/>}</td>
                    </tr>)}
                </tbody>
            </table>
        </div>}
    </div>;
}
