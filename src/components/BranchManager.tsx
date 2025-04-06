import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function BranchManager() {
  const [branches, setBranches] = useState([]);
  const [newBranch, setNewBranch] = useState({ code: '', name: '', description: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBranches();
  }, []);

  async function fetchBranches() {
    try {
      const { data, error } = await supabase
        .from('branches')
        .select('*')
        .order('code');

      if (error) throw error;
      setBranches(data);
    } catch (error) {
      console.error('Error fetching branches:', error);
    } finally {
      setLoading(false);
    }
  }

  async function addBranch(e) {
    e.preventDefault();
    try {
      const { data, error } = await supabase
        .from('branches')
        .insert([newBranch])
        .select();

      if (error) throw error;
      setBranches([...branches, data[0]]);
      setNewBranch({ code: '', name: '', description: '' });
    } catch (error) {
      console.error('Error adding branch:', error);
    }
  }

  async function deleteBranch(id) {
    try {
      const { error } = await supabase
        .from('branches')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setBranches(branches.filter(branch => branch.id !== id));
    } catch (error) {
      console.error('Error deleting branch:', error);
    }
  }

  if (loading) {
    return <div>Loading branches...</div>;
  }

  return (
    <div className="branch-manager">
      <h2>Manage Branches</h2>
      
      <form onSubmit={addBranch} className="add-form">
        <input
          type="text"
          placeholder="Branch Code (e.g., CSE)"
          value={newBranch.code}
          onChange={e => setNewBranch({ ...newBranch, code: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Branch Name"
          value={newBranch.name}
          onChange={e => setNewBranch({ ...newBranch, name: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Description"
          value={newBranch.description}
          onChange={e => setNewBranch({ ...newBranch, description: e.target.value })}
          required
        />
        <button type="submit">Add Branch</button>
      </form>

      <div className="branches-list">
        {branches.map(branch => (
          <div key={branch.id} className="branch-item">
            <div className="branch-info">
              <h3>{branch.name} ({branch.code})</h3>
              <p>{branch.description}</p>
            </div>
            <button 
              onClick={() => deleteBranch(branch.id)}
              className="delete-btn"
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      <style jsx>{`
        .branch-manager {
          padding: 1rem;
        }
        .add-form {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr auto;
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
        .branches-list {
          display: grid;
          gap: 1rem;
        }
        .branch-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem;
          background: rgba(var(--accent-dark), 0.3);
          border-radius: 4px;
        }
        .branch-info h3 {
          margin: 0;
          color: rgb(var(--accent-light));
        }
        .branch-info p {
          margin: 0.5rem 0 0;
          font-size: 0.9rem;
          opacity: 0.8;
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