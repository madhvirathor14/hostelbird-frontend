// Fix 3: Search Filter Persistence
// Problem: Filters (price range, amenities etc) reset when user navigates
//          from hostel detail page back to search results.
// Fix: Store filter state in a React Context so it survives navigation.

import React, { createContext, useContext, useState } from 'react';

// Default filter state
const defaultFilters = {
  priceMin: 0,
  priceMax: 2000,
  amenities: [],     // e.g. ['WiFi', 'AC', 'Locker']
  sortBy: 'price',   // 'price' | 'rating' | 'distance'
  roomType: 'any',   // 'any' | 'dorm' | 'private'
};

const FilterContext = createContext(null);

// Provider — wrap your app/navigator with this
export const FilterProvider = ({ children }) => {
  const [filters, setFilters] = useState(defaultFilters);

  const updateFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const toggleAmenity = (amenity) => {
    setFilters((prev) => {
      const exists = prev.amenities.includes(amenity);
      return {
        ...prev,
        amenities: exists
          ? prev.amenities.filter((a) => a !== amenity)
          : [...prev.amenities, amenity],
      };
    });
  };

  const resetFilters = () => setFilters(defaultFilters);

  return (
    <FilterContext.Provider value={{ filters, updateFilter, toggleAmenity, resetFilters }}>
      {children}
    </FilterContext.Provider>
  );
};

// Hook for easy access
export const useFilters = () => {
  const ctx = useContext(FilterContext);
  if (!ctx) throw new Error('useFilters must be inside FilterProvider');
  return ctx;
};

// --- Demo: Search Filter Panel UI ---
const AMENITIES = ['WiFi', 'AC', 'Locker', 'Hot Water', 'Breakfast', 'Parking'];

export const SearchFilterPanel = () => {
  const { filters, updateFilter, toggleAmenity, resetFilters } = useFilters();

  return (
    <div style={styles.panel}>
      <div style={styles.header}>
        <span style={styles.title}>Filters</span>
        <button style={styles.resetBtn} onClick={resetFilters}>Reset All</button>
      </div>

      {/* Price Range */}
      <div style={styles.section}>
        <label style={styles.label}>
          Price Range: ₹{filters.priceMin} – ₹{filters.priceMax}
        </label>
        <input
          type="range"
          min={0}
          max={5000}
          value={filters.priceMax}
          onChange={(e) => updateFilter('priceMax', Number(e.target.value))}
          style={styles.slider}
        />
      </div>

      {/* Room Type */}
      <div style={styles.section}>
        <label style={styles.label}>Room Type</label>
        <div style={styles.chipRow}>
          {['any', 'dorm', 'private'].map((type) => (
            <button
              key={type}
              style={{
                ...styles.chip,
                background: filters.roomType === type ? '#FF5722' : '#f0f0f0',
                color: filters.roomType === type ? '#fff' : '#333',
              }}
              onClick={() => updateFilter('roomType', type)}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Amenities */}
      <div style={styles.section}>
        <label style={styles.label}>Amenities</label>
        <div style={styles.chipRow}>
          {AMENITIES.map((a) => (
            <button
              key={a}
              style={{
                ...styles.chip,
                background: filters.amenities.includes(a) ? '#FF5722' : '#f0f0f0',
                color: filters.amenities.includes(a) ? '#fff' : '#333',
              }}
              onClick={() => toggleAmenity(a)}
            >
              {a}
            </button>
          ))}
        </div>
      </div>

      {/* Active filter summary — so user always knows what's applied */}
      <div style={styles.summary}>
        <strong>Active:</strong> ₹0–₹{filters.priceMax} · {filters.roomType} ·{' '}
        {filters.amenities.length > 0 ? filters.amenities.join(', ') : 'No amenities'}
      </div>
    </div>
  );
};

// Wrap app like this:
// <FilterProvider><App /></FilterProvider>

const styles = {
  panel: {
    fontFamily: 'sans-serif',
    maxWidth: 380,
    margin: '20px auto',
    padding: 20,
    borderRadius: 12,
    boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
    background: '#fff',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: { fontSize: 17, fontWeight: '700', color: '#1a1a1a' },
  resetBtn: {
    background: 'none',
    border: '1px solid #ccc',
    borderRadius: 6,
    padding: '4px 10px',
    fontSize: 12,
    cursor: 'pointer',
    color: '#666',
  },
  section: { marginBottom: 18 },
  label: { display: 'block', fontSize: 13, fontWeight: '600', color: '#555', marginBottom: 8 },
  slider: { width: '100%' },
  chipRow: { display: 'flex', flexWrap: 'wrap', gap: 8 },
  chip: {
    padding: '6px 14px',
    borderRadius: 20,
    border: 'none',
    fontSize: 13,
    cursor: 'pointer',
    fontWeight: '500',
  },
  summary: {
    marginTop: 12,
    padding: '10px 14px',
    background: '#FFF3E0',
    borderRadius: 8,
    fontSize: 12,
    color: '#E65100',
  },
};
