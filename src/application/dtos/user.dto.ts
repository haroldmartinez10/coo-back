export interface RegisterUserDTO {
  email: string;
  password: string;
  name: string;
}

export interface LoginUserDTO {
  email: string;
  password: string;
}

export interface UserPayload {
  userId: number;
  email: string;
  name: string;
  role: "admin" | "user";
}

export interface AuthenticatedUser {
  userId: number;
  email: string;
  name: string;
  role: "admin" | "user";
}
