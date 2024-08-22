import { Link } from "react-router-dom";
import { Contact } from "../components";
import contactsStore from "../stores/contacts.store";

function Contacts() {
  const contacts = contactsStore((state) => state.contacts);

  return (
    <nav className="bg-[#12455e] border border-gray-600 w-96 h-full rounded-lg overflow-hidden">
      <Link to="/">
        <h1 className="text-gray-300 bg-[#d1495b] p-4 font-bold text-3xl sticky top-0">
          XMPP Chat
        </h1>
      </Link>
      <ul className="flex flex-col gap-2 py-4 px-2 overflow-y-auto h-full">
        {contacts ? (
          contacts.map((contact, key) => (
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
