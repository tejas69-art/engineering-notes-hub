import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function ModuleManager() {
  const [modules, setModules] = useState([]);
  const [schemes, setSchemes] = useState([]);
  const [branches, setBranches] = useState([]);
  const [newModule, setNewModule] = useState({
    code: '',
    name: '',
    description: '',
    scheme_id: '',
    branch_id: '',
    semester: '',
    credits: '4'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchModules();
    fetchSchemes();
    fetchBranches();
  }, []);

  async function fetchModules() {
    try {
      const { data, error } = await supabase
        .from('modules')
        .select(`
          *,
          schemes (year),
          branches (code, name)
        `)
        .order('code');

      if (error) throw error;
      setModules(data);
    } catch (error) {
      console.error('Error fetching modules:', error);
    } finally {
      setLoading(false);
    }
  }

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
    }
  }

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
    }
  }

  async function addModule(e) {
    e.preventDefault();
    try {
      const { data, error } = await supabase
        .from('modules')
        .insert([{
          ...newModule,
          semester: parseInt(newModule.semester),
          credits: parseInt(newModule.credits)
        }])
        .select();

      if (error) throw error;
      await fetchModules(); // Refetch to get the relations
      setNewModule({
        code: '',
        name: '',
        description: '',
        scheme_id: '',
        branch_id: '',
        semester: '',
        credits: '4'
      });
    } catch (error) {
      console.error('Error adding module:', error);
    }
  }

  async function deleteModule(id) {
    try {
      const { error } = await supabase
        .from('modules')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setModules(modules.filter(module => module.id !== id));
    } catch (error) {
      console.error('Error deleting module:', error);
    }
  }

  if (loading) {
    return <div>Loading modules...</div>;
  }

  return (
    <div className="module-manager">
      <h2>Manage Modules</h2>
      
      <form onSubmit={addModule} className="add-form">
        <input
          type="text"
          placeholder="Module Code (e.g., CS101)"
          value={newModule.code}
          onChange={e => setNewModule({ ...newModule, code: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Module Name"
          value={newModule.name}
          onChange={e => setNewModule({ ...newModule, name: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Description"
          value={newModule.description}
          onChange={e => setNewModule({ ...newModule, description: e.target.value })}
          required
        />
        <select
          value={newModule.scheme_id}
          onChange={e => setNewModule({ ...newModule, scheme_id: e.target.value })}
          required
        >
          <option value="">Select Scheme</option>
          {schemes.map(scheme => (
            <option key={scheme.id} value={scheme.id}>
              {scheme.year}
            </option>
          ))}
        </select>
        <select
          value={newModule.branch_id}
          onChange={e => setNewModule({ ...newModule, branch_id: e.target.value })}
          required
        >
          <option value="">Select Branch</option>
          {branches.map(branch => (
            <option key={branch.id} value={branch.id}>
              {branch.code} - {branch.name}
            </option>
          ))}
        </select>
        <input
          type="number"
          placeholder="Semester"
          min="1"
          max="8"
          value={newModule.semester}
          onChange={e => setNewModule({ ...newModule, semester: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Credits"
          min="1"
          max="4"
          value={newModule.credits}
          onChange={e => setNewModule({ ...newModule, credits: e.target.value })}
          required
        />
        <button type="submit">Add Module</button>
      </form>

      <div className="modules-list">
        {modules.map(module => (
          <div key={module.id} className="module-item">
            <div className="module-info">
              <h3>{module.name} ({module.code})</h3>
              <p>{module.description}</p>
              <div className="module-meta">
                <span>Scheme: {module.schemes?.year}</span>
                <span>Branch: {module.branches?.code}</span>
                <span>Semester: {module.semester}</span>
                <span>Credits: {module.credits}</span>
              </div>
            </div>
            <button 
              onClick={() => deleteModule(module.id)}
              className="delete-btn"
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      <style jsx>{`
        .module-manager {
          padding: 1rem;
        }
        .add-form {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1rem;
          margin-bottom: 2rem;
        }
        .add-form input,
        .add-form select {
          padding: 0.5rem;
          border: 1px solid rgba(var(--accent-light), 0.2);
          border-radius: 4px;
          background: rgba(255, 255, 255, 0.1);
          color: white;
        }
        .add-form select {
          background: rgba(var(--accent-dark), 0.8);
        }
        .add-form select option {
          background: rgb(var(--accent-dark));
        }
        .add-form button {
          padding: 0.5rem 1rem;
          background: rgb(var(--accent-light));
          color: rgb(var(--accent-dark));
          border: none;
          border-radius: 4px;
          cursor: pointer;
          grid-column: span 4;
        }
        .modules-list {
          display: grid;
          gap: 1rem;
        }
        .module-item {
          display: flex;
          justify-content: space-between;
          align-items: start;
          padding: 1rem;
          background: rgba(var(--accent-dark), 0.3);
          border-radius: 4px;
        }
        .module-info h3 {
          margin: 0;
          color: rgb(var(--accent-light));
        }
        .module-info p {
          margin: 0.5rem 0;
          font-size: 0.9rem;
          opacity: 0.8;
        }
        .module-meta {
          display: flex;
          gap: 1rem;
          font-size: 0.8rem;
          margin-top: 0.5rem;
        }
        .module-meta span {
          background: rgba(var(--accent-light), 0.1);
          padding: 0.2rem 0.5rem;
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