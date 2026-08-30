"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card/Card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/Table/Table";
import { Button } from "@/components/ui/Button/Button";
import Link from "next/link";
import { API_URL } from "@/lib/api";
import { InvestigateButton } from "./InvestigateButton";

interface TxDetail {
  id: number;
  date: string;
  sender_id: number;
  sender_name: string;
  vendor_id: number;
  vendor_name: string;
  fund_type: string;
  amount: number;
  status: string;
}

interface AnalyzedTx {
  tx: TxDetail;
  riskScore: number;
  reason: string;
  isSuspicious: boolean;
}

function riskColor(score: number) {
  if (score >= 80) return "rgba(248, 113, 113, 0.2)";
  if (score >= 60) return "rgba(251, 191, 36, 0.2)";
  return "rgba(52, 211, 153, 0.2)";
}

export default function AuditorDashboard() {
  const [alerts, setAlerts] = useState<AnalyzedTx[]>([]);
  const [totalFlagged, setTotalFlagged] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch(`${API_URL}/transactions`);
        if (!res.ok) throw new Error("Failed to load transactions");
        const list: { id: number }[] = await res.json();

        const detailed: TxDetail[] = await Promise.all(
          list.map((tx) =>
            fetch(`${API_URL}/transactions/${tx.id}`)
              .then((r) => (r.ok ? r.json() : null))
              .catch(() => null)
          )
        );
        const realTxs = detailed.filter(Boolean);

        // Group by sender for velocity analysis
        const bySender: Record<number, TxDetail[]> = {};
        realTxs.forEach((tx) => {
          const id = tx.sender_id ?? 0;
          (bySender[id] = bySender[id] || []).push(tx);
        });

        // Statistical baseline for amount outliers
        const amounts = realTxs.map((t) => t.amount);
        const mean = amounts.length ? amounts.reduce((a, b) => a + b, 0) / amounts.length : 0;
        const variance = amounts.length
          ? amounts.reduce((a, b) => a + (b - mean) ** 2, 0) / amounts.length
          : 0;
        const stdDev = Math.sqrt(variance);

        const analyzed: AnalyzedTx[] = realTxs.map((tx) => {
          let score = 0;
          const flags: string[] = [];

          if (amounts.length > 1 && stdDev > 0 && tx.amount > mean + 1.5 * stdDev) {
            score += 45;
            flags.push("High value anomaly");
          }

          const senderTxs = (bySender[tx.sender_id ?? 0] || []).filter(
            (t) => t.id !== tx.id
          );
          const rapid = senderTxs.filter((t) => {
            const d = new Date(t.date).getTime();
            const cur = new Date(tx.date).getTime();
            return Math.abs(d - cur) <= 10 * 60 * 1000;
          });
          if (rapid.length >= 2) {
            score += 35;
            flags.push("Velocity anomaly — rapid successive transfers");
          }

          if (tx.amount > 5000) {
            score += 20;
            flags.push("Large single transfer");
          }

          const clamped = Math.min(95, score);
          return {
            tx,
            riskScore: clamped,
            reason: flags.length ? flags.join("; ") : "Routine activity",
            isSuspicious: clamped >= 60,
          };
        });

        if (cancelled) return;
        setAlerts(analyzed.filter((a) => a.isSuspicious).sort((a, b) => b.riskScore - a.riskScore));
        setTotalFlagged(analyzed.filter((a) => a.isSuspicious).length);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, []);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: 600 }}>Fraud Detection Engine</h1>
        <Link href="/auditor/trail">
          <Button variant="secondary">View Full Ledger</Button>
        </Link>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "2rem", marginBottom: "2rem" }}>
        <Card style={{ background: "rgba(248, 113, 113, 0.1)", border: "1px solid rgba(248, 113, 113, 0.3)" }}>
          <CardContent style={{ padding: "2rem" }}>
            <p style={{ opacity: 0.9, fontSize: "1.1rem", marginBottom: "0.5rem", color: "var(--accent-danger)" }}>Flagged Transactions</p>
            <h2 style={{ fontSize: "3rem", fontWeight: 700, color: "white" }}>{loading ? "…" : totalFlagged}</h2>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>AI Analysis Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginTop: "1rem" }}>
              <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "var(--accent-success)", boxShadow: "0 0 10px var(--accent-success)" }} />
              <span style={{ color: "var(--text-primary)", fontWeight: 500 }}>Engine Active</span>
            </div>
            <p style={{ marginTop: "1rem", fontSize: "0.875rem", color: "var(--text-secondary)" }}>
              Graph-based anomaly detection is analyzing on-chain transactions for velocity and high-value violations in real time.
            </p>
          </CardContent>
        </Card>
      </div>

      <h3 style={{ fontSize: "1.25rem", marginBottom: "1rem", fontWeight: 500, color: "var(--accent-danger)" }}>High-Risk Alerts</h3>

      <Card>
        <CardContent style={{ padding: 0 }}>
          {loading ? (
            <div style={{ textAlign: "center", padding: "3rem", color: "var(--text-secondary)" }}>Loading...</div>
          ) : error ? (
            <div style={{ textAlign: "center", padding: "3rem", color: "var(--accent-danger)" }}>{error}</div>
          ) : alerts.length === 0 ? (
            <div style={{ textAlign: "center", padding: "3rem", color: "var(--text-secondary)" }}>
              No suspicious transactions detected.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Risk Score</TableHead>
                  <TableHead>Tx ID</TableHead>
                  <TableHead>Entity</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {alerts.map(({ tx, riskScore, reason }) => (
                  <TableRow key={tx.id} style={{ background: "rgba(248, 113, 113, 0.05)" }}>
                    <TableCell>
                      <div style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "40px", height: "40px",
                        borderRadius: "50%",
                        background: riskColor(riskScore),
                        color: "var(--accent-danger)",
                        fontWeight: 700,
                      }}>
                        {riskScore}
                      </div>
                    </TableCell>
                    <TableCell style={{ fontFamily: "var(--font-mono)" }}>#{tx.id}</TableCell>
                    <TableCell>
                      {tx.vendor_name}
                      <br />
                      <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>Ben: {tx.sender_name}</span>
                    </TableCell>
                    <TableCell style={{ fontWeight: 600 }}>₹{tx.amount.toFixed(2)}</TableCell>
                    <TableCell style={{ color: "var(--accent-danger)" }}>{reason}</TableCell>
                    <TableCell>
                      <InvestigateButton txId={String(tx.id)} />
                    </TableCell>
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
