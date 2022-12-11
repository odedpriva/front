import { atom } from "recoil";

const entriesBufferAtom = atom({
  key: "entriesBufferAtom",
  default: []
});

export default entriesBufferAtom;
