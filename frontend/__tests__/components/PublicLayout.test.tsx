import '@testing-library/jest-dom';
import React from 'react';
import { render, screen } from '@testing-library/react';
import PublicLayout from '@/components/PublicLayout';

jest.mock('@/components/Navbar', () => {
  return function MockNavbar() {
    return <nav data-testid="navbar">Navbar</nav>;
  };
});

jest.mock('@/components/Footer', () => {
  return function MockFooter() {
    return <footer data-testid="footer">Footer</footer>;
  };
});

describe('PublicLayout', () => {
  it('renders navbar, children, and footer', () => {
    render(
      <PublicLayout>
        <div>Page Content</div>
      </PublicLayout>
    );
    
    expect(screen.getByTestId('navbar')).toBeInTheDocument();
    expect(screen.getByText('Page Content')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });

  it('renders children in main element', () => {
    render(
      <PublicLayout>
        <main data-testid="main">Main Content</main>
      </PublicLayout>
    );
    
    expect(screen.getByTestId('main')).toBeInTheDocument();
  });
});
