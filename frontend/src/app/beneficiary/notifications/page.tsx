"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/Card/Card";
import { API_URL } from "@/lib/api";

interface Notification {
  id: number;
  type: "payment" | "received";
  vendor_name: string;
  fund_type: string;
  amount: number;
  status: string;
  date: string;
  message: string;
}

export default function BeneficiaryNotificationsPage() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const raw = localStorage.getItem("user");
    if (!raw) { router.push("/login"); return; }
    const user = JSON.parse(raw);

    fetch(`${API_URL}/transactions?user_id=${user.id}`)
      .then((r) => r.json())
      .then((txs) => {
        const mapped: Notification[] = txs.map((tx: { id: number; amount: number; fund_type: string; vendor_name: string; status: string; date: string }) => ({
          id: tx.id,
          type: "payment" as const,
          vendor_name: tx.vendor_name,
          fund_type: tx.fund_type,
          amount: tx.amount,
          status: tx.status,
          date: tx.date,
          message: `Paid ₹${tx.amount.toFixed(2)} to ${tx.vendor_name} for ${tx.fund_type}`,
        }));
        setNotifications(mapped);
      })
      .finally(() => setLoading(false));
  }, [router]);

  function formatDate(iso: string) {
    if (!iso) return "—";
    const d = new Date(iso);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHrs = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHrs / 24);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHrs < 24) return `${diffHrs}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return d.toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  }

  if (loading) return <div style={{ textAlign: "center", padding: "4rem", color: "var(--text-secondary)" }}>Loading...</div>;

  return (
    <div style={{ maxWidth: "700px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "2rem", marginBottom: "2rem", fontWeight: 600 }}>Notifications</h1>

      {notifications.length === 0 ? (
        <Card>
          <CardContent>
            <div style={{ textAlign: "center", padding: "3rem" }}>
              <div style={{ marginBottom: "1rem" }}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: "var(--text-secondary)" }}>
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
              </div>
              <p style={{ color: "var(--text-secondary)", fontSize: "1rem" }}>No notifications yet</p>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", marginTop: "0.5rem" }}>
                Transaction activity will appear here
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {notifications.map((n) => (
            <Card key={n.id} style={{
              borderLeft: n.status === "Approved"
                ? "3px solid var(--accent-success)"
                : "3px solid rgba(255,255,255,0.1)",
            }}>
              <CardContent style={{ padding: "1.25rem 1.5rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem" }}>
                  <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
                    <div style={{
                      width: "40px", height: "40px", borderRadius: "50%", flexShrink: 0,
                      background: n.status === "Approved" ? "rgba(52, 211, 153, 0.15)" : "rgba(248, 113, 113, 0.15)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{
                        color: n.status === "Approved" ? "var(--accent-success)" : "var(--accent-danger)",
                      }}>
                        {n.status === "Approved" ? (
                          <polyline points="20 6 9 17 4 12" />
                        ) : (
                          <>
                            <circle cx="12" cy="12" r="10" />
                            <line x1="15" y1="9" x2="9" y2="15" />
                            <line x1="9" y1="9" x2="15" y2="15" />
                          </>
                        )}
                      </svg>
                    </div>
                    <div>
                      <p style={{ fontWeight: 500, marginBottom: "0.25rem" }}>{n.message}</p>
                      <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                        <span style={{
                          fontSize: "0.75rem", fontWeight: 600, padding: "0.15rem 0.5rem",
                          borderRadius: "999px", textTransform: "capitalize",
                          background: n.status === "Approved" ? "rgba(52, 211, 153, 0.15)" : "rgba(248, 113, 113, 0.15)",
                          color: n.status === "Approved" ? "var(--accent-success)" : "var(--accent-danger)",
                        }}>
                          {n.status}
                        </span>
                        <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                          Tx #{n.id}
                        </span>
                      </div>
                    </div>
                  </div>
                  <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)", whiteSpace: "nowrap" }}>
                    {formatDate(n.date)}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
