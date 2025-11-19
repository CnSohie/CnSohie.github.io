import { Link } from 'react-router-dom';

const NotFound = () => (
  <section className="section">
    <h1>404</h1>
    <p>The page you are looking for does not exist.</p>
    <Link to="/">Return Home</Link>
  </section>
);

export default NotFound;
