"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card/Card";
import { Button } from "@/components/ui/Button/Button";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/Table/Table";
import { API_URL } from "@/lib/api";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export default function AdminPage() {
  const router = useRouter();
  const [userName, setUserName] = useState("");
  const [beneficiaries, setBeneficiaries] = useState<{ id: number; name: string }[]>([]);
  const [fundTypes, setFundTypes] = useState<{ id: number; name: string }[]>([]);
  const [beneficiaryId, setBeneficiaryId] = useState("");
  const [fundTypeId, setFundTypeId] = useState("");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Staff account management
  const [staff, setStaff] = useState<User[]>([]);
  const [staffName, setStaffName] = useState("");
  const [staffEmail, setStaffEmail] = useState("");
  const [staffPassword, setStaffPassword] = useState("");
  const [staffRole, setStaffRole] = useState("government");
  const [staffSubmitting, setStaffSubmitting] = useState(false);
  const [staffMessage, setStaffMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem("user");
    if (!raw) { router.push("/login"); return; }
    const user = JSON.parse(raw);
    if (user.role !== "government") { router.push("/beneficiary"); return; }
    setUserName(user.name);

    Promise.all([
      fetch(`${API_URL}/users?role=beneficiary`).then(r => r.json()),
      fetch(`${API_URL}/fund-types`).then(r => r.json()),
      fetch(`${API_URL}/users?role=government`).then(r => r.json()),
      fetch(`${API_URL}/users?role=auditor`).then(r => r.json()),
    ]).then(([b, f, govs, auditors]) => {
      setBeneficiaries(b);
      setFundTypes(f);
      setStaff([...(govs as User[]), ...(auditors as User[])]);
    }).finally(() => setLoading(false));
  }, [router]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setMessage("");
    setSubmitting(true);

    const res = await fetch(`${API_URL}/issue-fund`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        beneficiary_id: Number(beneficiaryId),
        fund_type_id: Number(fundTypeId),
        amount: Number(amount),
      }),
    });

    const data = await res.json();
    setSubmitting(false);
    if (res.ok) {
      setMessage(`Issued ${amount} ${data.fund_type} tokens`);
      setAmount("");
      setBeneficiaryId("");
      setFundTypeId("");
    } else {
      setMessage(`Error: ${data.detail}`);
    }
  }

  async function handleCreateStaff(e: FormEvent) {
    e.preventDefault();
    setStaffMessage(null);
    setStaffSubmitting(true);

    try {
      const res = await fetch(`${API_URL}/admin/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: staffName,
          email: staffEmail,
          password: staffPassword,
          role: staffRole,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setStaffMessage({ type: "success", text: `Created ${data.role} account for ${data.name}` });
        setStaff(prev => [...prev, data as User]);
        setStaffName("");
        setStaffEmail("");
        setStaffPassword("");
      } else {
        setStaffMessage({ type: "error", text: data.detail || "Failed to create account" });
      }
    } catch {
      setStaffMessage({ type: "error", text: "Network error — is the backend running?" });
    } finally {
      setStaffSubmitting(false);
    }
  }

  if (loading) return <div style={{ textAlign: "center", padding: "4rem", color: "var(--text-secondary)" }}>Loading...</div>;

  return (
    <div>
      <h1 style={{ fontSize: "2rem", marginBottom: "2rem", fontWeight: 600 }}>Issue Fund</h1>

      <Card style={{
        marginBottom: "1.5rem",
        background: "rgba(15, 23, 42, 0.6)",
        backdropFilter: "blur(12px)",
        border: "1px solid rgba(168, 85, 247, 0.3)",
      }}>
        <CardContent style={{ padding: "1.5rem" }}>
          <p style={{ opacity: 0.8, fontSize: "0.95rem", marginBottom: "0.25rem" }}>Government Administrator</p>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 700 }}>{userName}</h2>
          <p style={{ color: "var(--text-secondary)", marginTop: "0.25rem", fontSize: "0.85rem" }}>
            Issue programmable funds to beneficiaries with spending rules
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>New Fund Issuance</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <label style={{ fontSize: "0.875rem", fontWeight: 500, color: "var(--text-secondary)" }}>Beneficiary</label>
              <select value={beneficiaryId} onChange={(e) => setBeneficiaryId(e.target.value)} required
                style={{ width: "100%", padding: "0.875rem 1rem", borderRadius: "var(--radius-md)", background: "rgba(255,255,255,0.03)", border: "1px solid var(--border-light)", color: "var(--text-primary)", fontSize: "1rem", outline: "none", appearance: "none", cursor: "pointer", fontFamily: "var(--font-family)" }}>
                <option value="" style={{ background: "var(--bg-secondary)" }}>Select beneficiary</option>
                {beneficiaries.map((b) => (
                  <option key={b.id} value={b.id} style={{ background: "var(--bg-secondary)" }}>{b.name}</option>
                ))}
              </select>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <label style={{ fontSize: "0.875rem", fontWeight: 500, color: "var(--text-secondary)" }}>Fund Category</label>
              <select value={fundTypeId} onChange={(e) => setFundTypeId(e.target.value)} required
                style={{ width: "100%", padding: "0.875rem 1rem", borderRadius: "var(--radius-md)", background: "rgba(255,255,255,0.03)", border: "1px solid var(--border-light)", color: "var(--text-primary)", fontSize: "1rem", outline: "none", appearance: "none", cursor: "pointer", fontFamily: "var(--font-family)" }}>
                <option value="" style={{ background: "var(--bg-secondary)" }}>Select fund category</option>
                {fundTypes.map((f) => (
                  <option key={f.id} value={f.id} style={{ background: "var(--bg-secondary)" }}>{f.name}</option>
                ))}
              </select>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <label style={{ fontSize: "0.875rem", fontWeight: 500, color: "var(--text-secondary)" }}>Amount (₹)</label>
              <input type="number" min="1" value={amount} onChange={(e) => setAmount(e.target.value)} required placeholder="0.00"
                style={{ width: "100%", padding: "0.875rem 1rem", borderRadius: "var(--radius-md)", background: "rgba(255,255,255,0.03)", border: "1px solid var(--border-light)", color: "var(--text-primary)", fontSize: "1rem", outline: "none", fontFamily: "var(--font-family)" }} />
            </div>
            <Button type="submit" fullWidth disabled={submitting} style={{ marginTop: "0.5rem" }}>
              {submitting ? "Processing Issuance..." : "Issue Fund"}
            </Button>
          </form>
          {message && (
            <p style={{ marginTop: "1rem", padding: "0.75rem 1rem", borderRadius: "var(--radius-md)",
              background: message.startsWith("Error") ? "rgba(248, 113, 113, 0.15)" : "rgba(52, 211, 153, 0.15)",
              color: message.startsWith("Error") ? "var(--accent-danger)" : "var(--accent-success)" }}>
              {message}
            </p>
          )}
        </CardContent>
      </Card>

      <Card style={{ marginTop: "2rem" }}>
        <CardHeader>
          <CardTitle>Manage Staff Accounts</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreateStaff} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "1rem", alignItems: "end" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <label style={{ fontSize: "0.875rem", fontWeight: 500, color: "var(--text-secondary)" }}>Full Name</label>
              <input value={staffName} onChange={(e) => setStaffName(e.target.value)} required
                style={{ width: "100%", padding: "0.875rem 1rem", borderRadius: "var(--radius-md)", background: "rgba(0,0,0,0.4)", border: "1px solid var(--border-light)", color: "var(--text-primary)", fontSize: "1rem", outline: "none", fontFamily: "var(--font-family)" }} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <label style={{ fontSize: "0.875rem", fontWeight: 500, color: "var(--text-secondary)" }}>Email</label>
              <input type="email" value={staffEmail} onChange={(e) => setStaffEmail(e.target.value)} required
                style={{ width: "100%", padding: "0.875rem 1rem", borderRadius: "var(--radius-md)", background: "rgba(0,0,0,0.4)", border: "1px solid var(--border-light)", color: "var(--text-primary)", fontSize: "1rem", outline: "none", fontFamily: "var(--font-family)" }} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <label style={{ fontSize: "0.875rem", fontWeight: 500, color: "var(--text-secondary)" }}>Password</label>
              <input type="password" value={staffPassword} onChange={(e) => setStaffPassword(e.target.value)} required minLength={4}
                style={{ width: "100%", padding: "0.875rem 1rem", borderRadius: "var(--radius-md)", background: "rgba(0,0,0,0.4)", border: "1px solid var(--border-light)", color: "var(--text-primary)", fontSize: "1rem", outline: "none", fontFamily: "var(--font-family)" }} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <label style={{ fontSize: "0.875rem", fontWeight: 500, color: "var(--text-secondary)" }}>Role</label>
              <select value={staffRole} onChange={(e) => setStaffRole(e.target.value)}
                style={{ width: "100%", padding: "0.875rem 1rem", borderRadius: "var(--radius-md)", background: "rgba(0,0,0,0.4)", border: "1px solid var(--border-light)", color: "var(--text-primary)", fontSize: "1rem", outline: "none", fontFamily: "var(--font-family)", cursor: "pointer" }}>
                <option value="government" style={{ background: "var(--bg-secondary)" }}>Government</option>
                <option value="auditor" style={{ background: "var(--bg-secondary)" }}>Auditor</option>
              </select>
            </div>
            <Button type="submit" disabled={staffSubmitting}>
              {staffSubmitting ? "Creating..." : "Create Account"}
            </Button>
          </form>

          {staffMessage && (
            <p style={{ marginTop: "1rem", padding: "0.75rem 1rem", borderRadius: "var(--radius-md)",
              background: staffMessage.type === "error" ? "rgba(248, 113, 113, 0.15)" : "rgba(52, 211, 153, 0.15)",
              color: staffMessage.type === "error" ? "var(--accent-danger)" : "var(--accent-success)" }}>
              {staffMessage.text}
            </p>
          )}

          <div style={{ marginTop: "2rem" }}>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 600, marginBottom: "1rem" }}>Existing Staff ({staff.length})</h3>
            {staff.length === 0 ? (
              <p style={{ color: "var(--text-secondary)", textAlign: "center", padding: "1rem" }}>No staff accounts yet</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {staff.map((s) => (
                    <TableRow key={s.id}>
                      <TableCell>{s.id}</TableCell>
                      <TableCell>{s.name}</TableCell>
                      <TableCell>{s.email}</TableCell>
                      <TableCell>
                        <span style={{
                          display: "inline-block",
                          padding: "0.25rem 0.75rem",
                          borderRadius: "999px",
                          fontSize: "0.8rem",
                          fontWeight: 600,
                          background: s.role === "government"
                            ? "rgba(168, 85, 247, 0.2)"
                            : "rgba(6, 182, 212, 0.2)",
                          color: s.role === "government"
                            ? "var(--accent-secondary)"
                            : "var(--accent-primary)",
                          textTransform: "capitalize",
                        }}>
                          {s.role}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
