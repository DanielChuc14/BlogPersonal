export interface UserSummary {
  id: string;
  email: string | null;
  userName: string | null;
  lockoutEnabled: boolean;
  lockoutEnd: string | null;
  roles: string[];
}

export interface UserDetail extends UserSummary {
  claims: ClaimItem[];
}

export interface ClaimItem {
  type: string;
  value: string;
}

export interface PagedUsers {
  total: number;
  page: number;
  pageSize: number;
  items: UserSummary[];
}
