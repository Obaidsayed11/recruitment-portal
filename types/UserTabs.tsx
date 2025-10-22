export interface GroupCardProps {
  data: any;
  onDelete: (id: number) => void;
  onUpdate: (data: any) => void;
}

export interface Permission {
  codename: string;
  name: string;
  id: string;
}

export interface GroupPermission {
  groupId: string;
  permissionId: string;
  Group: {
    id: string;
    clientId: string;
    roleId: string | null;
    name: string;
    createdAt: string; // ISO date string
    updatedAt: string; // ISO date string
  };
  Permission: {
    id: string;
    codename: string;
    name: string;
    createdAt: string; // ISO date string
    updatedAt: string; // ISO date string
  };
}

export interface GroupProps {
  id: string;
  type: string;
  clientId: string | null;
  roleId: string | null;
  name: string;
  groupName: string;
  createdAt: string;
  updatedAt: string;
  metadata: { classname: string };
  Client: {
    name: string;
  };
}