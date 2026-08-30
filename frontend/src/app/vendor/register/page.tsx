'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card/Card';
import { Button } from '@/components/ui/Button/Button';
import { Input } from '@/components/ui/Input/Input';
import { API_URL } from '@/lib/api';
import { useRouter } from 'next/navigation';

export default function VendorRegistration() {
  const router = useRouter();
  const [businessName, setBusinessName] = useState('');
  const [category, setCategory] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem("user");
    if (!raw) { router.push("/login"); return; }
    const user = JSON.parse(raw);
    setUserId(user.id);
  }, [router]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const res = await fetch(`${API_URL}/vendors`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          business_name: businessName,
          category: category,
        }),
      });

      const data = await res.json();
      setIsSubmitting(false);

      if (res.ok) {
        alert(`Vendor "${data.business_name}" registered successfully! Status: ${data.approval_status}`);
        router.push('/vendor');
      } else {
        setError(data.detail || "Registration failed");
      }
    } catch {
      setIsSubmitting(false);
      setError("Network error. Is the backend running?");
    }
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
              </select>
            </div>

            <Button type="submit" fullWidth disabled={isSubmitting || !userId} style={{ marginTop: '1rem' }}>
              {isSubmitting ? 'Registering...' : 'Complete Registration'}
            </Button>
          </form>
          {error && (
            <p style={{ marginTop: "1rem", padding: "0.75rem 1rem", borderRadius: "var(--radius-md)",
              background: "rgba(248, 113, 113, 0.15)", color: "var(--accent-danger)" }}>
              {error}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
