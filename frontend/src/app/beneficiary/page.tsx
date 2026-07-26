import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card/Card';
import { MOCK_BALANCES } from '@/lib/mockData';

export default function BeneficiaryOverview() {
  const totalBalance = MOCK_BALANCES.reduce((acc, curr) => acc + curr.balance, 0);

  return (
    <div>
      <h1 style={{ fontSize: '2rem', marginBottom: '2rem', fontWeight: 600 }}>Wallet Overview</h1>
      
      <Card style={{ 
        marginBottom: '2rem', 
        background: 'rgba(15, 23, 42, 0.8)', 
        backdropFilter: 'blur(16px)',
        border: '2px solid rgba(6, 182, 212, 0.6)',
        boxShadow: '0 0 40px rgba(6, 182, 212, 0.3), inset 0 0 20px rgba(6, 182, 212, 0.1)'
      }}>
        <CardContent style={{ padding: '2rem' }}>
          <p style={{ opacity: 0.9, fontSize: '1.1rem', marginBottom: '0.5rem' }}>Total Available Balance</p>
          <h2 style={{ fontSize: '3rem', fontWeight: 700 }}>${totalBalance.toFixed(2)}</h2>
        </CardContent>
      </Card>

      <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', fontWeight: 500 }}>Category Balances</h3>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem' }}>
        {MOCK_BALANCES.map((bal) => {
          const percent = (bal.balance / bal.allocated) * 100;
          return (
            <Card key={bal.category}>
              <CardHeader>
                <CardTitle>{bal.category}</CardTitle>
              </CardHeader>
              <CardContent>
                <div style={{ fontSize: '2rem', fontWeight: 600, marginBottom: '1rem' }}>
                  ${bal.balance.toFixed(2)}
                </div>
                <div style={{ height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div 
                    style={{ 
                      height: '100%', 
                      width: `${percent}%`, 
                      background: 'var(--accent-primary)',
                      transition: 'width 1s ease-in-out'
                    }} 
                  />
                </div>
                <div style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                  ${bal.allocated.toFixed(2)} Initial Allocation
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
