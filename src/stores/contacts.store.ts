import { create } from "zustand";

type ContactsStore = {
  contacts: Contact[] | null;
  setContacts: (contacts: Contact[]) => void;
  currentContact: Contact | null;
  setCurrentContact: (contact: Contact) => void;
  updateReadStatus: (contactId: string, status: boolean) => void;
  subscribeContacts: Contact[];
  setSubscribeContacts: (contacts: Contact[]) => void;
};

const contactsStore = create<ContactsStore>((set) => ({
  contacts: null,
  setContacts: (contacts) => set({ contacts }),
  currentContact: null,
  setCurrentContact: (contact) => set({ currentContact: contact }),
  updateReadStatus: (contactId, status) =>
    set((state) => ({
      contacts: state.contacts?.map((contact) =>
        contact.id === contactId ? { ...contact, unread: status } : contact
      ),
    })),
  subscribeContacts: [],
  setSubscribeContacts: (contacts) => set({ subscribeContacts: contacts }),
}));

export default contactsStore;
