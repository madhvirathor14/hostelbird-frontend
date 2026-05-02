import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { FilterProvider, useFilters } from '../fixes/fix3-filter-persistence/SearchFilterContext';

// Test component that uses the hook
const TestFilterComponent = () => {
  const { filters, updateFilter, toggleAmenity, resetFilters } = useFilters();

  return (
    <div>
      <span data-testid="price">{filters.priceMax}</span>
      <span data-testid="room">{filters.roomType}</span>
      <span data-testid="amenities">{filters.amenities.join(',')}</span>

      <input
        type="range"
        value={filters.priceMax}
        onChange={(e) => updateFilter('priceMax', Number(e.target.value))}
        data-testid="price-slider"
      />

      <button onClick={() => updateFilter('roomType', 'dorm')}>Select Dorm</button>
      <button onClick={() => updateFilter('roomType', 'private')}>Select Private</button>

      <button onClick={() => toggleAmenity('WiFi')}>Toggle WiFi</button>
      <button onClick={() => toggleAmenity('AC')}>Toggle AC</button>

      <button onClick={resetFilters}>Reset Filters</button>
    </div>
  );
};

describe('Fix 3: Search Filter Persistence', () => {
  beforeEach(() => {
    // Clear any mocked data before each test
  });

  it('should initialize with default filter values', () => {
    render(
      <FilterProvider>
        <TestFilterComponent />
      </FilterProvider>
    );

    expect(screen.getByTestId('price')).toHaveTextContent('2000');
    expect(screen.getByTestId('room')).toHaveTextContent('any');
    expect(screen.getByTestId('amenities')).toHaveTextContent('');
  });

  it('should update price filter', () => {
    render(
      <FilterProvider>
        <TestFilterComponent />
      </FilterProvider>
    );

    const priceSlider = screen.getByTestId('price-slider');
    fireEvent.change(priceSlider, { target: { value: '1500' } });

    expect(screen.getByTestId('price')).toHaveTextContent('1500');
  });

  it('should update room type filter', () => {
    render(
      <FilterProvider>
        <TestFilterComponent />
      </FilterProvider>
    );

    const dormBtn = screen.getByRole('button', { name: /select dorm/i });
    fireEvent.click(dormBtn);

    expect(screen.getByTestId('room')).toHaveTextContent('dorm');
  });

  it('should toggle amenity selection', () => {
    render(
      <FilterProvider>
        <TestFilterComponent />
      </FilterProvider>
    );

    const wifiBtn = screen.getByRole('button', { name: /toggle wifi/i });
    const acBtn = screen.getByRole('button', { name: /toggle ac/i });

    // Add WiFi
    fireEvent.click(wifiBtn);
    expect(screen.getByTestId('amenities')).toHaveTextContent('WiFi');

    // Add AC
    fireEvent.click(acBtn);
    expect(screen.getByTestId('amenities')).toHaveTextContent('WiFi,AC');

    // Remove WiFi
    fireEvent.click(wifiBtn);
    expect(screen.getByTestId('amenities')).toHaveTextContent('AC');
  });

  it('should remove amenity when toggled twice', () => {
    render(
      <FilterProvider>
        <TestFilterComponent />
      </FilterProvider>
    );

    const wifiBtn = screen.getByRole('button', { name: /toggle wifi/i });

    fireEvent.click(wifiBtn);
    expect(screen.getByTestId('amenities')).toHaveTextContent('WiFi');

    fireEvent.click(wifiBtn);
    expect(screen.getByTestId('amenities')).toHaveTextContent('');
  });

  it('should reset all filters to default', () => {
    render(
      <FilterProvider>
        <TestFilterComponent />
      </FilterProvider>
    );

    // Set custom filters
    const dormBtn = screen.getByRole('button', { name: /select dorm/i });
    const wifiBtn = screen.getByRole('button', { name: /toggle wifi/i });
    const priceSlider = screen.getByTestId('price-slider');

    fireEvent.change(priceSlider, { target: { value: '800' } });
    fireEvent.click(dormBtn);
    fireEvent.click(wifiBtn);

    expect(screen.getByTestId('price')).toHaveTextContent('800');
    expect(screen.getByTestId('room')).toHaveTextContent('dorm');
    expect(screen.getByTestId('amenities')).toHaveTextContent('WiFi');

    // Reset
    const resetBtn = screen.getByRole('button', { name: /reset filters/i });
    fireEvent.click(resetBtn);

    expect(screen.getByTestId('price')).toHaveTextContent('2000');
    expect(screen.getByTestId('room')).toHaveTextContent('any');
    expect(screen.getByTestId('amenities')).toHaveTextContent('');
  });

  it('should persist filters across multiple updates', () => {
    render(
      <FilterProvider>
        <TestFilterComponent />
      </FilterProvider>
    );

    const priceSlider = screen.getByTestId('price-slider');
    const dormBtn = screen.getByRole('button', { name: /select dorm/i });
    const wifiBtn = screen.getByRole('button', { name: /toggle wifi/i });

    // Update price
    fireEvent.change(priceSlider, { target: { value: '1000' } });
    expect(screen.getByTestId('price')).toHaveTextContent('1000');

    // Update room type
    fireEvent.click(dormBtn);
    // Previous price should still be there
    expect(screen.getByTestId('price')).toHaveTextContent('1000');
    expect(screen.getByTestId('room')).toHaveTextContent('dorm');

    // Add amenity
    fireEvent.click(wifiBtn);
    // Previous filters should persist
    expect(screen.getByTestId('price')).toHaveTextContent('1000');
    expect(screen.getByTestId('room')).toHaveTextContent('dorm');
    expect(screen.getByTestId('amenities')).toHaveTextContent('WiFi');
  });

  it('should throw error when useFilters is used outside FilterProvider', () => {
    const TestComponent = () => {
      try {
        useFilters();
        return <div>Should not reach here</div>;
      } catch (err) {
        return <div>Error: {err.message}</div>;
      }
    };

    render(<TestComponent />);
    expect(screen.getByText(/must be inside filterprovider/i)).toBeInTheDocument();
  });

  it('should maintain filter state when multiple amenities are toggled', () => {
    render(
      <FilterProvider>
        <TestFilterComponent />
      </FilterProvider>
    );

    const wifiBtn = screen.getByRole('button', { name: /toggle wifi/i });
    const acBtn = screen.getByRole('button', { name: /toggle ac/i });

    // Add both
    fireEvent.click(wifiBtn);
    fireEvent.click(acBtn);

    expect(screen.getByTestId('amenities')).toHaveTextContent('WiFi,AC');

    // Remove first
    fireEvent.click(wifiBtn);
    expect(screen.getByTestId('amenities')).toHaveTextContent('AC');

    // Add it back
    fireEvent.click(wifiBtn);
    expect(screen.getByTestId('amenities')).toHaveTextContent('AC,WiFi');
  });
});
