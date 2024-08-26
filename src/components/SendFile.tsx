import { Dispatch, SetStateAction, useState, FormEvent, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogDescription,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { toast } from "sonner";
import groupsStore from "../stores/groups.store";
import contactsStore from "../stores/contacts.store";

interface Props {
  open: boolean;
  closer: Dispatch<SetStateAction<boolean>>;
  sendFile: (file: File, groupJid?: string) => Promise<void>;
}

export default function UpdatePresence({ open, closer, sendFile }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File>();

  const groups = groupsStore((state) => state.groups);
  const id = contactsStore((state) => state.currentContact?.id);

  const handleSendFile = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) {
      toast("Please select a file to send 📂");
      return;
    }

    const groupJid = groups.find((group) => group.id === id)?.id;

    if (groupJid) {
      await sendFile(file, groupJid);
    } else {
      await sendFile(file);
    }

    toast("File sent successfully 🚀");
    inputRef.current!.value = "";
    closer(false);
  };

  return (
    <Dialog open={open} onOpenChange={closer}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-3xl">Attach file</DialogTitle>
          <DialogDescription className="flex gap-1 text-lg">
            Select a file to send
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSendFile} className="flex gap-2">
          <Input
            ref={inputRef}
            onChange={(e) => setFile(e.target.files?.[0])}
            placeholder="Enter a presence message"
            className="w-full"
            type="file"
          />
          <Button type="submit">Send</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
