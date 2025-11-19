import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from '../App';
import { AuthProvider } from '../context/AuthContext';

describe('App routing', () => {
  it('renders navigation links', () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
    );

    expect(screen.getByText(/Projects/i)).toBeInTheDocument();
    expect(screen.getByText(/Blog/i)).toBeInTheDocument();
  });
});
