import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HotelDataProvider } from './context/HotelDataContext';
import { HomeView } from './views/HomeView';
import { RoomsView } from './views/RoomsView';
import { DiningView } from './views/DiningView';
import { GalleryView } from './views/GalleryView';
import { OffersView } from './views/OffersView';
import { EventsView } from './views/EventsView';
import { StoryView } from './views/StoryView';
import { ReviewsView } from './views/ReviewsView';
import { ContactView } from './views/ContactView';
import { BookView } from './views/BookView';
import { AccountView } from './views/AccountView';
import { AdminLoginView } from './views/AdminLoginView';
import { AdminDashboardView } from './views/AdminDashboardView';
import { MembershipPopup } from './components/MembershipPopup';
import { RouteMetadata } from './components/RouteMetadata';
import { MobileHomeView } from './views/MobileHomeView';
import { MobileRoomsView } from './views/MobileRoomsView';
import { MobileDiningView } from './views/MobileDiningView';
import { MobileGalleryView } from './views/MobileGalleryView';
import { MobileOffersView } from './views/MobileOffersView';
import { MobileEventsView } from './views/MobileEventsView';
import { MobileStoryView } from './views/MobileStoryView';
import { MobileReviewsView } from './views/MobileReviewsView';
import { MobileContactView } from './views/MobileContactView';
import { MobileBookView } from './views/MobileBookView';
import { MobileAccountView } from './views/MobileAccountView';
import { MobileActionBar } from './components/MobileActionBar';
import { useIsMobile } from './hooks/useIsMobile';

function HomeRoute() {
  const isMobile = useIsMobile();
  return isMobile ? <MobileHomeView /> : <HomeView />;
}

function RoomsRoute() {
  const isMobile = useIsMobile();
  return isMobile ? <MobileRoomsView /> : <RoomsView />;
}

function DiningRoute() {
  const isMobile = useIsMobile();
  return isMobile ? <MobileDiningView /> : <DiningView />;
}

function GalleryRoute() {
  const isMobile = useIsMobile();
  return isMobile ? <MobileGalleryView /> : <GalleryView />;
}

function OffersRoute() {
  const isMobile = useIsMobile();
  return isMobile ? <MobileOffersView /> : <OffersView />;
}

function EventsRoute() {
  const isMobile = useIsMobile();
  return isMobile ? <MobileEventsView /> : <EventsView />;
}

function StoryRoute() {
  const isMobile = useIsMobile();
  return isMobile ? <MobileStoryView /> : <StoryView />;
}

function ReviewsRoute() {
  const isMobile = useIsMobile();
  return isMobile ? <MobileReviewsView /> : <ReviewsView />;
}

function ContactRoute() {
  const isMobile = useIsMobile();
  return isMobile ? <MobileContactView /> : <ContactView />;
}

function BookRoute() {
  const isMobile = useIsMobile();
  return isMobile ? <MobileBookView /> : <BookView />;
}

function AccountRoute() {
  const isMobile = useIsMobile();
  return isMobile ? <MobileAccountView /> : <AccountView />;
}

function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();
  const isAdmin = location.pathname.startsWith('/admin');

  if (location.pathname === '/admin/login') {
    return (
      <>
        <RouteMetadata />
        <AdminLoginView navigate={navigate} />
      </>
    );
  }

  if (isAdmin) {
    return (
      <>
        <RouteMetadata />
        <AdminDashboardView navigate={navigate} />
      </>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F4EFE6] text-[#2A2620]">
      <RouteMetadata />
      <Navbar />
      <main className="flex-1" id="main-content">
        <Routes>
          <Route path="/" element={<HomeRoute />} />
          <Route path="/rooms" element={<RoomsRoute />} />
          <Route path="/dining" element={<DiningRoute />} />
          <Route path="/gallery" element={<GalleryRoute />} />
          <Route path="/offers" element={<OffersRoute />} />
          <Route path="/events" element={<EventsRoute />} />
          <Route path="/our-story" element={<StoryRoute />} />
          <Route path="/reviews" element={<ReviewsRoute />} />
          <Route path="/contact" element={<ContactRoute />} />
          <Route path="/book" element={<BookRoute />} />
          <Route path="/account" element={<AccountRoute />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
      <MobileActionBar />
      <MembershipPopup />
    </div>
  );
}

export default function App() {
  return (
    <HotelDataProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </HotelDataProvider>
  );
}
