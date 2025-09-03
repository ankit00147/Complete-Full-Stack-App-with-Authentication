import { useEffect, useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import { apiFetch } from '../api';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [notes, setNotes] = useState([]);
  const [text, setText] = useState('');
  const [error, setError] = useState('');

  async function loadNotes() {
    try {
      const data = await apiFetch('/api/notes');
      setNotes(data.notes || []);
    } catch (e) {
      setError(e.message);
    }
  }

  useEffect(() => {
    loadNotes();
  }, []);

  async function addNote(e) {
    e.preventDefault();
    setError('');
    try {
      const { note } = await apiFetch('/api/notes', {
        method: 'POST',
        body: JSON.stringify({ text }),
      });
      setNotes(prev => [note, ...prev]);
      setText('');
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <div style={{ maxWidth: 720, margin: '40px auto', padding: 16 }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Dashboard</h2>
        <div>
          <span style={{ marginRight: 12 }}>{user?.name}</span>
          <button onClick={logout}>Logout</button>
        </div>
      </header>

      <form onSubmit={addNote} style={{ marginTop: 16 }}>
        <input
          placeholder="Write a note..."
          value={text}
          onChange={e => setText(e.target.value)}
          style={{ width: '100%', padding: 8 }}
        />
        <button style={{ marginTop: 8, padding: '8px 12px' }}>Add Note</button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <ul style={{ marginTop: 24, listStyle: 'none', padding: 0 }}>
        {notes.map(n => (
          <li key={n.id} style={{ padding: 12, border: '1px solid #ddd', marginBottom: 8 }}>
            <div>{n.text}</div>
            <small style={{ opacity: 0.7 }}>at {new Date(n.createdAt).toLocaleString()}</small>
          </li>
        ))}
        {!notes.length && <p>No notes yet. Add one!</p>}
      </ul>
    </div>
  );
}
