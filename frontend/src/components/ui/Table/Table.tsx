import React from 'react';
import styles from './Table.module.css';

interface TableProps extends React.TableHTMLAttributes<HTMLTableElement> {}

export const Table: React.FC<TableProps> = ({ children, className = '', ...props }) => (
  <div className={styles.tableWrapper}>
    <table className={`${styles.table} ${className}`} {...props}>
      {children}
    </table>
  </div>
);

export const TableHeader: React.FC<React.HTMLAttributes<HTMLTableSectionElement>> = (props) => (
  <thead className={styles.thead} {...props} />
);

export const TableBody: React.FC<React.HTMLAttributes<HTMLTableSectionElement>> = (props) => (
  <tbody className={styles.tbody} {...props} />
);

export const TableRow: React.FC<React.HTMLAttributes<HTMLTableRowElement>> = ({ className = '', ...props }) => (
  <tr className={`${styles.tr} ${className}`} {...props} />
);

export const TableHead: React.FC<React.ThHTMLAttributes<HTMLTableCellElement>> = ({ className = '', ...props }) => (
  <th className={`${styles.th} ${className}`} {...props} />
);

export const TableCell: React.FC<React.TdHTMLAttributes<HTMLTableCellElement>> = ({ className = '', ...props }) => (
  <td className={`${styles.td} ${className}`} {...props} />
);

export const StatusBadge: React.FC<{ status: 'approved' | 'rejected' | 'pending' | string }> = ({ status }) => {
  const normalized = status.toLowerCase();
  let className = styles.statusBadge;
  if (normalized === 'approved' || normalized === 'success') className += ` ${styles.statusApproved}`;
  else if (normalized === 'rejected' || normalized === 'failed') className += ` ${styles.statusRejected}`;
  else className += ` ${styles.statusPending}`;

  return <span className={className}>{status}</span>;
};
