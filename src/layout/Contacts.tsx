import { Link } from "react-router-dom";
import { Contact } from "../components";
import contactsStore from "../stores/contacts.store";
import userStore from "../stores/user.store";

interface Props {
  logout: () => void;
}

function Contacts({ logout }: Props) {
  const contacts = contactsStore((state) => state.contacts);
  const id = userStore((state) => state.user?.id);

  return (
    <nav className="bg-[#12455e] border border-gray-600 w-96 h-full rounded-lg overflow-hidden">
      <section className="bg-[#d1495b] p-4 flex justify-between">
        <Link to="/">
          <h1 className="text-gray-300 font-bold text-3xl">XMPP Chat</h1>
        </Link>
        <button
          type="button"
          onClick={logout}
          className="bg-[#edae49] rounded-xl font-bold p-2 text-white text-xs my-auto"
        >
          Logout
        </button>
      </section>
      <ul className="flex flex-col gap-2 py-4 px-2 overflow-y-auto h-full">
        {contacts ? (
          contacts
            // .filter((contact) => contact.id !== id)
            .map((contact, key) => (
              <li key={key}>
                <Contact contact={contact} />
              </li>
            ))
        ) : (
          <li>Loading...</li>
        )}
      </ul>
    </nav>
  );
}

export default Contacts;
