import "./App.css";
import { Contacts } from "./layout";
import { Outlet } from "react-router-dom";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

import useXMPPClient from "./client/useXmppClient";

function App() {
  const navigate = useNavigate();
  const client = useXMPPClient();

  const logout = () => {
    client?.stop();
    navigate("/");
    toast("Good bye 👋🏻");
  };

  return (
    <article className="h-dvh w-full bg-gray-950 gap-4 flex flex-row p-4">
      <Contacts logout={logout} />
      <main className="bg-[#12455e] border border-gray-600 h-full w-full rounded-lg overflow-hidden">
        <Outlet />
      </main>
    </article>
  );
}

export default App;
