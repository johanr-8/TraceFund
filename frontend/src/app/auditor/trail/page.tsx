import { Card, CardContent } from '@/components/ui/Card/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, StatusBadge } from '@/components/ui/Table/Table';
import { MOCK_AUDIT_TXS } from '@/lib/mockData';
import Link from 'next/link';

export default function AuditorTrail() {
  return (
    <div>
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '2rem' }}>
        <Link href="/auditor" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>
          &larr; Back to Dashboard
        </Link>
        <h1 style={{ fontSize: '2rem', fontWeight: 600, margin: 0 }}>Full Transaction Ledger</h1>
      </div>
      
      <Card>
        <CardContent style={{ padding: 0 }}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date & Time</TableHead>
                <TableHead>Tx ID</TableHead>
                <TableHead>Beneficiary</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MOCK_AUDIT_TXS.map((tx) => (
                <TableRow key={tx.id}>
                  <TableCell style={{ color: 'var(--text-secondary)' }}>{tx.date}</TableCell>
                  <TableCell style={{ fontFamily: 'var(--font-mono)', fontSize: '0.875rem' }}>{tx.id}</TableCell>
                  <TableCell>{tx.beneficiaryId}</TableCell>
                  <TableCell>{tx.vendorName}</TableCell>
                  <TableCell>{tx.category}</TableCell>
                  <TableCell style={{ fontWeight: 600 }}>${tx.amount.toFixed(2)}</TableCell>
                  <TableCell>
                    <StatusBadge status={tx.status} />
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
