import { Dispatch, SetStateAction, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogDescription,
} from "./ui/dialog";
import { Button } from "./ui/button";
import contactsStore from "../stores/contacts.store";

interface Props {
  open: boolean;
  closer: Dispatch<SetStateAction<boolean>>;
  acceptRequest: (contactId: string) => void;
}

export default function AcceptRequest({ open, closer, acceptRequest }: Props) {
  const subscribeContacts = contactsStore((state) => state.subscribeContacts);
  const setSubscribeContacts = contactsStore(
    (state) => state.setSubscribeContacts
  );

  useEffect(() => {
    if (subscribeContacts.length === 0) closer(false);
  }, [subscribeContacts]);

  return (
    <Dialog open={open} onOpenChange={closer}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-3xl">Contact requests</DialogTitle>
          <DialogDescription className="flex gap-1 text-lg">
            Accept any request from users below
          </DialogDescription>
        </DialogHeader>
        <ul className="flex flex-col gap-2">
          {subscribeContacts.length > 0 ? (
            subscribeContacts.map((contact, key) => (
              <li
                key={key}
                className="bg-gray-100 border rounded-md border-gray-500 flex justify-between px-4 py-4"
              >
                <h1 className="text-3xl text-gray-600 font-semibold">
                  {contact.name}
                </h1>
                <section className="flex gap-3">
                  <Button onClick={() => acceptRequest(contact.id)}>
                    Accept
                  </Button>
                  <Button
                    className="bg-red-600 text-white hover:bg-red-700"
                    onClick={() => {
                      setSubscribeContacts(
                        subscribeContacts.filter((c) => c.id !== contact.id)
                      );
                    }}
                  >
                    Deny
                  </Button>
                </section>
              </li>
            ))
          ) : (
            <li className="text-gray-500 text-xl">No requests available</li>
          )}
        </ul>
      </DialogContent>
    </Dialog>
  );
}
