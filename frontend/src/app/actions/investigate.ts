'use server';

export interface FraudReport {
  txId: string;
  riskScore: number;
  aiConfidence: string;
  flags: string[];
  graphAnalysis: string;
  status: 'Pending' | 'Frozen' | 'Dismissed';
}

// Simulated backend database call
export async function investigateTransaction(txId: string): Promise<FraudReport> {
  // Simulate network delay to mimic a complex graph AI analysis
  await new Promise((resolve) => setTimeout(resolve, 1500));

  return {
    txId,
    riskScore: Math.floor(Math.random() * 20) + 80, // Random high score 80-99
    aiConfidence: '98.5%',
    flags: [
      'Velocity Anomaly: 5 transactions within 2 minutes.',
      'Geofencing Alert: IP address mismatch for Vendor.',
      'Pattern Match: Similar to known cash-out scheme.',
    ],
    graphAnalysis: `The TraceFund AI Engine identified a sub-graph anomaly. Beneficiary wallet initiated rapid successive transfers to Vendor wallet, which immediately routed funds to a centralized exchange address. This violates the restricted token usage policy (US-04).`,
    status: 'Pending',
  };
}

export async function takeActionOnTransaction(txId: string, action: 'FREEZE' | 'DISMISS'): Promise<{ success: boolean; message: string }> {
  // Simulate network delay for taking action on the blockchain/database
  await new Promise((resolve) => setTimeout(resolve, 800));

  if (action === 'FREEZE') {
    return { success: true, message: `Funds for transaction ${txId} have been successfully frozen pending manual review.` };
  } else {
    return { success: true, message: `Alert for transaction ${txId} has been dismissed. Status updated to Approved.` };
  }
}
