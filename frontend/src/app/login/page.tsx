"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card/Card";
import { Button } from "@/components/ui/Button/Button";
import { API_URL } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    const res = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (res.ok) {
      localStorage.setItem("user", JSON.stringify({ id: data.id, name: data.name, role: data.role }));
      router.push(data.role === "government" ? "/admin" : "/beneficiary");
    } else {
      setError(data.detail);
    }
  }

  return (
    <div style={{ maxWidth: 480, margin: "4rem auto", padding: "0 1rem" }}>
      <h1 style={{ fontSize: "2rem", marginBottom: "2rem", fontWeight: 600, textAlign: "center" }}>Login</h1>
      <Card>
        <CardHeader>
          <CardTitle>Sign In</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
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
            <Button type="submit" fullWidth>Login</Button>
            {error && <p style={{ color: "var(--accent-danger)", fontSize: "0.9rem" }}>{error}</p>}
          </form>
          <p style={{ textAlign: "center", marginTop: "1.5rem", color: "var(--text-secondary)", fontSize: "0.9rem" }}>
            Don&apos;t have an account?{" "}
            <a href="/register" style={{ color: "var(--accent-primary)", textDecoration: "underline", cursor: "pointer" }}>Register</a>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
