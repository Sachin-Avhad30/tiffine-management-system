import { Pagination } from "./admin";

interface RoleDetails {
  organization_id: string;
  organization_name: string;
  approval_status: string[];
}

export interface Retailer {
  username: string;
  password: string;
  email: string;
  contact_number: string;
  address: string;
  role_id: string;
  role_specific_details: RoleDetails;
  _id: string;
}

export interface AllStatusResponses {
  statuscode: number;
  data: Retailer[];
  pagination: Pagination
}
