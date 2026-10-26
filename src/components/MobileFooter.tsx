import React from 'react';
import { useNavigate } from 'react-router-dom';
import { WHATSAPP_NUMBER } from '../data';

/** Phone footer, styled like the mobile redesign. */
export const MobileFooter: React.FC = () => {
  const navigate = useNavigate();

  const go = (path: string) => {
    navigate(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const links: { label: string; path: string }[] = [
    { label: 'Rooms', path: '/rooms' },
    { label: 'Dining', path: '/dining' },
    { label: 'Offers', path: '/offers' },
    { label: 'Events', path: '/events' },
    { label: 'Reviews', path: '/reviews' },
    { label: 'Contact', path: '/contact' },
    { label: 'How to book', path: '/book' },
  ];

  return (
    <footer className="mob-footer">
      <h3>Royal Mgwasi Hotel</h3>
      <p>Forest Mpya, Mzumbe University area, Mbeya 54113</p>
      <p>
        WhatsApp or call:{' '}
        <a href={`tel:+${WHATSAPP_NUMBER}`}>+255 762 555 557</a>
      </p>
      <p>Open 24 hours · Cash, card and mobile money</p>
      <nav aria-label="Footer">
        {links.map((l) => (
          <button key={l.path} type="button" onClick={() => go(l.path)}>
            {l.label}
          </button>
        ))}
      </nav>
      <p className="mob-footer__copy">© {new Date().getFullYear()} Royal Mgwasi Hotel</p>
    </footer>
  );
};
