import { Link, useParams } from "react-router-dom";

interface Props {
  user: User;
}

function Contact({ user }: Props) {
  const { id } = useParams();

  return (
    <Link
      to={`/chat/${user.id}`}
      className={`p-4 block h-fit w-full border rounded-md transition-colors duration-300 ease-in-out ${
        id === user.id
          ? "bg-blue-900 border-gray-400"
          : "bg-blue-950 border-gray-600"
      }`}
    >
      <h3 className="text-gray-400">{user.email}</h3>
    </Link>
  );
}

export default Contact;
