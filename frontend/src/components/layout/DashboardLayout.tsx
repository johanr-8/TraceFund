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
    { name: 'Wallet', path: '/beneficiary' },
    { name: 'Pay Vendor', path: '/beneficiary/pay' },
  ] : role === 'vendor' ? [
    { name: 'Dashboard', path: '/vendor' },
    { name: 'Receive Payment', path: '/vendor/receive' },
    { name: 'Register Business', path: '/vendor/register' },
  ] : role === 'auditor' ? [
    { name: 'Fraud Dashboard', path: '/auditor' },
    { name: 'Transaction Trail', path: '/auditor/trail' },
  ] : [
    { name: 'Issue Fund', path: '/admin' },
    { name: 'Vendor Approval', path: '/admin/vendors' },
  ];

  const initials = user ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : '?';

  return (
    <div className={styles.layout}>
      <aside className={styles.sidebar}>
        <div className={styles.logo}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="url(#paint0_linear)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            <defs>
              <linearGradient id="paint0_linear" x1="6" y1="2" x2="17" y2="22" gradientUnits="userSpaceOnUse">
                <stop stopColor="#6366f1" />
                <stop offset="1" stopColor="#a855f7" />
              </linearGradient>
            </defs>
          </svg>
          <span>TraceFund</span>
        </div>
        <nav className={styles.nav}>
          {links.map((link) => {
            const isActive = pathname === link.path || (pathname?.startsWith(link.path) && link.path !== `/${role}`);
            return (
              <Link
                key={link.path}
                href={link.path}
                className={`${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>
      </aside>

      <main className={styles.main}>
        <header className={styles.header}>
          <div className={styles.userProfile}>
            <span>{user ? `${user.name} (${user.role})` : 'Loading...'}</span>
            <div className={styles.avatar}>{initials}</div>
            <button onClick={() => { localStorage.removeItem("user"); router.push("/"); }} style={{ marginLeft: '1rem', fontSize: '0.875rem', color: 'var(--accent-danger)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-family)' }}>
              Logout
            </button>
          </div>
        </header>
        <div className={styles.content}>
          <div className="animate-fade-in">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};
