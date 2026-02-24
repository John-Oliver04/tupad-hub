export type Profile = {
  fullName: string;
  position: string;
  municipality: string;
  contactNumber: string;
  avatarUrl?: string;
  coverUrl?: string;
};

export type ProjectStatus = "Pending" | "Completed";

export type PreDetails = {
  documentTracking?: {
    dateReceivedRO?: string;
    adlNumber?: string;
    ntpNumber?: string;
    dateSubmittedRO?: string;
    noticeToProceedDate?: string;
  };
  projectInformation?: {
    nameNature?: string;
    proponent?: string;
    location?: string;
    totalBeneficiaries?: number;
    totalFemale?: number;
    noOfDays?: number;
  };
  projectCost?: {
    salaryPerDay?: number;
    laborCost?: number;
    ppe?: number;
    insurance?: number;
    total?: number;
  };
  implementation?: {
    orientationDate?: string;
    paymentDate?: string;
    remarks?: string;
  };
};

export type PostDetailsDocumentTracking = {
  adlNumber?: string;
  dateReceivedPost?: string;
  dateSubmittedRO?: string;
};
export type PostDetailsVerification = {
  totalBeneficiariesActual?: number;
  totalFemaleActual?: number;
  noOfDaysOfWork?: number;
  periodStart?: string;
  periodEnd?: string;
};
export type PostDetailsCost = {
  salaryPerDay?: number;
  laborCost?: number;
  ppe?: number;
  insurance?: number;
  total?: number;
};
export type PostDetailsImplementation = {
  paymentReleasedDate?: string;
  remarks?: string;
};
export type PostDetails = {
  documentTracking?: PostDetailsDocumentTracking;
  verification?: PostDetailsVerification;
  cost?: PostDetailsCost;
  implementation?: PostDetailsImplementation;
};

export type Project = {
  id: string;
  adl: string;
  municipality: string;
  beneficiaries: number;
  natureOfProject?: string;
  status?: ProjectStatus;
  preDetails?: PreDetails;
  postDetails?: PostDetails;
};
