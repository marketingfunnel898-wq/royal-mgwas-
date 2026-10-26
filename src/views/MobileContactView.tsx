import React, { useState } from 'react';
import { Phone } from 'lucide-react';
import { formatWhatsAppUrl, submitContactMessage, WHATSAPP_NUMBER } from '../data';
import { useHotelData } from '../context/HotelDataContext';

const WhatsAppIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.79.47 3.46 1.29 4.9L2 22l5.31-1.39a9.87 9.87 0 0 0 4.73 1.2h.01c5.46 0 9.9-4.45 9.9-9.9C21.96 6.45 17.5 2 12.04 2Zm5.8 14.06c-.24.68-1.4 1.3-1.93 1.38-.5.08-1.12.11-1.8-.11-.42-.13-.96-.31-1.65-.6-2.9-1.25-4.79-4.17-4.94-4.36-.14-.2-1.18-1.57-1.18-3 0-1.42.75-2.12 1.02-2.41.26-.28.57-.35.76-.35h.55c.18 0 .42-.07.65.5.24.58.82 2 .89 2.14.07.14.12.31.02.5-.09.19-.14.31-.28.48-.14.16-.29.36-.42.48-.14.13-.28.28-.12.55.16.28.71 1.17 1.53 1.9 1.05.94 1.94 1.23 2.21 1.37.28.14.44.12.6-.07.16-.19.68-.79.86-1.06Z" />
  </svg>
);

export const MobileContactView: React.FC = () => {
  const { landmarks } = useHotelData();
  const [submitted, setSubmitted] = useState(false);
  const [dbError, setDbError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [contactData, setFormData] = useState({ name: '', phone: '', email: '', message: '' });

  const clearSubmissionState = () => {
    if (submitted) {
      setSubmitted(false);
      setDbError(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    let dbSaveOk = false;

    // Dual-write: 1. Persist to Supabase
    try {
      const res = await submitContactMessage({
        full_name: contactData.name,
        phone: contactData.phone,
        email: contactData.email || undefined,
        message: contactData.message,
      });
      dbSaveOk = Boolean(res?.success);
    } catch (err) {
      console.warn('Supabase contact insert notice:', err);
      dbSaveOk = false;
    }

    // Dual-write: 2. Always open WhatsApp
    const msg = `Hello ROYAL MGWASI HOTEL, message from website:\nName: ${contactData.name}\nPhone: ${contactData.phone}\n${contactData.email ? `Email: ${contactData.email}\n` : ''}Message: ${contactData.message}`;
    window.open(formatWhatsAppUrl(msg), '_blank');

    setIsSubmitting(false);
    setSubmitted(true);
    setDbError(!dbSaveOk);
  };

  return (
    <div className="mh">
      {/* Header */}
      <div className="mh-head">
        <h1>Contact &amp; Location</h1>
        <p className="mh-sub">
          Forest Mpya, near Mzumbe University, Mbeya. 24/7 reception desk.
        </p>
      </div>

      <div className="mh-stack">
        {/* Map Block (170-220px rounded) */}
        <div>
          <div className="mh-map" style={{ height: 200, marginBottom: 12 }}>
            <iframe
              title="Google Map location of Royal Mgwasi Hotel Mbeya"
              src="https://maps.google.com/maps?q=ROYAL%20MGWASI%20HOTEL%2C%20Forest%20Mpya%2C%20Mbeya%2C%20Tanzania&t=&z=15&ie=UTF8&iwloc=&output=embed"
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <a
            className="mh-btn mh-btn--ghost-green mh-btn--block"
            href="https://maps.google.com/?q=ROYAL+MGWASI+HOTEL,+Forest+Mpya,+Mbeya,+Tanzania"
            target="_blank"
            rel="noopener noreferrer"
          >
            Open in Google Maps
          </a>
        </div>

        {/* Quick Contact Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <a
            className="mh-btn mh-btn--wa mh-btn--block"
            href={formatWhatsAppUrl("Hello Royal Mgwasi, I'd like to ask a question.")}
            target="_blank"
            rel="noopener noreferrer"
          >
            <WhatsAppIcon /> Message on WhatsApp
          </a>
          <a
            className="mh-btn mh-btn--green mh-btn--block"
            href={`tel:+${WHATSAPP_NUMBER}`}
          >
            <Phone size={18} aria-hidden="true" /> Call +255 762 555 557
          </a>
        </div>

        {/* Address Card */}
        <div className="mh-room-card">
          <div className="mh-room-card__body">
            <h3>Hotel Address</h3>
            <p style={{ margin: '6px 0 2px', fontSize: 15, color: 'var(--mh-ink)' }}>
              Forest Mpya, Mzumbe University Area<br />
              Mbeya 54113, Tanzania
            </p>
            <span style={{ fontSize: 13, color: 'var(--mh-mute)' }}>
              Plus Code: 3CQX+M4 Mbeya &middot; Reception open 24 hours
            </span>
          </div>
        </div>

        {/* Nearby Distances */}
        <div className="mh-room-card">
          <div className="mh-room-card__body">
            <h3>Nearby Distances</h3>
            <ul className="mh-near" style={{ margin: '10px 0 0' }}>
              {landmarks.map((lm, i) => (
                <li key={i}>
                  <b>{lm.name}</b>
                  <span>{lm.distance}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Contact Form Card */}
        <div className="mh-form">
          <h3>Send a Message</h3>
          <p>We reply within 15 minutes during the day.</p>

          <form onSubmit={handleSubmit}>
            <div className="mh-field">
              <label htmlFor="ct-name">Full Name *</label>
              <input
                id="ct-name"
                type="text"
                required
                placeholder="e.g. Maria Joseph"
                value={contactData.name}
                onChange={(e) => {
                  clearSubmissionState();
                  setFormData({ ...contactData, name: e.target.value });
                }}
              />
            </div>

            <div className="mh-field">
              <label htmlFor="ct-phone">Phone / WhatsApp *</label>
              <input
                id="ct-phone"
                type="tel"
                required
                placeholder="+255 762 555 557"
                value={contactData.phone}
                onChange={(e) => {
                  clearSubmissionState();
                  setFormData({ ...contactData, phone: e.target.value });
                }}
              />
            </div>

            <div className="mh-field">
              <label htmlFor="ct-email">Email Address</label>
              <input
                id="ct-email"
                type="email"
                placeholder="name@example.com"
                value={contactData.email}
                onChange={(e) => {
                  clearSubmissionState();
                  setFormData({ ...contactData, email: e.target.value });
                }}
              />
            </div>

            <div className="mh-field">
              <label htmlFor="ct-message">Your Message *</label>
              <textarea
                id="ct-message"
                rows={4}
                required
                placeholder="How can we assist you with your upcoming visit to Mbeya?"
                value={contactData.message}
                onChange={(e) => {
                  clearSubmissionState();
                  setFormData({ ...contactData, message: e.target.value });
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
                Thank you! Opening WhatsApp to deliver your message...
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
                We opened WhatsApp with your message. If WhatsApp did not open, please call or message us directly at +255 762 555 557.
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="mh-btn mh-btn--wa mh-btn--block"
              style={{ minHeight: 52, opacity: isSubmitting ? 0.75 : 1 }}
            >
              <WhatsAppIcon />
              {isSubmitting ? 'Opening WhatsApp...' : 'Send Message on WhatsApp'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
