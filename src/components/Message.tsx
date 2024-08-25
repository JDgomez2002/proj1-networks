import contactsStore from "../stores/contacts.store";

const images = [".jpg", ".jpeg", ".png", ".gif", ".svg", ".webp"];

interface Props {
  message: Message;
}

function processMessageContent(content: string) {
  // Expresión regular para detectar URLs
  const urlRegex = /(https?:\/\/[^\s]+)/g;

  // Buscar todas las URLs en el contenido
  const urls = content.match(urlRegex) || [];

  // Obtener el nombre del archivo
  const fileName = content.split("/")[content.split("/").length - 1];

  // Verificar si el archivo es una imagen
  const isImage = images.some((ext) => fileName.toLowerCase().endsWith(ext));

  return {
    fileName,
    url: urls[0],
    isImage,
    hasUrl: urls.length > 0,
  };
}

function Message({ message }: Props) {
  const currentContact = contactsStore((state) => state.currentContact);
  const { fileName, url, isImage, hasUrl } = processMessageContent(
    message.content
  );

  return (
    <article
      className={`py-2 px-4 rounded-md w-fit max-w-96 ${
        message.from === currentContact?.email
          ? "ml-0 bg-gray-800"
          : "ml-auto bg-blue-950"
      }`}
    >
      {isImage && (
        <img
          src={url}
          alt={fileName}
          className="w-auto h-48 rounded-md mb-2 pt-2"
        />
      )}
      <p className="text-gray-300 text-lg">
        {fileName}
        <br />
        {hasUrl && (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-white font-bold hover:text-blue-600 transition-colors duration-100 ease-in-out"
          >
            Download file
          </a>
        )}
      </p>
      <div className="w-fit ml-auto">
        <p className="text-xs text-gray-500 font-light">
          {message.date.toLocaleDateString() === new Date().toLocaleDateString()
            ? message.date.toLocaleTimeString()
            : message.date.toLocaleDateString()}
        </p>
      </div>
    </article>
  );
}

export default Message;
