import { Asset } from "./Asset";

export type OrganizationMember = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  role: string;
  assets: Asset[];
};
