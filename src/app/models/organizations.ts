export interface Location {
  loc: string;
  address: string;
  loc_contact: number;
  loc_email: string;
  admin_id: string;
}

export interface Organization {
  _id: string;
  org_name: string;
  org_image_url: string;
  org_location: Location[];
  org_created_at: Date;
  org_updated_at: Date;
  isActive: boolean;
}

export interface allOrganization {
  message: string,
  image:string;
  statusCode: number,
  data: Organization[],
  pagination: {
    currentPage: number,
    totalItems: number,
    totalPages: number
  }
}
export interface allOrganizations {
  message: string,
  statusCode: number,
  data: Organization
}
