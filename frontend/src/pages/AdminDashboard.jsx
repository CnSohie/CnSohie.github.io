import { useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { setAuthToken } from '../services/api';
import AdminProjectManager from '../components/AdminProjectManager';
import AdminBlogManager from '../components/AdminBlogManager';

const AdminDashboard = () => {
  const { user, token } = useAuth();

  useEffect(() => {
    setAuthToken(token);
  }, [token]);

  return (
    <div>
      <section className="section">
        <h1>Admin Dashboard</h1>
        <p>Welcome back, {user.username}.</p>
      </section>
      <AdminProjectManager token={token} />
      <AdminBlogManager token={token} />
    </div>
  );
};

export default AdminDashboard;
