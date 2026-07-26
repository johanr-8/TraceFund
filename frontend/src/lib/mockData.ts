// Mock data and types for the frontend

export type Category = 'Food' | 'Medicine' | 'Education' | 'Housing' | 'Electronics';

export interface Transaction {
  id: string;
  date: string;
  vendorName: string;
  amount: number;
  category: Category;
  status: 'Approved' | 'Rejected' | 'Pending';
  reason?: string;
  isSuspicious?: boolean;
  riskScore?: number;
  beneficiaryId?: string;
}

export interface WalletBalance {
  category: Category;
  balance: number;
  allocated: number;
}

export const MOCK_BALANCES: WalletBalance[] = [
  { category: 'Food', balance: 150, allocated: 500 },
  { category: 'Medicine', balance: 75, allocated: 200 },
  { category: 'Education', balance: 1200, allocated: 1200 },
];

export const MOCK_BENEFICIARY_TXS: Transaction[] = [
  { id: 'tx-101', date: '2026-07-25 10:30', vendorName: 'City Pharmacy', amount: 25, category: 'Medicine', status: 'Approved' },
  { id: 'tx-102', date: '2026-07-24 18:15', vendorName: 'Fresh Grocers', amount: 45, category: 'Food', status: 'Approved' },
  { id: 'tx-103', date: '2026-07-22 14:00', vendorName: 'TechStore', amount: 800, category: 'Education', status: 'Rejected', reason: 'Vendor category mismatch' },
  { id: 'tx-104', date: '2026-07-20 09:45', vendorName: 'National Bookstore', amount: 120, category: 'Education', status: 'Approved' },
];

export const MOCK_VENDOR_TXS: Transaction[] = [
  { id: 'tx-901', date: '2026-07-25 14:20', vendorName: 'PharmaCorp', amount: 50, category: 'Medicine', status: 'Approved' },
  { id: 'tx-902', date: '2026-07-25 11:10', vendorName: 'PharmaCorp', amount: 15, category: 'Medicine', status: 'Approved' },
  { id: 'tx-903', date: '2026-07-24 16:45', vendorName: 'PharmaCorp', amount: 120, category: 'Food', status: 'Rejected', reason: 'Invalid token category for this vendor' },
];

export const MOCK_VENDORS = [
  { id: 'v-001', name: 'Fresh Grocers', category: 'Food', address: '0x123...abc' },
  { id: 'v-002', name: 'City Pharmacy', category: 'Medicine', address: '0x456...def' },
  { id: 'v-003', name: 'PharmaCorp', category: 'Medicine', address: '0x789...ghi' },
  { id: 'v-004', name: 'TechStore', category: 'Electronics', address: '0x999...zzz' },
  { id: 'v-005', name: 'National Bookstore', category: 'Education', address: '0xabc...123' },
];

export const MOCK_AUDIT_TXS: Transaction[] = [
  ...MOCK_BENEFICIARY_TXS.map(tx => ({ ...tx, beneficiaryId: 'B-0012', riskScore: 12, isSuspicious: false })),
  ...MOCK_VENDOR_TXS.map(tx => ({ ...tx, beneficiaryId: 'B-0044', riskScore: tx.status === 'Rejected' ? 78 : 5, isSuspicious: tx.status === 'Rejected' })),
  { id: 'tx-701', date: '2026-07-25 19:10', vendorName: 'Ghost Mart', amount: 9500, category: 'Food', status: 'Pending', reason: 'Unusually high amount for Food category', isSuspicious: true, riskScore: 92, beneficiaryId: 'B-0089' },
  { id: 'tx-702', date: '2026-07-25 19:15', vendorName: 'Ghost Mart', amount: 9400, category: 'Food', status: 'Pending', reason: 'Rapid successive transactions', isSuspicious: true, riskScore: 95, beneficiaryId: 'B-0089' },
  { id: 'tx-703', date: '2026-07-23 08:20', vendorName: 'City Pharmacy', amount: 200, category: 'Medicine', status: 'Approved', riskScore: 8, isSuspicious: false, beneficiaryId: 'B-0105' },
];

export const MOCK_AGGREGATE_DATA = [
  { category: 'Food', allocated: 5000000, spent: 3200000 },
  { category: 'Medicine', allocated: 2500000, spent: 1800000 },
  { category: 'Education', allocated: 8000000, spent: 4500000 },
  { category: 'Housing', allocated: 12000000, spent: 11000000 },
  { category: 'Electronics', allocated: 1000000, spent: 250000 },
];
