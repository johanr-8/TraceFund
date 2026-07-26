'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card/Card';
import { Input } from '@/components/ui/Input/Input';
import { Button } from '@/components/ui/Button/Button';

export default function VendorSettings() {
  const [status, setStatus] = useState<'idle' | 'processing' | 'success'>('idle');

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('processing');
    setTimeout(() => {
      setStatus('success');
    }, 1000);
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '2rem', fontWeight: 600 }}>Vendor Registration & Settings</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Business Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <Input label="Business Name" defaultValue="PharmaCorp" disabled />
            <Input label="Wallet Address" defaultValue="0x789...ghi" disabled />
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
                Registered Category
              </label>
              <select 
                disabled
                defaultValue="Medicine"
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  background: 'rgba(0, 0, 0, 0.4)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--text-secondary)',
                  fontFamily: 'var(--font-family)',
                  fontSize: '1rem',
                  outline: 'none',
                  cursor: 'not-allowed'
                }}
              >
                <option value="Medicine">Medicine</option>
              </select>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                To change your registered category, you must submit a new request to the issuing authority.
              </span>
            </div>

            <Input label="Contact Email" defaultValue="admin@pharmacorp.example.com" />

            <Button type="submit" disabled={status === 'processing'}>
              {status === 'processing' ? 'Saving...' : 'Update Settings'}
            </Button>
          </form>

          {status === 'success' && (
            <div style={{ marginTop: '1rem', color: 'var(--accent-success)', fontSize: '0.875rem' }}>
              Settings updated successfully.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
