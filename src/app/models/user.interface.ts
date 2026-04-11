import { Role } from "./role";

export interface User {
  id: string;
  username: string;
  nombre: string;
  email: string;
  isActive: boolean;
  role: Role;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}
