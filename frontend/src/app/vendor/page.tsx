'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, StatusBadge } from '@/components/ui/Table/Table';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card/Card';
import { API_URL } from '@/lib/api';

interface VendorProfile {
  id: number;
  user_id: number;
  business_name: string;
  category: string;
  approval_status: string;
}

interface Transaction {
  id: number;
  amount: number;
  fund_type: string;
  vendor_name: string;
  status: string;
  date: string;
}

export default function VendorDashboard() {
  const router = useRouter();
  const [vendor, setVendor] = useState<VendorProfile | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const raw = localStorage.getItem("user");
    if (!raw) { router.push("/login"); return; }
    const user = JSON.parse(raw);

    fetch(`${API_URL}/vendors?user_id=${user.id}`)
      .then(r => r.json())
      .then((vendors: VendorProfile[]) => {
        if (vendors.length === 0) {
          setVendor(null);
          setLoading(false);
          return;
        }
        const v = vendors[0];
        setVendor(v);
        return fetch(`${API_URL}/transactions?vendor_id=${v.id}`);
      })
      .then(r => r?.json())
      .then((txs: Transaction[]) => {
        if (txs) setTransactions(txs);
      })
      .finally(() => setLoading(false));
  }, [router]);

  if (loading) return <div style={{ textAlign: "center", padding: "4rem", color: "var(--text-secondary)" }}>Loading...</div>;

  if (!vendor) {
    return (
      <div style={{ textAlign: "center", padding: "4rem" }}>
        <h1 style={{ fontSize: "2rem", marginBottom: "1rem", fontWeight: 600 }}>Vendor Dashboard</h1>
        <Card>
          <CardContent>
            <p style={{ color: "var(--text-secondary)", padding: "2rem" }}>
              You haven&apos;t registered as a vendor yet.{" "}
              <a href="/vendor/register" style={{ color: "var(--accent-primary)", textDecoration: "underline" }}>
                Register now
              </a>
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const totalSettled = transactions
    .filter(tx => tx.status === "Approved")
    .reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div>
      <h1 style={{ fontSize: "2rem", marginBottom: "2rem", fontWeight: 600 }}>Vendor Dashboard</h1>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "2rem", marginBottom: "2rem" }}>
        <Card style={{
          background: "rgba(15, 23, 42, 0.8)",
          backdropFilter: "blur(16px)",
          border: "2px solid rgba(6, 182, 212, 0.6)",
          boxShadow: "0 0 40px rgba(6, 182, 212, 0.3), inset 0 0 20px rgba(6, 182, 212, 0.1)"
        }}>
          <CardContent style={{ padding: "2rem" }}>
            <p style={{ opacity: 0.9, fontSize: "1.1rem", marginBottom: "0.5rem" }}>Total Settled</p>
            <h2 style={{ fontSize: "3rem", fontWeight: 700 }}>₹{totalSettled.toFixed(2)}</h2>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Registration Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginTop: "1rem" }}>
              <StatusBadge status={vendor.approval_status} />
              <span style={{ color: "var(--text-secondary)" }}>Category: <strong>{vendor.category}</strong></span>
            </div>
            <p style={{ marginTop: "1rem", fontSize: "0.875rem", color: "var(--text-secondary)" }}>
              {vendor.approval_status === "approved"
                ? `Your wallet is approved to accept restricted tokens for ${vendor.category}.`
                : vendor.approval_status === "pending"
                ? "Your registration is pending government approval."
                : "Your registration has been rejected."}
            </p>
          </CardContent>
        </Card>
      </div>

      <h3 style={{ fontSize: "1.25rem", marginBottom: "1rem", fontWeight: 500 }}>Recent Incoming Payments</h3>

      <Card>
        <CardContent style={{ padding: 0 }}>
          {transactions.length === 0 ? (
            <p style={{ padding: "2rem", color: "var(--text-secondary)", textAlign: "center" }}>No transactions yet</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Fund Type</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map(tx => (
                  <TableRow key={tx.id}>
                    <TableCell style={{ color: "var(--text-secondary)" }}>
                      {tx.date ? new Date(tx.date).toLocaleString() : "—"}
                    </TableCell>
                    <TableCell>{tx.fund_type}</TableCell>
                    <TableCell style={{ fontWeight: 600 }}>₹{tx.amount.toFixed(2)}</TableCell>
                    <TableCell><StatusBadge status={tx.status} /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
