import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatWhatsAppUrl } from '../data';
import { useHotelData } from '../context/HotelDataContext';

const WhatsAppIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.79.47 3.46 1.29 4.9L2 22l5.31-1.39a9.87 9.87 0 0 0 4.73 1.2h.01c5.46 0 9.9-4.45 9.9-9.9C21.96 6.45 17.5 2 12.04 2Zm5.8 14.06c-.24.68-1.4 1.3-1.93 1.38-.5.08-1.12.11-1.8-.11-.42-.13-.96-.31-1.65-.6-2.9-1.25-4.79-4.17-4.94-4.36-.14-.2-1.18-1.57-1.18-3 0-1.42.75-2.12 1.02-2.41.26-.28.57-.35.76-.35h.55c.18 0 .42-.07.65.5.24.58.82 2 .89 2.14.07.14.12.31.02.5-.09.19-.14.31-.28.48-.14.16-.29.36-.42.48-.14.13-.28.28-.12.55.16.28.71 1.17 1.53 1.9 1.05.94 1.94 1.23 2.21 1.37.28.14.44.12.6-.07.16-.19.68-.79.86-1.06.19-.28.37-.23.62-.14.26.09 1.64.77 1.92.91.28.14.44.12.6-.07.16-.19.68-.79.86-1.06Z" />
  </svg>
);

export const MobileStoryView: React.FC = () => {
  const navigate = useNavigate();
  const { galleryImages, heroSlides } = useHotelData();

  const storyPhoto = useMemo(() => {
    const fromGallery = galleryImages.find(
      (g) =>
        g.image &&
        (g.category.toLowerCase() === 'grounds' ||
          g.title.toLowerCase().includes('hotel') ||
          g.title.toLowerCase().includes('grounds'))
    );
    if (fromGallery?.image) return fromGallery.image;
    if (heroSlides && heroSlides.length > 0) {
      return heroSlides[0].image_url || heroSlides[0].storage_path;
    }
    return null;
  }, [galleryImages, heroSlides]);

  return (
    <div className="mh">
      {/* Header */}
      <div className="mh-head">
        <h1>Our Story</h1>
        <p className="mh-sub">
          Rooted in the welcoming spirit and cool climate of Mbeya&apos;s Southern Highlands.
        </p>
      </div>

      <div className="mh-stack">
        {/* Photo Block */}
        <div className="mh-photo-block">
          {storyPhoto ? (
            <img src={storyPhoto} alt="Royal Mgwasi Hotel Mbeya" loading="lazy" />
          ) : null}
        </div>

        {/* Story Text Card */}
        <article className="mh-story-text">
          <h2>Hospitality with Purpose</h2>
          <p>
            Located in the quiet Forest Mpya neighborhood adjacent to Mzumbe University, Royal
            Mgwasi Hotel was established with a singular vision: to offer a clean, peaceful, and
            warm haven where travelers experience true royal hospitality.
          </p>
          <p>
            Over the years, we have built a reputation based on consistency—impeccably clean
            bedrooms, dependable hot showers, generous breakfasts, and a team that treats every guest
            like family.
          </p>
        </article>

        {/* Pillars / Values Cards */}
        <div className="mh-room-card">
          <div className="mh-room-card__body">
            <span className="mh-room-card__badge" style={{ position: 'static', display: 'inline-block', marginBottom: 8 }}>
              Pillar 01
            </span>
            <h3>Uncompromising Cleanliness</h3>
            <p className="mh-sub" style={{ margin: '6px 0 0' }}>
              Every bedroom, bathroom, and dining area undergoes thorough daily sanitation, ensuring you always step into a fresh, spotless room.
            </p>
          </div>
        </div>

        <div className="mh-room-card">
          <div className="mh-room-card__body">
            <span className="mh-room-card__badge" style={{ position: 'static', display: 'inline-block', marginBottom: 8 }}>
              Pillar 02
            </span>
            <h3>Authentic Tanzanian Taste</h3>
            <p className="mh-sub" style={{ margin: '6px 0 0' }}>
              We source our fresh tilapia, garden vegetables, and highland coffee directly from local farms and regional lakes in the Southern Highlands.
            </p>
          </div>
        </div>

        <div className="mh-room-card">
          <div className="mh-room-card__body">
            <span className="mh-room-card__badge" style={{ position: 'static', display: 'inline-block', marginBottom: 8 }}>
              Pillar 03
            </span>
            <h3>Community &amp; Culture</h3>
            <p className="mh-sub" style={{ margin: '6px 0 0' }}>
              From welcoming university delegates to hosting our live poolside band every weekend, Royal Mgwasi is a cultural heart of Forest Mpya.
            </p>
          </div>
        </div>

        {/* CTAs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 8 }}>
          <a
            className="mh-btn mh-btn--wa mh-btn--block"
            href={formatWhatsAppUrl("Hello Royal Mgwasi, I'd like to book a stay.")}
            target="_blank"
            rel="noopener noreferrer"
          >
            <WhatsAppIcon /> Book on WhatsApp
          </a>
          <button
            type="button"
            className="mh-btn mh-btn--ghost-green mh-btn--block"
            onClick={() => navigate('/rooms')}
          >
            Explore our rooms
          </button>
        </div>
      </div>
    </div>
  );
};
