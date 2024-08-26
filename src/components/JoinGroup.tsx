import { Dispatch, SetStateAction, useState } from "react";
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
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Label } from "../components/ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import groupsStore from "../stores/groups.store";

interface Props {
  open: boolean;
  closer: Dispatch<SetStateAction<boolean>>;
  joinGroup: (
    jid: string,
    nickname: string,
    password?: string
  ) => Promise<void>;
}

export default function JoinGroup({ open, closer, joinGroup }: Props) {
  const groups = groupsStore((state) => state.groups);

  const [jid, setJid] = useState("");
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");

  const handleJoinPublicGroup = async (groupId: string) => {
    if (!nickname.trim()) {
      toast("Please provide a nickname 🚨");
      return;
    }

    try {
      await joinGroup(groupId, nickname);
      closer(false);
    } catch (e) {
      console.log("Error joining public group:", e);
      toast("Error joining public group 🚨");
    }
  };

  const handleJoinPrivateGroup = async () => {
    if (!jid.trim() || !nickname.trim() || !password.trim()) {
      toast("Please fill all fields 🚨");
      return;
    }

    try {
      await joinGroup(jid, nickname, password);
      closer(false);
    } catch (e) {
      console.log("Error joining private group:", e);
      toast("Error joining private group 🚨");
    }
  };

  return (
    <Dialog open={open} onOpenChange={closer}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-3xl">Join group</DialogTitle>
          <DialogDescription>
            Select a public or private group to join
          </DialogDescription>
        </DialogHeader>
        <section className="space-y-1 mt-4">
          <Label htmlFor="name">Nickname</Label>
          <Input
            id="name"
            onChange={(e) => setNickname(e.currentTarget.value)}
          />
        </section>
        <Tabs defaultValue="account" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="account">Public</TabsTrigger>
            <TabsTrigger value="password">Private</TabsTrigger>
          </TabsList>
          <TabsContent value="account">
            <Card>
              <CardHeader>
                <CardTitle>Public groups</CardTitle>
                <CardDescription>
                  Public groups are open to everyone. You can join them without
                  password.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <ul className="flex flex-col gap-2 h-96 overflow-y-auto">
                  {groups.map((group, key) => (
                    <li
                      key={key}
                      className="flex border justify-between border-gray-300 p-2 rounded-md"
                    >
                      <section className="my-auto">
                        <span>{group.name}</span>
                        <p className="text-sm text-gray-400">{group.id}</p>
                      </section>
                      <Button onClick={() => handleJoinPublicGroup(group.id)}>
                        Join
                      </Button>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="password">
            <Card>
              <CardHeader>
                <CardTitle>Private groups</CardTitle>
                <CardDescription>
                  Join a private group by providing the group JID and password.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="space-y-1">
                  <Label htmlFor="jid">JID</Label>
                  <Input
                    id="jid"
                    type="email"
                    onChange={(e) => setJid(e.currentTarget.value)}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    onChange={(e) => setPassword(e.currentTarget.value)}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" onClick={handleJoinPrivateGroup}>
                  Join
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
