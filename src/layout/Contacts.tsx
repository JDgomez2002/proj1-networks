import { Link } from "react-router-dom";
import { Contact } from "../components";
import contactsStore from "../stores/contacts.store";

interface Props {
  logout: () => void;
}

function Contacts({ logout }: Props) {
  const contacts = contactsStore((state) => state.contacts);

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
            // sort by name property & status in order: "Offline" | "Online" | "Away" | "Busy" | "Not available"
            // priority status order: Offline > Online > Away > Busy > Not available
            // if status is the same, sort by name property
            .sort((a, b) => {
              if (a.status === b.status) {
                return (a.name ?? "").localeCompare(b.name ?? "");
              }
              const statusOrder = [
                "Offline",
                "Online",
                "Away",
                "Busy",
                "Not available",
              ];
              return (
                statusOrder.indexOf(a.status ?? "Not available") -
                statusOrder.indexOf(b.status ?? "Not available")
              );
            })
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
