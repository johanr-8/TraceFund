"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card/Card";
import { Button } from "@/components/ui/Button/Button";
import { API_URL } from "@/lib/api";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("beneficiary");
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    const res = await fetch(`${API_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, role }),
    });

    const data = await res.json();
    if (res.ok) {
      alert(`Registered as ${data.name} (${data.role})`);
      router.push("/login");
    } else {
      setError(data.detail);
    }
  }

  return (
    <div style={{ maxWidth: 480, margin: "4rem auto", padding: "0 1rem" }}>
      <h1 style={{ fontSize: "2rem", marginBottom: "2rem", fontWeight: 600, textAlign: "center" }}>Register</h1>
      <Card>
        <CardHeader>
          <CardTitle>Create Account</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <label style={{ fontSize: "0.875rem", fontWeight: 500, color: "var(--text-secondary)" }}>Name</label>
              <input value={name} onChange={(e) => setName(e.target.value)} required
                style={{ width: "100%", padding: "0.875rem 1rem", borderRadius: "var(--radius-md)", background: "rgba(255,255,255,0.03)", border: "1px solid var(--border-light)", color: "var(--text-primary)", fontSize: "1rem", outline: "none", fontFamily: "var(--font-family)" }} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <label style={{ fontSize: "0.875rem", fontWeight: 500, color: "var(--text-secondary)" }}>Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                style={{ width: "100%", padding: "0.875rem 1rem", borderRadius: "var(--radius-md)", background: "rgba(255,255,255,0.03)", border: "1px solid var(--border-light)", color: "var(--text-primary)", fontSize: "1rem", outline: "none", fontFamily: "var(--font-family)" }} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <label style={{ fontSize: "0.875rem", fontWeight: 500, color: "var(--text-secondary)" }}>Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
                style={{ width: "100%", padding: "0.875rem 1rem", borderRadius: "var(--radius-md)", background: "rgba(255,255,255,0.03)", border: "1px solid var(--border-light)", color: "var(--text-primary)", fontSize: "1rem", outline: "none", fontFamily: "var(--font-family)" }} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <label style={{ fontSize: "0.875rem", fontWeight: 500, color: "var(--text-secondary)" }}>Role</label>
              <select value={role} onChange={(e) => setRole(e.target.value)}
                style={{ width: "100%", padding: "0.875rem 1rem", borderRadius: "var(--radius-md)", background: "rgba(255,255,255,0.03)", border: "1px solid var(--border-light)", color: "var(--text-primary)", fontSize: "1rem", outline: "none", fontFamily: "var(--font-family)", cursor: "pointer" }}>
                <option value="beneficiary" style={{ background: "var(--bg-secondary)" }}>Beneficiary</option>
                <option value="government" style={{ background: "var(--bg-secondary)" }}>Government</option>
                <option value="vendor" style={{ background: "var(--bg-secondary)" }}>Vendor</option>
                <option value="auditor" style={{ background: "var(--bg-secondary)" }}>Auditor</option>
              </select>
            </div>
            <Button type="submit" fullWidth>Register</Button>
            {error && <p style={{ color: "var(--accent-danger)", fontSize: "0.9rem" }}>{error}</p>}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
