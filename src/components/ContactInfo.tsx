import { Dispatch, SetStateAction } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogDescription,
} from "./ui/dialog";

interface Props {
  open: boolean;
  closer: Dispatch<SetStateAction<boolean>>;
  contact: Contact;
}

export default function ContactInfo({ open, closer, contact }: Props) {
  return (
    <Dialog open={open} onOpenChange={closer}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-3xl">{contact.email}</DialogTitle>
          <DialogDescription className="flex gap-1 text-lg">
            {contact.status ?? "Can't watch status"}{" "}
            {contact.status === "Online" ? (
              <span className="bg-green-500 rounded-full h-3 w-3 flex my-auto"></span>
            ) : contact?.status === "Offline" ? (
              <span className="bg-red-500 flex rounded-full h-3 w-3 my-auto"></span>
            ) : contact?.status === "Away" ? (
              <span className="bg-yellow-500 flex rounded-full h-3 w-3 my-auto"></span>
            ) : contact?.status === "Busy" ? (
              <span className="bg-orange-500 flex rounded-full h-3 w-3 my-auto"></span>
            ) : (
              <span className="bg-gray-500 flex rounded-full h-3 w-3 my-auto"></span>
            )}
          </DialogDescription>
        </DialogHeader>
        <section>
          <p className="text-gray-500 text-xl">
            <strong>jid:&nbsp;</strong>
            {contact.id}
          </p>
          <p className="text-gray-500 text-xl">
            <strong>Subscription:&nbsp;</strong>
            {contact?.subscription ?? "No subscription status"}
          </p>
        </section>
        <section className="flex gap-4 mt-4">
          <p className="text-gray-500 text-xl">
            {contact.presence ?? "No presence status message"}
          </p>
        </section>
      </DialogContent>
    </Dialog>
  );
}
