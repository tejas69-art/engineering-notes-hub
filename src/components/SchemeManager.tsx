import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function SchemeManager() {
  const [schemes, setSchemes] = useState([]);
  const [newScheme, setNewScheme] = useState({ year: '', description: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSchemes();
  }, []);

  async function fetchSchemes() {
    try {
      const { data, error } = await supabase
        .from('schemes')
        .select('*')
        .order('year', { ascending: false });

      if (error) throw error;
      setSchemes(data);
    } catch (error) {
      console.error('Error fetching schemes:', error);
    } finally {
      setLoading(false);
    }
  }

  async function addScheme(e) {
    e.preventDefault();
    try {
      const { data, error } = await supabase
        .from('schemes')
        .insert([newScheme])
        .select();

      if (error) throw error;
      setSchemes([...schemes, data[0]]);
      setNewScheme({ year: '', description: '' });
    } catch (error) {
      console.error('Error adding scheme:', error);
    }
  }

  async function deleteScheme(id) {
    try {
      const { error } = await supabase
        .from('schemes')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setSchemes(schemes.filter(scheme => scheme.id !== id));
    } catch (error) {
      console.error('Error deleting scheme:', error);
    }
  }

  if (loading) {
    return <div>Loading schemes...</div>;
  }

  return (
    <div className="scheme-manager">
      <h2>Manage Schemes</h2>
      
      <form onSubmit={addScheme} className="add-form">
        <input
          type="text"
          placeholder="Year (e.g., 2024)"
          value={newScheme.year}
          onChange={e => setNewScheme({ ...newScheme, year: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Description"
          value={newScheme.description}
          onChange={e => setNewScheme({ ...newScheme, description: e.target.value })}
          required
        />
        <button type="submit">Add Scheme</button>
      </form>

      <div className="schemes-list">
        {schemes.map(scheme => (
          <div key={scheme.id} className="scheme-item">
            <div className="scheme-info">
              <h3>{scheme.year} Scheme</h3>
              <p>{scheme.description}</p>
            </div>
            <button 
              onClick={() => deleteScheme(scheme.id)}
              className="delete-btn"
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      <style jsx>{`
        .scheme-manager {
          padding: 1rem;
        }
        .add-form {
          display: flex;
          gap: 1rem;
          margin-bottom: 2rem;
        }
        .add-form input {
          padding: 0.5rem;
          border: 1px solid rgba(var(--accent-light), 0.2);
          border-radius: 4px;
          background: rgba(255, 255, 255, 0.1);
          color: white;
        }
        .add-form button {
          padding: 0.5rem 1rem;
          background: rgb(var(--accent-light));
          color: rgb(var(--accent-dark));
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        .schemes-list {
          display: grid;
          gap: 1rem;
        }
        .scheme-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem;
          background: rgba(var(--accent-dark), 0.3);
          border-radius: 4px;
        }
        .delete-btn {
          padding: 0.5rem 1rem;
          background: rgba(255, 0, 0, 0.2);
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        .delete-btn:hover {
          background: rgba(255, 0, 0, 0.3);
        }
      `}</style>
    </div>
  );
}