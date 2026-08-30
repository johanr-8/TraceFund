"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { API_URL } from "@/lib/api";
import "./wallet.css";

interface CategoryBalance {
  fund_type: string;
  balance: number;
}

interface WalletData {
  user_id: number;
  user_name: string;
  balances: CategoryBalance[];
}

// Icons mapping per category name
const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  Food: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
      <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
      <line x1="6" y1="1" x2="6" y2="4" />
      <line x1="10" y1="1" x2="10" y2="4" />
      <line x1="14" y1="1" x2="14" y2="4" />
    </svg>
  ),
  Meals: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
      <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
    </svg>
  ),
  Medicine: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M10.5 20.5l10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7z" />
      <line x1="8.5" y1="8.5" x2="15.5" y2="15.5" />
    </svg>
  ),
  Education: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  ),
  Fuel: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="3" y1="22" x2="15" y2="22" />
      <rect x="4" y="9" width="10" height="13" rx="2" />
      <path d="M14 9l3-4 3 2v8a2 2 0 0 1-2 2h-1" />
    </svg>
  ),
  Groceries: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
  ),
  "Office Supplies": (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  ),
};

const DEFAULT_ICON = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
  </svg>
);

export default function BeneficiaryWallet() {
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const raw = localStorage.getItem("user");
    if (!raw) {
      setLoading(false);
      setError("No logged in user session found. Please log in.");
      return;
    }
    const user = JSON.parse(raw);

    fetch(`${API_URL}/wallet/${user.id}`)
      .then((r) => {
        if (!r.ok) throw new Error("Failed to load wallet data from server");
        return r.json();
      })
      .then((data) => {
        setWallet(data);
      })
      .catch((e) => {
        setError(e.message || "Failed to load wallet.");
      })
      .finally(() => setLoading(false));
  }, []);

  const totalBalance = wallet?.balances?.reduce((sum, b) => sum + b.balance, 0) ?? 0;
  const balancesList = wallet?.balances ?? [];

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "4rem", color: "#94a3b8" }}>
        Loading wallet balances...
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          background: "rgba(248, 113, 113, 0.1)",
          border: "1px solid rgba(248, 113, 113, 0.3)",
          color: "#f87171",
          padding: "2rem",
          borderRadius: "18px",
          textAlign: "center",
          margin: "2rem 0",
        }}
      >
        {error}
      </div>
    );
  }

  return (
    <div className="wallet-page-container">
      {/* Page Title */}
      <h1 className="wallet-page-title">TraceFund Digital Wallet</h1>

      {/* Main Wallet Banner Card */}
      <div className="wallet-main-banner">
        <div className="wallet-banner-mesh" />

        <span className="wallet-banner-label">Total Available Balance</span>

        <div className="wallet-banner-amount-row">
          <span className="wallet-main-balance">
            ₹{totalBalance.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
          <div className="wallet-trend-indicator">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="7" y1="17" x2="17" y2="7" />
              <polyline points="7 7 17 7 17 17" />
            </svg>
          </div>
        </div>

        <span className="wallet-user-name">{wallet?.user_name || "Beneficiary"}</span>
      </div>

      {/* Category Balances Section */}
      <div>
        <h2 className="category-balances-title">Category Balances</h2>

        {balancesList.length === 0 ? (
          <div
            style={{
              background: "rgba(10, 16, 28, 0.75)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: "20px",
              padding: "2.5rem",
              textAlign: "center",
              color: "#94a3b8",
              fontSize: "0.95rem",
            }}
          >
            No fund categories allocated to your wallet yet. Please contact your government administrator to issue funds.
          </div>
        ) : (
          <div className="category-balances-grid">
            {balancesList.map((cat, i) => (
              <div key={cat.fund_type + i} className="category-balance-card">
                <div className="category-card-header">
                  <div className="category-icon-badge">
                    {CATEGORY_ICONS[cat.fund_type] || DEFAULT_ICON}
                  </div>
                  <span className="category-title">{cat.fund_type}</span>
                </div>

                <div className="category-amount-val">
                  ₹{cat.balance.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>

                <Link
                  href={`/beneficiary/pay?category=${encodeURIComponent(cat.fund_type)}`}
                  className="pay-vendor-btn"
                >
                  Pay Vendor
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
