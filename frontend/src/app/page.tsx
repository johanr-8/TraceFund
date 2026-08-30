"use client";

import Link from "next/link";
import "./landing.css";

export default function Home() {
  return (
    <div className="landing-container">
      {/* Background Mesh Overlay */}
      <div className="world-map-overlay" />

      <div className="landing-grid">
        {/* Left Column: Transparency In Motion & 3D Isometric Matrix */}
        <div className="hero-section-left">
          {/* Backdrop Watermark */}
          <div className="backdrop-watermark">Transparency In Motion</div>

          <div className="hero-title-group">
            <h1 className="brand-header-title">TraceFund</h1>
            <p className="hero-system-subtitle">
              Blockchain-Based Transparent Fund Disbursement<br />
              and Fraud Detection System
            </p>
          </div>

          {/* 3D Isometric Cube Vector Matrix with Energy Lines */}
          <div className="isometric-matrix-container">
            <svg
              className="floating-matrix"
              width="320"
              height="300"
              viewBox="0 0 320 300"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="landingCubeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#00E5FF" stopOpacity="0.45" />
                  <stop offset="100%" stopColor="#0284C7" stopOpacity="0.12" />
                </linearGradient>
                <linearGradient id="landingCoreGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#00E5FF" stopOpacity="0.95" />
                  <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.6" />
                </linearGradient>
                <linearGradient id="streamGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#00E5FF" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#0284C7" stopOpacity="0.2" />
                </linearGradient>
                <filter id="glowLanding" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Cyan Energy Streams radiating outward to the right */}
              <g opacity="0.75">
                <path d="M 160 140 Q 220 100 310 80" stroke="url(#streamGrad)" strokeWidth="1.5" fill="none" strokeDasharray="4 3" />
                <path d="M 160 140 Q 240 140 310 130" stroke="url(#streamGrad)" strokeWidth="1.8" fill="none" />
                <path d="M 160 140 Q 230 180 310 200" stroke="url(#streamGrad)" strokeWidth="1.5" fill="none" strokeDasharray="3 3" />
                <path d="M 160 140 Q 250 220 310 250" stroke="url(#streamGrad)" strokeWidth="1.2" fill="none" />
              </g>

              {/* Cube Interconnecting Lines */}
              <g stroke="#00E5FF" strokeWidth="1.2" strokeOpacity="0.65">
                <line x1="160" y1="60" x2="100" y2="95" />
                <line x1="160" y1="60" x2="220" y2="95" />
                <line x1="100" y1="95" x2="100" y2="175" />
                <line x1="220" y1="95" x2="220" y2="175" />
                <line x1="100" y1="175" x2="160" y2="210" />
                <line x1="220" y1="175" x2="160" y2="210" />

                {/* Inner Cross Connections */}
                <line x1="160" y1="60" x2="160" y2="140" />
                <line x1="100" y1="95" x2="160" y2="140" />
                <line x1="220" y1="95" x2="160" y2="140" />
                <line x1="100" y1="175" x2="160" y2="140" />
                <line x1="220" y1="175" x2="160" y2="140" />
                <line x1="160" y1="210" x2="160" y2="140" />
              </g>

              {/* Top Cube */}
              <g transform="translate(160, 55)">
                <path d="M0 -22 L20 -11 L0 0 L-20 -11 Z" fill="url(#landingCubeGrad)" stroke="#00E5FF" strokeWidth="1.5" />
                <path d="M-20 -11 L0 0 L0 22 L-20 11 Z" fill="rgba(0,229,255,0.08)" stroke="#00E5FF" strokeWidth="1.2" />
                <path d="M0 0 L20 -11 L20 11 L0 22 Z" fill="rgba(2,132,199,0.15)" stroke="#00E5FF" strokeWidth="1.2" />
              </g>

              {/* Top Left Cube */}
              <g transform="translate(100, 90)">
                <path d="M0 -20 L18 -10 L0 0 L-18 -10 Z" fill="url(#landingCubeGrad)" stroke="#00E5FF" strokeWidth="1.5" />
                <path d="M-18 -10 L0 0 L0 20 L-18 10 Z" fill="rgba(0,229,255,0.08)" stroke="#00E5FF" strokeWidth="1.2" />
                <path d="M0 0 L18 -10 L18 10 L0 20 Z" fill="rgba(2,132,199,0.15)" stroke="#00E5FF" strokeWidth="1.2" />
              </g>

              {/* Top Right Cube */}
              <g transform="translate(220, 90)">
                <path d="M0 -20 L18 -10 L0 0 L-18 -10 Z" fill="url(#landingCubeGrad)" stroke="#00E5FF" strokeWidth="1.5" />
                <path d="M-18 -10 L0 0 L0 20 L-18 10 Z" fill="rgba(0,229,255,0.08)" stroke="#00E5FF" strokeWidth="1.2" />
                <path d="M0 0 L18 -10 L18 10 L0 20 Z" fill="rgba(2,132,199,0.15)" stroke="#00E5FF" strokeWidth="1.2" />
              </g>

              {/* Central Glowing Core Cube */}
              <g transform="translate(160, 140)" filter="url(#glowLanding)">
                <path d="M0 -26 L24 -13 L0 0 L-24 -13 Z" fill="url(#landingCoreGrad)" stroke="#FFFFFF" strokeWidth="1.8" />
                <path d="M-24 -13 L0 0 L0 26 L-24 13 Z" fill="rgba(0,229,255,0.35)" stroke="#00E5FF" strokeWidth="1.5" />
                <path d="M0 0 L24 -13 L24 13 L0 26 Z" fill="rgba(56,189,248,0.45)" stroke="#00E5FF" strokeWidth="1.5" />
              </g>

              {/* Bottom Left Cube */}
              <g transform="translate(100, 180)">
                <path d="M0 -20 L18 -10 L0 0 L-18 -10 Z" fill="url(#landingCubeGrad)" stroke="#00E5FF" strokeWidth="1.5" />
                <path d="M-18 -10 L0 0 L0 20 L-18 10 Z" fill="rgba(0,229,255,0.08)" stroke="#00E5FF" strokeWidth="1.2" />
                <path d="M0 0 L18 -10 L18 10 L0 20 Z" fill="rgba(2,132,199,0.15)" stroke="#00E5FF" strokeWidth="1.2" />
              </g>

              {/* Bottom Right Cube */}
              <g transform="translate(220, 180)">
                <path d="M0 -20 L18 -10 L0 0 L-18 -10 Z" fill="url(#landingCubeGrad)" stroke="#00E5FF" strokeWidth="1.5" />
                <path d="M-18 -10 L0 0 L0 20 L-18 10 Z" fill="rgba(0,229,255,0.08)" stroke="#00E5FF" strokeWidth="1.2" />
                <path d="M0 0 L18 -10 L18 10 L0 20 Z" fill="rgba(2,132,199,0.15)" stroke="#00E5FF" strokeWidth="1.2" />
              </g>

              {/* Bottom Cube */}
              <g transform="translate(160, 215)">
                <path d="M0 -20 L18 -10 L0 0 L-18 -10 Z" fill="url(#landingCubeGrad)" stroke="#00E5FF" strokeWidth="1.5" />
                <path d="M-18 -10 L0 0 L0 20 L-18 10 Z" fill="rgba(0,229,255,0.08)" stroke="#00E5FF" strokeWidth="1.2" />
                <path d="M0 0 L18 -10 L18 10 L0 20 Z" fill="rgba(2,132,199,0.15)" stroke="#00E5FF" strokeWidth="1.2" />
              </g>

              {/* Glowing Node Highlights */}
              <circle cx="160" cy="33" r="4" fill="#00E5FF" filter="url(#glowLanding)" />
              <circle cx="82" cy="80" r="4" fill="#00E5FF" filter="url(#glowLanding)" />
              <circle cx="238" cy="80" r="4" fill="#00E5FF" filter="url(#glowLanding)" />
              <circle cx="82" cy="190" r="4" fill="#00E5FF" filter="url(#glowLanding)" />
              <circle cx="238" cy="190" r="4" fill="#00E5FF" filter="url(#glowLanding)" />
              <circle cx="160" cy="235" r="4" fill="#00E5FF" filter="url(#glowLanding)" />
            </svg>
          </div>

          <div className="hero-baseline-text">
            <span>The Secure Foundation</span>
            <span className="hero-baseline-sub">of Modern Funding</span>
          </div>
        </div>

        {/* Right Column: System Orchestration Hub */}
        <div className="orchestration-panel">
          <h2 className="orchestration-header">System Orchestration</h2>

          {/* Interactive Hub Grid */}
          <div className="hub-interactive-grid">
            {/* Central Core Badge Hub */}
            <div className="central-core-hub">
              <svg width="34" height="34" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="16" cy="16" r="4" fill="#00E5FF" />
                <text x="16" y="20" fontSize="11" fontWeight="bold" textAnchor="middle" fill="#030712">T</text>
                <circle cx="8" cy="8" r="2.5" fill="#00E5FF" />
                <circle cx="24" cy="8" r="2.5" fill="#00E5FF" />
                <circle cx="8" cy="24" r="2.5" fill="#00E5FF" />
                <circle cx="24" cy="24" r="2.5" fill="#00E5FF" />
                <line x1="10" y1="10" x2="13.5" y2="13.5" stroke="#00E5FF" strokeWidth="1.8" />
                <line x1="22" y1="10" x2="18.5" y2="13.5" stroke="#00E5FF" strokeWidth="1.8" />
                <line x1="10" y1="22" x2="13.5" y2="18.5" stroke="#00E5FF" strokeWidth="1.8" />
                <line x1="22" y1="22" x2="18.5" y2="18.5" stroke="#00E5FF" strokeWidth="1.8" />
              </svg>
            </div>

            {/* Portal Card 1: Beneficiary */}
            <Link href="/beneficiary" className="portal-hub-card">
              <div className="portal-card-top">
                <div className="portal-icon-container">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
                <span className="portal-card-title">Beneficiary</span>
              </div>
              <div className="portal-card-badge-row">
                <span className="portal-badge-label">Active Wallet</span>
                <span className="portal-badge-value">Portal-line</span>
              </div>
            </Link>

            {/* Portal Card 2: Vendor */}
            <Link href="/vendor" className="portal-hub-card">
              <div className="portal-card-top">
                <div className="portal-icon-container">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                  </svg>
                </div>
                <span className="portal-card-title">Vendor</span>
              </div>
              <div className="portal-card-badge-row">
                <span className="portal-badge-label">Settlements</span>
                <span className="portal-badge-value">Light-line</span>
              </div>
            </Link>

            {/* Portal Card 3: Auditor */}
            <Link href="/auditor" className="portal-hub-card">
              <div className="portal-card-top">
                <div className="portal-icon-container">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                </div>
                <span className="portal-card-title">Auditor</span>
              </div>
              <div className="portal-card-badge-row">
                <span className="portal-badge-label">Fraud Checks</span>
                <span className="portal-badge-value">Light-line</span>
              </div>
            </Link>

            {/* Portal Card 4: Public Transparency */}
            <Link href="/public" className="portal-hub-card">
              <div className="portal-card-top">
                <div className="portal-icon-container">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="2" y1="12" x2="22" y2="12" />
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                  </svg>
                </div>
                <span className="portal-card-title">Public Transparency</span>
              </div>
              <div className="portal-card-badge-row">
                <span className="portal-badge-label">Utilization</span>
                <span className="portal-badge-value">Light-line</span>
              </div>
            </Link>
          </div>

          {/* Integrated Analytics Subgrid Widgets */}
          <div className="widgets-subgrid">
            {/* Widget 1: Donut Summary */}
            <div className="mini-widget-card">
              <div className="widget-header-row">
                <span>Summary Allocation</span>
                <span style={{ color: "#00E5FF" }}>75%</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <svg width="40" height="40" viewBox="0 0 36 36">
                  <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="3.8" />
                  <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#00E5FF" strokeWidth="3.8" strokeDasharray="75, 100" />
                </svg>
                <div>
                  <span className="widget-value">$25,234</span>
                  <div style={{ color: "#64748b", fontSize: "0.7rem" }}>Total Allocated</div>
                </div>
              </div>
            </div>

            {/* Widget 2: Bar Activity Graph */}
            <div className="mini-widget-card">
              <div className="widget-header-row">
                <span>Data Chart</span>
                <span style={{ color: "#34d399" }}>Live</span>
              </div>
              <div style={{ display: "flex", alignItems: "flex-end", gap: "6px", height: "32px" }}>
                <div style={{ flex: 1, height: "45%", background: "rgba(0,229,255,0.4)", borderRadius: "3px" }} />
                <div style={{ flex: 1, height: "70%", background: "rgba(0,229,255,0.6)", borderRadius: "3px" }} />
                <div style={{ flex: 1, height: "100%", background: "#00E5FF", borderRadius: "3px" }} />
                <div style={{ flex: 1, height: "60%", background: "rgba(0,229,255,0.5)", borderRadius: "3px" }} />
                <div style={{ flex: 1, height: "85%", background: "#38BDF8", borderRadius: "3px" }} />
              </div>
            </div>
          </div>

          {/* Bottom Action Buttons */}
          <div className="orchestration-actions-row">
            <Link href="/login" className="action-btn-primary">
              Enter Platform
            </Link>
            <Link href="/public" className="action-btn-secondary">
              View Public Records
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
