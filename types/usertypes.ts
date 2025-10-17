export interface UpdateProps {
  id: number | undefined | string;
  onUpdate: (data: any) => void;
}

export interface CardProps {
  onCardSelect: (id: string, isChecked: boolean) => void;
  onDelete: (id: string) => void;
  onUpdate: (data: any) => void;
  isSelected: boolean;
}
export interface UserRole {
  code: string;
}


// this is the response that we are getting
export interface UserProps {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  companyId?: string;
  Role?: UserRole;  // API returns this
  role?: UserRole;  // just for internal consistency
  token?: string;
}

export interface UserListProps {
  users: UserProps[];
  totalPages: string;
  page: string;
}

export interface UserCardProps extends CardProps {
  data: UserProps;
}

export interface UpdateUserProps extends UpdateProps {
  data: UserProps;
}
