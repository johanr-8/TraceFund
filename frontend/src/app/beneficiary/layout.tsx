import { DashboardLayout } from '@/components/layout/DashboardLayout';

export default function BeneficiaryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayout role="beneficiary">{children}</DashboardLayout>;
}
