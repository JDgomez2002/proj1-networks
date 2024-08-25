import { create } from "zustand";

type UserStore = {
  user: User | null;
  setUser: (user: User) => void;
  status: Status;
  setStatus: (status: Status) => void;
};

const userStore = create<UserStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  status: "Offline",
  setStatus: (status) => set({ status }),
}));

export default userStore;
