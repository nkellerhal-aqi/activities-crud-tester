export enum EnumActivityPriority {
  ACTIVITY_PRIORITY_UNKNOWN = 0,
  ACTIVITY_PRIORITY_LOW = 1,
  ACTIVITY_PRIORITY_NORMAL = 2,
  ACTIVITY_PRIORITY_HIGH = 3,
}

export enum EnumActivityStatus {
  ACTIVITY_STATUS_UNKNOWN = 0,
  ACTIVITY_STATUS_OPEN = 1,
  ACTIVITY_STATUS_COMPLETED = 2,
  ACTIVITY_STATUS_CANCELED = 3,
  ACTIVITY_STATUS_BLOCKED = 4,
  ACTIVITY_STATUS_IN_PROGRESS = 5,
}

export interface GeneralGetParameters {
  repeatCount?: number;
}

export interface GetManyParameters extends GeneralGetParameters {
  authTwinRefId?: string;
  includeActivityDescendants?: boolean;
  includeAuthTwinDescendants?: boolean;
  statusCode?: EnumActivityStatus;
  priorityCode?: EnumActivityPriority;
  startTime?: string | null;
  endTime?: string | null;
  scheduleId?: string;
  context?: string;
}

export interface ClarosDateTime {
  jsonDateTime: string;
  ticks: number;
  jsonTicksDateTimeCase: number;
}

export interface AuditEntry {
  createdById: string;
  createdOn: ClarosDateTime;
  modifiedById: string;
  modifiedOn: ClarosDateTime;
}

export interface Activity {
  id: string;
  authTwinRefId: string;
  parentId: string;
  owningUserId: string;
  priorityCode: EnumActivityPriority;
  activityTypeId: EnumActivityStatus;
  scheduleId: string;
  scheduledStart: ClarosDateTime;
  scheduledEnd: ClarosDateTime;
  subject: string;
  description: string;
  propertyBag: string;
  statusCode: number;
  recordAuditInfo: AuditEntry;
}

export interface ActivityTreeNode extends Activity {
  children?: ActivityTreeNode[];
}
