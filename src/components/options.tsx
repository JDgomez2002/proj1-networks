import {
  LogOut,
  MessageCircle,
  Plus,
  User,
  UserPlus,
  Users,
  Trash,
  MessageCirclePlus,
  Settings,
} from "lucide-react";

import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

interface Props {
  logout: () => void;
  openAcceptRequestDialog: () => void;
  openSendRequestDialog: () => void;
  updatePresenceMessageDialog: () => void;
}

export default function Options({
  logout,
  openAcceptRequestDialog,
  openSendRequestDialog,
  updatePresenceMessageDialog,
}: Props) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="text-sm h-fit p-1 leading-none hover:scale-105 transition-transform duration-300 ease-in-out"
        >
          <Settings className="h-7 w-7" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="start">
        <DropdownMenuLabel>Options</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={openAcceptRequestDialog}>
            <User className="mr-2 h-4 w-4" />
            <span>Contact requests</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={openSendRequestDialog}>
            <UserPlus className="mr-2 h-4 w-4" />
            <span>Add contact</span>
          </DropdownMenuItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <Users className="mr-2 h-4 w-4" />
              <span>Groups</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuItem>
                  <MessageCircle className="mr-2 h-4 w-4" />
                  <span>Join group</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <MessageCirclePlus className="mr-2 h-4 w-4" />
                  <span>Create group</span>
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={updatePresenceMessageDialog}>
            <Plus className="mr-2 h-4 w-4" />
            <span>Presence message</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Trash className="mr-2 h-4 w-4" />
            <span>Delete account</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={logout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
