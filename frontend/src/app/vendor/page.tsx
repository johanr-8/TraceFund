import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, StatusBadge } from '@/components/ui/Table/Table';
import { MOCK_VENDOR_TXS } from '@/lib/mockData';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card/Card';

export default function VendorDashboard() {
  const totalSettled = MOCK_VENDOR_TXS
    .filter(tx => tx.status === 'Approved')
    .reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div>
      <h1 style={{ fontSize: '2rem', marginBottom: '2rem', fontWeight: 600 }}>Vendor Dashboard</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
        <Card style={{ 
          background: 'rgba(15, 23, 42, 0.8)', 
          backdropFilter: 'blur(16px)',
          border: '2px solid rgba(6, 182, 212, 0.6)',
          boxShadow: '0 0 40px rgba(6, 182, 212, 0.3), inset 0 0 20px rgba(6, 182, 212, 0.1)'
        }}>
          <CardContent style={{ padding: '2rem' }}>
            <p style={{ opacity: 0.9, fontSize: '1.1rem', marginBottom: '0.5rem' }}>Total Settled (Today)</p>
            <h2 style={{ fontSize: '3rem', fontWeight: 700 }}>₹{totalSettled.toFixed(2)}</h2>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Registration Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '1rem' }}>
              <StatusBadge status="Approved" />
              <span style={{ color: 'var(--text-secondary)' }}>Category: <strong>Medicine</strong></span>
            </div>
            <p style={{ marginTop: '1rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              Your wallet is approved to accept restricted tokens for Medicine.
            </p>
          </CardContent>
        </Card>
      </div>

      <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', fontWeight: 500 }}>Recent Incoming Payments</h3>
      
      <Card>
        <CardContent style={{ padding: 0 }}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date & Time</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MOCK_VENDOR_TXS.map((tx) => (
                <TableRow key={tx.id}>
                  <TableCell style={{ color: 'var(--text-secondary)' }}>{tx.date}</TableCell>
                  <TableCell>Beneficiary ID: {tx.id.substring(3)}...</TableCell>
                  <TableCell>{tx.category}</TableCell>
                  <TableCell style={{ fontWeight: 600 }}>₹{tx.amount.toFixed(2)}</TableCell>
                  <TableCell>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', alignItems: 'flex-start' }}>
                      <StatusBadge status={tx.status} />
                      {tx.reason && (
                        <span style={{ fontSize: '0.75rem', color: 'var(--accent-danger)' }}>{tx.reason}</span>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
