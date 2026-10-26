import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatWhatsAppUrl } from '../data';
import { useHotelData } from '../context/HotelDataContext';
import { GalleryCardMedia } from '../components/GalleryCardMedia';

interface VideoItem {
  id: string;
  vimeoId: string;
  title: string;
  tag: string;
  description: string;
  aspect: '9/16' | 'square';
}

const HOTEL_VIDEOS: VideoItem[] = [
  {
    id: '1',
    vimeoId: '1218139293',
    title: 'Hotel Experience & Tour',
    tag: 'Feat. Mwijaku',
    description: 'An exclusive look at the hotel vibe, hospitality, and dining experience.',
    aspect: '9/16',
  },
  {
    id: '2',
    vimeoId: '1218139241',
    title: 'Grounds & Facilities',
    tag: 'Property Tour',
    description: 'Walk-through of the serene environment, lush gardens, and room comfort.',
    aspect: '9/16',
  },
  {
    id: '3',
    vimeoId: '1218139285',
    title: 'Clouds FM Spotlight',
    tag: 'Media Feature',
    description: 'Clouds FM media feature exploring Royal Mgwasi Hotel in Mbeya.',
    aspect: 'square',
  },
  {
    id: '4',
    vimeoId: '1218139242',
    title: 'Suites & Ambience Walkthrough',
    tag: 'Rooms & Relaxation',
    description: 'Detailed showcase of executive guest suites, room appointments, and tranquility.',
    aspect: '9/16',
  },
  {
    id: '5',
    vimeoId: '1218139246',
    title: 'Hospitality & Dining Moments',
    tag: 'Guest Experience',
    description: 'Authentic moments of exceptional Tanzanian service, food, and hospitality.',
    aspect: '9/16',
  },
  {
    id: '6',
    vimeoId: '1218139277',
    title: 'Celebrations & Atmosphere',
    tag: 'Atmosphere & Events',
    description: 'Vibrant ambience, memorable gatherings, and pleasant stays at Royal Mgwasi.',
    aspect: '9/16',
  },
];

export const MobileGalleryView: React.FC = () => {
  const navigate = useNavigate();
  const { galleryImages, initialLoading } = useHotelData();
  const [activeTab, setActiveTab] = useState<string>('All');

  const categories = ['All', 'Videos', 'Rooms', 'Dining', 'Pool', 'Grounds', 'Events'];

  const filteredImages =
    activeTab === 'All'
      ? galleryImages
      : activeTab === 'Videos'
      ? []
      : galleryImages.filter((img) => img.category.toLowerCase() === activeTab.toLowerCase());

  return (
    <div className="mh">
      {/* Header */}
      <div className="mh-head">
        <h1>Hotel Gallery</h1>
        <p className="mh-sub">
          Photos and video tours of Royal Mgwasi Hotel in Forest Mpya, Mbeya.
        </p>
      </div>

      {/* Horizontally scrollable category pills */}
      <div className="mh-filter-rail" role="tablist" aria-label="Gallery categories">
        {categories.map((cat) => {
          const isActive = activeTab === cat;
          return (
            <button
              key={cat}
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveTab(cat)}
              className={`mh-pill ${isActive ? 'is-active' : ''}`}
            >
              {cat === 'Videos' ? `▶ Videos (${HOTEL_VIDEOS.length})` : cat}
            </button>
          );
        })}
      </div>

      {/* Video section when Videos tab is selected or in All view (if desired) */}
      {activeTab === 'Videos' && (
        <div style={{ padding: '0 20px' }}>
          {HOTEL_VIDEOS.map((video) => (
            <article key={video.id} className="mh-video-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h4>{video.title}</h4>
                <span className="mh-room-card__badge" style={{ position: 'static' }}>
                  {video.tag}
                </span>
              </div>
              <div className={`mh-video-card__frame ${video.aspect === 'square' ? 'is-square' : ''}`}>
                <iframe
                  src={`https://player.vimeo.com/video/${video.vimeoId}?title=0&byline=0&portrait=0&badge=0&autopause=0&player_id=0&app_id=58479`}
                  className="w-full h-full border-0"
                  allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  title={video.title}
                />
              </div>
              <p style={{ margin: 0, fontSize: 13, color: 'var(--mh-mute)' }}>{video.description}</p>
            </article>
          ))}
        </div>
      )}

      {/* 2-Column Photo Grid */}
      {activeTab !== 'Videos' && (
        <div className="mh-gallery-grid">
          {initialLoading && filteredImages.length === 0 ? (
            [1, 2, 3, 4, 5, 6].map((n) => (
              <div
                key={n}
                className="mh-room-card mh-skeleton"
                style={{ height: 180, borderRadius: 18 }}
              />
            ))
          ) : filteredImages.length === 0 ? (
            <div style={{ gridColumn: 'span 2' }}>
              <div className="mh-note" style={{ margin: '0' }}>
                <h3>No photos</h3>
                <p>No photos currently listed under {activeTab}.</p>
              </div>
            </div>
          ) : (
            filteredImages.map((img) => (
              <GalleryCardMedia key={img.id} item={img} />
            ))
          )}
        </div>
      )}

      {/* Live WhatsApp Video Tour Card */}
      <div className="mh-note">
        <h3>Want a live room video walk-through?</h3>
        <p>
          Our 24-hour reception team can send you live video clips of currently available rooms on WhatsApp.
        </p>
        <a
          className="mh-btn mh-btn--wa mh-btn--block"
          style={{ marginTop: 14 }}
          href={formatWhatsAppUrl("Hello Royal Mgwasi, could you send me a video tour of your available rooms?")}
          target="_blank"
          rel="noopener noreferrer"
        >
          Ask for Video Tour
        </a>
        <button
          type="button"
          className="mh-btn mh-btn--ghost-green mh-btn--block"
          style={{ marginTop: 8 }}
          onClick={() => navigate('/book')}
        >
          Book online
        </button>
      </div>
    </div>
  );
};
