"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/Card/Card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, StatusBadge } from "@/components/ui/Table/Table";
import { Button } from "@/components/ui/Button/Button";
import { API_URL } from "@/lib/api";

interface TxSummary {
  id: number;
  amount: number;
  fund_type: string;
  vendor_name: string;
  status: string;
  date: string;
}

interface TxDetail extends TxSummary {
  sender_id: number;
  sender_name: string;
  vendor_id: number;
}

export default function AdminTransactionsPage() {
  const router = useRouter();
  const [txs, setTxs] = useState<TxSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [detail, setDetail] = useState<TxDetail | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    const raw = localStorage.getItem("user");
    if (!raw) { router.push("/login"); return; }
    const user = JSON.parse(raw);
    if (user.role !== "government") { router.push("/beneficiary"); return; }

    fetch(`${API_URL}/transactions`)
      .then((r) => r.json())
      .then(setTxs)
      .finally(() => setLoading(false));
  }, [router]);

  async function viewDetail(id: number) {
    setLoadingDetail(true);
    try {
      const res = await fetch(`${API_URL}/transactions/${id}`);
      if (res.ok) setDetail(await res.json());
    } finally {
      setLoadingDetail(false);
    }
  }

  const filtered = filter
    ? txs.filter((t) => t.fund_type.toLowerCase().includes(filter.toLowerCase()) || t.status.toLowerCase().includes(filter.toLowerCase()))
    : txs;

  function formatDate(iso: string) {
    if (!iso) return "—";
    return new Date(iso).toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
  }

  if (loading) return <div style={{ textAlign: "center", padding: "4rem", color: "var(--text-secondary)" }}>Loading...</div>;

  return (
    <div>
      <h1 style={{ fontSize: "2rem", marginBottom: "2rem", fontWeight: 600 }}>Transaction Monitoring</h1>

      <div style={{ marginBottom: "1.5rem", display: "flex", gap: "1rem", alignItems: "center" }}>
        <input
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Filter by category or status..."
          style={{ padding: "0.75rem 1rem", borderRadius: "var(--radius-md)", background: "rgba(0,0,0,0.4)", border: "1px solid var(--border-light)", color: "var(--text-primary)", fontSize: "0.95rem", outline: "none", fontFamily: "var(--font-family)", width: "300px" }}
        />
        <span style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>{filtered.length} transactions</span>
      </div>

      <Card>
        <CardContent style={{ padding: 0 }}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date & Time</TableHead>
                <TableHead>Tx ID</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} style={{ textAlign: "center", color: "var(--text-secondary)", padding: "2rem" }}>
                    No transactions found
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((tx) => (
                  <TableRow key={tx.id}>
                    <TableCell style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>{formatDate(tx.date)}</TableCell>
                    <TableCell style={{ fontFamily: "var(--font-mono)" }}>#{tx.id}</TableCell>
                    <TableCell>{tx.vendor_name}</TableCell>
                    <TableCell>{tx.fund_type}</TableCell>
                    <TableCell style={{ fontWeight: 600 }}>₹{tx.amount.toFixed(2)}</TableCell>
                    <TableCell><StatusBadge status={tx.status} /></TableCell>
                    <TableCell>
                      <Button variant="secondary" onClick={() => viewDetail(tx.id)} disabled={loadingDetail} style={{ padding: "0.4rem 1rem", fontSize: "0.8rem" }}>
                        {loadingDetail && detail?.id === tx.id ? "Loading..." : "View"}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {detail && (
        <Card style={{ marginTop: "2rem" }}>
          <CardContent>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
              <h3 style={{ fontSize: "1.25rem", fontWeight: 600 }}>Transaction #{detail.id}</h3>
              <Button variant="secondary" onClick={() => setDetail(null)} style={{ padding: "0.4rem 1rem", fontSize: "0.8rem" }}>Close</Button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "1.5rem" }}>
              <div>
                <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: "0.25rem" }}>Beneficiary</p>
                <p style={{ fontWeight: 500 }}>{detail.sender_name} (ID: {detail.sender_id})</p>
              </div>
              <div>
                <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: "0.25rem" }}>Vendor</p>
                <p style={{ fontWeight: 500 }}>{detail.vendor_name} (ID: {detail.vendor_id})</p>
              </div>
              <div>
                <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: "0.25rem" }}>Category</p>
                <p style={{ fontWeight: 500 }}>{detail.fund_type}</p>
              </div>
              <div>
                <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: "0.25rem" }}>Amount</p>
                <p style={{ fontWeight: 500 }}>₹{detail.amount.toFixed(2)}</p>
              </div>
              <div>
                <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: "0.25rem" }}>Status</p>
                <StatusBadge status={detail.status} />
              </div>
              <div>
                <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: "0.25rem" }}>Date</p>
                <p style={{ fontWeight: 500 }}>{formatDate(detail.date)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
