import { Dispatch, ReactElement, ReactNode, SetStateAction } from "react";

export interface AdminProfileData {
  user: {
    fullName: string;
    email: string;
    gender: string;
    phone: string;
    dob: Date;
    role: string;
    photo: string;
  };
}
export interface Option {
  value: string;
  label: string;
}

export interface ActionsProps {
  id: string;
  data: any;
  isDelete?: boolean;
  hidden?: any;
  permissions?: any[];
  onUpdate: (data: any) => void;
  onDelete: (data: any) => void;
}

export interface AdminProfileProps {
  userData: AdminProfileData | null;
  refreshData: () => void;
}

export interface ButtonProps {
  children: ReactNode;
  icon?: ReactElement;
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  secondary?: boolean;
}

export interface LoginData {
  phone: string;
  oldPassword: string;
  password: string;
  cPassword: string;
}

export interface UpdatePasswordProps {
  open: boolean;
  onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface logoProps {
  logo: string;
  clientLogo?: string;
  clientName?: string;
  companyName: string;
  className?: string;
}

export interface SheetModalProps {
  className?: string;
  className2?: string;

  children: React.ReactNode;
  icon: React.ReactNode;
  dateTime?: string;
  title: string;
  name?: string;
  open: boolean;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
}

// export interface AddProps {
//   onAdd: (data: any) => void;
// }

export interface AddProps {
  onAdd: (data: any) => void;
}

export interface UpdateProps {
  id: number | undefined | string;
  onUpdate: (data: any) => void;
}

export interface UpdateWarehouseProps extends UpdateProps {
  data: WarehouseProps;
}

export interface UpdateUserProps extends UpdateProps {
  data: UserProps;
}

export interface UpdateCategoryProps extends UpdateProps {
  data: CategoryProps;
}

export interface UpdateDriversProps extends UpdateProps {
  data: UserProps;
}

export interface UpdateProductsProps extends UpdateProps {
  data: ProductProps;
}
export interface UpdateOutletProps extends UpdateProps {
  data: OutletProps;
}

export interface InputFieldProps {
  name: string;
  label?: string;
  helpingText?: string;
  className?: string;
  placeholder: string;
  formItemClassName?: string;
  formLabelClassName?: string;
  type?: string;
}

export interface DialogModalProps {
  className?: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  dateTime?: string;
  title?: string;
  description?: string;
  name?: string;
  open: boolean;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
}

export interface SvgProps {
  isActive?: boolean;
  stat?: any;
}

export interface CardProps {
  onCardSelect: (id: string, isChecked: boolean) => void;
  onDelete: (id: string) => void;
  onUpdate: (data: any) => void;
  isSelected: boolean;
}
 

// export interface UserProps {
//   id: string;
//   photo?: string;
//   fullName: string;
//   email: string;
//   phone: string;
//   password: string;
//   refreshToken: string | null;
//   otp: string | null;
//   otpExpiry: string | null;
//   dob: string | null;
//   gender: "MALE" | "FEMALE" | "OTHER" | "NONE";
//   device: "ANDROID" | "IOS" | "WEB" | "UNKNOWN";
//   macAddress: string | null;
//   androidToken: string | null;
//   iosToken: string | null;
//   webToken: string | null;
//   isActive: boolean;
//   createdAt: string; // ISO date string
//   updatedAt: string; // ISO date string
//   role: "DISPATCHER" | "ADMIN" | "CUSTOMER" | "MANAGER" | "AGENT" | string;
// }


export interface UserProps {
  id: string
  fullName: string;
  email: string;
  phone: string;
  role: any;
  companyId?: string
}

export interface CategoryProps {
  id: string;
  name: string;
  image: string | null;
  isDeleted: boolean;
  deletedAt: string | null; // ISO timestamp or null
  createdAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
}

export interface OutletProps {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  Pincode: {
    name: string;
    code: string;
    City: {
      name: string;
    };
    State: {
      name: string;
    };
  };
  createdAt: string;
  updatedAt: string;
}

export interface WarehouseProps {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  createdAt: string;
  updatedAt: string;
  Pincode: {
    name: string;
    code: string;
    City: {
      name: string;
    };
    State: {
      name: string;
    };
  };
  Dispatcher: {
    fullName: string;
    phone: string;
  };
  WM: {
    fullName: string;
    phone: string;
  };
}

export interface ProductProps {
  id: string; // UUID
  name: string;
  image: string; // URL or file path
  code: string;
  createdAt: string; // ISO timestamp
  updatedAt: string;
  Category: {
    name: string;
  };
}

export interface DriverProps {
  id: string;
}

// export interface UserListProps {
//   users: UserProps[];
//   currentPage: string;
//   totalPages: string;
// }

export interface OutletListProps {
  outlets: OutletProps[];
  currentPage: string;
  totalPages: string;
}

export interface WarehouseListProps {
  warehouses: WarehouseProps[];
  currentPage: string;
  totalPages: string;
}

export interface CategoryListProps {
  categories: CategoryProps[];
}

export interface ProductListProps {
  products: ProductProps[];
  currentPage: string;
  totalPages: string;
}

export interface DriverListProps {
  drivers: DriverProps[];
}

// export interface UserCardProps extends CardProps {
//   data: UserProps;
// }

export interface OutletCardProps extends CardProps {
  data: OutletProps;
}

export interface WarehouseCardProps extends CardProps {
  data: WarehouseProps;
}
export interface OrderCardProps extends CardProps {
  data: InvoiceProps;
}

export interface CategoryCardProps extends CardProps {
  data: CategoryProps;
}

export interface ProductCardProps extends CardProps {
  data: ProductProps;
}

export interface DriverCardProps extends CardProps {
  data: DriverProps;
}

// export interface Option {
//   value: any;
//   label: string;
// }

export interface InvoiceProps {
  id: string;
  invoiceNo: string;
  invoiceDate: string; // ISO string, or `Date` if parsed
  status: "PENDING" | "COMPLETED" | "DISPATCHED"; // Extend as needed
  notes: string | null;
  dispatch: any | null; // Replace `any` with specific type if known
  delivery: any | null; // Replace `any` with specific type if known
  Driver: {
    id: string;
    fullName: string;
    phone: string;
    email: string;
  };
  Outlet: {
    id: string;
    User: {
      id: string;
      fullName: string;
      phone: string;
      email: string;
    };
  };
}

export interface DeliveryStatsProps {
  PENDING: number;
  PICKED: number;
  OTW: number;
  DELIVERED: number;
  CANCELED: number;
  FAILED: number;
}
export interface DispatcherDashboardProps {
  user: { fullName: string };
  deliveryStats: DeliveryStatsProps;
}

export interface Driver {
  id: string;
  fullName: string;
  phone: string;
  email: string;
}

export interface OutletUser {
  id: string;
  fullName: string;
  phone: string;
  email: string;
}

export interface Outlet {
  id: string;
  User: OutletUser;
}

export interface DeliveryOrder {
  id: string;
  invoiceNo: string;
  invoiceDate: string; // ISO date string
  invoice: string; // ISO date string
  status: "PENDING" | "PICKED" | "OTW" | "DELIVERED" | "CANCELED" | "FAILED"; // Extend if needed
  notes: string | null;
  dispatch: any | null; // Replace `any` with actual type if known
  delivery: any | null; // Replace `any` with actual type if known
  Driver: {
    id: string;
    fullName: string;
    phone: string;
    email: string;
  };
  Warehouse: {
    id: string;
    name: string;
    address: string;
    latitude: number;
    longitude: number;
  };
  Outlet: {
    id: string;
    name: string;
    address: string;
    latitude: number;
    longitude: number;
  };
}

export interface DeliveryOrdersResponse {
  message: string;
  deliveryOrders: DeliveryOrder[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
}

export interface DeliveryOrderProps {
  id: string;
  invoiceNo: string;
  invoiceDate: string; // ISO date string
  status:
    | "PENDING"
    | "DISPATCHED"
    | "COMPLETED"
    | "PICKED"
    | "OTW"
    | "DELIVERED"
    | "CANCELED"
    | "FAILED";
  notes: string | null;
  categories: CategoryWithProducts[];
}

export interface CategoryWithProducts {
  categoryId: string;
  categoryName: string;
  products: Product[];
}

export interface Product {
  id: string;
  name: string;
  code: string;
  orderQty: number;
  dispatchQty: number;
}
// job description



export interface UpdateJobDescription {
  id?: number; // optional, for edit mode
  job_id: string;
  company_id: string;
  job_title: string;
  department: string;
  location: string;
  experience_required: string;
  salary_range: string; 
  employment_type: string; // e.g. "Full-time", "Part-time"
  description: string;
  responsibilities: string;
  requirements: string;
  created_by: string;
  published: boolean;
  status: string; // e.g. "Active", "Inactive"
  created_at?: string;
  updated_at?: string;
}
export interface UpdateJobDescriptionProps {
  id: number | string;
  data: UpdateJobDescription;
  onUpdate: (updated: UpdateJobDescription) => void;
}


export interface UpdateApplication {
  jobId: string;
  companyId: string;
  candidateName: string;
  email: string;
  phone: string;
  currentCTC?: string;
  noticePeriod?: string;
  status?: string;
  source?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UpdateApplicationProps {
  id: number | string;
  data: UpdateApplication;
  onUpdate: (updated: UpdateApplication) => void;
}
