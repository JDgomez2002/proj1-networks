import { create } from "zustand";

type MessagesStore = {
  messages: Message[];
  setMessages: (messages: Message[]) => void;
  newMessage: (message: Message) => void;
};

const messagesStore = create<MessagesStore>((set) => ({
  messages: [],
  setMessages: (messages) => set({ messages }),
  // add message just if the id is not already in the messages
  newMessage: (message) =>
    set((state) => ({
      messages: state.messages.find((m) => m.id === message.id)
        ? state.messages
        : [...state.messages, message],
    })),
}));

export default messagesStore;
