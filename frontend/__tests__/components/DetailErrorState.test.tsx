import '@testing-library/jest-dom';
import React from 'react';
import { render, screen } from '@testing-library/react';
import DetailErrorState from '@/components/DetailErrorState';

jest.mock('next/link', () => {
  return function MockLink({ children, href }: { children: React.ReactNode; href: string }) {
    return <a href={href}>{children}</a>;
  };
});

describe('DetailErrorState', () => {
  it('renders with required props', () => {
    render(<DetailErrorState title="Not Found" backHref="/services" />);
    expect(screen.getByText('Not Found')).toBeInTheDocument();
  });

  it('renders with custom description', () => {
    render(<DetailErrorState title="Error" description="Something went wrong" backHref="/services" />);
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });

  it('renders a back link with correct href', () => {
    render(<DetailErrorState title="Error" backHref="/services" />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/services');
  });

  it('renders custom back label', () => {
    render(<DetailErrorState title="Error" backHref="/services" backLabel="Go Back" />);
    expect(screen.getByText('Go Back')).toBeInTheDocument();
  });
});
