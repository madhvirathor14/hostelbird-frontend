// Fix 4: Booking Confirmation Screen
// Problem: After completing payment, there's no proper confirmation screen.
//          Users don't see a booking ID or clear next-steps, causing anxiety
//          and duplicate booking attempts.

import React from 'react';

// Simulate what the booking object looks like after API success
const mockBookingData = {
  bookingId: 'HB-2026-48291',
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

const formatDate = (dateStr) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
};

const BookingConfirmation = ({ booking = mockBookingData }) => {
  return (
    <div style={styles.page}>
      {/* Success Header */}
      <div style={styles.successBanner}>
        <div style={styles.checkIcon}>✓</div>
        <h1 style={styles.successTitle}>Booking Confirmed!</h1>
        <p style={styles.successSub}>
          Your spot is reserved. Get ready for the trip!
        </p>
      </div>

      {/* Booking ID — most important, shown prominently */}
      <div style={styles.bookingIdBox}>
        <span style={styles.bookingIdLabel}>Booking ID</span>
        <span style={styles.bookingIdValue}>{booking.bookingId}</span>
        <span style={styles.bookingIdHint}>Save this for check-in</span>
      </div>

      {/* Hostel Details Card */}
      <div style={styles.card}>
        <div style={styles.cardHeader}>📍 Hostel Details</div>
        <div style={styles.row}>
          <span style={styles.key}>Hostel</span>
          <span style={styles.val}>{booking.hostelName}</span>
        </div>
        <div style={styles.row}>
          <span style={styles.key}>Location</span>
          <span style={styles.val}>{booking.location}</span>
        </div>
        <div style={styles.row}>
          <span style={styles.key}>Room Type</span>
          <span style={styles.val}>{booking.roomType}</span>
        </div>
      </div>

      {/* Dates Card */}
      <div style={styles.card}>
        <div style={styles.cardHeader}>📅 Stay Dates</div>
        <div style={styles.datesRow}>
          <div style={styles.dateBox}>
            <span style={styles.dateLabel}>Check-in</span>
            <span style={styles.dateVal}>{formatDate(booking.checkIn)}</span>
            <span style={styles.dateNote}>From 12:00 PM</span>
          </div>
          <div style={styles.arrow}>→</div>
          <div style={styles.dateBox}>
            <span style={styles.dateLabel}>Check-out</span>
            <span style={styles.dateVal}>{formatDate(booking.checkOut)}</span>
            <span style={styles.dateNote}>Before 11:00 AM</span>
          </div>
        </div>
        <div style={styles.nightsBadge}>{booking.nights} Nights</div>
      </div>

      {/* Payment Card */}
      <div style={styles.card}>
        <div style={styles.cardHeader}>💳 Payment</div>
        <div style={styles.row}>
          <span style={styles.key}>Amount Paid</span>
          <span style={{ ...styles.val, fontWeight: '700', color: '#2E7D32' }}>
            ₹{booking.totalPaid}
          </span>
        </div>
        <div style={styles.row}>
          <span style={styles.key}>Via</span>
          <span style={styles.val}>{booking.paymentMethod}</span>
        </div>
      </div>

      {/* Next Steps */}
      <div style={styles.nextSteps}>
        <div style={styles.cardHeader}>🗺️ What's Next</div>
        <ul style={styles.stepsList}>
          <li>You'll receive a confirmation SMS & email shortly</li>
          <li>Show your Booking ID at the hostel reception</li>
          <li>Carry a valid government ID for check-in</li>
          <li>Contact the hostel directly for early check-in requests</li>
        </ul>
      </div>

      {/* Action Buttons */}
      <div style={styles.actions}>
        <button style={styles.primaryBtn}>View My Bookings</button>
        <button style={styles.secondaryBtn}>Explore Things To Do</button>
      </div>
    </div>
  );
};

export default BookingConfirmation;

const styles = {
  page: {
    fontFamily: 'sans-serif',
    maxWidth: 420,
    margin: '0 auto',
    padding: '0 0 40px 0',
    background: '#F9F9F9',
    minHeight: '100vh',
  },
  successBanner: {
    background: 'linear-gradient(135deg, #FF5722, #FF8A65)',
    padding: '40px 24px 32px',
    textAlign: 'center',
    color: '#fff',
  },
  checkIcon: {
    width: 60,
    height: 60,
    background: 'rgba(255,255,255,0.25)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 28,
    margin: '0 auto 16px',
    lineHeight: '60px',
    textAlign: 'center',
  },
  successTitle: { margin: '0 0 8px', fontSize: 24, fontWeight: '700' },
  successSub: { margin: 0, fontSize: 14, opacity: 0.9 },
  bookingIdBox: {
    margin: '16px',
    padding: '16px',
    background: '#fff',
    borderRadius: 12,
    textAlign: 'center',
    border: '2px dashed #FF5722',
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
  },
  bookingIdLabel: { fontSize: 11, color: '#999', textTransform: 'uppercase', letterSpacing: 1 },
  bookingIdValue: { fontSize: 22, fontWeight: '800', color: '#FF5722', letterSpacing: 2 },
  bookingIdHint: { fontSize: 12, color: '#aaa' },
  card: {
    margin: '0 16px 12px',
    padding: 16,
    background: '#fff',
    borderRadius: 12,
    boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
  },
  cardHeader: {
    fontSize: 13,
    fontWeight: '700',
    color: '#555',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  row: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: 8,
    fontSize: 14,
  },
  key: { color: '#888' },
  val: { color: '#1a1a1a', fontWeight: '500', textAlign: 'right', maxWidth: '60%' },
  datesRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  dateBox: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 },
  dateLabel: { fontSize: 11, color: '#999', textTransform: 'uppercase' },
  dateVal: { fontSize: 15, fontWeight: '700', color: '#1a1a1a' },
  dateNote: { fontSize: 11, color: '#aaa' },
  arrow: { fontSize: 20, color: '#ccc' },
  nightsBadge: {
    textAlign: 'center',
    fontSize: 12,
    color: '#FF5722',
    fontWeight: '600',
    background: '#FFF3E0',
    padding: '4px 12px',
    borderRadius: 20,
    display: 'inline-block',
    marginTop: 4,
  },
  nextSteps: {
    margin: '0 16px 12px',
    padding: 16,
    background: '#E8F5E9',
    borderRadius: 12,
  },
  stepsList: {
    margin: 0,
    paddingLeft: 18,
    fontSize: 13,
    color: '#2E7D32',
    lineHeight: 2,
  },
  actions: {
    margin: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  primaryBtn: {
    padding: '14px',
    background: '#FF5722',
    color: '#fff',
    border: 'none',
    borderRadius: 10,
    fontSize: 15,
    fontWeight: '600',
    cursor: 'pointer',
  },
  secondaryBtn: {
    padding: '14px',
    background: '#fff',
    color: '#FF5722',
    border: '1.5px solid #FF5722',
    borderRadius: 10,
    fontSize: 15,
    fontWeight: '600',
    cursor: 'pointer',
  },
};
