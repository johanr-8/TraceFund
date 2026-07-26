import { DashboardLayout } from '@/components/layout/DashboardLayout';

export default function VendorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayout role="vendor">{children}</DashboardLayout>;
}
