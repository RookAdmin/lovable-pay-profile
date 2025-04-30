
export type VerificationType = 'individual' | 'proprietorship' | 'private_limited' | 'llp' | 'corporation';
export type VerificationStatus = 'not_submitted' | 'pending' | 'approved' | 'rejected';

export interface VerificationRequest {
  id: string;
  profile_id: string;
  category: VerificationType;
  status: VerificationStatus;
  submitted_at: string;
  updated_at: string;
  reviewed_by?: string;
  reviewed_at?: string;
  rejection_reason?: string;
  form_data: Record<string, any>;
  documents: Record<string, string>;
}

export interface DocumentUpload {
  file: File;
  url?: string;
  progress?: number;
  path?: string;
  error?: string;
}

export type FormDataValues = {
  [key: string]: string | number | Date | null;
};
