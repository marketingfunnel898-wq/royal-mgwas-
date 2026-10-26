import React from 'react';
import { Phone } from 'lucide-react';
import { WHATSAPP_NUMBER, formatWhatsAppUrl } from '../data';
import { useIsMobile } from '../hooks/useIsMobile';

/** Sticky "Book on WhatsApp" + call bar. Phones only. */
export const MobileActionBar: React.FC = () => {
  const isMobile = useIsMobile();

  if (!isMobile) return null;

  return (
    <div className="mob-bar">
      <a
        className="mob-bar__wa"
        href={formatWhatsAppUrl("Hello Royal Mgwasi, I'd like to book a room.")}
        target="_blank"
        rel="noopener noreferrer"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.79.47 3.46 1.29 4.9L2 22l5.31-1.39a9.87 9.87 0 0 0 4.73 1.2h.01c5.46 0 9.9-4.45 9.9-9.9C21.96 6.45 17.5 2 12.04 2Zm5.8 14.06c-.24.68-1.4 1.3-1.93 1.38-.5.08-1.12.11-1.8-.11-.42-.13-.96-.31-1.65-.6-2.9-1.25-4.79-4.17-4.94-4.36-.14-.2-1.18-1.57-1.18-3 0-1.42.75-2.12 1.02-2.41.26-.28.57-.35.76-.35h.55c.18 0 .42-.07.65.5.24.58.82 2 .89 2.14.07.14.12.31.02.5-.09.19-.14.31-.28.48-.14.16-.29.36-.42.48-.14.13-.28.28-.12.55.16.28.71 1.17 1.53 1.9 1.05.94 1.94 1.23 2.21 1.37.28.14.44.12.6-.07.16-.19.68-.79.86-1.06.19-.28.37-.23.62-.14.26.09 1.64.77 1.92.91.28.14.44.12.6-.07.16-.19.68-.79.86-1.06Z" />
        </svg>
        Book on WhatsApp
      </a>
      <a className="mob-bar__call" href={`tel:+${WHATSAPP_NUMBER}`} aria-label="Call reception">
        <Phone size={22} aria-hidden="true" />
      </a>
    </div>
  );
};
