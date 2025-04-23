
export interface BankDetails {
  accountNumber: string;
  ifsc: string;
  accountName: string;
  bankName: string;
}

export interface UpiDetails {
  upiId: string;
  qrCodeUrl?: string;
}

export interface CardDetails {
  cardNumber: string;
  nameOnCard: string;
  expiryMonth: string;
  expiryYear: string;
}

export type PaymentMethod = {
  id: string;
  type: 'upi' | 'bank' | 'card';
  details: UpiDetails | BankDetails | CardDetails;
  isActive: boolean;
  isPrimary: boolean;
  qrCodeUrl?: string; // Add this field to match database schema
};
