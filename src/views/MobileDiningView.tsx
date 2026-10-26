import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatWhatsAppUrl } from '../data';
import { useHotelData } from '../context/HotelDataContext';

const WhatsAppIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.79.47 3.46 1.29 4.9L2 22l5.31-1.39a9.87 9.87 0 0 0 4.73 1.2h.01c5.46 0 9.9-4.45 9.9-9.9C21.96 6.45 17.5 2 12.04 2Zm5.8 14.06c-.24.68-1.4 1.3-1.93 1.38-.5.08-1.12.11-1.8-.11-.42-.13-.96-.31-1.65-.6-2.9-1.25-4.79-4.17-4.94-4.36-.14-.2-1.18-1.57-1.18-3 0-1.42.75-2.12 1.02-2.41.26-.28.57-.35.76-.35h.55c.18 0 .42-.07.65.5.24.58.82 2 .89 2.14.07.14.12.31.02.5-.09.19-.14.31-.28.48-.14.16-.29.36-.42.48-.14.13-.28.28-.12.55.16.28.71 1.17 1.53 1.9 1.05.94 1.94 1.23 2.21 1.37.28.14.44.12.6-.07.16-.19.68-.79.86-1.06.19-.28.37-.23.62-.14.26.09 1.64.77 1.92.91.28.14.44.12.6-.07.16-.19.68-.79.86-1.06Z" />
  </svg>
);

export const MobileDiningView: React.FC = () => {
  const navigate = useNavigate();
  const { galleryImages } = useHotelData();

  const bandPhoto = useMemo(() => {
    const byTitle = (needle: string) =>
      galleryImages.find((g) => g.image && g.title.toLowerCase().includes(needle));
    const item =
      byTitle('band') ||
      byTitle('music') ||
      galleryImages.find((g) => g.image && g.category.toLowerCase() === 'dining');
    return item?.image || null;
  }, [galleryImages]);

  const tilapiaPhoto = useMemo(() => {
    const item = galleryImages.find(
      (g) => g.image && g.title.toLowerCase().includes('tilapia')
    );
    return item?.image || null;
  }, [galleryImages]);

  const reserveWaUrl = formatWhatsAppUrl(
    "Hello Royal Mgwasi, I'd like to reserve a table / ask about today's menu."
  );

  return (
    <div className="mh">
      {/* Header */}
      <div className="mh-head">
        <h1>Dining &amp; Live Band</h1>
        <p className="mh-sub">
          Authentic Tanzanian dishes, fresh signature Tilapia, and weekend poolside live music.
        </p>
      </div>

      <div className="mh-stack">
        {/* Main Live Band Feature Card */}
        <article className="mh-feature">
          <div className="mh-feature__media">
            {bandPhoto ? (
              <img src={bandPhoto} alt="Live band at Royal Mgwasi" loading="lazy" />
            ) : null}
          </div>
          <div className="mh-feature__body">
            <h2>Weekend Live Band</h2>
            <div className="mh-days" aria-label="Live band schedule">
              <span>Fri</span>
              <span>Sat</span>
              <span>Sun</span>
            </div>
            <p className="mh-sub">
              Mbeya&apos;s finest musicians poolside from 7:00 PM to 11:00 PM. Fresh barbecue, cold drinks, and free entry for guests.
            </p>
            <a
              className="mh-btn mh-btn--wa mh-btn--block"
              href={reserveWaUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <WhatsAppIcon /> Reserve a table
            </a>
          </div>
        </article>

        {/* Signature Tilapia Card */}
        <article className="mh-feature">
          {tilapiaPhoto ? (
            <div className="mh-feature__media" style={{ height: 180 }}>
              <img src={tilapiaPhoto} alt="Fresh Lake Tilapia" loading="lazy" />
            </div>
          ) : null}
          <div className="mh-feature__body">
            <h2>Signature Lake Tilapia</h2>
            <p className="mh-sub">
              Pan-fried, grilled, or stewed in coconut &amp; tomato spices. Served with ugali, chips, or fried rice. Lunch &amp; dinner 11:30 AM – 10:30 PM.
            </p>
            <a
              className="mh-btn mh-btn--ghost-green mh-btn--block"
              href={formatWhatsAppUrl("Hello Royal Mgwasi, I'd like to order Tilapia / enquire about dining.")}
              target="_blank"
              rel="noopener noreferrer"
            >
              Order Tilapia on WhatsApp
            </a>
          </div>
        </article>

        {/* Daily Breakfast Highlight Card */}
        <article className="mh-room-card">
          <div className="mh-room-card__body">
            <span className="mh-room-card__badge" style={{ position: 'static', display: 'inline-block', marginBottom: 10 }}>
              Included with Stay
            </span>
            <h3>Daily Free Breakfast</h3>
            <p className="mh-sub" style={{ margin: '6px 0 12px' }}>
              6:30 AM – 10:00 AM daily. Tanzanian highland coffee, spiced tea, fresh tropical fruits, eggs cooked to order, mandazi, and warm pastries.
            </p>
          </div>
        </article>

        {/* Tanzanian Specialties Menu Card */}
        <div className="mh-menu-card">
          <h3>Tanzanian Specialties</h3>
          <ul className="mh-menu-list">
            <li className="mh-menu-item">
              <span>Whole Fresh Lake Tilapia</span>
              <b>Specialty</b>
            </li>
            <li className="mh-menu-item">
              <span>Beef / Chicken Nyama Choma</span>
              <b>Barbecue</b>
            </li>
            <li className="mh-menu-item">
              <span>Kuku wa Kienyeji (Chicken Stew)</span>
              <b>House Special</b>
            </li>
            <li className="mh-menu-item">
              <span>Chips Mayai &amp; Fresh Kachumbari</span>
              <b>Local Favorite</b>
            </li>
          </ul>
        </div>

        {/* Drinks & Refreshments Menu Card */}
        <div className="mh-menu-card">
          <h3>Drinks &amp; Refreshments</h3>
          <ul className="mh-menu-list">
            <li className="mh-menu-item">
              <span>Fresh Mango &amp; Passion Juice</span>
              <b>Fresh Daily</b>
            </li>
            <li className="mh-menu-item">
              <span>Highland Coffee &amp; Spiced Tea</span>
              <b>Local Sourced</b>
            </li>
            <li className="mh-menu-item">
              <span>Chilled Tanzanian &amp; Imported Beers</span>
              <b>Ice Cold</b>
            </li>
            <li className="mh-menu-item">
              <span>Wine Selection &amp; Mocktails</span>
              <b>Full Bar</b>
            </li>
          </ul>
        </div>
      </div>

      {/* Halal & Room Service Banner */}
      <div className="mh-note">
        <h3>Halal-friendly &amp; 24/7 Room Service</h3>
        <p>
          All poultry and meats are 100% Halal certified. Prefer dining in your room? Call reception or message WhatsApp for room delivery anytime.
        </p>
        <button
          type="button"
          className="mh-btn mh-btn--green mh-btn--block"
          style={{ marginTop: 14 }}
          onClick={() => navigate('/book')}
        >
          Book room &amp; stay
        </button>
      </div>
    </div>
  );
};
