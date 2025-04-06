import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { Toaster, toast } from 'react-hot-toast';
import SchemeManager from './SchemeManager';
import BranchManager from './BranchManager';
import ModuleManager from './ModuleManager';
import UnitManager from './UnitManager';

export default function AdminDashboard() {
  const [session, setSession] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('schemes');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (!session) {
    return (
      <div className="auth-container" style={styles.authContainer}>
        <h1 style={styles.authTitle}>Admin Login</h1>
        <Auth
          supabaseClient={supabase}
          appearance={{ 
            theme: ThemeSupa,
            style: {
              button: {
                background: 'rgb(var(--accent-light))',
                color: 'rgb(var(--accent-dark))',
                border: 'none',
              },
              input: {
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(var(--accent-light), 0.2)',
                color: 'white',
              },
              label: {
                color: 'rgb(var(--accent-light))',
              },
            },
          }}
          providers={[]}
        />
      </div>
    );
  }

  return (
    <div style={styles.adminDashboard}>
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: 'rgb(var(--accent-dark))',
            color: 'white',
          },
          success: {
            iconTheme: {
              primary: 'rgb(var(--accent-light))',
              secondary: 'rgb(var(--accent-dark))',
            },
          },
        }}
      />
      
      <header style={styles.header}>
        <h1 style={styles.title}>Admin Dashboard</h1>
        <button 
          onClick={() => {
            supabase.auth.signOut();
            toast.success('Signed out successfully');
          }}
          style={styles.signOutButton}
        >
          Sign Out
        </button>
      </header>

      <nav style={styles.adminNav}>
        <button 
          style={{
            ...styles.navButton,
            ...(activeTab === 'schemes' ? styles.activeButton : {})
          }}
          onClick={() => setActiveTab('schemes')}
        >
          Schemes
        </button>
        <button 
          style={{
            ...styles.navButton,
            ...(activeTab === 'branches' ? styles.activeButton : {})
          }}
          onClick={() => setActiveTab('branches')}
        >
          Branches
        </button>
        <button 
          style={{
            ...styles.navButton,
            ...(activeTab === 'modules' ? styles.activeButton : {})
          }}
          onClick={() => setActiveTab('modules')}
        >
          Modules
        </button>
        <button 
          style={{
            ...styles.navButton,
            ...(activeTab === 'units' ? styles.activeButton : {})
          }}
          onClick={() => setActiveTab('units')}
        >
          Units
        </button>
      </nav>

      <div style={styles.content}>
        {activeTab === 'schemes' && <SchemeManager />}
        {activeTab === 'branches' && <BranchManager />}
        {activeTab === 'modules' && <ModuleManager />}
        {activeTab === 'units' && <UnitManager />}
      </div>
    </div>
  );
}

const styles = {
  adminDashboard: {
    minHeight: '100vh',
    background: '#13151a',
    color: 'white',
  },
  authContainer: {
    maxWidth: '400px',
    margin: '4rem auto',
    padding: '2rem',
    background: 'rgba(var(--accent-dark), 0.8)',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)',
  },
  authTitle: {
    textAlign: 'center' as const,
    color: 'rgb(var(--accent-light))',
    marginBottom: '2rem',
    fontSize: '2rem',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '2rem',
    background: 'rgba(var(--accent-dark), 0.8)',
    borderBottom: '1px solid rgba(var(--accent-light), 0.1)',
  },
  title: {
    margin: 0,
    fontSize: '2rem',
    color: 'rgb(var(--accent-light))',
    fontWeight: 700,
  },
  adminNav: {
    display: 'flex',
    gap: '0.5rem',
    padding: '1rem 2rem',
    background: 'rgba(var(--accent-dark), 0.6)',
    borderBottom: '1px solid rgba(var(--accent-light), 0.1)',
  },
  navButton: {
    background: 'none',
    border: 'none',
    color: 'white',
    padding: '0.75rem 1.5rem',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    fontSize: '1rem',
    fontWeight: 500,
  },
  activeButton: {
    background: 'rgba(var(--accent-light), 0.2)',
    color: 'rgb(var(--accent-light))',
  },
  signOutButton: {
    background: 'rgba(255, 59, 48, 0.2)',
    border: 'none',
    color: 'white',
    padding: '0.75rem 1.5rem',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    fontSize: '1rem',
    fontWeight: 500,
  },
  content: {
    padding: '2rem',
    maxWidth: '1200px',
    margin: '0 auto',
  },
};