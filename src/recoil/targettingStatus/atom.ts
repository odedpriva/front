import { atom } from "recoil";
import { TargettingStatusPod } from "./index";

const targettingStatusAtom = atom({
  key: "targettingStatusAtom",
  default: null as TargettingStatusPod[]
});

export default targettingStatusAtom;
