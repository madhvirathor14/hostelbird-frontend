import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import DateRangePicker from '../fixes/fix1-date-validation/DateRangePicker';

describe('Fix 1: Date Range Picker Validation', () => {
  let component;

  beforeEach(() => {
    component = render(<DateRangePicker />);
  });

  it('should render check-in and check-out inputs', () => {
    expect(screen.getByLabelText(/check-in/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/check-out/i)).toBeInTheDocument();
  });

  it('should disable check-out input until check-in is selected', () => {
    const checkOutInput = screen.getByLabelText(/check-out/i);
    expect(checkOutInput).toBeDisabled();
  });

  it('should enable check-out input when check-in is selected', () => {
    const checkInInput = screen.getByLabelText(/check-in/i);
    const checkOutInput = screen.getByLabelText(/check-out/i);

    fireEvent.change(checkInInput, { target: { value: '2026-05-10' } });
    expect(checkOutInput).not.toBeDisabled();
  });

  it('should show error when check-out is before check-in', () => {
    const checkInInput = screen.getByLabelText(/check-in/i);
    const checkOutInput = screen.getByLabelText(/check-out/i);

    fireEvent.change(checkInInput, { target: { value: '2026-05-15' } });
    fireEvent.change(checkOutInput, { target: { value: '2026-05-14' } });

    expect(screen.getByText(/must be at least 1 day after/i)).toBeInTheDocument();
  });

  it('should show error when check-out equals check-in', () => {
    const checkInInput = screen.getByLabelText(/check-in/i);
    const checkOutInput = screen.getByLabelText(/check-out/i);

    fireEvent.change(checkInInput, { target: { value: '2026-05-15' } });
    fireEvent.change(checkOutInput, { target: { value: '2026-05-15' } });

    expect(screen.getByText(/must be at least 1 day after/i)).toBeInTheDocument();
  });

  it('should accept valid date ranges', () => {
    const checkInInput = screen.getByLabelText(/check-in/i);
    const checkOutInput = screen.getByLabelText(/check-out/i);

    fireEvent.change(checkInInput, { target: { value: '2026-05-10' } });
    fireEvent.change(checkOutInput, { target: { value: '2026-05-13' } });

    expect(screen.getByText(/3 night stay selected/i)).toBeInTheDocument();
  });

  it('should clear check-out when check-in is changed to make it invalid', () => {
    const checkInInput = screen.getByLabelText(/check-in/i);
    const checkOutInput = screen.getByLabelText(/check-out/i);

    // Set valid dates
    fireEvent.change(checkInInput, { target: { value: '2026-05-10' } });
    fireEvent.change(checkOutInput, { target: { value: '2026-05-13' } });

    // Change check-in to a later date
    fireEvent.change(checkInInput, { target: { value: '2026-05-20' } });

    // Check-out should be cleared
    expect(checkOutInput.value).toBe('');
  });

  it('should prevent form submission with invalid dates', () => {
    const checkInInput = screen.getByLabelText(/check-in/i);
    const searchBtn = screen.getByText(/search hostels/i);

    fireEvent.change(checkInInput, { target: { value: '2026-05-10' } });
    fireEvent.click(searchBtn);

    // Should show error (check-out not selected)
    expect(screen.getByText(/please select both/i)).toBeInTheDocument();
  });

  it('should set correct minimum date for check-out', () => {
    const checkInInput = screen.getByLabelText(/check-in/i);
    const checkOutInput = screen.getByLabelText(/check-out/i);

    const checkInDate = '2026-05-15';
    const expectedMinCheckOut = '2026-05-16';

    fireEvent.change(checkInInput, { target: { value: checkInDate } });

    // The min attribute should be set correctly
    expect(checkOutInput.min).toBe(expectedMinCheckOut);
  });
});
