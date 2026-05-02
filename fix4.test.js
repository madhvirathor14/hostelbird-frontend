import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import BookingConfirmation from '../fixes/fix4-booking-confirmation/BookingConfirmation';

const mockBooking = {
  bookingId: 'HB-2026-12345',
  hostelName: 'Rishikesh Backpackers Den',
  location: 'Tapovan, Rishikesh, Uttarakhand',
  checkIn: '2026-05-10',
  checkOut: '2026-05-13',
  nights: 3,
  roomType: 'Mixed Dorm (6-bed)',
  guestName: 'Rahul Sharma',
  totalPaid: 1350,
  paymentMethod: 'UPI',
};

describe('Fix 4: Booking Confirmation Screen', () => {
  it('should render success banner', () => {
    render(<BookingConfirmation booking={mockBooking} />);

    expect(screen.getByText(/booking confirmed/i)).toBeInTheDocument();
    expect(screen.getByText(/your spot is reserved/i)).toBeInTheDocument();
  });

  it('should display booking ID prominently', () => {
    render(<BookingConfirmation booking={mockBooking} />);

    expect(screen.getByText('HB-2026-12345')).toBeInTheDocument();
    expect(screen.getByText(/save this for check-in/i)).toBeInTheDocument();
  });

  it('should display hostel name', () => {
    render(<BookingConfirmation booking={mockBooking} />);

    expect(screen.getByText('Rishikesh Backpackers Den')).toBeInTheDocument();
  });

  it('should display hostel location', () => {
    render(<BookingConfirmation booking={mockBooking} />);

    expect(screen.getByText('Tapovan, Rishikesh, Uttarakhand')).toBeInTheDocument();
  });

  it('should display room type', () => {
    render(<BookingConfirmation booking={mockBooking} />);

    expect(screen.getByText('Mixed Dorm (6-bed)')).toBeInTheDocument();
  });

  it('should display formatted check-in date', () => {
    render(<BookingConfirmation booking={mockBooking} />);

    expect(screen.getByText('10 May 2026')).toBeInTheDocument();
  });

  it('should display formatted check-out date', () => {
    render(<BookingConfirmation booking={mockBooking} />);

    expect(screen.getByText('13 May 2026')).toBeInTheDocument();
  });

  it('should display total amount paid', () => {
    render(<BookingConfirmation booking={mockBooking} />);

    expect(screen.getByText('₹1350')).toBeInTheDocument();
  });

  it('should display payment method', () => {
    render(<BookingConfirmation booking={mockBooking} />);

    expect(screen.getByText('UPI')).toBeInTheDocument();
  });

  it('should display number of nights', () => {
    render(<BookingConfirmation booking={mockBooking} />);

    expect(screen.getByText('3 Nights')).toBeInTheDocument();
  });

  it('should display next steps checklist', () => {
    render(<BookingConfirmation booking={mockBooking} />);

    expect(screen.getByText(/confirmation sms & email sent shortly/i)).toBeInTheDocument();
    expect(screen.getByText(/show booking id at hostel check-in/i)).toBeInTheDocument();
    expect(screen.getByText(/carry a valid govt. id/i)).toBeInTheDocument();
    expect(screen.getByText(/contact hostel for early check-in/i)).toBeInTheDocument();
  });

  it('should display action buttons', () => {
    render(<BookingConfirmation booking={mockBooking} />);

    expect(screen.getByRole('button', { name: /view my bookings/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /explore things to do/i })).toBeInTheDocument();
  });

  it('should display all hostel detail sections', () => {
    render(<BookingConfirmation booking={mockBooking} />);

    // Check for section headers
    expect(screen.getByText(/hostel details/i)).toBeInTheDocument();
    expect(screen.getByText(/stay dates/i)).toBeInTheDocument();
    expect(screen.getByText(/payment/i)).toBeInTheDocument();
    expect(screen.getByText(/what's next/i)).toBeInTheDocument();
  });

  it('should render with default mock data if no booking prop provided', () => {
    render(<BookingConfirmation />);

    expect(screen.getByText(/booking confirmed/i)).toBeInTheDocument();
    expect(screen.getByText('HB-2026-48291')).toBeInTheDocument(); // Default mock ID
  });

  it('should format dates correctly for different months', () => {
    const differentMonthBooking = {
      ...mockBooking,
      checkIn: '2026-12-25',
      checkOut: '2026-12-28',
    };

    render(<BookingConfirmation booking={differentMonthBooking} />);

    expect(screen.getByText('25 Dec 2026')).toBeInTheDocument();
    expect(screen.getByText('28 Dec 2026')).toBeInTheDocument();
  });

  it('should handle long hostel names', () => {
    const longNameBooking = {
      ...mockBooking,
      hostelName: 'The Ultimate Adventure Hostel with Very Long Name for Testing',
    };

    render(<BookingConfirmation booking={longNameBooking} />);

    expect(
      screen.getByText('The Ultimate Adventure Hostel with Very Long Name for Testing')
    ).toBeInTheDocument();
  });

  it('should display success icon', () => {
    render(<BookingConfirmation booking={mockBooking} />);

    const checkIcon = screen.getByText('✓');
    expect(checkIcon).toBeInTheDocument();
  });

  it('should have proper semantic structure for accessibility', () => {
    render(<BookingConfirmation booking={mockBooking} />);

    // Check for heading hierarchy
    const h1 = screen.getByRole('heading', { level: 1 });
    expect(h1).toBeInTheDocument();
  });

  it('should display confirmation for different room types', () => {
    const privateRoomBooking = {
      ...mockBooking,
      roomType: 'Private Double Room',
    };

    render(<BookingConfirmation booking={privateRoomBooking} />);

    expect(screen.getByText('Private Double Room')).toBeInTheDocument();
  });

  it('should handle edge case with maximum price', () => {
    const expensiveBooking = {
      ...mockBooking,
      totalPaid: 99999,
    };

    render(<BookingConfirmation booking={expensiveBooking} />);

    expect(screen.getByText('₹99999')).toBeInTheDocument();
  });

  it('should display check-in and check-out times in next steps', () => {
    render(<BookingConfirmation booking={mockBooking} />);

    expect(screen.getByText(/from 12:00 pm/i)).toBeInTheDocument();
    expect(screen.getByText(/before 11:00 am/i)).toBeInTheDocument();
  });
});
