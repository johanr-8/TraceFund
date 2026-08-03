import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card/Card';
import { MOCK_AGGREGATE_DATA } from '@/lib/mockData';
import Link from 'next/link';
import { Button } from '@/components/ui/Button/Button';

export default function PublicDashboard() {
  const totalAllocated = MOCK_AGGREGATE_DATA.reduce((acc, curr) => acc + curr.allocated, 0);
  const totalSpent = MOCK_AGGREGATE_DATA.reduce((acc, curr) => acc + curr.spent, 0);
  const totalPercent = (totalSpent / totalAllocated) * 100;

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
        <h1 className="text-gradient" style={{ fontSize: '2.5rem', fontWeight: 700, margin: 0 }}>TraceFund Public Transparency</h1>
        <Link href="/">
          <Button variant="secondary">Back to Home</Button>
        </Link>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
        
        {/* Total Utilization Overview */}
        <Card style={{ 
          background: 'rgba(15, 23, 42, 0.6)', 
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(6, 182, 212, 0.3)',
        }}>
          <CardContent style={{ padding: '2.5rem', textAlign: 'center' }}>
            <h2 style={{ fontSize: '1.25rem', opacity: 0.9, marginBottom: '1rem' }}>Total Network Utilization</h2>
            <div style={{ fontSize: '3rem', fontWeight: 700, marginBottom: '1rem', letterSpacing: '-0.02em' }}>
              ₹{(totalSpent / 1000000).toFixed(2)}M / ₹{(totalAllocated / 1000000).toFixed(2)}M
            </div>
            
            <div style={{ height: '16px', background: 'rgba(255,255,255,0.2)', borderRadius: '8px', overflow: 'hidden', maxWidth: '800px', margin: '0 auto' }}>
              <div 
                style={{ 
                  height: '100%', 
                  width: `${totalPercent}%`, 
                  background: 'white',
                  transition: 'width 1.5s cubic-bezier(0.4, 0, 0.2, 1)',
                  borderRadius: '8px'
                }} 
              />
            </div>
            <p style={{ marginTop: '1rem', fontSize: '1.1rem', fontWeight: 500 }}>{totalPercent.toFixed(1)}% of total funds successfully distributed to approved vendors.</p>
          </CardContent>
        </Card>

        {/* Category Breakdown */}
        <div>
          <h3 style={{ fontSize: '1.75rem', marginBottom: '1.5rem', fontWeight: 600 }}>Category Breakdown</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '2rem' }}>
            {MOCK_AGGREGATE_DATA.map((data) => {
              const percent = (data.spent / data.allocated) * 100;
              return (
                <Card key={data.category} style={{ transition: 'transform 0.3s' }}>
                  <CardHeader>
                    <CardTitle style={{ fontSize: '1.25rem' }}>{data.category}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '1.1rem' }}>
                      <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>₹{(data.spent / 1000000).toFixed(1)}M Spent</span>
                      <span style={{ color: 'var(--text-secondary)' }}>₹{(data.allocated / 1000000).toFixed(1)}M Total</span>
                    </div>
                    <div style={{ height: '10px', background: 'rgba(255,255,255,0.05)', borderRadius: '5px', overflow: 'hidden' }}>
                      <div 
                        style={{ 
                          height: '100%', 
                          width: `${percent}%`, 
                          background: 'var(--gradient-brand)',
                          transition: 'width 1s ease-in-out'
                        }} 
                      />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
