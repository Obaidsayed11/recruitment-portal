
// this is for every card that is used for actions like edit and delete
export interface CardProps {
  onCardSelect: (id: string, isChecked: boolean) => void;
  onDelete: (id: string) => void;
  onUpdate: (data: any) => void;
  isSelected: boolean;
}
export interface GroupProps {
  id: string;
  group_name: string;
  created_at?: string;
  updated_at?: string;
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
