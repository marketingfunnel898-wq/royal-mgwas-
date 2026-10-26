import React, { useState } from 'react';
import { formatWhatsAppUrl, submitBooking } from '../data';
import { useHotelData } from '../context/HotelDataContext';

const WhatsAppIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.79.47 3.46 1.29 4.9L2 22l5.31-1.39a9.87 9.87 0 0 0 4.73 1.2h.01c5.46 0 9.9-4.45 9.9-9.9C21.96 6.45 17.5 2 12.04 2Zm5.8 14.06c-.24.68-1.4 1.3-1.93 1.38-.5.08-1.12.11-1.8-.11-.42-.13-.96-.31-1.65-.6-2.9-1.25-4.79-4.17-4.94-4.36-.14-.2-1.18-1.57-1.18-3 0-1.42.75-2.12 1.02-2.41.26-.28.57-.35.76-.35h.55c.18 0 .42-.07.65.5.24.58.82 2 .89 2.14.07.14.12.31.02.5-.09.19-.14.31-.28.48-.14.16-.29.36-.42.48-.14.13-.28.28-.12.55.16.28.71 1.17 1.53 1.9 1.05.94 1.94 1.23 2.21 1.37.28.14.44.12.6-.07.16-.19.68-.79.86-1.06.19-.28.37-.23.62-.14.26.09 1.64.77 1.92.91.28.14.44.12.6-.07.16-.19.68-.79.86-1.06Z" />
  </svg>
);

