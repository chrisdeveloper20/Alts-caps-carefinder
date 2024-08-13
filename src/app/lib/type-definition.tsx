export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
};

export type RegisterState = {
  message?: string;
  error?: {
    name?: string[];
    email?: string[];
    password?: string[];
    "confirm-password"?: string[];
  };
};
