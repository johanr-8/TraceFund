"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/Card/Card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, StatusBadge } from "@/components/ui/Table/Table";
import Link from "next/link";
import { API_URL } from "@/lib/api";

interface TrailTx {
  id: number;
  date: string;
  sender_name: string;
  vendor_name: string;
  fund_type: string;
  amount: number;
  status: string;
}

function formatDate(iso: string) {
  if (!iso) return "-";
  return new Date(iso).toLocaleString("en-IN", {
    day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
  });
}

export default function AuditorTrail() {
  const [txs, setTxs] = useState<TrailTx[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`${API_URL}/transactions`)
      .then((r) => {
        if (!r.ok) throw new Error("Failed to load transactions");
        return r.json();
      })
      .then(async (list: { id: number }[]) => {
        const detailed = await Promise.all(
          list.map((tx: { id: number }) =>
            fetch(`${API_URL}/transactions/${tx.id}`)
              .then((r) => (r.ok ? r.json() : tx))
              .catch(() => tx)
          )
        );
        setTxs(detailed);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div style={{ display: "flex", gap: "1rem", alignItems: "center", marginBottom: "2rem" }}>
        <Link href="/auditor" style={{ color: "var(--text-secondary)", textDecoration: "none" }}>
          &larr; Back to Dashboard
        </Link>
        <h1 style={{ fontSize: "2rem", fontWeight: 600, margin: 0 }}>Full Transaction Ledger</h1>
      </div>

      <Card>
        <CardContent style={{ padding: 0 }}>
          {loading ? (
            <div style={{ textAlign: "center", padding: "3rem", color: "var(--text-secondary)" }}>Loading...</div>
          ) : error ? (
            <div style={{ textAlign: "center", padding: "3rem", color: "var(--accent-danger)" }}>{error}</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Tx ID</TableHead>
                  <TableHead>Beneficiary</TableHead>
                  <TableHead>Vendor</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {txs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} style={{ textAlign: "center", color: "var(--text-secondary)", padding: "2rem" }}>
                      No transactions recorded yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  txs.map((tx) => (
                    <TableRow key={tx.id}>
                      <TableCell style={{ color: "var(--text-secondary)" }}>{formatDate(tx.date)}</TableCell>
                      <TableCell style={{ fontFamily: "var(--font-mono)", fontSize: "0.875rem" }}>#{tx.id}</TableCell>
                      <TableCell>{tx.sender_name || "—"}</TableCell>
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
          )}
        </CardContent>
      </Card>
    </div>
  );
}
