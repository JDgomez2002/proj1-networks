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
  sendRequest: (
    contactId: string,
    closer: Dispatch<SetStateAction<boolean>>
  ) => void;
}

export default function SendRequest({ open, closer, sendRequest }: Props) {
  const [jid, setJid] = useState("");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    sendRequest(jid, closer);
  };

  return (
    <Dialog open={open} onOpenChange={closer}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-3xl">Add contact</DialogTitle>
          <DialogDescription className="flex gap-1 text-lg">
            Send contact request to a new user
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            onChange={(e) => setJid(e.target.value)}
            placeholder="Enter user jid"
            className="w-full"
            type="email"
            // if there is an enter, send the request
            // onKeyPress={(e) => {
            //   if (e.key === "Enter") {
            //     sendRequest(jid, closer);
            //   }
            // }}
          />
          <Button type={"submit"}>Send</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
