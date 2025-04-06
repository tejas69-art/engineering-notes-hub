import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function UnitManager() {
  const [units, setUnits] = useState([]);
  const [modules, setModules] = useState([]);
  const [newUnit, setNewUnit] = useState({
    module_id: '',
    unit_number: '',
    title: '',
    description: '',
    drive_file_id: '',
    topics: []
  });
  const [newTopic, setNewTopic] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUnits();
    fetchModules();
  }, []);

  async function fetchUnits() {
    try {
      const { data, error } = await supabase
        .from('units')
        .select(`
          *,
          modules (
            code,
            name,
            schemes (year),
            branches (code)
          )
        `)
        .order('unit_number');

      if (error) throw error;
      setUnits(data);
    } catch (error) {
      console.error('Error fetching units:', error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchModules() {
    try {
      const { data, error } = await supabase
        .from('modules')
        .select(`
          *,
          schemes (year),
          branches (code)
        `)
        .order('code');

      if (error) throw error;
      setModules(data);
    } catch (error) {
      console.error('Error fetching modules:', error);
    }
  }

  async function addUnit(e) {
    e.preventDefault();
    try {
      const { data, error } = await supabase
        .from('units')
        .insert([{
          ...newUnit,
          unit_number: parseInt(newUnit.unit_number),
          topics: newUnit.topics
        }])
        .select();

      if (error) throw error;
      await fetchUnits(); // Refetch to get the relations
      setNewUnit({
        module_id: '',
        unit_number: '',
        title: '',
        description: '',
        drive_file_id: '',
        topics: []
      });
    } catch (error) {
      console.error('Error adding unit:', error);
    }
  }

  async function deleteUnit(id) {
    try {
      const { error } = await supabase
        .from('units')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setUnits(units.filter(unit => unit.id !== id));
    } catch (error) {
      console.error('Error deleting unit:', error);
    }
  }

  function addTopic(e) {
    e.preventDefault();
    if (newTopic.trim()) {
      setNewUnit({
        ...newUnit,
        topics: [...newUnit.topics, newTopic.trim()]
      });
      setNewTopic('');
    }
  }

  function removeTopic(index) {
    setNewUnit({
      ...newUnit,
      topics: newUnit.topics.filter((_, i) => i !== index)
    });
  }

  if (loading) {
    return <div>Loading units...</div>;
  }

  return (
    <div className="unit-manager">
      <h2>Manage Units</h2>
      
      <form onSubmit={addUnit} className="add-form">
        <select
          value={newUnit.module_id}
          onChange={e => setNewUnit({ ...newUnit, module_id: e.target.value })}
          required
        >
          <option value="">Select Module</option>
          {modules.map(module => (
            <option key={module.id} value={module.id}>
              {module.code} - {module.name} ({module.schemes?.year} - {module.branches?.code})
            </option>
          ))}
        </select>
        <input
          type="number"
          placeholder="Unit Number"
          min="1"
          max="5"
          value={newUnit.unit_number}
          onChange={e => setNewUnit({ ...newUnit, unit_number: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Unit Title"
          value={newUnit.title}
          onChange={e => setNewUnit({ ...newUnit, title: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Description"
          value={newUnit.description}
          onChange={e => setNewUnit({ ...newUnit, description: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Google Drive File ID"
          value={newUnit.drive_file_id}
          onChange={e => setNewUnit({ ...newUnit, drive_file_id: e.target.value })}
          required
        />
        <div className="topics-section">
          <div className="topics-input">
            <input
              type="text"
              placeholder="Add Topic"
              value={newTopic}
              onChange={e => setNewTopic(e.target.value)}
            />
            <button type="button" onClick={addTopic}>Add Topic</button>
          </div>
          <div className="topics-list">
            {newUnit.topics.map((topic, index) => (
              <div key={index} className="topic-item">
                <span>{topic}</span>
                <button type="button" onClick={() => removeTopic(index)}>×</button>
              </div>
            ))}
          </div>
        </div>
        <button type="submit" className="submit-btn">Add Unit</button>
      </form>

      <div className="units-list">
        {units.map(unit => (
          <div key={unit.id} className="unit-item">
            <div className="unit-info">
              <h3>Unit {unit.unit_number}: {unit.title}</h3>
              <p>{unit.description}</p>
              <div className="unit-meta">
                <span>Module: {unit.modules?.code}</span>
                <span>Scheme: {unit.modules?.schemes?.year}</span>
                <span>Branch: {unit.modules?.branches?.code}</span>
              </div>
              <div className="unit-topics">
                <h4>Topics:</h4>
                <ul>
                  {unit.topics.map((topic, index) => (
                    <li key={index}>{topic}</li>
                  ))}
                </ul>
              </div>
              {unit.drive_file_id && (
                <a
                  href={`https://drive.google.com/file/d/${unit.drive_file_id}/view`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="view-file"
                >
                  View PDF
                </a>
              )}
            </div>
            <button 
              onClick={() => deleteUnit(unit.id)}
              className="delete-btn"
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      <style jsx>{`
        .unit-manager {
          padding: 1rem;
        }
        .add-form {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
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
        .topics-section {
          grid-column: span 2;
          background: rgba(var(--accent-dark), 0.3);
          padding: 1rem;
          border-radius: 4px;
        }
        .topics-input {
          display: flex;
          gap: 1rem;
          margin-bottom: 1rem;
        }
        .topics-input input {
          flex: 1;
        }
        .topics-input button {
          padding: 0.5rem 1rem;
          background: rgb(var(--accent-light));
          color: rgb(var(--accent-dark));
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        .topics-list {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }
        .topic-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(var(--accent-light), 0.1);
          padding: 0.2rem 0.5rem;
          border-radius: 4px;
        }
        .topic-item button {
          background: none;
          border: none;
          color: white;
          cursor: pointer;
          padding: 0 0.2rem;
        }
        .submit-btn {
          grid-column: span 2;
          padding: 0.5rem 1rem;
          background: rgb(var(--accent-light));
          color: rgb(var(--accent-dark));
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        .units-list {
          display: grid;
          gap: 1rem;
        }
        .unit-item {
          display: flex;
          justify-content: space-between;
          align-items: start;
          padding: 1rem;
          background: rgba(var(--accent-dark), 0.3);
          border-radius: 4px;
        }
        .unit-info h3 {
          margin: 0;
          color: rgb(var(--accent-light));
        }
        .unit-info p {
          margin: 0.5rem 0;
          font-size: 0.9rem;
          opacity: 0.8;
        }
        .unit-meta {
          display: flex;
          gap: 1rem;
          font-size: 0.8rem;
          margin-top: 0.5rem;
        }
        .unit-meta span {
          background: rgba(var(--accent-light), 0.1);
          padding: 0.2rem 0.5rem;
          border-radius: 4px;
        }
        .unit-topics {
          margin-top: 1rem;
        }
        .unit-topics h4 {
          margin: 0 0 0.5rem;
          font-size: 0.9rem;
          color: rgb(var(--accent-light));
        }
        .unit-topics ul {
          list-style: none;
          padding: 0;
          margin: 0;
          font-size: 0.9rem;
        }
        .unit-topics li {
          margin: 0.2rem 0;
          padding-left: 1rem;
          position: relative;
        }
        .unit-topics li:before {
          content: "•";
          position: absolute;
          left: 0;
          color: rgb(var(--accent-light));
        }
        .view-file {
          display: inline-block;
          margin-top: 1rem;
          padding: 0.5rem 1rem;
          background: rgba(var(--accent-light), 0.1);
          color: rgb(var(--accent-light));
          text-decoration: none;
          border-radius: 4px;
        }
        .view-file:hover {
          background: rgba(var(--accent-light), 0.2);
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