import "./App.css";
import { useEffect, useState, useRef } from "react";
import { Contacts } from "./layout";
import { Outlet } from "react-router-dom";
import { client, Client, xml } from "@xmpp/client";
import userStore from "./stores/user.store";
import contactsStore from "./stores/contacts.store";
import messagesStore from "./stores/messages.store";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

import useXMPPClient from "./client/xmpp";

const XMPP_SERVICE = "ws://alumchat.lol:7070/ws/";
const XMPP_DOMAIN = "alumchat.lol";

function App() {
  const navigate = useNavigate();
  const xmppClient = useXMPPClient();

  return (
    <article className="h-dvh w-full bg-gray-950 gap-4 flex flex-row p-4">
      <Contacts />
      <main className="bg-[#12455e] border border-gray-600 h-full w-full rounded-lg overflow-hidden">
        <Outlet />
      </main>
    </article>
  );
}

export default App;
