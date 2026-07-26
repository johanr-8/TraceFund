'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card/Card';
import { Button } from '@/components/ui/Button/Button';
import { Input } from '@/components/ui/Input/Input';
import { useRouter } from 'next/navigation';

export default function VendorRegistration() {
  const router = useRouter();
  const [businessName, setBusinessName] = useState('');
  const [address, setAddress] = useState('');
  const [category, setCategory] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate network delay
    setTimeout(() => {
      alert(`Vendor ${businessName} registered successfully under ${category}!`);
      setIsSubmitting(false);
      router.push('/vendor');
    }, 1500);
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '2rem', fontWeight: 600 }}>Vendor Registration</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Register Business</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            <Input 
              label="Business Name" 
              type="text" 
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder="Enter your registered business name"
              required
            />

            <Input 
              label="Business Address / Wallet Address" 
              type="text" 
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="0x..."
              required
            />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
                Restricted Category
              </label>
              <select 
                value={category} 
                onChange={(e) => setCategory(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '0.875rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid var(--border-light)',
                  color: 'var(--text-primary)',
                  fontSize: '1rem',
                  outline: 'none',
                  appearance: 'none',
                  fontFamily: 'var(--font-family)',
                  cursor: 'pointer'
                }}
              >
                <option value="" disabled>Select the category of goods you sell</option>
                <option value="Food" style={{ background: 'var(--bg-secondary)' }}>Food & Groceries</option>
                <option value="Medicine" style={{ background: 'var(--bg-secondary)' }}>Medicine & Healthcare</option>
                <option value="Education" style={{ background: 'var(--bg-secondary)' }}>Education & Supplies</option>
                <option value="Housing" style={{ background: 'var(--bg-secondary)' }}>Housing & Rent</option>
                <option value="Electronics" style={{ background: 'var(--bg-secondary)' }}>Electronics</option>
              </select>
            </div>

            <Button type="submit" fullWidth disabled={isSubmitting} style={{ marginTop: '1rem' }}>
              {isSubmitting ? 'Registering...' : 'Complete Registration'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
