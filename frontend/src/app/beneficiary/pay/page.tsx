'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card/Card';
import { Button } from '@/components/ui/Button/Button';
import { Input } from '@/components/ui/Input/Input';
import { API_URL } from '@/lib/api';
import { useRouter } from 'next/navigation';

interface Balance {
  fund_type: string;
  balance: number;
}

interface FundType {
  id: number;
  name: string;
}

interface Vendor {
  id: number;
  business_name: string;
  category: string;
}

export default function PayVendor() {
  const router = useRouter();
  const [userId, setUserId] = useState<number | null>(null);
  const [balances, setBalances] = useState<Balance[]>([]);
  const [fundTypes, setFundTypes] = useState<FundType[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedVendor, setSelectedVendor] = useState('');
  const [amount, setAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const raw = localStorage.getItem("user");
    if (!raw) { router.push("/login"); return; }
    const user = JSON.parse(raw);
    setUserId(user.id);

    Promise.all([
      fetch(`${API_URL}/wallet/${user.id}`).then(r => r.json()),
      fetch(`${API_URL}/fund-types`).then(r => r.json()),
      fetch(`${API_URL}/vendors`).then(r => r.json()),
    ]).then(([wallet, ft, v]) => {
      setBalances(wallet.balances.filter((b: Balance) => b.balance > 0));
      setFundTypes(ft);
      setVendors(v);
    }).finally(() => setLoading(false));
  }, [router]);

  const availableVendors = selectedCategory
    ? vendors.filter(v => v.category === selectedCategory)
    : [];

  async function handlePayment(e: React.FormEvent) {
    e.preventDefault();
    setMessage('');
    setIsSubmitting(true);

    const vendor = vendors.find(v => v.business_name === selectedVendor);
    if (!vendor) { setMessage('Error: Vendor not found'); setIsSubmitting(false); return; }

    const ft = fundTypes.find(f => f.name === selectedCategory);
    if (!ft) { setMessage('Error: Fund type not found'); setIsSubmitting(false); return; }

    const res = await fetch(`${API_URL}/spend`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sender_id: userId,
        vendor_id: vendor.id,
        fund_type_id: ft.id,
        amount: Number(amount),
      }),
    });

    const data = await res.json();
    setIsSubmitting(false);
    if (res.ok) {
      setMessage(`Paid ₹${amount} to ${data.vendor} from ${data.fund_type}`);
      setAmount('');
      setSelectedVendor('');
      setSelectedCategory('');
    } else {
      setMessage(`Error: ${data.detail}`);
    }
  }

  if (loading) return <div style={{ textAlign: "center", padding: "4rem", color: "var(--text-secondary)" }}>Loading...</div>;

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', fontWeight: 600 }}>Pay Approved Vendor</h1>
      
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
                  setSelectedVendor('');
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
                {balances.map(b => (
                  <option key={b.fund_type} value={b.fund_type} style={{ background: 'var(--bg-secondary)' }}>
                    {b.fund_type} (Available: ₹{b.balance})
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
                {availableVendors.map(v => (
                  <option key={v.id} value={v.business_name} style={{ background: 'var(--bg-secondary)' }}>
                    {v.business_name}
                  </option>
                ))}
              </select>
            </div>

            <Input 
              label="Amount (₹)" 
              type="number" 
              min="0.01" 
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              required
            />

            <Button type="submit" fullWidth disabled={isSubmitting} style={{ marginTop: '0.5rem' }}>
              {isSubmitting ? 'Processing Transaction...' : 'Confirm Payment'}
            </Button>
          </form>
          {message && (
            <p style={{ marginTop: "1rem", padding: "0.75rem 1rem", borderRadius: "var(--radius-md)",
              background: message.startsWith("Error") ? "rgba(248, 113, 113, 0.15)" : "rgba(52, 211, 153, 0.15)",
              color: message.startsWith("Error") ? "var(--accent-danger)" : "var(--accent-success)" }}>
              {message}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
