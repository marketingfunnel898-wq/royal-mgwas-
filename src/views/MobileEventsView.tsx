import React, { useState, useMemo } from 'react';
import { formatWhatsAppUrl, submitEventInquiry } from '../data';
import { useHotelData } from '../context/HotelDataContext';

const WhatsAppIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.79.47 3.46 1.29 4.9L2 22l5.31-1.39a9.87 9.87 0 0 0 4.73 1.2h.01c5.46 0 9.9-4.45 9.9-9.9C21.96 6.45 17.5 2 12.04 2Zm5.8 14.06c-.24.68-1.4 1.3-1.93 1.38-.5.08-1.12.11-1.8-.11-.42-.13-.96-.31-1.65-.6-2.9-1.25-4.79-4.17-4.94-4.36-.14-.2-1.18-1.57-1.18-3 0-1.42.75-2.12 1.02-2.41.26-.28.57-.35.76-.35h.55c.18 0 .42-.07.65.5.24.58.82 2 .89 2.14.07.14.12.31.02.5-.09.19-.14.31-.28.48-.14.16-.29.36-.42.48-.14.13-.28.28-.12.55.16.28.71 1.17 1.53 1.9 1.05.94 1.94 1.23 2.21 1.37.28.14.44.12.6-.07.16-.19.68-.79.86-1.06.19-.28.37-.23.62-.14.26.09 1.64.77 1.92.91.28.14.44.12.6-.07.16-.19.68-.79.86-1.06Z" />
  </svg>
);

