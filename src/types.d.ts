declare global {
  interface User {
    id?: string;
    name?: string;
    email: string;
    password: string;
  }

  interface Contact {
    id: string;
    email: string;
    name?: string;
    presence?: string;
    status?: string;
    unread?: boolean;
  }

  interface Message {
    id: string;
    content: string;
    date: Date;
    from: User.id;
    unread: boolean;
    // to: User.id;
  }
}

export {};
