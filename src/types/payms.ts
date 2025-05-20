
export interface PaymReminder {
  id: string;
  paymId: string;
  recipient: string;
  channel: 'email' | 'whatsapp';
  status: 'pending' | 'sent' | 'failed';
  scheduledAt: Date;
  sentAt?: Date;
  createdAt: Date;
}

export interface Paym {
  id: string;
  profileId: string;
  title: string;
  amount: number;
  currency: string;
  uniqueLink: string;
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  isPaid: boolean;
  invoiceApp?: 'zoho' | 'freshbooks' | 'xero' | 'quickbooks';
  invoiceId?: string;
  reminderEnabled: boolean;
  lastReminderSent?: Date;
  metadata?: Record<string, any>;
}

export interface PaymFormData {
  title: string;
  amount: number;
  currency: string;
  expiresAt?: Date;
  invoiceApp?: 'zoho' | 'freshbooks' | 'xero' | 'quickbooks';
  invoiceId?: string;
  reminderEnabled: boolean;
  recipientEmail?: string;
  recipientPhone?: string;
}
