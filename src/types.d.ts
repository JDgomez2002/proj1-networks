declare global {
  interface User {
    id: string;
    name: string;
    email: string;
  }

  interface Message {
    id: string;
    content: string;
    date: Date;
    from: User.id;
    to: User.id;
  }
}

export {};
