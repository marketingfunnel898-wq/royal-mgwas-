import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatWhatsAppUrl } from '../data';
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

export const MobileRoomsView: React.FC = () => {
  const navigate = useNavigate();
  const { rooms, initialLoading } = useHotelData();
  const [filter, setFilter] = useState<string>('All');

  const categories = ['All', 'Standard', 'Suite', 'Superior', 'Executive', 'Apartment'];

  const getCategoryCount = (cat: string) => {
    if (cat === 'All') return rooms.length;
    return rooms.filter((r) => r.category.toLowerCase() === cat.toLowerCase()).length;
  };

  const filteredRooms =
    filter === 'All'
      ? rooms
      : rooms.filter((r) => r.category.toLowerCase() === filter.toLowerCase());

  return (
    <div className="mh">
      {/* Page Header */}
      <div className="mh-head">
        <h1>Rooms &amp; Suites</h1>
        <p className="mh-sub">
          Quiet rest in Mbeya. Free breakfast, high-speed Wi-Fi, and parking included.
        </p>
      </div>

      {/* Horizontally scrollable category pills */}
      <div className="mh-filter-rail" role="tablist" aria-label="Room categories">
        {categories.map((cat) => {
          const count = getCategoryCount(cat);
          const isActive = filter === cat;
          return (
            <button
              key={cat}
              role="tab"
              aria-selected={isActive}
              onClick={() => setFilter(cat)}
              className={`mh-pill ${isActive ? 'is-active' : ''}`}
            >
              {cat} {rooms.length > 0 ? `(${count})` : ''}
            </button>
          );
        })}
      </div>

      {/* Stacked Rooms List */}
      <div className="mh-rooms-list">
        {initialLoading && rooms.length === 0 ? (
          [1, 2, 3].map((n) => (
            <article key={n} className="mh-room-card mh-skeleton" aria-hidden="true">
              <div className="mh-room-card__media" />
              <div className="mh-room-card__body" style={{ minHeight: 180 }} />
            </article>
          ))
        ) : filteredRooms.length === 0 ? (
          <div className="mh-note">
            <h3>No rooms found</h3>
            <p>There are no rooms listed under the &ldquo;{filter}&rdquo; category.</p>
          </div>
        ) : (
          filteredRooms.map((room) => {
            const photo = roomPhoto(room);
            const meta = roomMeta(room);
            const waUrl = formatWhatsAppUrl(
              `Hello Royal Mgwasi, I'd like to check availability for the ${room.name}.`
            );

            return (
              <article key={room.id} className="mh-room-card">
                <div className="mh-room-card__media">
                  {photo ? (
                    <img src={photo} alt={room.name} loading="lazy" />
                  ) : null}
                  <span className="mh-room-card__badge">{room.category}</span>
                </div>

                <div className="mh-room-card__body">
                  <h3>{room.name}</h3>

                  <div className="mh-room-card__price">
                    {room.price_tzs ? (
                      <>
                        From <b>{formatTzs(room.price_tzs)}</b> / night
                      </>
                    ) : (
                      <span className="mh-price__req">Price on request</span>
                    )}
                  </div>

                  <div className="mh-room-card__meta">{meta}</div>

                  {room.amenities && room.amenities.length > 0 && (
                    <div className="mh-room-card__amenities">
                      {room.amenities.slice(0, 4).map((am, i) => (
                        <span key={i} className="mh-room-card__amenity">
                          ✓ {am}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="mh-room-card__actions">
                    <a
                      className="mh-btn mh-btn--wa mh-btn--block"
                      href={waUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <WhatsAppIcon /> Book this room
                    </a>
                    <button
                      type="button"
                      className="mh-btn mh-btn--ghost-green mh-btn--block"
                      onClick={() => navigate('/book')}
                    >
                      Book online
                    </button>
                  </div>
                </div>
              </article>
            );
          })
        )}
      </div>

      {/* Group Booking Note */}
      <div className="mh-note">
        <h3>Group bookings &amp; seminars</h3>
        <p>
          We accommodate group delegations for Mzumbe University seminars and custom check-in times.
          Message reception on WhatsApp for direct group rates.
        </p>
      </div>
    </div>
  );
};
