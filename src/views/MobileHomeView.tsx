import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DEFAULT_HERO_SLIDES, formatWhatsAppUrl } from '../data';
import { useHotelData } from '../context/HotelDataContext';
import { getRoomImageUrl } from '../lib/supabase';
import { RoomOption } from '../types';

const WhatsAppIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.79.47 3.46 1.29 4.9L2 22l5.31-1.39a9.87 9.87 0 0 0 4.73 1.2h.01c5.46 0 9.9-4.45 9.9-9.9C21.96 6.45 17.5 2 12.04 2Zm5.8 14.06c-.24.68-1.4 1.3-1.93 1.38-.5.08-1.12.11-1.8-.11-.42-.13-.96-.31-1.65-.6-2.9-1.25-4.79-4.17-4.94-4.36-.14-.2-1.18-1.57-1.18-3 0-1.42.75-2.12 1.02-2.41.26-.28.57-.35.76-.35h.55c.18 0 .42-.07.65.5.24.58.82 2 .89 2.14.07.14.12.31.02.5-.09.19-.14.31-.28.48-.14.16-.29.36-.42.48-.14.13-.28.28-.12.55.16.28.71 1.17 1.53 1.9 1.05.94 1.94 1.23 2.21 1.37.28.14.44.12.6-.07.16-.19.68-.79.86-1.06.19-.28.37-.23.62-.14.26.09 1.64.77 1.92.91.28.14.44.12.6-.07.16-.19.68-.79.86-1.06Z" />
  </svg>
);

const formatTzs = (n: number) => `TZS ${Math.round(n).toLocaleString('en-US')}`;

function roomPhoto(room: RoomOption): string | null {
  const first = room.images && room.images.length > 0 ? room.images[0] : room.image;
  return getRoomImageUrl(first);
}

function roomMeta(room: RoomOption): string {
  return [room.capacity, ...room.tags.slice(0, 2)].filter(Boolean).join(' · ');
}

const AMENITIES = [
  'Free Wi-Fi',
  'Daily free breakfast',
  'Swimming pool',
  'Fitness centre',
  'Secure free parking',
  'On-site restaurant',
  'Express laundry',
  'Live band every weekend',
];

const STEPS: { title: string; text: string }[] = [
  { title: 'Message us', text: 'Send your dates and preferred room on WhatsApp.' },
  { title: 'Pick a room', text: 'We reply within 15 minutes with what is free.' },
  { title: 'Pay a deposit', text: 'By mobile money or card. Free cancellation applies.' },
  { title: "You're confirmed", text: 'Receive your booking confirmation and arrival guide.' },
];

