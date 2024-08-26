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
import { toast } from "sonner";

interface Props {
  open: boolean;
  closer: Dispatch<SetStateAction<boolean>>;
  createGroup: (groupName: string) => Promise<void>;
}

export default function CreateGroup({ open, closer, createGroup }: Props) {
  const [name, setName] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name.trim()) {
      toast("Please enter a name for the group 🚨");
      return;
    }

    try {
      await createGroup(name);
      setName("");
      toast("Group created successfully 🚀");
      closer(false);
    } catch (e) {
      console.log("Error creating group:", e);
      toast("Error creating group 🚨");
    }
  };

  return (
    <Dialog open={open} onOpenChange={closer}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-3xl">Create group</DialogTitle>
          <DialogDescription className="flex gap-1 text-lg">
            Create a public group to chat with multiple users
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            className="w-full"
            type="text"
          />
          <Button type={"submit"}>Create</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
