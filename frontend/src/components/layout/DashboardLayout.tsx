'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import styles from './DashboardLayout.module.css';

interface DashboardLayoutProps {
  children: React.ReactNode;
  role: 'beneficiary' | 'vendor' | 'auditor' | 'government';
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, role }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<{ id: number; name: string; role: string } | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem("user");
    if (!raw) { router.push("/login"); return; }
    setUser(JSON.parse(raw));
  }, [router]);

  const links = role === 'beneficiary' ? [
    { name: 'Wallet', path: '/beneficiary', icon: '💳' },
    { name: 'Transactions', path: '/beneficiary/history', icon: '⇄' },
    { name: 'Pay Vendors', path: '/beneficiary/pay', icon: '👥' },
    { name: 'Notifications', path: '/beneficiary/notifications', icon: '🔔' },
    { name: 'Profile', path: '/beneficiary/profile', icon: '👤' },
  ] : role === 'vendor' ? [
    { name: 'Dashboard', path: '/vendor', icon: '📊' },
    { name: 'Receive Payment', path: '/vendor/receive', icon: '📥' },
    { name: 'Register Business', path: '/vendor/register', icon: '🏢' },
    { name: 'Settings', path: '/vendor/settings', icon: '⚙️' },
  ] : role === 'auditor' ? [
    { name: 'Fraud Dashboard', path: '/auditor', icon: '🛡️' },
    { name: 'Transaction Trail', path: '/auditor/trail', icon: '📜' },
    { name: 'Audit Logs', path: '/auditor/logs', icon: '📋' },
  ] : [
    { name: 'Issue Fund', path: '/admin', icon: '🏛️' },
    { name: 'Vendor Approval', path: '/admin/vendors', icon: '✅' },
    { name: 'Fund Types', path: '/admin/fund-types', icon: '📁' },
    { name: 'Transactions', path: '/admin/transactions', icon: '📊' },
    { name: 'Dashboard Stats', path: '/admin/stats', icon: '📈' },
  ];

  const initials = user
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : '?';

  return (
    <div className={styles.layout}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.logo}>
          <span style={{ color: '#00E5FF', fontWeight: 800, marginRight: '4px' }}>$</span>
          <span>TraceFund</span>
        </div>
        <nav className={styles.nav}>
          {links.map((link) => {
            const isActive = pathname === link.path;
            return (
              <Link
                key={link.name + link.path}
                href={link.path}
                className={`${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}
              >
                <span style={{ opacity: 0.8, fontSize: '1rem' }}>{link.icon}</span>
                <span>{link.name}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Container */}
      <main className={styles.main}>
        {/* Top Navbar */}
        <header className={styles.header}>
          <div className={styles.headerRightControls}>
            {/* Notifications */}
            <div className={styles.headerControlItem}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
              <span>Notifications</span>
            </div>

            {/* Help */}
            <div className={styles.headerControlItem}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
              <span>Help</span>
            </div>

            {/* User Profile Pill */}
            <div className={styles.userProfilePill}>
              <span>{user ? `${user.name} (${user.role})` : 'Loading...'}</span>
              <div className={styles.avatarCircle}>{initials}</div>
            </div>

            {/* Logout Button */}
            <button
              onClick={() => {
                localStorage.removeItem('user');
                router.push('/');
              }}
              className={styles.logoutPillBtn}
            >
              Logout
            </button>
          </div>
        </header>

        {/* Content Body */}
        <div className={styles.content}>
          <div className="animate-fade-in">{children}</div>
        </div>
      </main>
    </div>
  );
};
