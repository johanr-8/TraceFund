"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { API_URL } from "@/lib/api";
import "./login.css";

type PortalRole = "beneficiary" | "government" | "vendor" | "auditor";

interface PortalOption {
  id: PortalRole;
  label: string;
  buttonText: string;
  icon: string;
}

const PORTALS: PortalOption[] = [
  { id: "beneficiary", label: "Beneficiary Portal", buttonText: "Login as Beneficiary", icon: "👤" },
  { id: "government", label: "Government Admin Portal", buttonText: "Login as Government", icon: "🏛️" },
  { id: "vendor", label: "Vendor Portal", buttonText: "Login as Vendor", icon: "🏪" },
  { id: "auditor", label: "Auditor Portal", buttonText: "Login as Auditor", icon: "🛡️" },
];

export default function LoginPage() {
  const router = useRouter();
  const [selectedPortal, setSelectedPortal] = useState<PortalRole>("beneficiary");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForgotNotice, setShowForgotNotice] = useState(false);

  const currentPortal = PORTALS.find((p) => p.id === selectedPortal) || PORTALS[0];

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem(
          "user",
          JSON.stringify({ id: data.id, name: data.name, role: data.role })
        );
        const routes: Record<string, string> = {
          government: "/admin",
          vendor: "/vendor",
          auditor: "/auditor",
          beneficiary: "/beneficiary",
        };
        router.push(routes[data.role] || "/beneficiary");
      } else {
        setError(data.detail || "Authentication failed. Please check your credentials.");
      }
    } catch {
      setError("Unable to connect to TraceFund backend service.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-container">
      <div className="login-grid">
        {/* Left Hero Column */}
        <div className="hero-section">
          <h1 className="hero-title">TraceFund</h1>
          <p className="hero-subtitle">
            Blockchain-Based Transparent Fund Disbursement<br />
            and Fraud Detection System
          </p>

          {/* 3D Isometric Network Graphic */}
          <div className="isometric-graphic-container">
            <svg
              className="floating-graphic"
              width="260"
              height="260"
              viewBox="0 0 260 260"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="cubeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#00E5FF" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#0284C7" stopOpacity="0.1" />
                </linearGradient>
                <linearGradient id="coreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#00E5FF" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.5" />
                </linearGradient>
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Connecting Wireframe Nodes */}
              <g stroke="#00E5FF" strokeWidth="1.2" strokeOpacity="0.6">
                <line x1="130" y1="50" x2="70" y2="85" />
                <line x1="130" y1="50" x2="190" y2="85" />
                <line x1="70" y1="85" x2="70" y2="155" />
                <line x1="190" y1="85" x2="190" y2="155" />
                <line x1="70" y1="155" x2="130" y2="190" />
                <line x1="190" y1="155" x2="130" y2="190" />

                {/* Inner Cross Connectors */}
                <line x1="130" y1="50" x2="130" y2="120" />
                <line x1="70" y1="85" x2="130" y2="120" />
                <line x1="190" y1="85" x2="130" y2="120" />
                <line x1="70" y1="155" x2="130" y2="120" />
                <line x1="190" y1="155" x2="130" y2="120" />
                <line x1="130" y1="190" x2="130" y2="120" />
              </g>

              {/* Top Cube */}
              <g transform="translate(130, 45)">
                <path d="M0 -20 L18 -10 L0 0 L-18 -10 Z" fill="url(#cubeGradient)" stroke="#00E5FF" strokeWidth="1.5" />
                <path d="M-18 -10 L0 0 L0 20 L-18 10 Z" fill="rgba(0,229,255,0.08)" stroke="#00E5FF" strokeWidth="1.2" />
                <path d="M0 0 L18 -10 L18 10 L0 20 Z" fill="rgba(2,132,199,0.15)" stroke="#00E5FF" strokeWidth="1.2" />
              </g>

              {/* Top Left Cube */}
              <g transform="translate(70, 80)">
                <path d="M0 -20 L18 -10 L0 0 L-18 -10 Z" fill="url(#cubeGradient)" stroke="#00E5FF" strokeWidth="1.5" />
                <path d="M-18 -10 L0 0 L0 20 L-18 10 Z" fill="rgba(0,229,255,0.08)" stroke="#00E5FF" strokeWidth="1.2" />
                <path d="M0 0 L18 -10 L18 10 L0 20 Z" fill="rgba(2,132,199,0.15)" stroke="#00E5FF" strokeWidth="1.2" />
              </g>

              {/* Top Right Cube */}
              <g transform="translate(190, 80)">
                <path d="M0 -20 L18 -10 L0 0 L-18 -10 Z" fill="url(#cubeGradient)" stroke="#00E5FF" strokeWidth="1.5" />
                <path d="M-18 -10 L0 0 L0 20 L-18 10 Z" fill="rgba(0,229,255,0.08)" stroke="#00E5FF" strokeWidth="1.2" />
                <path d="M0 0 L18 -10 L18 10 L0 20 Z" fill="rgba(2,132,199,0.15)" stroke="#00E5FF" strokeWidth="1.2" />
              </g>

              {/* Center Core Glowing Cube */}
              <g transform="translate(130, 120)" filter="url(#glow)">
                <path d="M0 -24 L22 -12 L0 0 L-22 -12 Z" fill="url(#coreGradient)" stroke="#FFFFFF" strokeWidth="1.8" />
                <path d="M-22 -12 L0 0 L0 24 L-22 12 Z" fill="rgba(0,229,255,0.3)" stroke="#00E5FF" strokeWidth="1.5" />
                <path d="M0 0 L22 -12 L22 12 L0 24 Z" fill="rgba(56,189,248,0.4)" stroke="#00E5FF" strokeWidth="1.5" />
              </g>

              {/* Bottom Left Cube */}
              <g transform="translate(70, 160)">
                <path d="M0 -20 L18 -10 L0 0 L-18 -10 Z" fill="url(#cubeGradient)" stroke="#00E5FF" strokeWidth="1.5" />
                <path d="M-18 -10 L0 0 L0 20 L-18 10 Z" fill="rgba(0,229,255,0.08)" stroke="#00E5FF" strokeWidth="1.2" />
                <path d="M0 0 L18 -10 L18 10 L0 20 Z" fill="rgba(2,132,199,0.15)" stroke="#00E5FF" strokeWidth="1.2" />
              </g>

              {/* Bottom Right Cube */}
              <g transform="translate(190, 160)">
                <path d="M0 -20 L18 -10 L0 0 L-18 -10 Z" fill="url(#cubeGradient)" stroke="#00E5FF" strokeWidth="1.5" />
                <path d="M-18 -10 L0 0 L0 20 L-18 10 Z" fill="rgba(0,229,255,0.08)" stroke="#00E5FF" strokeWidth="1.2" />
                <path d="M0 0 L18 -10 L18 10 L0 20 Z" fill="rgba(2,132,199,0.15)" stroke="#00E5FF" strokeWidth="1.2" />
              </g>

              {/* Bottom Cube */}
              <g transform="translate(130, 195)">
                <path d="M0 -20 L18 -10 L0 0 L-18 -10 Z" fill="url(#cubeGradient)" stroke="#00E5FF" strokeWidth="1.5" />
                <path d="M-18 -10 L0 0 L0 20 L-18 10 Z" fill="rgba(0,229,255,0.08)" stroke="#00E5FF" strokeWidth="1.2" />
                <path d="M0 0 L18 -10 L18 10 L0 20 Z" fill="rgba(2,132,199,0.15)" stroke="#00E5FF" strokeWidth="1.2" />
              </g>

              {/* Glowing Node Highlights */}
              <circle cx="130" cy="25" r="3.5" fill="#00E5FF" filter="url(#glow)" />
              <circle cx="52" cy="70" r="3.5" fill="#00E5FF" filter="url(#glow)" />
              <circle cx="208" cy="70" r="3.5" fill="#00E5FF" filter="url(#glow)" />
              <circle cx="52" cy="170" r="3.5" fill="#00E5FF" filter="url(#glow)" />
              <circle cx="208" cy="170" r="3.5" fill="#00E5FF" filter="url(#glow)" />
              <circle cx="130" cy="215" r="3.5" fill="#00E5FF" filter="url(#glow)" />
            </svg>
          </div>

          <Link href="/register" className="hero-create-account-link">
            Create Account
          </Link>
        </div>

        {/* Right Glass Card Column */}
        <div className="portal-card">
          <div className="portal-card-header">
            <div className="portal-icon-badge">
              {/* Custom Network Nodes Icon */}
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="3" fill="#00E5FF" />
                <circle cx="6" cy="6" r="2" fill="#00E5FF" />
                <circle cx="18" cy="6" r="2" fill="#00E5FF" />
                <circle cx="6" cy="18" r="2" fill="#00E5FF" />
                <circle cx="18" cy="18" r="2" fill="#00E5FF" />
                <line x1="8" y1="8" x2="10" y2="10" stroke="#00E5FF" strokeWidth="1.5" />
                <line x1="16" y1="8" x2="14" y2="10" stroke="#00E5FF" strokeWidth="1.5" />
                <line x1="8" y1="16" x2="10" y2="14" stroke="#00E5FF" strokeWidth="1.5" />
                <line x1="16" y1="16" x2="14" y2="14" stroke="#00E5FF" strokeWidth="1.5" />
              </svg>
            </div>
            <h2 className="portal-title">Access your Portal</h2>
          </div>

          <form onSubmit={handleSubmit} className="form-container">
            {/* SVG Bracket Line connecting Role Selector to Input Fields */}
            <svg className="svg-bracket" viewBox="0 0 28 155" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="bracketGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#00E5FF" stopOpacity="0.8" />
                  <stop offset="50%" stopColor="#0284C7" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#f43f5e" stopOpacity="0.4" />
                </linearGradient>
              </defs>
              <path
                d="M 26 8 H 14 C 8 8 4 12 4 18 V 65 C 4 72 1 76 -3 76 C 1 76 4 80 4 87 V 137 C 4 143 8 147 14 147 H 26"
                stroke="url(#bracketGrad)"
                strokeWidth="1.8"
                fill="none"
                strokeLinecap="round"
              />
            </svg>

            {/* Portal Selector Row */}
            <div className="portal-selector-row">
              <span className="portal-selector-label">Login As:</span>
              <div className="portal-selector-dropdown">
                <button
                  type="button"
                  className="portal-select-btn"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  <span>
                    <span style={{ marginRight: "6px" }}>{currentPortal.icon}</span>
                    {currentPortal.label}
                  </span>
                  <span style={{ fontSize: "0.75rem", opacity: 0.7 }}>▼</span>
                </button>

                {dropdownOpen && (
                  <div className="portal-dropdown-menu">
                    {PORTALS.map((portal) => (
                      <div
                        key={portal.id}
                        className={`portal-dropdown-item ${selectedPortal === portal.id ? "active" : ""}`}
                        onClick={() => {
                          setSelectedPortal(portal.id);
                          setDropdownOpen(false);
                        }}
                      >
                        <span>{portal.icon}</span>
                        <span>{portal.label}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Input 1: Username or Email */}
            <div className="input-group">
              <label className="input-label">Username or Email</label>
              <input
                type="text"
                className="input-field"
                placeholder="Enter your username or email..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Input 2: Password */}
            <div className="input-group">
              <label className="input-label">Password</label>
              <input
                type="password"
                className="input-field"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && <div className="error-banner">{error}</div>}

            {/* Action Submit Button */}
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? "Authenticating..." : currentPortal.buttonText}
            </button>

            {/* Forgot Password Link */}
            <span
              className="forgot-password-link"
              onClick={() => setShowForgotNotice(!showForgotNotice)}
            >
              Forgot Password?
            </span>

            {showForgotNotice && (
              <div
                style={{
                  background: "rgba(0, 229, 255, 0.08)",
                  border: "1px solid rgba(0, 229, 255, 0.25)",
                  borderRadius: "12px",
                  padding: "0.75rem",
                  fontSize: "0.825rem",
                  color: "#cbd5e1",
                  textAlign: "center",
                }}
              >
                🔒 For security, credential resets are managed by system admins. Please contact your administrator or government authority.
              </div>
            )}

            {/* Alternative Portal Logins Panel */}
            <div className="alternative-logins-panel">
              <span className="alt-logins-title">Alternative Portal Logins</span>
              <div className="alt-logins-row">
                <button
                  type="button"
                  className="alt-login-pill"
                  onClick={() => setSelectedPortal(selectedPortal === "vendor" ? "auditor" : "vendor")}
                >
                  Vendor / Auditor
                </button>
                <button
                  type="button"
                  className="alt-login-pill"
                  onClick={() => setSelectedPortal("government")}
                >
                  Government
                </button>
                <button
                  type="button"
                  className="alt-login-pill"
                  onClick={() => setSelectedPortal("beneficiary")}
                >
                  Beneficiary
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
