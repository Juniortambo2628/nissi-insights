import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CategoryFilter from '@/components/CategoryFilter';

describe('CategoryFilter', () => {
  const categories = ['All', 'Energy', 'Technology', 'Finance'];
  const defaultProps = {
    categories,
    activeCategory: 'All',
    onChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all categories', () => {
    render(<CategoryFilter {...defaultProps} />);
    categories.forEach(cat => {
      expect(screen.getByText(cat)).toBeInTheDocument();
    });
  });

  it('calls onChange when a category is clicked', () => {
    render(<CategoryFilter {...defaultProps} />);
    fireEvent.click(screen.getByText('Energy'));
    expect(defaultProps.onChange).toHaveBeenCalledWith('Energy');
  });

  it('highlights the active category', () => {
    render(<CategoryFilter {...defaultProps} activeCategory="Energy" />);
    const energyButton = screen.getByText('Energy');
    expect(energyButton.closest('button')).toHaveClass('bg-primary');
  });

  it('renders with empty categories', () => {
    render(<CategoryFilter {...defaultProps} categories={[]} />);
    expect(screen.queryByRole('button')).toBeNull();
  });
});
