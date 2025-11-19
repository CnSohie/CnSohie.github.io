import { useEffect, useState } from 'react';
import api, { setAuthToken } from '../services/api';

const defaultForm = {
  title: '',
  description: '',
  repoUrl: '',
  liveUrl: ''
};

const AdminProjectManager = ({ token }) => {
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState(defaultForm);
  const [editingId, setEditingId] = useState(null);
  const [status, setStatus] = useState('');

  const fetchProjects = async () => {
    const { data } = await api.get('/projects');
    setProjects(data);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus('');
    setAuthToken(token);

    try {
      if (editingId) {
        await api.put(`/projects/${editingId}`, form);
        setStatus('Project updated');
      } else {
        await api.post('/projects', form);
        setStatus('Project created');
      }
      setForm(defaultForm);
      setEditingId(null);
      fetchProjects();
    } catch (error) {
      setStatus(error.response?.data?.message || 'Action failed');
    }
  };

  const startEdit = (project) => {
    setEditingId(project._id);
    setForm({
      title: project.title,
      description: project.description,
      repoUrl: project.repoUrl || '',
      liveUrl: project.liveUrl || ''
    });
  };

  const removeProject = async (id) => {
    setAuthToken(token);
    await api.delete(`/projects/${id}`);
    fetchProjects();
  };

  return (
    <section className="section">
      <h2>Manage Projects</h2>
      {status && <p>{status}</p>}
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />
        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          required
        />
        <input
          placeholder="Repo URL"
          value={form.repoUrl}
          onChange={(e) => setForm({ ...form, repoUrl: e.target.value })}
        />
        <input
          placeholder="Live URL"
          value={form.liveUrl}
          onChange={(e) => setForm({ ...form, liveUrl: e.target.value })}
        />
        <button type="submit">{editingId ? 'Update Project' : 'Add Project'}</button>
      </form>

      <ul>
        {projects.map((project) => (
          <li key={project._id} style={{ display: 'flex', justifyContent: 'space-between', margin: '0.5rem 0' }}>
            <span>{project.title}</span>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button type="button" onClick={() => startEdit(project)}>
                Edit
              </button>
              <button type="button" style={{ backgroundColor: '#dc2626' }} onClick={() => removeProject(project._id)}>
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default AdminProjectManager;
