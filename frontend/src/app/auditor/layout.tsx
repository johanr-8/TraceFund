import { DashboardLayout } from '@/components/layout/DashboardLayout';

export default function AuditorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayout role="auditor">{children}</DashboardLayout>;
}
