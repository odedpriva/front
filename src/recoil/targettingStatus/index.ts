import atom from "./atom";
import targettingStatusDetails from './details';

interface TargettingStatusPod {
  name: string;
  namespace: string;
  isTargetted: boolean;
}

interface TargettingStatus {
  pods: TargettingStatusPod[];
}

export type { TargettingStatus, TargettingStatusPod };
export { targettingStatusDetails };

export default atom;
