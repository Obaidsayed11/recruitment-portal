// interfaces for companiesm

export interface CompanyProps {
  id: string;
  name: string;
  websiteUrl?: string;
  careerPageUrl?: string;
  description?: string;
  location? : string;
  logoUrl?: string;
}

export interface CompanyListProps {
  companies: CompanyProps[];
  company : CompanyProps,
  name: string
    totalPages: string;
  page: string;
}

// In @/types/companyInterface.ts

export interface CompanyCardProps {
  data: CompanyProps;
  isSelected: boolean;
  onCardSelect: (id: string, checked: boolean) => void;
  onDelete: (id: string) => void;
  onUpdate: (updatedData: CompanyProps) => void;
  onClick?: () => void; // Add this line
}
export interface AddProps {
  onAdd: (company: CompanyProps) => void;
}

export interface UpdateCompanyProps {
  onUpdate: (company: CompanyProps) => void;
  data: CompanyProps;
  id: string;
}





// this is for every card that is used for actions like edit and delete
export interface CardProps {
  onCardSelect: (id: string, isChecked: boolean) => void;
  onDelete: (id: string) => void;
  onUpdate: (data: any) => void;
  isSelected: boolean;
    onClick?: () => void; // Add this line

}


export type EmploymentType = "FULL TIME" | "CONTRACT" | "INTERNSHIP";
export type PublishedType = true | false;
export type StatusType = "ACTIVE" | "CLOSED" | "DRAFT";


// Add Job Form Values
export interface AddJobDescriptionFormValues {
  companyId: string;
  title: string;
  department: string;
  location: string;
  experience?: string;
  salaryRange?: string;
  employmentType: EmploymentType;
  description?: string;
  responsibilities?: string;
  requirements?: string;
  // published?: boolean;
  // status?: string;
}

// Update Job Form Values
export interface EditJobDescriptionFormValues {
  // companyId: string;
  id: string
  title: string;
  department?: string;
  location?: string;
  experienceRequired?: string;
  salaryRange?: string;
  employmentType?: EmploymentType | any;
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
  companyId: string;
  title: string;
  Department: {
                name: string
                id:string
            },
          
  location?: string;
  experience?: string;
  salaryRange?: string;
  employmentType?: EmploymentType;
  description?: string;
  responsibilities?: string;
  requirements?: string;
  published: boolean;
  status?: StatusType;
  // image_url?: string;
 CreatedBy?: {
    id: string | any;
  };
  createdAt?: string;
  updatedAt?: string;
}

// 
export interface JobDescriptionListProps {
  jobs: JobDescriptionProps[];
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

// Experience object for previous roles
export interface Experience {
  company: string;
  role: string;
  years: number;
}

// Main Add Application form interface
export interface AddApplicationFormValues {
  jobId: string;                // Required
  companyId: string;            // Required
  candidateName: string;        // Required
  email: string;                // Required
  phone: string;                // Required
  skills?: string[];            // Optional (array of strings)
  experience?: Experience[];    // Optional (array of objects)
  currentCTC?: string;
  expectedCTC?: string;
  noticePeriod?: string;
  source?: string;
  resume: File | null;          // Required file
}

// Edit Application form (all fields optional)
export interface EditApplicationFormValues {
  jobId?: string;
  companyId?: string;
  candidateName?: string;
  email?: string;
  phone?: string;
  skills?: string[];
  experience?: Experience[];
  currentCTC?: string;
  expectedCTC?: string;
  noticePeriod?: string;
  source?: string;
  status?: string;
  resume?: File | null;
  updated_at?: string;
}

// Application data returned from the API
export interface ApplicationProps {
  id: string;
  jobId: string;
  companyId: string;
  candidateName: string;
  email: string;
  phone: string;
  resumeUrl?: string;
  experience?: Experience[];
  skills?: string[];
  currentCTC?: string;
  expectedCTC?: string;
  noticePeriod?: string;
  status?: string;
  source?: string;
  createdAt?: string;
  updatedAt: string;
  Notes?: {
    userId: string;
    note?: string;
  };
  History?: {
    oldStatus: string;
    newStatus: string;
    changeById: string;
  }[];
}

// Application list response from the backend
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


export interface DepartmentProps {
  id: string;
  name: string;
  companyId: string;
 description:string
}


// Add Department Form Values
export interface AddDepartmentFormValues {
   onAdd: (data: DepartmentProps) => void;
}

// Edit Department Form Values
export interface EditDepartmentFormValues {
 
  
  name?: string;
  description?: string;
}

// Department Data (from API)


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
   companyId: string;
}
export interface EditDepartmentProps {
  id: string | number;
  data: EditDepartmentFormValues;
  onUpdate: (updated: any) => void;
  
}

export interface UpdateDepartmentProps {
  onUpdate: (data: DepartmentProps) => void;
  data: DepartmentProps | null;
  id: string;
}

