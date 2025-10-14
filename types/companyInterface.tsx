// this is for every card that is used for actions like edit and delete
export interface CardProps {
  onCardSelect: (id: string, isChecked: boolean) => void;
  onDelete: (id: string) => void;
  onUpdate: (data: any) => void;
  isSelected: boolean;
}


export type EmploymentType = "FULL_TIME" | "PART_TIME" | "CONTRACT" | "INTERNSHIP";
export type PublishedType = "YES" | "NO";
export type StatusType = "ACTIVE" | "INACTIVE" | "DRAFT";

// Add Job Form Values
export interface AddJobDescriptionFormValues {
  companyId: string;
  jobTitle: string;
  department: string;
  location: string;
  experienceRequired?: string;
  salaryRange?: string;
  employmentType: EmploymentType;
  description?: string;
  responsibilities?: string;
  requirements?: string;
  published?: boolean;
  status?: string;
}

// Update Job Form Values
export interface EditJobDescriptionFormValues {
  companyId: string;
  jobTitle: string;
  department?: string;
  location?: string;
  experienceRequired?: string;
  salaryRange?: string;
  employmentType?: EmploymentType;
  description?: string;
  responsibilities?: string;
  requirements?: string;
  createdBy?: string;
  published?: PublishedType;
  status?: StatusType;
  image?: File | null;
}

// Job Description Data (from API)
export interface JobDescriptionProps {
  id: string;
  company_id: string;
  job_title: string;
  department?: string;
  location?: string;
  experience_required?: string;
  salary_range?: string;
  employment_type?: EmploymentType;
  description?: string;
  responsibilities?: string;
  requirements?: string;
  created_by?: string;
  published?: boolean;
  status?: StatusType;
  image_url?: string;
  created_at?: string;
  updated_at?: string;
}

// 
export interface JobDescriptionListProps {
  description: JobDescriptionProps[];
  currentPage: string;
  totalPages: string;
}



// this is for the data we are passing in the card props
export interface JobDescriptionCardProps extends CardProps {
  data: JobDescriptionProps;
}

// Props for Add Modal
export interface AddJobModalProps {
  onAdd: (data: JobDescriptionProps) => void;
}

// Props for Edit Modal
export interface UpdateJobDescriptionProps {
  onUpdate: (data: JobDescriptionProps) => void;
  data: JobDescriptionProps | null;
  id: string;
}


// Now for Company Application-------------------------------------------------------------------

// Enums and Basic Types


export type ApplicationStatus =
  | "PENDING"
  | "SHORTLISTED"
  | "REJECTED"
  | "HIRED";

export type ApplicationSource =
  | "LINKEDIN"
  | "INDEED"
  | "NAUKRI"
  | "REFERRAL"
  | "WALKIN"
  | "OTHER";

export interface AddApplicationFormValues {
  jobId: string;
  companyId: string;
  candidateName: string;
  email: string;
  phone: string;
  currentCTC?: string;
  expectedCTC?: string;
  noticePeriod?: string;
  resume?: File | null;
  source?: ApplicationSource;
  status?: ApplicationStatus;
}


// Edit Application Form Values

export interface EditApplicationFormValues {
  jobId?: string;
  companyId?: string;
  candidateName?: string;
  email?: string;
  phone?: string;
  currentCTC?: string;
  expectedCTC?: string;
  noticePeriod?: string;
  resume?: File | null;
  source?: ApplicationSource;
  status?: ApplicationStatus;
  updated_at?: string;
}

// Application Data (from API)

export interface ApplicationProps {
  id: string;
  job_id: string;
  company_id: string;
  candidate_name: string;
  email: string;
  phone: string;
  current_ctc?: string;
  expected_ctc?: string;
  notice_period?: string;
  status?: ApplicationStatus;
  source?: ApplicationSource;
  created_at?: string;
  updated_at?: string;
}


// Application List Props

export interface ApplicationListProps {
  applications: ApplicationProps[];
  currentPage: string;
  totalPages: string;
}


// Card Props (for the ApplicationCard component)

export interface ApplicationCardProps extends CardProps {
  data: ApplicationProps;
}


// Props for Modals

export interface AddApplicationModalProps {
  onAdd: (data: ApplicationProps) => void;
}

export interface UpdateApplicationProps {
  onUpdate: (data: ApplicationProps) => void;
  data: ApplicationProps | null;
  id: string;
}



// Department interfaces

// Department Status
// Department Status
export type DepartmentStatus = "ACTIVE" | "INACTIVE";


// Add Department Form Values
export interface AddDepartmentFormValues {
  departmentName: string;
  companyId: string;
  headOfDepartment?: string;
  email?: string;
  phone?: string;
  status?: DepartmentStatus;
}

// Edit Department Form Values
export interface EditDepartmentFormValues {
  departmentName?: string;
  companyId?: string;
  headOfDepartment?: string;
  email?: string;
  phone?: string;
  status?: DepartmentStatus;
  updated_at?: string;
}

// Department Data (from API)
export interface DepartmentProps {
  id: string;
  department_name: string;
  company_id: string;
  head_of_department?: string;
  email?: string;
  phone?: string;
  status?: DepartmentStatus;
  created_at?: string;
  updated_at?: string;
}

// Department List Props
export interface DepartmentListProps {
  departments: DepartmentProps[];
  currentPage: string;
  totalPages: string;
}

// Card Props (for DepartmentCard component)
export interface DepartmentCardProps extends CardProps {
   data: DepartmentProps;
}

// Props for Modals
export interface AddDepartmentModalProps {
  onAdd: (data: DepartmentProps) => void;
}

export interface UpdateDepartmentProps {
  onUpdate: (data: DepartmentProps) => void;
  data: DepartmentProps | null;
  id: string;
}

