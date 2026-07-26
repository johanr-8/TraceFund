import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, StatusBadge } from '@/components/ui/Table/Table';
import { MOCK_BENEFICIARY_TXS } from '@/lib/mockData';
import { Card, CardContent } from '@/components/ui/Card/Card';

export default function BeneficiaryHistory() {
  return (
    <div>
      <h1 style={{ fontSize: '2rem', marginBottom: '2rem', fontWeight: 600 }}>Transaction History</h1>
      
      <Card>
        <CardContent style={{ padding: 0 }}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date & Time</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MOCK_BENEFICIARY_TXS.map((tx) => (
                <TableRow key={tx.id}>
                  <TableCell style={{ color: 'var(--text-secondary)' }}>{tx.date}</TableCell>
                  <TableCell>{tx.vendorName}</TableCell>
                  <TableCell>{tx.category}</TableCell>
                  <TableCell style={{ fontWeight: 600 }}>${tx.amount.toFixed(2)}</TableCell>
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
