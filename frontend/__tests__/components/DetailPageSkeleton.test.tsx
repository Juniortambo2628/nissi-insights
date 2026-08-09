import '@testing-library/jest-dom';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { DetailPageSkeleton } from '@/components/ui/DetailPageSkeleton';

describe('DetailPageSkeleton', () => {
  it('renders loading skeleton', () => {
    render(<DetailPageSkeleton />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders custom message', () => {
    render(<DetailPageSkeleton message="Please wait..." />);
    expect(screen.getByText('Please wait...')).toBeInTheDocument();
  });

  it('renders content rows', () => {
    const { container } = render(<DetailPageSkeleton contentRows={2} />);
    expect(container.querySelector('.animate-pulse')).toBeTruthy();
  });
});
