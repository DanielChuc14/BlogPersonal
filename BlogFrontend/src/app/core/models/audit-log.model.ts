export interface AuditLog {
  id: number;
  actorUserId: string;
  actorUserName: string;
  action: string;
  targetType: string;
  targetId: string | null;
  details: string | null;
  timestamp: string;
}

export interface PagedResult<T> {
  total: number;
  page: number;
  pageSize: number;
  items: T[];
}
