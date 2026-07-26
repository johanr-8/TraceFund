"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card/Card";
import { API_URL } from "@/lib/api";

export default function BeneficiaryWallet() {
  const [wallet, setWallet] = useState<{ user_name: string; balances: { fund_type: string; balance: number }[] } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const raw = localStorage.getItem("user");
    if (!raw) return;
    const user = JSON.parse(raw);

    fetch(`${API_URL}/wallet/${user.id}`)
      .then((r) => r.json())
      .then(setWallet)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ textAlign: "center", padding: "4rem", color: "var(--text-secondary)" }}>Loading wallet...</div>;
  if (!wallet) return <div style={{ textAlign: "center", padding: "4rem", color: "var(--text-secondary)" }}>Please log in first.</div>;

  const totalBalance = wallet.balances.reduce((sum, b) => sum + b.balance, 0);

  return (
    <div>
      <h1 style={{ fontSize: "2rem", marginBottom: "2rem", fontWeight: 600 }}>Wallet Overview</h1>

      <Card style={{
        marginBottom: "2rem",
        background: "rgba(15, 23, 42, 0.8)",
        backdropFilter: "blur(16px)",
        border: "2px solid rgba(6, 182, 212, 0.6)",
        boxShadow: "0 0 40px rgba(6, 182, 212, 0.3), inset 0 0 20px rgba(6, 182, 212, 0.1)"
      }}>
        <CardContent style={{ padding: "2rem" }}>
          <p style={{ opacity: 0.9, fontSize: "1.1rem", marginBottom: "0.5rem" }}>Total Available Balance</p>
          <h2 style={{ fontSize: "3rem", fontWeight: 700 }}>
            ${totalBalance.toFixed(2)}
          </h2>
          <p style={{ color: "var(--text-secondary)", marginTop: "0.5rem", fontSize: "0.9rem" }}>
            {wallet.user_name}
          </p>
        </CardContent>
      </Card>

      <h3 style={{ fontSize: "1.25rem", marginBottom: "1rem", fontWeight: 500 }}>Category Balances</h3>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "1.5rem" }}>
        {wallet.balances.length === 0 ? (
          <p style={{ color: "var(--text-secondary)" }}>No funds allocated yet.</p>
        ) : (
          wallet.balances.map((b, i) => (
            <Card key={i}>
              <CardHeader>
                <CardTitle>{b.fund_type}</CardTitle>
              </CardHeader>
              <CardContent>
                <div style={{ fontSize: "2rem", fontWeight: 600 }}>${b.balance.toFixed(2)}</div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
