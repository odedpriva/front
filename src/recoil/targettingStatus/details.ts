import {selector} from "recoil";
import targettingStatusAtom from "./atom";

const targettingStatusDetails = selector({
    key: 'targettingStatusDetails',
    get: ({get}) => {
        const targettingStatus = get(targettingStatusAtom);
        const uniqueNamespaces = Array.from(new Set(targettingStatus.map(pod => pod.namespace)));
        const amountOfPods = targettingStatus.length;
        const amountOfTargettedPods = targettingStatus.filter(pod => pod.isTargetted).length;
        const amountOfUntargettedPods = amountOfPods - amountOfTargettedPods;

        return {
            uniqueNamespaces,
            amountOfPods,
            amountOfTargettedPods,
            amountOfUntargettedPods,
        };
    },
});

export default targettingStatusDetails;