export const MobileBookView: React.FC = () => {
  const { rooms, user, memberProfile } = useHotelData();
  const [guestName, setGuestName] = useState(
    memberProfile?.full_name || user?.user_metadata?.full_name || ''
  );
  const [guestPhone, setGuestPhone] = useState(memberProfile?.phone || '');
  const [selectedRoom, setSelectedRoom] = useState(rooms[0]?.name || 'Junior Suite');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guestCount, setGuestCount] = useState('2 Guests');
  const [specialRequests, setSpecialRequests] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [dbError, setDbError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dateError, setDateError] = useState<string | null>(null);

  const todayStr = new Date().toISOString().split('T')[0];

  const getMinCheckOut = (inDate: string) => {
    if (!inDate) return todayStr;
    const d = new Date(inDate);
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  };

  const clearSubmissionState = () => {
    if (submitted) {
      setSubmitted(false);
      setDbError(false);
    }
  };

  const handleCheckInChange = (val: string) => {
    clearSubmissionState();
    setCheckIn(val);
    if (checkOut && val && checkOut <= val) {
      setDateError('Check-out date must be after check-in date.');
    } else {
      setDateError(null);
    }
  };

  const handleCheckOutChange = (val: string) => {
    clearSubmissionState();
    setCheckOut(val);
    if (checkIn && val && val <= checkIn) {
      setDateError('Check-out date must be after check-in date.');
    } else {
      setDateError(null);
    }
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (checkIn && checkOut && checkOut <= checkIn) {
      setDateError('Check-out date must be after check-in date.');
      return;
    }
    setDateError(null);

    setIsSubmitting(true);
    let dbSaveOk = false;

    // Identify matching room for DB row
    const matchedRoom = rooms.find((r) => r.name === selectedRoom) || rooms[0];
    const roomId = matchedRoom?.id || rooms[0]?.id;

    // Dual-write: 1. Persist to Supabase
    try {
      if (roomId) {
        const res = await submitBooking({
          guest_name: guestName,
          guest_phone: guestPhone,
          room_id: roomId,
          check_in: checkIn,
          check_out: checkOut,
          guest_count_label: guestCount,
          special_requests: specialRequests || undefined,
          member_id: user?.id ?? null,
        });
        dbSaveOk = Boolean(res?.success);
      }
    } catch (err) {
      console.warn('Supabase booking record notice:', err);
      dbSaveOk = false;
    }

    // Dual-write: 2. Always open WhatsApp confirmation link
    const messageLines = [
      "Hello ROYAL MGWASI HOTEL, I'd like to reserve a room.",
      `Guest Name: ${guestName || 'Not specified'}`,
      `Contact Phone: ${guestPhone || 'Not specified'}`,
      `Room Type: ${selectedRoom}`,
      `Check-In Date: ${checkIn || 'TBD'}`,
      `Check-Out Date: ${checkOut || 'TBD'}`,
      `Guests: ${guestCount}`,
    ];

    if (specialRequests.trim()) {
      messageLines.push(`Special Requests: ${specialRequests.trim()}`);
    }

    messageLines.push('\nPlease confirm availability and payment details.');

    const finalUrl = formatWhatsAppUrl(messageLines.join('\n'));
    window.open(finalUrl, '_blank');

    setIsSubmitting(false);
    setSubmitted(true);
    setDbError(!dbSaveOk);
  };

  return (
    <div className="mh">
      {/* Header */}
      <div className="mh-head">
        <h1>Book Your Stay</h1>
        <p className="mh-sub">
          Instant 15-minute response on WhatsApp. Free hot breakfast &amp; Wi-Fi included.
        </p>
      </div>

      <div style={{ padding: '0 20px' }}>
        {/* Single Booking Card Form */}
        <div className="mh-form">
          <h3>Reservation Details</h3>
          <p>Complete the form below to check availability directly on WhatsApp.</p>

          <form onSubmit={handleBookingSubmit}>
            <div className="mh-field">
              <label htmlFor="bk-name">Guest Full Name *</label>
              <input
                id="bk-name"
                type="text"
                required
                placeholder="e.g. John Mwasambili"
                value={guestName}
                onChange={(e) => {
                  clearSubmissionState();
                  setGuestName(e.target.value);
                }}
              />
            </div>

            <div className="mh-field">
              <label htmlFor="bk-phone">WhatsApp / Phone *</label>
              <input
                id="bk-phone"
                type="tel"
                required
                placeholder="+255 762 555 557"
                value={guestPhone}
                onChange={(e) => {
                  clearSubmissionState();
                  setGuestPhone(e.target.value);
                }}
              />
            </div>

            <div className="mh-field">
              <label htmlFor="bk-room">Select Room Type *</label>
              <select
                id="bk-room"
                value={selectedRoom}
                onChange={(e) => {
                  clearSubmissionState();
                  setSelectedRoom(e.target.value);
                }}
              >
                {rooms.map((rm) => (
                  <option key={rm.id} value={rm.name}>
                    {rm.name} ({rm.capacity}) — {rm.tags[0] || rm.category}
                  </option>
                ))}
                <option value="Any available room">Any Available Room</option>
              </select>
            </div>

            <div className="mh-field">
              <label htmlFor="bk-checkin">Check-In Date *</label>
              <input
                id="bk-checkin"
                type="date"
                required
                min={todayStr}
                value={checkIn}
                onChange={(e) => handleCheckInChange(e.target.value)}
              />
            </div>

            <div className="mh-field">
              <label htmlFor="bk-checkout">Check-Out Date *</label>
              <input
                id="bk-checkout"
                type="date"
                required
                min={getMinCheckOut(checkIn)}
                value={checkOut}
                onChange={(e) => handleCheckOutChange(e.target.value)}
              />
            </div>

            {dateError && (
              <p style={{ color: '#b91c1c', fontSize: 13, fontWeight: 600, margin: '-6px 0 12px' }}>
                {dateError}
              </p>
            )}

            <div className="mh-field">
              <label htmlFor="bk-guests">Number of Guests</label>
              <select
                id="bk-guests"
                value={guestCount}
                onChange={(e) => {
                  clearSubmissionState();
                  setGuestCount(e.target.value);
                }}
              >
                <option value="1 Adult">1 Adult</option>
                <option value="2 Guests">2 Guests (1 King/Queen or Twin)</option>
                <option value="3 Guests">3 Guests (Family / Triple)</option>
                <option value="4+ Family Group">4+ Family Group</option>
              </select>
            </div>

            <div className="mh-field">
              <label htmlFor="bk-notes">Special Requests or Arrival Time</label>
              <textarea
                id="bk-notes"
                rows={3}
                placeholder="e.g. Late check-in at 10 PM, ground floor room, or airport shuttle..."
                value={specialRequests}
                onChange={(e) => {
                  clearSubmissionState();
                  setSpecialRequests(e.target.value);
                }}
              />
            </div>

            {submitted && !dbError && (
              <div
                style={{
                  background: 'rgba(30,60,45,0.08)',
                  color: 'var(--mh-green)',
                  padding: '12px 14px',
                  borderRadius: 12,
                  fontSize: 14,
                  fontWeight: 600,
                  marginBottom: 14,
                }}
              >
                Opening WhatsApp to send your reservation request directly to reception...
              </div>
            )}

            {submitted && dbError && (
              <div
                style={{
                  background: '#fef3c7',
                  color: '#92400e',
                  padding: '12px 14px',
                  borderRadius: 12,
                  fontSize: 13,
                  lineHeight: 1.45,
                  marginBottom: 14,
                }}
              >
                We opened WhatsApp with your booking details. If WhatsApp did not open, please call or message us directly at +255 762 555 557.
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting || Boolean(dateError)}
              className="mh-btn mh-btn--wa mh-btn--block"
              style={{ minHeight: 52, opacity: isSubmitting || dateError ? 0.75 : 1 }}
            >
              <WhatsAppIcon />
              {isSubmitting ? 'Opening WhatsApp...' : 'Send Booking Request on WhatsApp'}
            </button>

            <p style={{ fontSize: 13, color: 'var(--mh-mute)', textAlign: 'center', marginTop: 12 }}>
              ⚡ 15-min response &middot; Deposit via M-Pesa / Tigo Pesa / Card &middot; Free cancellation
            </p>
          </form>
        </div>

        {/* Booking Benefits Chips */}
        <div className="mh-note" style={{ margin: '20px 0 0' }}>
          <h3>Direct Booking Promises</h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: '10px 0 0', display: 'flex', flexDirection: 'column', gap: 8, fontSize: 14 }}>
            <li>✓ Best rate guaranteed — lowest nightly price direct</li>
            <li>✓ Free daily breakfast for all room guests</li>
            <li>✓ M-Pesa, Tigo Pesa, Airtel Money, Visa &amp; cash accepted</li>
            <li>✓ 24-hour front desk &amp; secure parking</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
