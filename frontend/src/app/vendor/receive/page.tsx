'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card/Card';
import { MOCK_VENDORS } from '@/lib/mockData';
import { useEffect, useState } from 'react';

export default function ReceivePayment() {
  const vendor = MOCK_VENDORS.find(v => v.name === 'PharmaCorp');
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setPulse(p => !p);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '2rem', fontWeight: 600 }}>Receive Payment</h1>
      
      <Card style={{ position: 'relative', overflow: 'hidden' }}>
        {/* Animated background glow behind QR */}
        <div style={{ 
          position: 'absolute', 
          top: '50%', left: '50%', 
          transform: 'translate(-50%, -50%)', 
          width: '300px', height: '300px', 
          background: 'var(--accent-primary)', 
          filter: 'blur(100px)', 
          opacity: 0.15,
          zIndex: 0,
          pointerEvents: 'none'
        }} />

        <CardHeader style={{ justifyContent: 'center', zIndex: 1, position: 'relative' }}>
          <CardTitle>Scan to Pay</CardTitle>
        </CardHeader>
        <CardContent style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2.5rem', zIndex: 1, position: 'relative' }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
            Show this QR code to beneficiaries to accept TraceFund tokens for <strong style={{ color: 'var(--text-primary)' }}>{vendor?.category}</strong>.
          </p>
          
          <div style={{ 
            width: '280px', 
            height: '280px', 
            background: 'white', 
            borderRadius: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: pulse ? '0 0 40px rgba(var(--accent-primary-rgb), 0.4)' : '0 0 20px rgba(var(--accent-primary-rgb), 0.2)',
            transition: 'box-shadow 1s ease-in-out',
            padding: '1.5rem',
            position: 'relative'
          }}>
            {/* Corner brackets */}
            <div style={{ position: 'absolute', top: '10px', left: '10px', width: '30px', height: '30px', borderTop: '4px solid var(--accent-primary)', borderLeft: '4px solid var(--accent-primary)', borderRadius: '8px 0 0 0' }} />
            <div style={{ position: 'absolute', top: '10px', right: '10px', width: '30px', height: '30px', borderTop: '4px solid var(--accent-primary)', borderRight: '4px solid var(--accent-primary)', borderRadius: '0 8px 0 0' }} />
            <div style={{ position: 'absolute', bottom: '10px', left: '10px', width: '30px', height: '30px', borderBottom: '4px solid var(--accent-primary)', borderLeft: '4px solid var(--accent-primary)', borderRadius: '0 0 0 8px' }} />
            <div style={{ position: 'absolute', bottom: '10px', right: '10px', width: '30px', height: '30px', borderBottom: '4px solid var(--accent-primary)', borderRight: '4px solid var(--accent-primary)', borderRadius: '0 0 8px 0' }} />

            {/* Stylized QR Code SVG */}
            <svg width="220" height="220" viewBox="0 0 200 200" style={{ fill: '#0a0a0a' }}>
              <rect x="10" y="10" width="50" height="50" rx="8" />
              <rect x="20" y="20" width="30" height="30" fill="#fff" rx="4" />
              <rect x="25" y="25" width="20" height="20" rx="4" />
              
              <rect x="140" y="10" width="50" height="50" rx="8" />
              <rect x="150" y="20" width="30" height="30" fill="#fff" rx="4" />
              <rect x="155" y="25" width="20" height="20" rx="4" />
              
              <rect x="10" y="140" width="50" height="50" rx="8" />
              <rect x="20" y="150" width="30" height="30" fill="#fff" rx="4" />
              <rect x="25" y="155" width="20" height="20" rx="4" />
              
              {/* Pattern blocks */}
              <circle cx="90" cy="35" r="10" />
              <circle cx="115" cy="35" r="10" />
              <rect x="70" y="60" width="60" height="20" rx="10" />
              <circle cx="35" cy="90" r="10" />
              <rect x="70" y="90" width="120" height="20" rx="10" />
              <circle cx="35" cy="115" r="10" />
              <circle cx="175" cy="115" r="10" />
              <rect x="70" y="140" width="20" height="50" rx="10" />
              <circle cx="115" cy="165" r="10" />
              <rect x="140" y="140" width="50" height="20" rx="10" />
              <circle cx="175" cy="175" r="8" fill="var(--accent-primary)" />
            </svg>
          </div>

          <div style={{ width: '100%' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
              Wallet Address
            </label>
            <div style={{ 
              marginTop: '0.75rem',
              padding: '1.25rem', 
              background: 'rgba(255,255,255,0.02)', 
              borderRadius: 'var(--radius-md)',
              border: '1px solid rgba(255,255,255,0.1)',
              fontFamily: 'var(--font-mono)',
              fontSize: '1.1rem',
              letterSpacing: '1px',
              color: 'var(--accent-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}>
              {vendor?.address}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ cursor: 'pointer', opacity: 0.7 }}><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
