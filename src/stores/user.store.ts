import { create } from "zustand";

type UserStore = {
  user: User | null;
  setUser: (user: User) => void;
  status: "online" | "offline";
  setStatus: (status: "online" | "offline") => void;
};

const userStore = create<UserStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  status: "offline",
  setStatus: (status) => set({ status }),
}));

export default userStore;
