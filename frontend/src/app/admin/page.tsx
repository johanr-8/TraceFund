"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card/Card";
import { Button } from "@/components/ui/Button/Button";

const API = "http://localhost:8000";

export default function AdminPage() {
  const router = useRouter();
  const [beneficiaries, setBeneficiaries] = useState<{ id: number; name: string }[]>([]);
  const [fundTypes, setFundTypes] = useState<{ id: number; name: string }[]>([]);
  const [beneficiaryId, setBeneficiaryId] = useState("");
  const [fundTypeId, setFundTypeId] = useState("");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const raw = localStorage.getItem("user");
    if (!raw) { router.push("/login"); return; }
    const user = JSON.parse(raw);
    if (user.role !== "government") { router.push("/beneficiary"); return; }

    fetch(`${API}/users?role=beneficiary`)
      .then((r) => r.json())
      .then(setBeneficiaries);
    fetch(`${API}/fund-types`)
      .then((r) => r.json())
      .then(setFundTypes);
  }, [router]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setMessage("");

    const res = await fetch(`${API}/issue-fund`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        beneficiary_id: Number(beneficiaryId),
        fund_type_id: Number(fundTypeId),
        amount: Number(amount),
      }),
    });

    const data = await res.json();
    if (res.ok) {
      setMessage(`Issued ${amount} ${data.fund_type} tokens`);
      setAmount("");
    } else {
      setMessage(`Error: ${data.detail}`);
    }
  }

  return (
    <div style={{ maxWidth: 600, margin: "2rem auto", padding: "0 1rem" }}>
      <h1 style={{ fontSize: "2rem", marginBottom: "2rem", fontWeight: 600 }}>Issue Fund</h1>
      <Card>
        <CardHeader>
          <CardTitle>New Fund Issuance</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <label style={{ fontSize: "0.875rem", fontWeight: 500, color: "var(--text-secondary)" }}>Beneficiary</label>
              <select value={beneficiaryId} onChange={(e) => setBeneficiaryId(e.target.value)} required
                style={{ width: "100%", padding: "0.875rem 1rem", borderRadius: "var(--radius-md)", background: "rgba(255,255,255,0.03)", border: "1px solid var(--border-light)", color: "var(--text-primary)", fontSize: "1rem", outline: "none", cursor: "pointer" }}>
                <option value="" style={{ background: "var(--bg-secondary)" }}>Select beneficiary</option>
                {beneficiaries.map((b) => (
                  <option key={b.id} value={b.id} style={{ background: "var(--bg-secondary)" }}>{b.name}</option>
                ))}
              </select>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <label style={{ fontSize: "0.875rem", fontWeight: 500, color: "var(--text-secondary)" }}>Fund Type</label>
              <select value={fundTypeId} onChange={(e) => setFundTypeId(e.target.value)} required
                style={{ width: "100%", padding: "0.875rem 1rem", borderRadius: "var(--radius-md)", background: "rgba(255,255,255,0.03)", border: "1px solid var(--border-light)", color: "var(--text-primary)", fontSize: "1rem", outline: "none", cursor: "pointer" }}>
                <option value="" style={{ background: "var(--bg-secondary)" }}>Select fund type</option>
                {fundTypes.map((f) => (
                  <option key={f.id} value={f.id} style={{ background: "var(--bg-secondary)" }}>{f.name}</option>
                ))}
              </select>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <label style={{ fontSize: "0.875rem", fontWeight: 500, color: "var(--text-secondary)" }}>Amount</label>
              <input type="number" min="1" value={amount} onChange={(e) => setAmount(e.target.value)} required
                style={{ width: "100%", padding: "0.875rem 1rem", borderRadius: "var(--radius-md)", background: "rgba(255,255,255,0.03)", border: "1px solid var(--border-light)", color: "var(--text-primary)", fontSize: "1rem", outline: "none", fontFamily: "var(--font-family)" }} />
            </div>
            <Button type="submit" fullWidth>Issue Fund</Button>
          </form>
          {message && <p style={{ marginTop: "1rem", padding: "0.75rem 1rem", borderRadius: "var(--radius-md)", background: "rgba(52, 211, 153, 0.15)", color: "var(--accent-success)" }}>{message}</p>}
        </CardContent>
      </Card>
    </div>
  );
}
