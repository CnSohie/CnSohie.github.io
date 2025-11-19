import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Header = () => {
  const { isAuthenticated, logout, user } = useAuth();

  return (
    <header style={{ backgroundColor: '#1d4ed8', color: '#fff', padding: '1rem 2rem' }}>
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link to="/" style={{ textDecoration: 'none', color: '#fff', fontSize: '1.25rem', fontWeight: 700 }}>
          My Portfolio
        </Link>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <Link to="/projects">Projects</Link>
          <Link to="/blog">Blog</Link>
          <Link to="/contact">Contact</Link>
          {isAuthenticated ? (
            <>
              <span style={{ fontSize: '0.9rem' }}>Hi, {user.username}</span>
              <Link to="/admin">Dashboard</Link>
              <button type="button" onClick={logout} style={{ backgroundColor: '#ef4444' }}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
