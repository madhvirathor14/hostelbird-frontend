# Hostelbird Hackathon Submission
**Participant:** [Tera Naam]  
**Date:** April 30, 2026  
**GitHub Repo:** [Link]

---

## Summary

While exploring the Hostelbird app as a traveler planning a solo trip to Rishikesh, I ran into 4 issues that directly hurt the booking experience. These aren't cosmetic problems — each one either stops a user from completing a booking or leaves them confused mid-flow.

---

## Bug 1 — Date Picker Allows Invalid Date Selection

**What I found:**  
On the search screen, you can set a check-out date that's before or same as the check-in date. No error shows up. You move forward and either get wrong results or a broken booking state.

**Why it matters:**  
This is a direct conversion killer. A user picks wrong dates accidentally, sees weird results, assumes the app is broken, and leaves. I've personally seen this kind of silent failure cause major drop-off in booking funnels.

**Fix:** Client-side date validation with a clear error message.

📁 `fixes/fix1-date-validation/DateRangePicker.jsx`

---

## Bug 2 — App Shows Blank Screen on No Internet (No Error State)

**What I found:**  
When you open the app with mobile data off, the home screen just shows a loading spinner that never resolves. No message, no retry button, nothing. Users think the app crashed.

**Why it matters:**  
Budget travelers often have patchy internet — trains, hills, rural areas. This is exactly Hostelbird's target audience. A blank screen will cause uninstalls.

**Fix:** Network-aware wrapper with a friendly offline screen and retry button.

📁 `fixes/fix2-offline-screen/OfflineWrapper.jsx`

---

## Bug 3 — Search Filters Reset When Navigating Back

**What I found:**  
I searched "Goa", applied filters (price range ₹300-₹700, AC, WiFi), clicked on a hostel to see details, hit back — all my filters were gone. Had to redo everything.

**Why it matters:**  
This kills the browsing experience. Users compare multiple hostels before booking. Losing filter state every time = frustration = app close.

**Fix:** Persist filter state using a simple context/store so it survives navigation.

📁 `fixes/fix3-filter-persistence/SearchFilterContext.jsx`

---

## Bug 4 — No Booking Confirmation Screen After Payment

**What I found:**  
After completing a booking (test flow), there's no clear confirmation page. No booking ID shown prominently, no "what happens next" message. Users are left wondering if their booking actually went through.

**Why it matters:**  
This creates anxiety and leads to duplicate bookings or support calls. Every OTA — MakeMyTrip, Goibibo — shows a big green "Booking Confirmed" screen. It's a trust signal.

**Fix:** A proper booking confirmation screen with booking ID, hostel details, and next steps.

📁 `fixes/fix4-booking-confirmation/BookingConfirmation.jsx`

---

## How to Run

```bash
cd fixes
npm install
npm run dev
```

Each fix is a standalone React component with mock data so it can be previewed without the actual app backend.
