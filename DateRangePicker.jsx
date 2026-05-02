// Fix 1: Date Range Picker with Proper Validation
// Problem: Hostelbird allowed check-out date to be same or before check-in
// This causes silent failures in the booking flow

import React, { useState } from 'react';

const DateRangePicker = ({ onDatesSelected }) => {
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [error, setError] = useState('');

  // Get today's date in YYYY-MM-DD format for min attribute
  const today = new Date().toISOString().split('T')[0];

  const handleCheckInChange = (e) => {
    const selectedCheckIn = e.target.value;
    setCheckIn(selectedCheckIn);
    setError('');

    // If check-out is already selected and now becomes invalid, clear it
    if (checkOut && checkOut <= selectedCheckIn) {
      setCheckOut('');
    }
  };

  const handleCheckOutChange = (e) => {
    const selectedCheckOut = e.target.value;

    if (!checkIn) {
      setError('Please select a check-in date first.');
      return;
    }

    if (selectedCheckOut <= checkIn) {
      setError('Check-out must be at least 1 day after check-in.');
      setCheckOut('');
      return;
    }

    setError('');
    setCheckOut(selectedCheckOut);

    if (onDatesSelected) {
      onDatesSelected({ checkIn, checkOut: selectedCheckOut });
    }
  };

  // Minimum check-out = day after check-in
  const minCheckOut = checkIn
    ? new Date(new Date(checkIn).getTime() + 86400000).toISOString().split('T')[0]
    : today;

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>Select Your Stay Dates</h3>

      <div style={styles.row}>
        <div style={styles.field}>
          <label style={styles.label}>Check-in</label>
          <input
            type="date"
            value={checkIn}
            min={today}
            onChange={handleCheckInChange}
            style={styles.input}
          />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Check-out</label>
          <input
            type="date"
            value={checkOut}
            min={minCheckOut}
            onChange={handleCheckOutChange}
            disabled={!checkIn}
            style={{
              ...styles.input,
              opacity: !checkIn ? 0.5 : 1,
              cursor: !checkIn ? 'not-allowed' : 'pointer',
            }}
          />
        </div>
      </div>

      {/* Error shown clearly instead of silent failure */}
      {error && (
        <div style={styles.errorBox}>
          ⚠️ {error}
        </div>
      )}

      {/* Duration preview — helpful UX addition */}
      {checkIn && checkOut && (
        <div style={styles.durationBadge}>
          ✅ {Math.round(
            (new Date(checkOut) - new Date(checkIn)) / 86400000
          )} night stay selected
        </div>
      )}

      <button
        onClick={() => {
          if (!checkIn || !checkOut) {
            setError('Please select both check-in and check-out dates.');
            return;
          }
          alert(`Searching for ${checkIn} → ${checkOut}`);
        }}
        style={styles.button}
      >
        Search Hostels
      </button>
    </div>
  );
};

const styles = {
  container: {
    fontFamily: 'sans-serif',
    maxWidth: 400,
    margin: '30px auto',
    padding: 24,
    borderRadius: 12,
    boxShadow: '0 2px 16px rgba(0,0,0,0.1)',
    background: '#fff',
  },
  title: {
    marginBottom: 20,
    fontSize: 18,
    color: '#1a1a1a',
  },
  row: {
    display: 'flex',
    gap: 16,
  },
  field: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#555',
  },
  input: {
    padding: '10px 12px',
    borderRadius: 8,
    border: '1.5px solid #ddd',
    fontSize: 14,
    outline: 'none',
  },
  errorBox: {
    marginTop: 12,
    padding: '10px 14px',
    background: '#FFF3CD',
    border: '1px solid #FFCA28',
    borderRadius: 8,
    fontSize: 13,
    color: '#7A5800',
  },
  durationBadge: {
    marginTop: 12,
    padding: '8px 14px',
    background: '#E8F5E9',
    borderRadius: 8,
    fontSize: 13,
    color: '#2E7D32',
  },
  button: {
    marginTop: 20,
    width: '100%',
    padding: '12px',
    background: '#FF5722',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    fontSize: 15,
    fontWeight: '600',
    cursor: 'pointer',
  },
};

export default DateRangePicker;
