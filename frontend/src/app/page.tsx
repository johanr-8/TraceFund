import Link from 'next/link';
import { Card } from '@/components/ui/Card/Card';
import { Button } from '@/components/ui/Button/Button';

export default function Home() {
  const smallCards = [
    {
      href: "/vendor",
      title: "Vendor Portal",
      desc: "Register your business, accept restricted token payments via QR, and view real-time settlements.",
      btn: "Login as Vendor",
      accent: "rgba(255,255,255,0.5)",
      icon: <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>,
      icon2: <polyline points="9 22 9 12 15 12 15 22"></polyline>,
    },
    {
      href: "/public",
      title: "Public Transparency",
      desc: "View real-time, category-wise aggregate fund utilization statistics across the network.",
      btn: "View Public Data",
      accent: "#34d399",
      icon: <path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path>,
      icon2: <path d="M22 12A10 10 0 0 0 12 2v10z"></path>,
    },
    {
      href: "/auditor",
      title: "Auditor Portal",
      desc: "Monitor high-risk transactions with the Fraud Engine and view the full compliance ledger.",
      btn: "Login as Auditor",
      accent: "#f87171",
      icon: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>,
      icon2: null,
    },
    {
      href: "/admin",
      title: "Government Portal",
      desc: "Manage funding allocations, define restricted categories, and oversee the entire distribution network.",
      btn: "Login as Issuer",
      accent: "#a855f7",
      icon: <path d="M3 21h18"></path>,
      icon2: <path d="M12 3L3 10V21"></path>,
    },
  ];

  return (
    <div style={{
      minHeight: "100vh",
      width: "100%",
      backgroundImage: 'url("/bg-map.jpg")',
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      color: "white",
      display: "flex",
      flexDirection: "column",
    }}>
      <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 0 }} />

      <div className="animate-fade-in" style={{ position: "relative", zIndex: 10, padding: "2rem 3rem 0" }}>
        <h1 className="text-gradient" style={{ fontSize: "2.5rem", marginBottom: "0.25rem", letterSpacing: "-0.02em" }}>TraceFund</h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", maxWidth: "500px" }}>
          Blockchain-Based Transparent Fund Disbursement and Fraud Detection System
        </p>
      </div>

      <div style={{
        position: "relative", zIndex: 10,
        display: "flex", gap: "1.5rem",
        padding: "2rem 3rem", flex: 1, alignItems: "stretch",
      }}>
        <div className="animate-fade-in" style={{ flex: "1 1 420px", maxWidth: "440px", display: "flex" }}>
          <Card style={{
            background: "rgba(15, 23, 42, 0.7)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(6, 182, 212, 0.4)",
            borderRadius: "24px",
            width: "100%",
          }}>
            <div style={{ padding: "2.5rem", display: "flex", flexDirection: "column", height: "100%" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
                <div style={{ width: "44px", height: "44px", borderRadius: "50%", background: "rgba(6, 182, 212, 0.12)", display: "flex", alignItems: "center", justifyContent: "center", color: "#06b6d4" }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                </div>
                <h2 style={{ fontSize: "1.35rem", fontWeight: 600 }}>Beneficiary Portal</h2>
              </div>
              <div style={{ width: "35px", height: "2px", background: "#06b6d4", marginBottom: "1rem", borderRadius: "2px", opacity: 0.5 }} />
              <p style={{ color: "var(--text-secondary)", marginBottom: "2rem", lineHeight: 1.6, fontSize: "0.9rem", flex: 1 }}>
                Access your wallet, view balances by allocated category, and pay approved vendors securely.
              </p>
              <Link href="/beneficiary" style={{ width: "100%", display: "block" }}>
                <Button fullWidth style={{ borderRadius: "10px" }}>Login as Beneficiary</Button>
              </Link>
            </div>
          </Card>
        </div>

        <div style={{ flex: "1 1 380px", display: "flex", flexDirection: "column", gap: "1rem", minWidth: 0 }}>
          {smallCards.map((c, i) => (
            <div key={i} className="animate-fade-in" style={{ animationDelay: `${i * 0.1}s`, flex: 1, display: "flex" }}>
              <Card style={{
                background: "rgba(15, 23, 42, 0.7)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "16px",
                width: "100%",
              }}>
                <div style={{ padding: "1rem 1.25rem", display: "flex", alignItems: "center", gap: "1rem", height: "100%" }}>
                  <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "center", color: c.accent, flexShrink: 0 }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{c.icon}{c.icon2}</svg>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h2 style={{ fontSize: "0.95rem", fontWeight: 600, marginBottom: "0.15rem" }}>{c.title}</h2>
                    <p style={{ color: "var(--text-secondary)", fontSize: "0.75rem", lineHeight: 1.4, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{c.desc}</p>
                  </div>
                  <Link href={c.href} style={{ flexShrink: 0 }}>
                    <Button variant="secondary" style={{ borderRadius: "8px", padding: "0.5rem 1rem", fontSize: "0.8rem", whiteSpace: "nowrap" }}>{c.btn}</Button>
                  </Link>
                </div>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
