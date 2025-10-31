// this is for every card that is used for actions like edit and delete
export interface CardProps {
  onCardSelect: (id: string, isChecked: boolean) => void;
  onDelete: (id: string) => void;
  onUpdate: (data: any) => void;
  isSelected: boolean;
}
export interface GroupProps {
 id: string;
      companyId: string,
      code: string,
      name: string,
      permissionIds: string[]
      roleType: string,
      description: string,
      createdAt: string,
      updatedAt: string
}

export interface GroupListProps {
  groups: GroupProps[];
  currentPage: string;
  totalPages: string;
}

export interface AddGroupFormValues {
  id: string;
  group_name: string;
}
export interface EditGroupFormValues {
  id: string;
  group_name: string;
}

export interface UpdateGroupProps {
  onUpdate: (data: GroupProps) => void;
  data: GroupProps | null;
  id: string;
}

export interface GroupCardProps extends CardProps {
  data: GroupProps;
}


// roles

export interface RoleProps {
 id: string,
      companyId?: string,
      code: string,
      name: string,
      roleType: string,
      description: string,
      createdAt: string,
      updatedAt: string
}

export interface RoleListProps {
  roles: RoleProps[];
  currentPage: string;
  totalPages: string;
    page: string;
}

export interface AddRoleFormValues {
  id: string;
   name: string,
   code: string,
      roleType: string,
      description: string,
}
export interface EditRoleFormValues {
  id: string;
name: string;
}

export interface UpdateRoleProps {
  onUpdate: (data: RoleProps) => void;
  data: RoleProps | null;
  id: string;
}
export interface RoleCardProps extends CardProps {
  data: RoleProps;
}


export interface RoleCardProps extends CardProps {
  data: RoleProps;
}
