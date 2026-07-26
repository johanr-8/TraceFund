'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Button } from '@/components/ui/Button/Button';
import { investigateTransaction, takeActionOnTransaction, FraudReport } from '@/app/actions/investigate';

interface Props {
  txId: string;
}

export function InvestigateButton({ txId }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<FraudReport | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleInvestigate = async () => {
    setIsOpen(true);
    setLoading(true);
    setActionMessage('');
    
    try {
      const data = await investigateTransaction(txId);
      setReport(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (action: 'FREEZE' | 'DISMISS') => {
    setActionLoading(true);
    try {
      const result = await takeActionOnTransaction(txId, action);
      setActionMessage(result.message);
      if (report) {
        setReport({ ...report, status: action === 'FREEZE' ? 'Frozen' : 'Dismissed' });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const modalContent = isOpen ? (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(10px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        background: 'var(--bg-primary)',
        border: '1px solid var(--border-light)',
        borderRadius: 'var(--radius-lg)',
        width: '90%', maxWidth: '600px',
        padding: '2rem',
        position: 'relative',
        boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
      }}>
        <button 
          onClick={() => setIsOpen(false)}
          style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '1.5rem' }}
        >
          &times;
        </button>

        <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', fontWeight: 600 }}>AI Fraud Analysis</h2>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--accent-primary)' }}>
            <div className="animate-pulse">Analyzing Graph Sub-network...</div>
          </div>
        ) : report ? (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            <div style={{ display: 'flex', gap: '1rem' }}>
              <div style={{ flex: 1, padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(248, 113, 113, 0.2)' }}>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Risk Score</p>
                <p style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--accent-danger)' }}>{report.riskScore}</p>
              </div>
              <div style={{ flex: 1, padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Status</p>
                <p style={{ fontSize: '1.25rem', fontWeight: 600, color: report.status === 'Frozen' ? 'var(--accent-danger)' : report.status === 'Dismissed' ? 'var(--accent-success)' : 'var(--text-primary)', marginTop: '0.5rem' }}>
                  {report.status}
                </p>
              </div>
            </div>

            <div>
              <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.5rem' }}>Triggered Flags</h4>
              <ul style={{ listStyleType: 'disc', paddingLeft: '1.5rem', color: 'var(--text-secondary)' }}>
                {report.flags.map((flag, idx) => (
                  <li key={idx} style={{ marginBottom: '0.25rem' }}>{flag}</li>
                ))}
              </ul>
            </div>

            <div>
              <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.5rem' }}>Graph Analysis</h4>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, fontSize: '0.875rem', background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                {report.graphAnalysis}
              </p>
            </div>

            {actionMessage && (
              <div style={{ padding: '1rem', borderRadius: 'var(--radius-md)', background: report.status === 'Frozen' ? 'rgba(248, 113, 113, 0.1)' : 'rgba(52, 211, 153, 0.1)', color: report.status === 'Frozen' ? 'var(--accent-danger)' : 'var(--accent-success)' }}>
                {actionMessage}
              </div>
            )}

            {report.status === 'Pending' && (
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <Button 
                  fullWidth 
                  style={{ background: 'var(--accent-danger)' }} 
                  onClick={() => handleAction('FREEZE')}
                  disabled={actionLoading}
                >
                  {actionLoading ? 'Processing...' : 'Freeze Funds'}
                </Button>
                <Button 
                  fullWidth 
                  variant="secondary"
                  onClick={() => handleAction('DISMISS')}
                  disabled={actionLoading}
                >
                  {actionLoading ? 'Processing...' : 'Dismiss Alert'}
                </Button>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  ) : null;

  return (
    <>
      <Button variant="secondary" onClick={handleInvestigate} style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
        Investigate
      </Button>

      {mounted && isOpen && createPortal(modalContent, document.body)}
    </>
  );
}