export const MobileHomeView: React.FC = () => {
  const navigate = useNavigate();
  const { rooms, reviews, landmarks, heroSlides, galleryImages, initialLoading } = useHotelData();

  /* ---------- Hero slideshow (real photos, simple cross-fade) ---------- */
  const slides = useMemo(
    () => (heroSlides && heroSlides.length > 0 ? heroSlides : DEFAULT_HERO_SLIDES),
    [heroSlides]
  );
  const [slideIdx, setSlideIdx] = useState(0);

  useEffect(() => {
    if (slideIdx >= slides.length) setSlideIdx(0);
  }, [slides.length, slideIdx]);

  useEffect(() => {
    if (slides.length <= 1) return;
    const t = setInterval(() => setSlideIdx((p) => (p + 1) % slides.length), 6000);
    return () => clearInterval(t);
  }, [slides.length]);

  /* ---------- Dining feature photo ---------- */
  const diningPhoto = useMemo(() => {
    const byTitle = (needle: string) =>
      galleryImages.find((g) => g.image && g.title.toLowerCase().includes(needle));
    const item =
      byTitle('band') ||
      byTitle('tilapia') ||
      galleryImages.find((g) => g.image && g.category.toLowerCase() === 'dining');
    return item?.image || null;
  }, [galleryImages]);

  /* ---------- Rooms summary ---------- */
  const maxPrice = useMemo(
    () => rooms.reduce((m, r) => Math.max(m, r.price_tzs || 0), 0),
    [rooms]
  );

  const goTo = (path: string) => {
    navigate(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToRooms = (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById('rooms')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const wa = (msg: string) => formatWhatsAppUrl(msg);

  return (
    <div className="mh">
      {/* ================= HERO ================= */}
      <header className="mh-hero">
        <div className="mh-hero__slides" aria-hidden="true">
          {slides.map((s, i) => (
            <div
              key={s.id || i}
              className={`mh-hero__slide ${i === slideIdx ? 'is-active' : ''}`}
              style={{ backgroundImage: `url('${s.image_url || s.storage_path}')` }}
            />
          ))}
        </div>

        <span className="mh-rate">
          <span className="mh-stars" aria-hidden="true">★★★★★</span> 4.3 · 118 Google reviews
        </span>
        <h1>Rest well in the centre of Mbeya.</h1>
        <p>
          Clean rooms, free breakfast and Wi-Fi, and a live band on weekends. Forest Mpya, near
          Mzumbe University.
        </p>
        <div className="mh-hero__row">
          <a
            className="mh-btn mh-btn--wa"
            href={wa("Hello Royal Mgwasi, I'd like to book a room.")}
            target="_blank"
            rel="noopener noreferrer"
          >
            <WhatsAppIcon /> Book on WhatsApp
          </a>
          <a className="mh-btn mh-btn--ghost" href="#rooms" onClick={scrollToRooms}>
            See rooms and prices
          </a>
        </div>
        <div className="mh-hero__note">Replies within 15 minutes · Reception open 24 hours</div>
      </header>

      {/* ================= TRUST ================= */}
      <section className="mh-trust" aria-label="Booking promises">
        <div><b>Free cancellation</b>Simple changes, clearly explained</div>
        <div><b>Mobile money</b>Deposit with M-Pesa, Tigo Pesa, Airtel Money</div>
        <div><b>Halal-friendly</b>Fresh halal meals available</div>
        <div><b>4-star hotel</b>24-hour reception</div>
      </section>

      {/* ================= ROOMS ================= */}
      <section className="mh-sec" id="rooms">
        <h2>Rooms made for proper rest</h2>
        <p className="mh-sub">Prices per night for 2 guests. Message us to check dates.</p>

        <div className="mh-rail" role="region" aria-label="Rooms" tabIndex={0}>
          {initialLoading && rooms.length === 0
            ? [1, 2, 3].map((n) => (
                <article key={n} className="mh-room mh-skeleton" aria-hidden="true">
                  <div className="mh-room__media" />
                  <div className="mh-room__body" style={{ minHeight: 170 }} />
                </article>
              ))
            : rooms.map((room) => {
                const photo = roomPhoto(room);
                const price = room.price_tzs ? formatTzs(room.price_tzs) : null;
                return (
                  <article key={room.id} className="mh-room">
                    <div className={`mh-room__media ${room.colorClass || ''}`}>
                      {photo && (
                        <img
                          src={photo}
                          alt={room.name}
                          loading="lazy"
                          onError={(e) => {
                            (e.currentTarget as HTMLElement).style.display = 'none';
                          }}
                        />
                      )}
                    </div>
                    <div className="mh-room__body">
                      <h3>{room.name}</h3>
                      <div className="mh-price">
                        {price ? (
                          <>
                            From <b>{price}</b>
                          </>
                        ) : (
                          <b className="mh-price__req">Price on request</b>
                        )}
                      </div>
                      <div className="mh-meta">{roomMeta(room)}</div>
                      <a
                        className="mh-btn mh-btn--green mh-btn--block"
                        href={wa(
                          `Hello, I'd like the ${room.name}${price ? ` (${price})` : ''}.`
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Book this room
                      </a>
                    </div>
                  </article>
                );
              })}
        </div>

        <a
          className="mh-more"
          href="/rooms"
          onClick={(e) => {
            e.preventDefault();
            goTo('/rooms');
          }}
        >
          See all {rooms.length} room types
          {maxPrice > 0 ? `, up to ${formatTzs(maxPrice)}` : ''}
        </a>
      </section>

      {/* ================= HOW TO BOOK ================= */}
      <section className="mh-steps" id="book">
        <h2>Book in four clear steps</h2>
        <ol>
          {STEPS.map((s, i) => (
            <li key={s.title}>
              <i aria-hidden="true">{i + 1}</i>
              <div>
                <b>{s.title}</b>
                <span>{s.text}</span>
              </div>
            </li>
          ))}
        </ol>
        <a
          className="mh-btn mh-btn--gold mh-btn--block"
          href={wa("Hello, I'd like to book.")}
          target="_blank"
          rel="noopener noreferrer"
        >
          Start on WhatsApp
        </a>
      </section>

      {/* ================= DINING ================= */}
      <section className="mh-sec">
        <div className="mh-feature">
          <div
            className="mh-feature__media"
            role="img"
            aria-label="Restaurant and live band at Royal Mgwasi Hotel"
          >
            {diningPhoto && (
              <img
                src={diningPhoto}
                alt=""
                loading="lazy"
                onError={(e) => {
                  (e.currentTarget as HTMLElement).style.display = 'none';
                }}
              />
            )}
          </div>
          <div className="mh-feature__body">
            <h2>Tilapia by day, live band by night</h2>
            <p className="mh-sub" style={{ marginBottom: 0 }}>
              Eat at the restaurant, then stay for music at the lounge.
            </p>
            <div className="mh-days" aria-label="Live band nights">
              <span>Fri</span>
              <span>Sat</span>
              <span>Sun</span>
            </div>
            <a
              className="mh-btn mh-btn--wa mh-btn--block"
              href={wa("Hello, I'd like to reserve a table for live band night.")}
              target="_blank"
              rel="noopener noreferrer"
            >
              <WhatsAppIcon /> Reserve a table
            </a>
          </div>
        </div>
      </section>

      {/* ================= AMENITIES ================= */}
      <section className="mh-sec">
        <h2>Included in your stay</h2>
        <p className="mh-sub">Everything you need, nothing to ask for twice.</p>
        <div className="mh-chips">
          {AMENITIES.map((a) => (
            <span key={a}>{a}</span>
          ))}
        </div>
      </section>

      {/* ================= REVIEWS ================= */}
      <section className="mh-sec" id="reviews">
        <h2>What guests say</h2>
        <div className="mh-score">
          <b>4.3</b>
          <div>
            <div className="mh-stars" aria-label="4.3 out of 5">★★★★☆</div>
            <small>118 Google reviews</small>
          </div>
        </div>
        {reviews.slice(0, 3).map((r) => (
          <article key={r.id} className="mh-rev">
            <div className="mh-stars" aria-label={`${r.rating} out of 5`}>
              {'★'.repeat(Math.max(0, Math.min(5, r.rating)))}
            </div>
            <p>{r.comment}</p>
            <small>
              {r.name}
              {r.tripType ? ` · ${r.tripType}` : ''}
            </small>
          </article>
        ))}
        <a
          className="mh-more"
          href="/reviews"
          onClick={(e) => {
            e.preventDefault();
            goTo('/reviews');
          }}
        >
          Read all reviews
        </a>
      </section>

      {/* ================= LOCATION ================= */}
      <section className="mh-sec" id="location">
        <h2>Easy to find</h2>
        <p className="mh-sub">Forest Mpya, Mzumbe University area, Mbeya 54113.</p>
        <div className="mh-map">
          <iframe
            title="Map of Royal Mgwasi Hotel, Forest Mpya, Mbeya"
            src="https://maps.google.com/maps?q=ROYAL%20MGWASI%20HOTEL%2C%20Forest%20Mpya%2C%20Mbeya%2C%20Tanzania&t=&z=15&ie=UTF8&iwloc=&output=embed"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
        <ul className="mh-near">
          {landmarks.slice(0, 4).map((lm) => (
            <li key={lm.name}>
              {lm.name}
              <span>{lm.distance}</span>
            </li>
          ))}
        </ul>
        <a
          className="mh-btn mh-btn--ghost-green mh-btn--block"
          href="https://maps.google.com/?q=ROYAL+MGWASI+HOTEL,+Forest+Mpya,+Mbeya,+Tanzania"
          target="_blank"
          rel="noopener noreferrer"
        >
          Open in Google Maps
        </a>
      </section>
    </div>
  );
};
