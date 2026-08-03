"use client";

import { useState, useEffect } from "react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, StatusBadge } from '@/components/ui/Table/Table';
import { Card, CardContent } from '@/components/ui/Card/Card';
import { API_URL } from '@/lib/api';
import { useRouter } from "next/navigation";

interface Tx {
  id: number;
  date: string;
  vendor_name: string;
  fund_type: string;
  amount: number;
  status: string;
}

export default function BeneficiaryHistory() {
  const router = useRouter();
  const [txs, setTxs] = useState<Tx[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const raw = localStorage.getItem("user");
    if (!raw) { router.push("/login"); return; }
    const user = JSON.parse(raw);

    fetch(`${API_URL}/transactions?user_id=${user.id}`)
      .then(r => r.json())
      .then(setTxs)
      .finally(() => setLoading(false));
  }, [router]);

  function formatDate(iso: string) {
    if (!iso) return "-";
    const d = new Date(iso);
    return d.toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
  }

  return (
    <div>
      <h1 style={{ fontSize: "1.5rem", marginBottom: "1.5rem", fontWeight: 600 }}>Transaction History</h1>
      
      {loading ? (
        <div style={{ textAlign: "center", padding: "4rem", color: "var(--text-secondary)" }}>Loading...</div>
      ) : (
        <Card>
          <CardContent style={{ padding: 0 }}>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Vendor</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {txs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} style={{ textAlign: "center", color: "var(--text-secondary)", padding: "2rem" }}>No transactions yet.</TableCell>
                  </TableRow>
                ) : (
                  txs.map((tx) => (
                    <TableRow key={tx.id}>
                      <TableCell style={{ color: 'var(--text-secondary)', fontSize: "0.85rem" }}>{formatDate(tx.date)}</TableCell>
                      <TableCell>{tx.vendor_name}</TableCell>
                      <TableCell>{tx.fund_type}</TableCell>
                      <TableCell style={{ fontWeight: 600 }}>₹{tx.amount.toFixed(2)}</TableCell>
                      <TableCell>
                        <StatusBadge status={tx.status} />
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
