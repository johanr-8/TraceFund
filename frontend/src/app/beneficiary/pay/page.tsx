'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card/Card';
import { Button } from '@/components/ui/Button/Button';
import { Input } from '@/components/ui/Input/Input';
import { MOCK_VENDORS, MOCK_BALANCES } from '@/lib/mockData';
import { useRouter } from 'next/navigation';

export default function PayVendor() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedVendor, setSelectedVendor] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter vendors based on selected category
  const availableVendors = selectedCategory 
    ? MOCK_VENDORS.filter(v => v.category === selectedCategory)
    : [];

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate network delay
    setTimeout(() => {
      alert(`Successfully paid $${amount} to ${selectedVendor} from ${selectedCategory} funds!`);
      setIsSubmitting(false);
      router.push('/beneficiary');
    }, 1500);
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '2rem', fontWeight: 600 }}>Pay Approved Vendor</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Transfer Funds</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePayment} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
                Fund Category
              </label>
              <select 
                value={selectedCategory} 
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setSelectedVendor(''); // reset vendor when category changes
                }}
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
                <option value="" disabled>Select a category</option>
                {MOCK_BALANCES.map(bal => (
                  <option key={bal.category} value={bal.category} style={{ background: 'var(--bg-secondary)' }}>
                    {bal.category} (Available: ${bal.balance})
                  </option>
                ))}
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
                Select Vendor
              </label>
              <select 
                value={selectedVendor} 
                onChange={(e) => setSelectedVendor(e.target.value)}
                required
                disabled={!selectedCategory}
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
                  opacity: !selectedCategory ? 0.5 : 1,
                  cursor: !selectedCategory ? 'not-allowed' : 'pointer'
                }}
              >
                <option value="" disabled>
                  {selectedCategory ? 'Select a vendor' : 'Select a category first'}
                </option>
                {availableVendors.map(vendor => (
                  <option key={vendor.id} value={vendor.name} style={{ background: 'var(--bg-secondary)' }}>
                    {vendor.name}
                  </option>
                ))}
              </select>
            </div>

            <Input 
              label="Amount ($)" 
              type="number" 
              min="0.01" 
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              required
            />

            <Button type="submit" fullWidth disabled={isSubmitting} style={{ marginTop: '1rem' }}>
              {isSubmitting ? 'Processing Transaction...' : 'Confirm Payment'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
