import { useState, FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { client, xml } from "@xmpp/client";
import { toast } from "sonner";
import userStore from "../stores/user.store";

const XMPP_SERVICE = "ws://alumchat.lol:7070/ws/";
const XMPP_DOMAIN = "alumchat.lol";

function Register() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [verifyPassword, setVerifyPassword] = useState("");

  const setUser = userStore((state) => state.setUser);

  const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password !== verifyPassword) {
      toast("Passwords don't match 🚨", {
        description: "Please verify your password",
      });
      return;
    }

    const xmppClient = client({
      service: XMPP_SERVICE,
      domain: XMPP_DOMAIN,
      username: username,
      password: password,
    });

    xmppClient.on("open", () => {
      xmppClient.send(
        xml(
          "iq",
          { type: "set", to: XMPP_DOMAIN, id: "register" },
          xml(
            "query",
            { xmlns: "jabber:iq:register" },
            xml("username", {}, username),
            xml("password", {}, password),
            xml("email", {}, email)
          )
        )
      );
    });

    xmppClient.on("error", (err) => {
      console.error(err);
    });

    // Set up message handler
    xmppClient.on("stanza", async (stanza) => {
      console.log("Stanza:", stanza.toString());

      if (stanza.is("iq")) {
        console.log("IQ:", stanza.toString());
        if (stanza.attrs.type === "result") {
          console.log("Registration successful");
          toast("Registration successful 🎉");
          setUser({ email, password });
          xmppClient.stop();
          navigate("/chat");
        } else {
          console.log("Registration failed");
          // toast("Registration failed 🚨");
        }
      }
    });

    xmppClient.start().catch(console.error);

    return () => {
      xmppClient.stop().catch(console.error);
    };
  };

  return (
    <article className="h-dvh bg-blue-950 flex flex-col">
      <h3 className="py-4 px-8 text-gray-300 text-3xl font-light bg-[#d1495b] rounded-lg">
        XMPP Chat
      </h3>
      <section className="grid text-gray-700 place-items-center m-auto border border-[#edae49] bg-[#edae49] p-6 rounded-lg">
        <h1 className="text-5xl font-bold mb-8 text-white">Register</h1>
        <form onSubmit={handleRegister} className="flex flex-col gap-2">
          <article className="flex flex-col gap-2">
            <label htmlFor="username">Username</label>
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
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              name="email"
              onChange={(e) => setEmail(e.target.value)}
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
          <article className="flex flex-col gap-2">
            <label htmlFor="verifyPassword">Verify password</label>
            <input
              id="verifyPassword"
              type="password"
              name="verifyPassword"
              onChange={(e) => setVerifyPassword(e.target.value)}
              required
              className="py-2 px-3 rounded-md focus:outline-bg-blue-950"
            />
          </article>
          <section>
            <button
              type="submit"
              className="bg-[#00798c] w-full py-2 rounded-md text-white font-bold mb-2 mt-4 focus:scale-105 transition-transform duration-200 ease-in-out"
            >
              Register
            </button>
            <Link
              to="/register"
              className="bg-gray-500 flex justify-center text-white text-center w-full py-2 rounded-md font-bold focus:scale-105 transition-transform duration-200 ease-in-out"
            >
              Login
            </Link>
          </section>
        </form>
      </section>
    </article>
  );
}

export default Register;
