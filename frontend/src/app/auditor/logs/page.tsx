"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/Card/Card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/Table/Table";
import { Button } from "@/components/ui/Button/Button";
import { API_URL } from "@/lib/api";

interface AuditLog {
  id: number;
  user_id: number | null;
  action: string;
  target_type: string;
  target_id: number | null;
  details: string;
  date: string;
}

const ACTION_COLORS: Record<string, string> = {
  register: "rgba(6, 182, 212, 0.2)",
  issue_fund: "rgba(168, 85, 247, 0.2)",
  spend: "rgba(52, 211, 153, 0.2)",
  approve_vendor: "rgba(52, 211, 153, 0.2)",
  reject_vendor: "rgba(248, 113, 113, 0.2)",
  register_vendor: "rgba(251, 191, 36, 0.2)",
  create_fund_type: "rgba(168, 85, 247, 0.2)",
  delete_fund_type: "rgba(248, 113, 113, 0.2)",
  admin_create_user: "rgba(6, 182, 212, 0.2)",
};

export default function AuditLogsPage() {
  const router = useRouter();
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem("user");
    if (!raw) { router.push("/login"); return; }
    const user = JSON.parse(raw);
    if (user.role !== "auditor") { router.push("/beneficiary"); return; }
    fetchLogs();
  }, [router]);

  function fetchLogs() {
    setRefreshing(true);
    const url = filter ? `${API_URL}/audit-logs?action=${filter}` : `${API_URL}/audit-logs`;
    fetch(url)
      .then((r) => r.json())
      .then(setLogs)
      .finally(() => { setLoading(false); setRefreshing(false); });
  }

  function formatDate(iso: string) {
    if (!iso) return "—";
    return new Date(iso).toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit" });
  }

  const actions = ["register", "issue_fund", "spend", "approve_vendor", "reject_vendor", "register_vendor", "create_fund_type", "delete_fund_type", "admin_create_user"];

  if (loading) return <div style={{ textAlign: "center", padding: "4rem", color: "var(--text-secondary)" }}>Loading...</div>;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: 600 }}>Audit Logs</h1>
        <Button variant="secondary" onClick={fetchLogs} disabled={refreshing} style={{ padding: "0.5rem 1.25rem" }}>
          {refreshing ? "Refreshing..." : "Refresh"}
        </Button>
      </div>

      <div style={{ marginBottom: "1.5rem", display: "flex", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
        <select
          value={filter}
          onChange={(e) => { setFilter(e.target.value); }}
          style={{ padding: "0.75rem 1rem", borderRadius: "var(--radius-md)", background: "rgba(0,0,0,0.4)", border: "1px solid var(--border-light)", color: "var(--text-primary)", fontSize: "0.95rem", outline: "none", fontFamily: "var(--font-family)", cursor: "pointer" }}
        >
          <option value="">All Actions</option>
          {actions.map((a) => (
            <option key={a} value={a} style={{ background: "var(--bg-secondary)" }}>{a.replace(/_/g, " ")}</option>
          ))}
        </select>
        <Button onClick={fetchLogs} disabled={refreshing} style={{ padding: "0.75rem 1.25rem" }}>
          Apply Filter
        </Button>
        <span style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>{logs.length} log entries</span>
      </div>

      <Card>
        <CardContent style={{ padding: 0 }}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>User ID</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Target</TableHead>
                <TableHead>Target ID</TableHead>
                <TableHead>Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} style={{ textAlign: "center", color: "var(--text-secondary)", padding: "2rem" }}>
                    No audit logs found
                  </TableCell>
                </TableRow>
              ) : (
                logs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell style={{ color: "var(--text-secondary)", fontSize: "0.85rem", whiteSpace: "nowrap" }}>
                      {formatDate(log.date)}
                    </TableCell>
                    <TableCell style={{ fontFamily: "var(--font-mono)" }}>
                      {log.user_id !== null ? `#${log.user_id}` : "—"}
                    </TableCell>
                    <TableCell>
                      <span style={{
                        display: "inline-block",
                        padding: "0.25rem 0.75rem",
                        borderRadius: "999px",
                        fontSize: "0.8rem",
                        fontWeight: 600,
                        background: ACTION_COLORS[log.action] || "rgba(255,255,255,0.05)",
                        textTransform: "capitalize",
                      }}>
                        {log.action.replace(/_/g, " ")}
                      </span>
                    </TableCell>
                    <TableCell style={{ textTransform: "capitalize" }}>{log.target_type}</TableCell>
                    <TableCell style={{ fontFamily: "var(--font-mono)" }}>
                      {log.target_id !== null ? `#${log.target_id}` : "—"}
                    </TableCell>
                    <TableCell style={{ color: "var(--text-secondary)", fontSize: "0.85rem", maxWidth: "300px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {log.details || "—"}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
