import { Dispatch, SetStateAction, useState, FormEvent } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogDescription,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

interface Props {
  open: boolean;
  closer: Dispatch<SetStateAction<boolean>>;
  updatePresenceMessage: (
    message: string,
    closer: Dispatch<SetStateAction<boolean>>
  ) => void;
}

export default function UpdatePresence({
  open,
  closer,
  updatePresenceMessage,
}: Props) {
  const [jid, setJid] = useState("");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    updatePresenceMessage(jid, closer);
  };

  return (
    <Dialog open={open} onOpenChange={closer}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-3xl">Presence message</DialogTitle>
          <DialogDescription className="flex gap-1 text-lg">
            Update presence message
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            onChange={(e) => setJid(e.target.value)}
            placeholder="Enter a presence message"
            className="w-full"
            type="text"
          />
          <Button type="submit">Save</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
