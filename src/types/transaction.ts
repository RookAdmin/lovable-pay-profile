
export interface Transaction {
  id: string;
  profile_id: string;
  transaction_id: string;
  amount: number;
  currency: string;
  status: string;
  payment_gateway: string;
  transaction_date: string;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}
