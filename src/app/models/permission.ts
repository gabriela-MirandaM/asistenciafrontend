import { Group } from "./group";

export interface Permission {
  isActive: boolean;
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  group: Group | null;
  groupId?: number | null;
}
