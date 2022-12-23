import { atom } from "recoil";

const focusedItemAtom = atom({
  key: "focusedItemAtom",
  default: null
});

export default focusedItemAtom;