export const MobileEventsView: React.FC = () => {
  const { galleryImages } = useHotelData();
  const [submitted, setSubmitted] = useState(false);
  const [dbError, setDbError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    eventType: 'Conference / Seminar',
    guests: '50-100 Guests',
    date: '',
    notes: '',
  });

  const clearSubmissionState = () => {
    if (submitted) {
      setSubmitted(false);
      setDbError(false);
    }
  };

  const eventPhotos = useMemo(() => {
    return galleryImages
      .filter((item) => item.category === 'Events' && Boolean(item.image))
      .map((item) => item.image as string);
  }, [galleryImages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    let dbSaveOk = false;

    // Dual-write: 1. Persist to Supabase
    try {
      const res = await submitEventInquiry({
        full_name: formData.name,
        phone: formData.phone,
        event_type: formData.eventType,
        guest_count: formData.guests,
        target_date: formData.date || null,
        notes: formData.notes,
      });
      dbSaveOk = Boolean(res?.success);
    } catch (err) {
      console.warn('Supabase event inquiry insert notice:', err);
      dbSaveOk = false;
    }

    // Dual-write: 2. Always open WhatsApp
    const msg = `Hello ROYAL MGWASI HOTEL, I'd like an Event Quote.\nName: ${formData.name}\nPhone: ${formData.phone}\nEvent Type: ${formData.eventType}\nGuests: ${formData.guests}\nTarget Date: ${formData.date}\nNotes: ${formData.notes}`;
    window.open(formatWhatsAppUrl(msg), '_blank');

    setIsSubmitting(false);
    setSubmitted(true);
    setDbError(!dbSaveOk);
  };

  return (
    <div className="mh">
      {/* Header */}
      <div className="mh-head">
        <h1>Events &amp; Weddings</h1>
        <p className="mh-sub">
          Conferences, corporate seminars, and wedding ceremonies with full catering in Mbeya.
        </p>
      </div>

      {/* Stacked Venue Cards */}
      <div className="mh-stack">
        {/* Main Conference Hall Card */}
        <article className="mh-feature">
          <div className="mh-feature__media">
            {eventPhotos.length > 0 ? (
              <img src={eventPhotos[0]} alt="Main Conference Hall" loading="lazy" />
            ) : null}
          </div>
          <div className="mh-feature__body">
            <span className="mh-room-card__badge" style={{ position: 'static', display: 'inline-block', marginBottom: 8 }}>
              Capacity: Up to 150 Guests
            </span>
            <h2>Main Conference Hall</h2>
            <p className="mh-sub">
              Air-conditioned hall with PA sound system, projector, stage, and flexible seating layouts for seminars and corporate retreats.
            </p>
          </div>
        </article>

        {/* Outdoor Garden Lawn Card */}
        <article className="mh-room-card">
          <div className="mh-room-card__body">
            <span className="mh-room-card__badge" style={{ position: 'static', display: 'inline-block', marginBottom: 8 }}>
              Capacity: Up to 300 Guests
            </span>
            <h3>Outdoor Garden Lawn</h3>
            <p className="mh-sub" style={{ margin: '6px 0 10px' }}>
              Picturesque manicured lawn for romantic wedding receptions, evening banquets, and cocktail gatherings.
            </p>
          </div>
        </article>

        {/* Executive Boardroom Card */}
        <article className="mh-room-card">
          <div className="mh-room-card__body">
            <span className="mh-room-card__badge" style={{ position: 'static', display: 'inline-block', marginBottom: 8 }}>
              Capacity: Up to 25 Guests
            </span>
            <h3>Executive Boardroom</h3>
            <p className="mh-sub" style={{ margin: '6px 0 10px' }}>
              Quiet boardroom setting with executive seating, high-speed Wi-Fi, and private refreshment service for VIP meetings.
            </p>
          </div>
        </article>

        {/* Event Quote Form Card */}
        <div className="mh-form">
          <h3>Request Event Quote</h3>
          <p>Fill in your requirements to receive a customized price proposal in 15 minutes.</p>

          <form onSubmit={handleSubmit}>
            <div className="mh-field">
              <label htmlFor="ev-name">Your Full Name *</label>
              <input
                id="ev-name"
                type="text"
                required
                placeholder="e.g. Dr. Frank Mwaikenda"
                value={formData.name}
                onChange={(e) => {
                  clearSubmissionState();
                  setFormData({ ...formData, name: e.target.value });
                }}
              />
            </div>

            <div className="mh-field">
              <label htmlFor="ev-phone">Phone / WhatsApp Number *</label>
              <input
                id="ev-phone"
                type="tel"
                required
                placeholder="e.g. +255 762 555 557"
                value={formData.phone}
                onChange={(e) => {
                  clearSubmissionState();
                  setFormData({ ...formData, phone: e.target.value });
                }}
              />
            </div>

            <div className="mh-field">
              <label htmlFor="ev-type">Event Type</label>
              <select
                id="ev-type"
                value={formData.eventType}
                onChange={(e) => {
                  clearSubmissionState();
                  setFormData({ ...formData, eventType: e.target.value });
                }}
              >
                <option value="Conference / Seminar">Conference / Seminar</option>
                <option value="Wedding Reception">Wedding Reception</option>
                <option value="Corporate Workshop">Corporate Workshop</option>
                <option value="Private Dinner / Party">Private Dinner / Party</option>
                <option value="University Event">University Event</option>
              </select>
            </div>

            <div className="mh-field">
              <label htmlFor="ev-guests">Expected Guests</label>
              <select
                id="ev-guests"
                value={formData.guests}
                onChange={(e) => {
                  clearSubmissionState();
                  setFormData({ ...formData, guests: e.target.value });
                }}
              >
                <option value="Under 25 Guests">Under 25 Guests</option>
                <option value="25 - 50 Guests">25 - 50 Guests</option>
                <option value="50 - 100 Guests">50 - 100 Guests</option>
                <option value="100 - 200 Guests">100 - 200 Guests</option>
                <option value="200+ Guests">200+ Guests</option>
              </select>
            </div>

            <div className="mh-field">
              <label htmlFor="ev-date">Target Event Date</label>
              <input
                id="ev-date"
                type="date"
                value={formData.date}
                onChange={(e) => {
                  clearSubmissionState();
                  setFormData({ ...formData, date: e.target.value });
                }}
              />
            </div>

            <div className="mh-field">
              <label htmlFor="ev-notes">Catering &amp; Special Requirements</label>
              <textarea
                id="ev-notes"
                rows={3}
                placeholder="Buffet catering, sound system, hall decor, guest rooms..."
                value={formData.notes}
                onChange={(e) => {
                  clearSubmissionState();
                  setFormData({ ...formData, notes: e.target.value });
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
                Thank you! Opening WhatsApp with your event inquiry...
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
                We opened WhatsApp with your details. If WhatsApp did not open, please message us directly at +255 762 555 557.
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="mh-btn mh-btn--wa mh-btn--block"
              style={{ minHeight: 52, opacity: isSubmitting ? 0.75 : 1 }}
            >
              <WhatsAppIcon />
              {isSubmitting ? 'Opening WhatsApp...' : 'Submit & Get Quote on WhatsApp'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
