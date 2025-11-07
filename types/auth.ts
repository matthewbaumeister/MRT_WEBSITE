export interface User {
  id: string;
  email: string;
  name: string;
  password: string;
  role: "admin" | "user";
  twoFactorEnabled?: boolean;
  twoFactorSecret?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Session {
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
  expires: string;
}

