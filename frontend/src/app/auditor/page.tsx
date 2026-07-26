import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, StatusBadge } from '@/components/ui/Table/Table';
import { MOCK_AUDIT_TXS } from '@/lib/mockData';
import { Button } from '@/components/ui/Button/Button';
import Link from 'next/link';
import { InvestigateButton } from './InvestigateButton';

export default function AuditorDashboard() {
  const suspiciousTxs = MOCK_AUDIT_TXS.filter(tx => tx.isSuspicious).sort((a, b) => (b.riskScore || 0) - (a.riskScore || 0));

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 600 }}>Fraud Detection Engine</h1>
        <Link href="/auditor/trail">
          <Button variant="secondary">View Full Ledger</Button>
        </Link>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
        <Card style={{ background: 'rgba(248, 113, 113, 0.1)', border: '1px solid rgba(248, 113, 113, 0.3)' }}>
          <CardContent style={{ padding: '2rem' }}>
            <p style={{ opacity: 0.9, fontSize: '1.1rem', marginBottom: '0.5rem', color: 'var(--accent-danger)' }}>Flagged Transactions</p>
            <h2 style={{ fontSize: '3rem', fontWeight: 700, color: 'white' }}>{suspiciousTxs.length}</h2>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>AI Analysis Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '1rem' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--accent-success)', boxShadow: '0 0 10px var(--accent-success)' }} />
              <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>Engine Active</span>
            </div>
            <p style={{ marginTop: '1rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              Graph-based anomaly detection is actively monitoring the mempool for velocity and category violations.
            </p>
          </CardContent>
        </Card>
      </div>

      <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', fontWeight: 500, color: 'var(--accent-danger)' }}>High-Risk Alerts</h3>
      
      <Card>
        <CardContent style={{ padding: 0 }}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Risk Score</TableHead>
                <TableHead>Tx ID</TableHead>
                <TableHead>Entity</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {suspiciousTxs.map((tx) => (
                <TableRow key={tx.id} style={{ background: 'rgba(248, 113, 113, 0.05)' }}>
                  <TableCell>
                    <div style={{ 
                      display: 'inline-flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      width: '40px', height: '40px', 
                      borderRadius: '50%', 
                      background: 'rgba(248, 113, 113, 0.2)',
                      color: 'var(--accent-danger)',
                      fontWeight: 700
                    }}>
                      {tx.riskScore}
                    </div>
                  </TableCell>
                  <TableCell style={{ fontFamily: 'var(--font-mono)' }}>{tx.id}</TableCell>
                  <TableCell>{tx.vendorName}<br/><span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Ben: {tx.beneficiaryId}</span></TableCell>
                  <TableCell style={{ fontWeight: 600 }}>${tx.amount.toFixed(2)}</TableCell>
                  <TableCell style={{ color: 'var(--accent-danger)' }}>{tx.reason}</TableCell>
                  <TableCell>
                    <InvestigateButton txId={tx.id} />
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
