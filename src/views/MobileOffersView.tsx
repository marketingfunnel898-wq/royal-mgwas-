import React from 'react';
import { useNavigate } from 'react-router-dom';
import { formatWhatsAppUrl } from '../data';
import { useHotelData } from '../context/HotelDataContext';

const WhatsAppIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.79.47 3.46 1.29 4.9L2 22l5.31-1.39a9.87 9.87 0 0 0 4.73 1.2h.01c5.46 0 9.9-4.45 9.9-9.9C21.96 6.45 17.5 2 12.04 2Zm5.8 14.06c-.24.68-1.4 1.3-1.93 1.38-.5.08-1.12.11-1.8-.11-.42-.13-.96-.31-1.65-.6-2.9-1.25-4.79-4.17-4.94-4.36-.14-.2-1.18-1.57-1.18-3 0-1.42.75-2.12 1.02-2.41.26-.28.57-.35.76-.35h.55c.18 0 .42-.07.65.5.24.58.82 2 .89 2.14.07.14.12.31.02.5-.09.19-.14.31-.28.48-.14.16-.29.36-.42.48-.14.13-.28.28-.12.55.16.28.71 1.17 1.53 1.9 1.05.94 1.94 1.23 2.21 1.37.28.14.44.12.6-.07.16-.19.68-.79.86-1.06Z" />
  </svg>
);

export const MobileOffersView: React.FC = () => {
  const navigate = useNavigate();
  const { offers, initialLoading } = useHotelData();

  return (
    <div className="mh">
      {/* Header */}
      <div className="mh-head">
        <h1>Special Offers</h1>
        <p className="mh-sub">
          Package deals and seasonal rates for weekends, retreats, and extended stays in Mbeya.
        </p>
      </div>

      <div className="mh-stack">
        {initialLoading && offers.length === 0 ? (
          [1, 2, 3].map((n) => (
            <div key={n} className="mh-offer-card mh-skeleton" style={{ minHeight: 220 }} />
          ))
        ) : (
          offers.map((offer) => {
            const waUrl = formatWhatsAppUrl(
              `Hello Royal Mgwasi, I'd like to claim the '${offer.title}' package.`
            );

            return (
              <article key={offer.id} className="mh-offer-card">
                <div className="mh-offer-card__badges">
                  <span className="mh-badge mh-badge--green">{offer.badge}</span>
                  {offer.members_only && (
                    <span className="mh-badge mh-badge--gold">★ Member Exclusive</span>
                  )}
                </div>

                <h3>{offer.title}</h3>
                <p>{offer.description}</p>

                {offer.perks && offer.perks.length > 0 && (
                  <ul className="mh-offer-card__perks">
                    {offer.perks.map((perk, idx) => (
                      <li key={idx}>
                        <span>✓</span> {perk}
                      </li>
                    ))}
                  </ul>
                )}

                <div className="mh-offer-card__price">{offer.priceNote}</div>

                <a
                  className="mh-btn mh-btn--wa mh-btn--block"
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <WhatsAppIcon /> Claim offer on WhatsApp
                </a>
              </article>
            );
          })
        )}
      </div>

      {/* Custom Group & Conference Panel */}
      <div className="mh-steps" style={{ marginTop: 28 }}>
        <h2>Group &amp; Conference Deals</h2>
        <p style={{ margin: '10px 0 18px', opacity: 0.9 }}>
          Planning a workshop, university delegation, or wedding party? We offer custom package pricing with meals and hall hire included.
        </p>
        <button
          type="button"
          className="mh-btn mh-btn--gold mh-btn--block"
          onClick={() => navigate('/events')}
        >
          View events &amp; request quote
        </button>
      </div>
    </div>
  );
};
