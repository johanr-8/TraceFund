import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card/Card';
import { Button } from '@/components/ui/Button/Button';

export default function Home() {
  return (
    <div style={{ 
      position: 'relative', 
      minHeight: '100vh', 
      width: '100%',
      overflow: 'hidden',
      backgroundImage: 'url("/bg-map.jpg")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      color: 'white'
    }}>
      
      {/* Dark overlay to ensure text readability */}
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 0 }} />

      {/* Header / Title */}
      <div className="animate-fade-in" style={{ position: 'absolute', top: '5%', left: '5%', zIndex: 10 }}>
        <h1 className="text-gradient" style={{ fontSize: '3.5rem', marginBottom: '0.5rem', letterSpacing: '-0.02em', textAlign: 'left' }}>TraceFund</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '400px', lineHeight: 1.5 }}>
          Blockchain-Based Transparent Fund Disbursement and Fraud Detection System
        </p>
      </div>

      {/* Portal Cards */}
      <div style={{ zIndex: 10, position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        
        {/* Beneficiary Portal */}
        <div className="animate-float" style={{ animationDelay: '0s', position: 'absolute', top: '30%', left: '5%', pointerEvents: 'auto' }}>
          <Card style={{ 
            width: '420px', 
            background: 'rgba(15, 23, 42, 0.8)', 
            backdropFilter: 'blur(16px)',
            border: '2px solid rgba(6, 182, 212, 0.6)',
            boxShadow: '0 0 40px rgba(6, 182, 212, 0.3), inset 0 0 20px rgba(6, 182, 212, 0.1)',
            borderRadius: '24px'
          }}>
            <div style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(6, 182, 212, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#06b6d4' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                </div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Beneficiary Portal</h2>
              </div>
              <div style={{ width: '40px', height: '3px', background: '#06b6d4', marginBottom: '1.5rem', borderRadius: '2px' }} />
              <p style={{ color: 'var(--text-secondary)', marginBottom: '2.5rem', lineHeight: 1.6, fontSize: '0.95rem' }}>
                Access your wallet, view balances by allocated category, and pay approved vendors securely.
              </p>
              <Link href="/beneficiary" style={{ width: '100%', display: 'block' }}>
                <Button fullWidth style={{ background: '#06b6d4', color: 'black', fontWeight: 700, borderRadius: '12px' }}>Login as Beneficiary</Button>
              </Link>
            </div>
          </Card>
        </div>

        {/* Vendor Portal */}
        <div className="animate-float" style={{ animationDelay: '1s', position: 'absolute', top: '15%', left: '42%', pointerEvents: 'auto' }}>
          <Card style={{ 
            width: '340px', 
            background: 'rgba(15, 23, 42, 0.7)', 
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '20px'
          }}>
            <div style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255, 255, 255, 0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                </div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Vendor Portal</h2>
              </div>
              <div style={{ width: '30px', height: '2px', background: 'rgba(255,255,255,0.3)', marginBottom: '1.25rem', borderRadius: '2px' }} />
              <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', lineHeight: 1.5, fontSize: '0.85rem' }}>
                Register your business, accept restricted token payments via QR, and view real-time settlements.
              </p>
              <Link href="/vendor" style={{ width: '100%', display: 'block' }}>
                <Button fullWidth variant="secondary" style={{ borderRadius: '10px' }}>Login as Vendor</Button>
              </Link>
            </div>
          </Card>
        </div>

        {/* Public Transparency */}
        <div className="animate-float" style={{ animationDelay: '2.5s', position: 'absolute', top: '15%', right: '5%', pointerEvents: 'auto' }}>
          <Card style={{ 
            width: '340px', 
            background: 'rgba(15, 23, 42, 0.7)', 
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '20px'
          }}>
            <div style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(52, 211, 153, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-success)' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path><path d="M22 12A10 10 0 0 0 12 2v10z"></path></svg>
                </div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Public Transparency</h2>
              </div>
              <div style={{ width: '30px', height: '2px', background: 'rgba(255,255,255,0.3)', marginBottom: '1.25rem', borderRadius: '2px' }} />
              <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', lineHeight: 1.5, fontSize: '0.85rem' }}>
                View real-time, category-wise aggregate fund utilization statistics across the network.
              </p>
              <Link href="/public" style={{ width: '100%', display: 'block' }}>
                <Button fullWidth variant="secondary" style={{ borderRadius: '10px' }}>View Public Data</Button>
              </Link>
            </div>
          </Card>
        </div>

        {/* Auditor Portal */}
        <div className="animate-float" style={{ animationDelay: '1.5s', position: 'absolute', bottom: '10%', right: '35%', pointerEvents: 'auto' }}>
          <Card style={{ 
            width: '340px', 
            background: 'rgba(15, 23, 42, 0.7)', 
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '20px'
          }}>
            <div style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(248, 113, 113, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-danger)' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                </div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Auditor Portal</h2>
              </div>
              <div style={{ width: '30px', height: '2px', background: 'rgba(248, 113, 113, 0.5)', marginBottom: '1.25rem', borderRadius: '2px' }} />
              <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', lineHeight: 1.5, fontSize: '0.85rem' }}>
                Monitor high-risk transactions with the Fraud Engine and view the full compliance ledger.
              </p>
              <Link href="/auditor" style={{ width: '100%', display: 'block' }}>
                <Button fullWidth variant="secondary" style={{ borderRadius: '10px' }}>Login as Auditor</Button>
              </Link>
            </div>
          </Card>
        </div>

        {/* Government Portal */}
        <div className="animate-float" style={{ animationDelay: '3s', position: 'absolute', bottom: '15%', right: '5%', pointerEvents: 'auto' }}>
          <Card style={{ 
            width: '340px', 
            background: 'rgba(15, 23, 42, 0.7)', 
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '20px'
          }}>
            <div style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(168, 85, 247, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#a855f7' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18"></path><path d="M12 3L3 10V21"></path><path d="M21 10L12 3"></path><path d="M9 21v-6h6v6"></path><path d="M12 10v4"></path></svg>
                </div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Government Portal</h2>
              </div>
              <div style={{ width: '30px', height: '2px', background: '#a855f7', marginBottom: '1.25rem', borderRadius: '2px' }} />
              <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', lineHeight: 1.5, fontSize: '0.85rem' }}>
                Manage funding allocations, define restricted categories, and oversee the entire distribution network.
              </p>
                <Link href="/admin" style={{ width: '100%', display: 'block' }}>
                  <Button fullWidth variant="secondary" style={{ borderRadius: '10px' }}>Login as Issuer</Button>
                </Link>
            </div>
          </Card>
        </div>

      </div>
    </div>
  );
}
