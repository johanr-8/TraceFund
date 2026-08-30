"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { API_URL } from "@/lib/api";
import "./register.css";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("beneficiary");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("Passwords do not match. Please verify your password.");
      return;
    }

    if (password.length < 4) {
      setError("Password must be at least 4 characters long.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), password, role }),
      });

      const data = await res.json();
      if (res.ok) {
        setSuccess(`Registration successful! Account created for ${data.name} (${data.role}). Redirecting to login...`);
        setTimeout(() => {
          router.push("/login");
        }, 1500);
      } else {
        setError(data.detail || "Registration failed. Please try again.");
      }
    } catch {
      setError("Unable to connect to TraceFund backend service.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="register-container">
      <div className="register-grid">
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
                <linearGradient id="cubeGradientReg" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#00E5FF" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#0284C7" stopOpacity="0.1" />
                </linearGradient>
                <linearGradient id="coreGradientReg" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#00E5FF" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.5" />
                </linearGradient>
                <filter id="glowReg" x="-20%" y="-20%" width="140%" height="140%">
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
                <path d="M0 -20 L18 -10 L0 0 L-18 -10 Z" fill="url(#cubeGradientReg)" stroke="#00E5FF" strokeWidth="1.5" />
                <path d="M-18 -10 L0 0 L0 20 L-18 10 Z" fill="rgba(0,229,255,0.08)" stroke="#00E5FF" strokeWidth="1.2" />
                <path d="M0 0 L18 -10 L18 10 L0 20 Z" fill="rgba(2,132,199,0.15)" stroke="#00E5FF" strokeWidth="1.2" />
              </g>

              {/* Top Left Cube */}
              <g transform="translate(70, 80)">
                <path d="M0 -20 L18 -10 L0 0 L-18 -10 Z" fill="url(#cubeGradientReg)" stroke="#00E5FF" strokeWidth="1.5" />
                <path d="M-18 -10 L0 0 L0 20 L-18 10 Z" fill="rgba(0,229,255,0.08)" stroke="#00E5FF" strokeWidth="1.2" />
                <path d="M0 0 L18 -10 L18 10 L0 20 Z" fill="rgba(2,132,199,0.15)" stroke="#00E5FF" strokeWidth="1.2" />
              </g>

              {/* Top Right Cube */}
              <g transform="translate(190, 80)">
                <path d="M0 -20 L18 -10 L0 0 L-18 -10 Z" fill="url(#cubeGradientReg)" stroke="#00E5FF" strokeWidth="1.5" />
                <path d="M-18 -10 L0 0 L0 20 L-18 10 Z" fill="rgba(0,229,255,0.08)" stroke="#00E5FF" strokeWidth="1.2" />
                <path d="M0 0 L18 -10 L18 10 L0 20 Z" fill="rgba(2,132,199,0.15)" stroke="#00E5FF" strokeWidth="1.2" />
              </g>

              {/* Center Core Glowing Cube */}
              <g transform="translate(130, 120)" filter="url(#glowReg)">
                <path d="M0 -24 L22 -12 L0 0 L-22 -12 Z" fill="url(#coreGradientReg)" stroke="#FFFFFF" strokeWidth="1.8" />
                <path d="M-22 -12 L0 0 L0 24 L-22 12 Z" fill="rgba(0,229,255,0.3)" stroke="#00E5FF" strokeWidth="1.5" />
                <path d="M0 0 L22 -12 L22 12 L0 24 Z" fill="rgba(56,189,248,0.4)" stroke="#00E5FF" strokeWidth="1.5" />
              </g>

              {/* Bottom Left Cube */}
              <g transform="translate(70, 160)">
                <path d="M0 -20 L18 -10 L0 0 L-18 -10 Z" fill="url(#cubeGradientReg)" stroke="#00E5FF" strokeWidth="1.5" />
                <path d="M-18 -10 L0 0 L0 20 L-18 10 Z" fill="rgba(0,229,255,0.08)" stroke="#00E5FF" strokeWidth="1.2" />
                <path d="M0 0 L18 -10 L18 10 L0 20 Z" fill="rgba(2,132,199,0.15)" stroke="#00E5FF" strokeWidth="1.2" />
              </g>

              {/* Bottom Right Cube */}
              <g transform="translate(190, 160)">
                <path d="M0 -20 L18 -10 L0 0 L-18 -10 Z" fill="url(#cubeGradientReg)" stroke="#00E5FF" strokeWidth="1.5" />
                <path d="M-18 -10 L0 0 L0 20 L-18 10 Z" fill="rgba(0,229,255,0.08)" stroke="#00E5FF" strokeWidth="1.2" />
                <path d="M0 0 L18 -10 L18 10 L0 20 Z" fill="rgba(2,132,199,0.15)" stroke="#00E5FF" strokeWidth="1.2" />
              </g>

              {/* Bottom Cube */}
              <g transform="translate(130, 195)">
                <path d="M0 -20 L18 -10 L0 0 L-18 -10 Z" fill="url(#cubeGradientReg)" stroke="#00E5FF" strokeWidth="1.5" />
                <path d="M-18 -10 L0 0 L0 20 L-18 10 Z" fill="rgba(0,229,255,0.08)" stroke="#00E5FF" strokeWidth="1.2" />
                <path d="M0 0 L18 -10 L18 10 L0 20 Z" fill="rgba(2,132,199,0.15)" stroke="#00E5FF" strokeWidth="1.2" />
              </g>

              {/* Glowing Node Highlights */}
              <circle cx="130" cy="25" r="3.5" fill="#00E5FF" filter="url(#glowReg)" />
              <circle cx="52" cy="70" r="3.5" fill="#00E5FF" filter="url(#glowReg)" />
              <circle cx="208" cy="70" r="3.5" fill="#00E5FF" filter="url(#glowReg)" />
              <circle cx="52" cy="170" r="3.5" fill="#00E5FF" filter="url(#glowReg)" />
              <circle cx="208" cy="170" r="3.5" fill="#00E5FF" filter="url(#glowReg)" />
              <circle cx="130" cy="215" r="3.5" fill="#00E5FF" filter="url(#glowReg)" />
            </svg>
          </div>

          <h2 className="hero-footer-title">Create Your TraceFund Account</h2>
          <p className="hero-footer-subtitle">Join the transparent ecosystem</p>
        </div>

        {/* Right Glass Card Column */}
        <div className="register-card">
          <div className="register-card-header">
            <div className="register-icon-badge">
              {/* Custom 'T' Blockchain Node Network Logo */}
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="16" cy="16" r="4" fill="#00E5FF" />
                <text x="16" y="20" fontSize="11" fontWeight="bold" textAnchor="middle" fill="#030712">T</text>
                <circle cx="8" cy="8" r="2.5" fill="#00E5FF" />
                <circle cx="24" cy="8" r="2.5" fill="#00E5FF" />
                <circle cx="8" cy="24" r="2.5" fill="#00E5FF" />
                <circle cx="24" cy="24" r="2.5" fill="#00E5FF" />
                <circle cx="16" cy="5" r="2" fill="#38BDF8" />
                <line x1="10" y1="10" x2="13.5" y2="13.5" stroke="#00E5FF" strokeWidth="1.8" />
                <line x1="22" y1="10" x2="18.5" y2="13.5" stroke="#00E5FF" strokeWidth="1.8" />
                <line x1="10" y1="22" x2="13.5" y2="18.5" stroke="#00E5FF" strokeWidth="1.8" />
                <line x1="22" y1="22" x2="18.5" y2="18.5" stroke="#00E5FF" strokeWidth="1.8" />
                <line x1="16" y1="7" x2="16" y2="12" stroke="#38BDF8" strokeWidth="1.5" />
              </svg>
            </div>
            <h2 className="register-title">Complete Your Registration</h2>
          </div>

          <form onSubmit={handleSubmit} className="form-container">
            {/* Field 1: Full Name */}
            <div className="input-group">
              <label className="input-label">Full Name</label>
              <input
                type="text"
                className="input-field"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            {/* Field 2: Email Address */}
            <div className="input-group">
              <label className="input-label">Email Address</label>
              <input
                type="email"
                className="input-field"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Field 3: Account Role */}
            <div className="input-group">
              <label className="input-label">Account Role</label>
              <select
                className="select-field"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="beneficiary" className="select-option">Beneficiary Portal (Fund Recipient)</option>
                <option value="vendor" className="select-option">Vendor Portal (Authorized Merchant)</option>
              </select>
            </div>

            {/* Field 4: Create Password */}
            <div className="input-group">
              <label className="input-label">Create Password</label>
              <input
                type="password"
                className="input-field"
                placeholder="Password (min 4 characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {/* Field 5: Confirm Password */}
            <div className="input-group">
              <label className="input-label">Confirm Password</label>
              <input
                type="password"
                className="input-field"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            {error && <div className="error-banner">{error}</div>}
            {success && <div className="success-banner">{success}</div>}

            {/* Action Submit Button */}
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? "Processing Registration..." : "Register for TraceFund"}
            </button>

            {/* Footer Links */}
            <div className="card-footer-links">
              <Link href="/login" className="back-to-login-link">
                ← Back to Login
              </Link>
              <span className="already-account-text">Already have an account?</span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
