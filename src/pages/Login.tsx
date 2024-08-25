import { useState, FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { client } from "@xmpp/client";
import { toast } from "sonner";
import userStore from "../stores/user.store";

const XMPP_SERVICE = "ws://alumchat.lol:7070/ws/";
const XMPP_DOMAIN = "alumchat.lol";

function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const setUser = userStore((state) => state.setUser);

  // Configurar el cliente XMPP
  const xmppClient = client({
    service: XMPP_SERVICE,
    domain: XMPP_DOMAIN,
    resource: "client",
    username,
    password,
  });

  xmppClient.on("error", () => {
    // console.log("connection", e.message.slice(0, 1));
  });

  xmppClient.on("online", (address) => {
    console.log("Logged in as:", address.local);
    // Guardar en sessionStorage
    setUser({
      email: address.local,
      password: password,
    });
    toast("Welcome back 🎉");
    xmppClient.stop();
    navigate("/chat"); // Navega a la página principal después de iniciar sesión correctamente
  });

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await xmppClient.start();
    } catch (e) {
      console.log("Error logging in:", e);
      toast("Can't sign in right now 🚨", {
        description: "Error logging in",
      });
    }
  };

  return (
    <article className="h-dvh bg-blue-950 flex flex-col">
      <h3 className="py-4 px-8 text-gray-300 text-3xl font-light bg-[#d1495b] rounded-lg">
        XMPP Chat
      </h3>
      <section className="grid text-gray-700 place-items-center m-auto border border-[#edae49] bg-[#edae49] p-6 rounded-lg">
        <h1 className="text-5xl font-bold mb-8 text-white">Login</h1>
        <form onSubmit={handleLogin} className="flex flex-col gap-2">
          <article className="flex flex-col gap-2">
            <label htmlFor="email">Email</label>
            <input
              id="username"
              type="text"
              name="username"
              onChange={(e) => setUsername(e.target.value)}
              required
              className="py-2 px-3 rounded-md focus:outline-bg-blue-950"
            />
          </article>
          <article className="flex flex-col gap-2">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              name="password"
              onChange={(e) => setPassword(e.target.value)}
              required
              className="py-2 px-3 rounded-md focus:outline-bg-blue-950"
            />
          </article>
          <section>
            <button
              type="submit"
              className="bg-[#00798c] w-full py-2 rounded-md text-white font-bold mb-2 mt-4 focus:scale-105 transition-transform duration-200 ease-in-out"
            >
              Login
            </button>
            <Link
              to="/register"
              className="bg-gray-500 flex justify-center text-white text-center w-full py-2 rounded-md font-bold focus:scale-105 transition-transform duration-200 ease-in-out"
            >
              Register
            </Link>
          </section>
        </form>
      </section>
    </article>
  );
}

export default Login;
