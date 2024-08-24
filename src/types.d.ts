declare global {
  interface User {
    id?: string;
    name?: string;
    email: string;
    password: string;
  }

  type Status = "Offline" | "Online" | "Away" | "Busy" | "Not available";

  interface Contact {
    id: string;
    email: string;
    name?: string;
    presence?: string;
    status?: Status;
    unread?: boolean;
    subscription?: string;
  }

  interface Message {
    id: string;
    content: string;
    date: Date;
    from: User.id;
    unread: boolean;
    to: User.id;
  }
}

export {};
