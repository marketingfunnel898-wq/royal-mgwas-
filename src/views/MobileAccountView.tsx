import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHotelData } from '../context/HotelDataContext';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { BookingRow } from '../components/admin/AdminBookingsSection';
import { ReviewRow } from '../components/admin/AdminReviewsSection';

const STATUS_CONFIG: Record<string, { label: string; bg: string; text: string }> = {
  pending: { label: 'Pending', bg: '#fef3c7', text: '#92400e' },
  confirmed: { label: 'Confirmed', bg: '#d1fae5', text: '#065f46' },
  checked_in: { label: 'Checked In', bg: '#dbeafe', text: '#1e40af' },
  checked_out: { label: 'Checked Out', bg: '#f1f5f9', text: '#334155' },
  cancelled: { label: 'Cancelled', bg: '#ffe4e6', text: '#9f1239' },
  no_show: { label: 'No Show', bg: '#f3e8ff', text: '#6b21a8' },
};

export const MobileAccountView: React.FC = () => {
  const navigate = useNavigate();
  const {
    user,
    memberProfile,
    initialLoading,
    refreshMemberProfile,
    rooms,
    signInWithGoogle,
    signOut,
  } = useHotelData();

  // Profile form state
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);

  // Direct login state
  const [accountEmail, setAccountEmail] = useState('');
  const [accountPassword, setAccountPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Bookings state
  const [bookings, setBookings] = useState<BookingRow[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(true);

  // Reviews state
  const [reviews, setReviews] = useState<ReviewRow[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(true);

  const handleDirectAccountLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setIsLoggingIn(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: accountEmail.trim(),
        password: accountPassword,
      });
      if (error) {
        setLoginError(error.message);
      }
    } catch (err: any) {
      setLoginError(err?.message || 'Failed to sign in');
    } finally {
      setIsLoggingIn(false);
    }
  };

  useEffect(() => {
    if (user) {
      setFullName(
        memberProfile?.full_name ||
          (user.user_metadata?.full_name as string) ||
          (user.user_metadata?.name as string) ||
          ''
      );
      setPhone(memberProfile?.phone || (user.user_metadata?.phone as string) || '');
    }
  }, [user, memberProfile]);

  const fetchMemberBookings = useCallback(async () => {
    if (!user || !isSupabaseConfigured) {
      setLoadingBookings(false);
      return;
    }
    try {
      setLoadingBookings(true);
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('member_id', user.id)
        .order('check_in', { ascending: false });

      if (error) {
        setBookings([]);
      } else if (data) {
        setBookings(data as BookingRow[]);
      }
    } catch {
      setBookings([]);
    } finally {
      setLoadingBookings(false);
    }
  }, [user]);

  const fetchMemberReviews = useCallback(async () => {
    if (!user || !isSupabaseConfigured) {
      setLoadingReviews(false);
      return;
    }
    try {
      setLoadingReviews(true);
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('member_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        setReviews([]);
      } else if (data) {
        setReviews(data as ReviewRow[]);
      }
    } catch {
      setReviews([]);
    } finally {
      setLoadingReviews(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchMemberBookings();
      fetchMemberReviews();
    }
  }, [user, fetchMemberBookings, fetchMemberReviews]);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || isSavingProfile) return;

    setIsSavingProfile(true);
    setProfileSuccess(null);
    setProfileError(null);

    try {
      const avatarUrl =
        memberProfile?.avatar_url ||
        (user.user_metadata?.avatar_url as string) ||
        (user.user_metadata?.picture as string) ||
        null;
      const profileDataWithPhone = {
        full_name: fullName.trim() || null,
        phone: phone.trim() || null,
        email: user.email,
        avatar_url: avatarUrl,
      };
      const profileDataNoPhone = {
        full_name: fullName.trim() || null,
        email: user.email,
        avatar_url: avatarUrl,
      };

      try {
        await supabase.auth.updateUser({
          data: {
            full_name: fullName.trim(),
            name: fullName.trim(),
            phone: phone.trim(),
          },
        });
      } catch (authErr) {
        console.warn('Could not update auth user_metadata:', authErr);
      }

      let saveError: any = null;
      if (memberProfile) {
        let res = await supabase.from('members').update(profileDataWithPhone).eq('id', user.id);
        if (res.error && (res.error.code === '42703' || res.error.message.includes('phone'))) {
          res = await supabase.from('members').update(profileDataNoPhone).eq('id', user.id);
        }
        saveError = res.error;
      }

      if (!memberProfile || (saveError && !saveError.message.includes('policy'))) {
        let res = await supabase.from('members').upsert(
          {
            id: user.id,
            ...profileDataWithPhone,
          },
          { onConflict: 'id' }
        );

        if (res.error && (res.error.code === '42703' || res.error.message.includes('phone'))) {
          res = await supabase.from('members').upsert(
            {
              id: user.id,
              ...profileDataNoPhone,
            },
            { onConflict: 'id' }
          );
        }
        saveError = res.error;
      }

      if (saveError) {
        setProfileError(saveError.message);
        return;
      }

      await refreshMemberProfile();
      setProfileSuccess('Profile saved successfully.');
      setTimeout(() => setProfileSuccess(null), 4000);
    } catch (err: any) {
      setProfileError(err?.message || 'Failed to update profile.');
    } finally {
      setIsSavingProfile(false);
    }
  };

  const getRoomName = (roomId: string) => {
    const matched = rooms.find((r) => r.id === roomId || r.slug === roomId);
    return matched ? matched.name : roomId || 'Room Reservation';
  };

  const formatDateRange = (inStr: string, outStr: string) => {
    try {
      const inDate = new Date(inStr);
      const outDate = new Date(outStr);
      const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' };
      return `${inDate.toLocaleDateString('en-US', options)} — ${outDate.toLocaleDateString('en-US', options)}`;
    } catch {
      return `${inStr} to ${outStr}`;
    }
  };

  if (initialLoading) {
    return (
      <div className="mh" style={{ minHeight: '60vh', display: 'grid', placeItems: 'center' }}>
        <p className="mh-sub">Loading account...</p>
      </div>
    );
  }

  // Not logged in view
  if (!user) {
    return (
      <div className="mh">
        <div className="mh-head">
          <h1>Sign In</h1>
          <p className="mh-sub">Access your member account, bookings, and privileges.</p>
        </div>

        <div style={{ padding: '0 20px' }}>
          <div className="mh-form">
            <h3>Account Sign In</h3>
            <p>Enter your credentials below to access member benefits.</p>

            {loginError && (
              <div
                style={{
                  background: '#ffe4e6',
                  color: '#9f1239',
                  padding: '10px 12px',
                  borderRadius: 10,
                  fontSize: 13,
                  marginBottom: 14,
                }}
              >
                {loginError}
              </div>
            )}

            <form onSubmit={handleDirectAccountLogin}>
              <div className="mh-field">
                <label htmlFor="acc-email">Email Address</label>
                <input
                  id="acc-email"
                  type="email"
                  required
                  value={accountEmail}
                  onChange={(e) => setAccountEmail(e.target.value)}
                  placeholder="name@example.com"
                />
              </div>

              <div className="mh-field">
                <label htmlFor="acc-pw">Password</label>
                <input
                  id="acc-pw"
                  type="password"
                  required
                  value={accountPassword}
                  onChange={(e) => setAccountPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={isLoggingIn}
                className="mh-btn mh-btn--green mh-btn--block"
                style={{ marginTop: 8 }}
              >
                {isLoggingIn ? 'Signing In...' : 'Sign In'}
              </button>
            </form>

            <div style={{ textAlign: 'center', margin: '18px 0 14px' }}>
              <span style={{ fontSize: 12, color: 'var(--mh-mute)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Or continue with
              </span>
            </div>

            <button
              type="button"
              onClick={signInWithGoogle}
              className="mh-btn mh-btn--ghost-green mh-btn--block"
              style={{ gap: 10 }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              Google Account
            </button>
          </div>
        </div>
      </div>
    );
  }

  const avatarUrl =
    memberProfile?.avatar_url ||
    (user.user_metadata?.avatar_url as string) ||
    (user.user_metadata?.picture as string) ||
    null;
  const initial = (fullName?.[0] || user.email?.[0] || 'M').toUpperCase();

  return (
    <div className="mh">
      {/* Header */}
      <div className="mh-head">
        <h1>My Account</h1>
        <p className="mh-sub">
          Welcome back to Royal Mgwasi Hotel. Manage your bookings and profile.
        </p>
      </div>

      <div className="mh-stack">
        {/* Member Profile Card */}
        <div className="mh-room-card">
          <div className="mh-room-card__body">
            <div style={{ display: 'flex', gap: 14, alignItems: 'center', marginBottom: 14 }}>
              <div className="mh-avatar">
                {avatarUrl ? <img src={avatarUrl} alt={fullName || 'Member'} /> : initial}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
                  <h3 style={{ fontSize: 20, margin: 0 }}>{fullName || 'Loyalty Member'}</h3>
                  <span className="mh-badge mh-badge--gold">★ Royal Member</span>
                </div>
                <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--mh-mute)' }}>
                  {user.email}
                </p>
                {memberProfile?.joined_at && (
                  <p style={{ margin: '2px 0 0', fontSize: 12, color: 'var(--mh-gold)' }}>
                    Member since{' '}
                    {new Date(memberProfile.joined_at).toLocaleDateString('en-US', {
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                )}
              </div>
            </div>

            {/* Edit Profile Form */}
            <form onSubmit={handleProfileSubmit} style={{ marginTop: 16 }}>
              <div className="mh-field">
                <label htmlFor="acc-name">Full Name</label>
                <input
                  id="acc-name"
                  type="text"
                  required
                  value={fullName}
                  placeholder="e.g. John Mwasambili"
                  onChange={(e) => {
                    setProfileSuccess(null);
                    setProfileError(null);
                    setFullName(e.target.value);
                  }}
                />
              </div>

              <div className="mh-field">
                <label htmlFor="acc-phone">Phone / WhatsApp Number</label>
                <input
                  id="acc-phone"
                  type="tel"
                  value={phone}
                  placeholder="+255 762 555 557"
                  onChange={(e) => {
                    setProfileSuccess(null);
                    setProfileError(null);
                    setPhone(e.target.value);
                  }}
                />
              </div>

              <div className="mh-field">
                <label htmlFor="acc-email-field">Email Address</label>
                <input
                  id="acc-email-field"
                  type="email"
                  disabled
                  value={user.email || ''}
                  style={{ opacity: 0.7, background: 'var(--mh-line)' }}
                />
              </div>

              {profileSuccess && (
                <div
                  style={{
                    background: 'rgba(30,60,45,0.08)',
                    color: 'var(--mh-green)',
                    padding: '10px 12px',
                    borderRadius: 10,
                    fontSize: 13,
                    marginBottom: 12,
                  }}
                >
                  {profileSuccess}
                </div>
              )}

              {profileError && (
                <div
                  style={{
                    background: '#ffe4e6',
                    color: '#9f1239',
                    padding: '10px 12px',
                    borderRadius: 10,
                    fontSize: 13,
                    marginBottom: 12,
                  }}
                >
                  {profileError}
                </div>
              )}

              <button
                type="submit"
                disabled={isSavingProfile}
                className="mh-btn mh-btn--green mh-btn--block"
              >
                {isSavingProfile ? 'Saving Changes...' : 'Save Profile Details'}
              </button>

              <button
                type="button"
                onClick={signOut}
                className="mh-btn mh-btn--ghost-green mh-btn--block"
                style={{ marginTop: 10 }}
              >
                Sign Out
              </button>
            </form>
          </div>
        </div>

        {/* Member Privileges Card */}
        <div className="mh-steps" style={{ margin: '0' }}>
          <h2>Royal Member Privileges</h2>
          <ul style={{ listStyle: 'none', padding: 0, margin: '14px 0 0', display: 'flex', flexDirection: 'column', gap: 10, fontSize: 14 }}>
            <li>✓ <strong>Exclusive Member Rates:</strong> Unlock private discount packages on luxury suites</li>
            <li>✓ <strong>Priority Check-In:</strong> Express front desk arrival and early check-in upon request</li>
            <li>✓ <strong>Complimentary Breakfast:</strong> Full hot breakfast included on all reservations</li>
          </ul>
        </div>

        {/* My Bookings Section */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12 }}>
            <h2 style={{ fontSize: 24 }}>My Bookings</h2>
            <button
              type="button"
              className="mh-pill"
              style={{ padding: '6px 14px', fontSize: 13 }}
              onClick={() => navigate('/book')}
            >
              + New Booking
            </button>
          </div>

          {loadingBookings ? (
            <div className="mh-room-card" style={{ padding: 20, textAlign: 'center' }}>
              <p className="mh-sub" style={{ margin: 0 }}>Loading your bookings...</p>
            </div>
          ) : bookings.length === 0 ? (
            <div className="mh-room-card" style={{ padding: 20, textAlign: 'center' }}>
              <h3 style={{ fontSize: 18 }}>No bookings found</h3>
              <p className="mh-sub" style={{ margin: '6px 0 14px' }}>
                You have not made any room reservations yet.
              </p>
              <button
                type="button"
                className="mh-btn mh-btn--green mh-btn--block"
                onClick={() => navigate('/book')}
              >
                Book a Room Now
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {bookings.map((b) => {
                const status = STATUS_CONFIG[b.status] || {
                  label: b.status,
                  bg: '#f1f5f9',
                  text: '#334155',
                };
                return (
                  <article key={b.id} className="mh-room-card" style={{ padding: 16 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                      <h4 style={{ margin: 0, fontSize: 17, fontFamily: 'var(--mh-serif)' }}>
                        {getRoomName(b.room_id)}
                      </h4>
                      <span
                        className="mh-status-pill"
                        style={{ background: status.bg, color: status.text }}
                      >
                        {status.label}
                      </span>
                    </div>
                    <p style={{ margin: '4px 0', fontSize: 14, color: 'var(--mh-mute)' }}>
                      {formatDateRange(b.check_in, b.check_out)}
                    </p>
                    <span style={{ fontSize: 13, color: 'var(--mh-mute)' }}>
                      Guests: {b.guest_count_label || '2 Guests'}
                    </span>
                  </article>
                );
              })}
            </div>
          )}
        </div>

        {/* My Reviews Section */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12 }}>
            <h2 style={{ fontSize: 24 }}>My Reviews</h2>
            <button
              type="button"
              className="mh-pill"
              style={{ padding: '6px 14px', fontSize: 13 }}
              onClick={() => navigate('/reviews')}
            >
              + Write Review
            </button>
          </div>

          {loadingReviews ? (
            <div className="mh-room-card" style={{ padding: 20, textAlign: 'center' }}>
              <p className="mh-sub" style={{ margin: 0 }}>Loading your reviews...</p>
            </div>
          ) : reviews.length === 0 ? (
            <div className="mh-room-card" style={{ padding: 20, textAlign: 'center' }}>
              <h3 style={{ fontSize: 18 }}>No reviews yet</h3>
              <p className="mh-sub" style={{ margin: '6px 0 14px' }}>
                Share your feedback to assist fellow travelers.
              </p>
              <button
                type="button"
                className="mh-btn mh-btn--ghost-green mh-btn--block"
                onClick={() => navigate('/reviews')}
              >
                Share Your Experience
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {reviews.map((rev) => (
                <article key={rev.id} className="mh-rev">
                  <div className="mh-rev-header">
                    <div className="mh-stars">{'★'.repeat(rev.rating)}</div>
                    <span
                      className="mh-status-pill"
                      style={{
                        background: rev.is_published ? '#d1fae5' : '#fef3c7',
                        color: rev.is_published ? '#065f46' : '#92400e',
                      }}
                    >
                      {rev.is_published ? 'Published' : 'Pending review'}
                    </span>
                  </div>
                  <p>{rev.comment}</p>
                  <small>
                    {new Date(rev.created_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </small>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
