'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card/Card';
import { Button } from '@/components/ui/Button/Button';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, StatusBadge } from '@/components/ui/Table/Table';
import { API_URL } from '@/lib/api';

interface Vendor {
  id: number;
  user_id: number;
  business_name: string;
  category: string;
  approval_status: string;
}

export default function VendorApprovalPage() {
  const router = useRouter();
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<number | null>(null);

  function fetchVendors(status: string) {
    return fetch(`${API_URL}/vendors?status=${status}`).then(r => r.json());
  }

  useEffect(() => {
    const raw = localStorage.getItem("user");
    if (!raw) { router.push("/login"); return; }
    const user = JSON.parse(raw);
    if (user.role !== "government") { router.push("/beneficiary"); return; }

    Promise.all([
      fetchVendors("pending"),
      fetchVendors("approved"),
      fetchVendors("rejected"),
    ]).then(([pending, approved, rejected]) => {
      setVendors([...pending, ...approved, ...rejected]);
    }).finally(() => setLoading(false));
  }, [router]);

  async function handleApprove(vendorId: number) {
    setActionId(vendorId);
    const res = await fetch(`${API_URL}/vendors/${vendorId}/approve`, { method: "POST" });
    if (res.ok) {
      setVendors(prev => prev.map(v =>
        v.id === vendorId ? { ...v, approval_status: "approved" } : v
      ));
    }
    setActionId(null);
  }

  async function handleReject(vendorId: number) {
    setActionId(vendorId);
    const res = await fetch(`${API_URL}/vendors/${vendorId}/reject`, { method: "POST" });
    if (res.ok) {
      setVendors(prev => prev.map(v =>
        v.id === vendorId ? { ...v, approval_status: "rejected" } : v
      ));
    }
    setActionId(null);
  }

  if (loading) return <div style={{ textAlign: "center", padding: "4rem", color: "var(--text-secondary)" }}>Loading...</div>;

  const pending = vendors.filter(v => v.approval_status === "pending");
  const approved = vendors.filter(v => v.approval_status === "approved");
  const rejected = vendors.filter(v => v.approval_status === "rejected");

  return (
    <div>
      <h1 style={{ fontSize: "2rem", marginBottom: "2rem", fontWeight: 600 }}>Vendor Approval</h1>

      <Card style={{ marginBottom: "2rem" }}>
        <CardHeader>
          <CardTitle>Pending Approval ({pending.length})</CardTitle>
        </CardHeader>
        <CardContent style={{ padding: 0 }}>
          {pending.length === 0 ? (
            <p style={{ padding: "1.5rem", color: "var(--text-secondary)", textAlign: "center" }}>No vendors pending approval</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Business Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pending.map(v => (
                  <TableRow key={v.id}>
                    <TableCell>{v.id}</TableCell>
                    <TableCell>{v.business_name}</TableCell>
                    <TableCell>{v.category}</TableCell>
                    <TableCell><StatusBadge status="Pending" /></TableCell>
                    <TableCell>
                      <div style={{ display: "flex", gap: "0.5rem" }}>
                        <Button
                          onClick={() => handleApprove(v.id)}
                          disabled={actionId === v.id}
                          style={{ padding: "0.5rem 1.25rem", fontSize: "0.875rem" }}
                        >
                          {actionId === v.id ? "Processing..." : "Approve"}
                        </Button>
                        <Button
                          variant="danger"
                          onClick={() => handleReject(v.id)}
                          disabled={actionId === v.id}
                          style={{ padding: "0.5rem 1.25rem", fontSize: "0.875rem" }}
                        >
                          Reject
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Approved Vendors ({approved.length})</CardTitle>
        </CardHeader>
        <CardContent style={{ padding: 0 }}>
          {approved.length === 0 ? (
            <p style={{ padding: "1.5rem", color: "var(--text-secondary)", textAlign: "center" }}>No approved vendors yet</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Business Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {approved.map(v => (
                  <TableRow key={v.id}>
                    <TableCell>{v.id}</TableCell>
                    <TableCell>{v.business_name}</TableCell>
                    <TableCell>{v.category}</TableCell>
                    <TableCell><StatusBadge status="Approved" /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Card style={{ marginTop: "2rem" }}>
        <CardHeader>
          <CardTitle>Rejected Vendors ({rejected.length})</CardTitle>
        </CardHeader>
        <CardContent style={{ padding: 0 }}>
          {rejected.length === 0 ? (
            <p style={{ padding: "1.5rem", color: "var(--text-secondary)", textAlign: "center" }}>No rejected vendors</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Business Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rejected.map(v => (
                  <TableRow key={v.id}>
                    <TableCell>{v.id}</TableCell>
                    <TableCell>{v.business_name}</TableCell>
                    <TableCell>{v.category}</TableCell>
                    <TableCell><StatusBadge status="Rejected" /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
