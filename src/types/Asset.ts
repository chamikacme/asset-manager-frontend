import { OrganizationMember } from "./OrganizationMember";

export type Asset = {
  id: string;
  name: string;
  description: string;
  condition: string;
  assignedTo: OrganizationMember;
  createdAt: string;
  updatedAt: string;
  createdBy: OrganizationMember;
};
