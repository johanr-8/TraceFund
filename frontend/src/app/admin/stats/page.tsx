"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card/Card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/Table/Table";
import { API_URL } from "@/lib/api";

interface FundTypeBreakdown {
  name: string;
  issued: number;
  spent: number;
}

interface Stats {
  total_users: number;
  beneficiaries: number;
  vendors_registered: number;
  vendors_approved: number;
  vendors_pending: number;
  total_issued: number;
  total_spent: number;
  total_transactions: number;
  fund_type_breakdown: FundTypeBreakdown[];
}

export default function AdminStatsPage() {
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const raw = localStorage.getItem("user");
    if (!raw) { router.push("/login"); return; }
    const user = JSON.parse(raw);
    if (user.role !== "government") { router.push("/beneficiary"); return; }

    fetch(`${API_URL}/stats`)
      .then((r) => r.json())
      .then(setStats)
      .finally(() => setLoading(false));
  }, [router]);

  if (loading) return <div style={{ textAlign: "center", padding: "4rem", color: "var(--text-secondary)" }}>Loading...</div>;
  if (!stats) return <div style={{ textAlign: "center", padding: "4rem", color: "var(--accent-danger)" }}>Failed to load stats</div>;

  const utilization = stats.total_issued > 0 ? ((stats.total_spent / stats.total_issued) * 100).toFixed(1) : "0";

  return (
    <div>
      <h1 style={{ fontSize: "2rem", marginBottom: "2rem", fontWeight: 600 }}>Dashboard Statistics</h1>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "1.5rem", marginBottom: "2rem" }}>
        <Card>
          <CardContent style={{ padding: "1.5rem" }}>
            <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "0.5rem" }}>Total Users</p>
            <h2 style={{ fontSize: "2rem", fontWeight: 700 }}>{stats.total_users}</h2>
          </CardContent>
        </Card>

        <Card>
          <CardContent style={{ padding: "1.5rem" }}>
            <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "0.5rem" }}>Beneficiaries</p>
            <h2 style={{ fontSize: "2rem", fontWeight: 700 }}>{stats.beneficiaries}</h2>
          </CardContent>
        </Card>

        <Card>
          <CardContent style={{ padding: "1.5rem" }}>
            <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "0.5rem" }}>Vendors (Approved / Pending)</p>
            <h2 style={{ fontSize: "2rem", fontWeight: 700 }}>{stats.vendors_approved} / {stats.vendors_pending}</h2>
          </CardContent>
        </Card>

        <Card>
          <CardContent style={{ padding: "1.5rem" }}>
            <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "0.5rem" }}>Total Transactions</p>
            <h2 style={{ fontSize: "2rem", fontWeight: 700 }}>{stats.total_transactions}</h2>
          </CardContent>
        </Card>

        <Card style={{ background: "rgba(15, 23, 42, 0.8)", border: "2px solid rgba(6, 182, 212, 0.6)" }}>
          <CardContent style={{ padding: "1.5rem" }}>
            <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "0.5rem" }}>Total Issued</p>
            <h2 style={{ fontSize: "2rem", fontWeight: 700, color: "var(--accent-primary)" }}>₹{stats.total_issued.toLocaleString("en-IN")}</h2>
          </CardContent>
        </Card>

        <Card style={{ background: "rgba(15, 23, 42, 0.8)", border: "2px solid rgba(52, 211, 153, 0.6)" }}>
          <CardContent style={{ padding: "1.5rem" }}>
            <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "0.5rem" }}>Total Spent</p>
            <h2 style={{ fontSize: "2rem", fontWeight: 700, color: "var(--accent-success)" }}>₹{stats.total_spent.toLocaleString("en-IN")}</h2>
            <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginTop: "0.25rem" }}>{utilization}% utilization</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Fund Type Breakdown</CardTitle>
        </CardHeader>
        <CardContent style={{ padding: 0 }}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fund Type</TableHead>
                <TableHead>Issued</TableHead>
                <TableHead>Spent</TableHead>
                <TableHead>Remaining</TableHead>
                <TableHead>Utilization</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stats.fund_type_breakdown.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} style={{ textAlign: "center", color: "var(--text-secondary)", padding: "2rem" }}>
                    No fund types defined
                  </TableCell>
                </TableRow>
              ) : (
                stats.fund_type_breakdown.map((ft) => {
                  const remaining = ft.issued - ft.spent;
                  const pct = ft.issued > 0 ? ((ft.spent / ft.issued) * 100).toFixed(1) : "0";
                  return (
                    <TableRow key={ft.name}>
                      <TableCell style={{ fontWeight: 500 }}>{ft.name}</TableCell>
                      <TableCell>₹{ft.issued.toLocaleString("en-IN")}</TableCell>
                      <TableCell style={{ color: "var(--accent-success)" }}>₹{ft.spent.toLocaleString("en-IN")}</TableCell>
                      <TableCell>₹{remaining.toLocaleString("en-IN")}</TableCell>
                      <TableCell>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                          <div style={{ width: "80px", height: "6px", borderRadius: "3px", background: "rgba(255,255,255,0.08)", overflow: "hidden" }}>
                            <div style={{ width: `${Math.min(100, Number(pct))}%`, height: "100%", background: "var(--accent-primary)", borderRadius: "3px" }} />
                          </div>
                          <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>{pct}%</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
