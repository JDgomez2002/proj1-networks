import { Dispatch, SetStateAction } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogDescription,
} from "./ui/dialog";
import { Button } from "./ui/button";

interface Props {
  open: boolean;
  closer: Dispatch<SetStateAction<boolean>>;
  deleteAccount: () => Promise<void>;
}

export default function DeleteAccount({ open, closer, deleteAccount }: Props) {
  return (
    <Dialog open={open} onOpenChange={closer}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-3xl">Delete account</DialogTitle>
          <DialogDescription className="flex gap-1 text-lg">
            Permanently delete your account
          </DialogDescription>
        </DialogHeader>
        <Button type="button" onClick={async () => await deleteAccount()}>
          Delete
        </Button>
      </DialogContent>
    </Dialog>
  );
}
