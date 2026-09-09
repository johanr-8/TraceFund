"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card/Card";
import { API_URL } from "@/lib/api";

interface CategoryBalance {
  fund_type: string;
  balance: number;
}

interface WalletData {
  user_id: number;
  user_name: string;
  balances: CategoryBalance[];
}

export default function BeneficiaryProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<{ id: number; name: string; email: string; role: string } | null>(null);
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const raw = localStorage.getItem("user");
    if (!raw) { router.push("/login"); return; }
    const u = JSON.parse(raw);
    setUser(u);

    fetch(`${API_URL}/wallet/${u.id}`)
      .then((r) => r.json())
      .then(setWallet)
      .finally(() => setLoading(false));
  }, [router]);

  const totalBalance = wallet?.balances?.reduce((sum, b) => sum + b.balance, 0) ?? 0;

  if (loading) return <div style={{ textAlign: "center", padding: "4rem", color: "var(--text-secondary)" }}>Loading...</div>;

  const initials = user ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) : "?";

  return (
    <div style={{ maxWidth: "700px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "2rem", marginBottom: "2rem", fontWeight: 600 }}>My Profile</h1>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1.5rem", marginBottom: "2rem" }}>
        <Card>
          <CardContent style={{ padding: "2rem", display: "flex", alignItems: "center", gap: "1.5rem" }}>
            <div style={{
              width: "64px", height: "64px", borderRadius: "50%",
              background: "rgba(6, 182, 212, 0.15)", border: "2px solid rgba(6, 182, 212, 0.4)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "1.25rem", fontWeight: 700, color: "var(--accent-primary)",
              flexShrink: 0,
            }}>
              {initials}
            </div>
            <div>
              <h2 style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: "0.25rem" }}>{user?.name}</h2>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>{user?.email}</p>
              <span style={{
                display: "inline-block", marginTop: "0.5rem",
                padding: "0.2rem 0.75rem", borderRadius: "999px",
                fontSize: "0.75rem", fontWeight: 600, textTransform: "capitalize",
                background: "rgba(6, 182, 212, 0.15)", color: "var(--accent-primary)",
              }}>
                {user?.role}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card style={{ background: "rgba(15, 23, 42, 0.8)", border: "2px solid rgba(6, 182, 212, 0.6)" }}>
          <CardContent style={{ padding: "2rem" }}>
            <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "0.5rem" }}>Total Wallet Balance</p>
            <h2 style={{ fontSize: "2.5rem", fontWeight: 700 }}>
              ₹{totalBalance.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h2>
            <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginTop: "0.25rem" }}>
              Across {wallet?.balances?.length ?? 0} fund {wallet?.balances?.length === 1 ? "category" : "categories"}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Category Balances</CardTitle>
        </CardHeader>
        <CardContent style={{ padding: 0 }}>
          {wallet && wallet.balances.length > 0 ? (
            <div style={{ padding: "1rem 1.5rem" }}>
              {wallet.balances.map((b, i) => (
                <div key={b.fund_type + i} style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "1rem 0",
                  borderBottom: i < wallet.balances.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none",
                }}>
                  <span style={{ fontWeight: 500 }}>{b.fund_type}</span>
                  <span style={{ fontWeight: 600, color: "var(--accent-primary)" }}>
                    ₹{b.balance.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ padding: "2rem", textAlign: "center", color: "var(--text-secondary)" }}>
              No fund categories allocated yet.
            </p>
          )}
        </CardContent>
      </Card>

      <Card style={{ marginTop: "1.5rem" }}>
        <CardHeader>
          <CardTitle>Account Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "1.5rem" }}>
            <div>
              <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: "0.25rem" }}>User ID</p>
              <p style={{ fontFamily: "var(--font-mono)", fontWeight: 500 }}>#{user?.id}</p>
            </div>
            <div>
              <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: "0.25rem" }}>Full Name</p>
              <p style={{ fontWeight: 500 }}>{user?.name}</p>
            </div>
            <div>
              <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: "0.25rem" }}>Email</p>
              <p style={{ fontWeight: 500 }}>{user?.email}</p>
            </div>
            <div>
              <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: "0.25rem" }}>Role</p>
              <p style={{ fontWeight: 500, textTransform: "capitalize" }}>{user?.role}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
