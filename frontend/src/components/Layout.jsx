import Header from './Header';
import Footer from './Footer';

const Layout = ({ children }) => (
  <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
    <Header />
    <main style={{ flex: 1, width: 'min(1200px, 100%)', margin: '0 auto', padding: '2rem 1rem' }}>{children}</main>
    <Footer />
  </div>
);

export default Layout;
