import { create } from "zustand";

type GroupsStore = {
  groups: Group[];
  setGroups: (groups: Group[]) => void;
};

const groupsStore = create<GroupsStore>((set) => ({
  groups: [],
  setGroups: (groups) => set({ groups }),
}));

export default groupsStore;
