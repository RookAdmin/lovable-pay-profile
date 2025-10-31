
export interface BankDetails {
  accountNumber: string;
  ifsc: string;
  accountName: string;
  bankName: string;
  swiftCode?: string;
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

// Helper function to safely convert JSON data to UpiDetails type
export const safelyConvertToUpiDetails = (details: any): UpiDetails => {
  if (!details) return { upiId: '' };
  
  // If it's an array, return default
  if (Array.isArray(details)) return { upiId: '' };
  
  // If it's an object, extract upiId
  if (typeof details === 'object') {
    return {
      upiId: details.upiId || '',
      qrCodeUrl: details.qrCodeUrl
    };
  }
  
  return { upiId: '' };
};
