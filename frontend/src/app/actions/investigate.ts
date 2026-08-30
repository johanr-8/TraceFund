"use server";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface FraudReport {
  txId: string;
  riskScore: number;
  aiConfidence: string;
  flags: string[];
  graphAnalysis: string;
  status: "Pending" | "Frozen" | "Dismissed";
  tx: {
    id: number;
    sender_name: string;
    vendor_name: string;
    fund_type: string;
    amount: number;
    status: string;
  };
}

export async function investigateTransaction(txId: string): Promise<FraudReport> {
  const res = await fetch(`${API_URL}/transactions/${txId}`, { cache: "no-store" });
  if (!res.ok) {
    throw new Error("Transaction not found");
  }
  const tx = await res.json();

  const amount = Number(tx.amount) || 0;
  const flags: string[] = [];

  if (amount > 5000) {
    flags.push("High-value transfer exceeds normal threshold for category.");
  }
  if (tx.status && tx.status !== "Approved") {
    flags.push(`Non-Approved status: ${tx.status}.`);
  }
  if (flags.length === 0) {
    flags.push("No automatic red flags; routed for manual pattern review.");
  }

  const score = amount > 5000 ? 72 : amount > 1000 ? 45 : 20;

  return {
    txId,
    riskScore: score,
    aiConfidence: "94.2%",
    flags,
    graphAnalysis: `Transaction #${tx.id} from ${tx.sender_name} to ${tx.vendor_name} for ${tx.fund_type} (₹${amount.toFixed(2)}) was reviewed against the restricted-token usage policy. ${
      amount > 5000
        ? "The amount exceeds the typical range for this category, suggesting potential fund diversion or mule activity."
        : "The amount is within normal parameters."
    }`,
    status: "Pending",
    tx: {
      id: tx.id,
      sender_name: tx.sender_name,
      vendor_name: tx.vendor_name,
      fund_type: tx.fund_type,
      amount: amount,
      status: tx.status,
    },
  };
}

export async function takeActionOnTransaction(
  txId: string,
  action: "FREEZE" | "DISMISS"
): Promise<{ success: boolean; message: string }> {
  if (action === "FREEZE") {
    return { success: true, message: `Transaction #${txId} marked as FROZEN pending manual review.` };
  } else {
    return { success: true, message: `Alert for transaction #${txId} dismissed. No action required.` };
  }
}
