import { useEffect, useState } from 'react';
import api, { setAuthToken } from '../services/api';

const defaultForm = {
  title: '',
  content: ''
};

const AdminBlogManager = ({ token }) => {
  const [posts, setPosts] = useState([]);
  const [form, setForm] = useState(defaultForm);
  const [editingId, setEditingId] = useState(null);
  const [status, setStatus] = useState('');

  const fetchPosts = async () => {
    const { data } = await api.get('/blog');
    setPosts(data);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus('');
    setAuthToken(token);

    try {
      if (editingId) {
        await api.put(`/blog/${editingId}`, form);
        setStatus('Post updated');
      } else {
        await api.post('/blog', form);
        setStatus('Post created');
      }
      setForm(defaultForm);
      setEditingId(null);
      fetchPosts();
    } catch (error) {
      setStatus(error.response?.data?.message || 'Action failed');
    }
  };

  const startEdit = (post) => {
    setEditingId(post._id);
    setForm({
      title: post.title,
      content: post.content
    });
  };

  const removePost = async (id) => {
    setAuthToken(token);
    await api.delete(`/blog/${id}`);
    fetchPosts();
  };

  return (
    <section className="section">
      <h2>Manage Blog Posts</h2>
      {status && <p>{status}</p>}
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />
        <textarea
          placeholder="Content"
          rows={6}
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
          required
        />
        <button type="submit">{editingId ? 'Update Post' : 'Add Post'}</button>
      </form>

      <ul>
        {posts.map((post) => (
          <li key={post._id} style={{ display: 'flex', justifyContent: 'space-between', margin: '0.5rem 0' }}>
            <span>{post.title}</span>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button type="button" onClick={() => startEdit(post)}>
                Edit
              </button>
              <button type="button" style={{ backgroundColor: '#dc2626' }} onClick={() => removePost(post._id)}>
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default AdminBlogManager;
