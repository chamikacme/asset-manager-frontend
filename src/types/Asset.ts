import { OrganizationMember } from "./OrganizationMember";

export type Asset = {
  id: string;
  name: string;
  description: string;
  condition: string;
  assignedTo: OrganizationMember;
};
