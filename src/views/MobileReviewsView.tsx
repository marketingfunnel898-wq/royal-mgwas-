import React, { useState } from 'react';
import { submitReview } from '../data';
import { useHotelData } from '../context/HotelDataContext';

export const MobileReviewsView: React.FC = () => {
  const { reviews, initialLoading, user, memberProfile } = useHotelData();
  const [filter, setFilter] = useState<string>('All');
  const [showForm, setShowForm] = useState(false);
  const [newReview, setNewReview] = useState({
    name: memberProfile?.full_name || user?.user_metadata?.full_name || '',
    tripType: 'Leisure stay',
    rating: 5,
    comment: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filterOptions = ['All', '5 Stars', '4 Stars', 'Leisure', 'Business'];

  const filteredReviews = reviews.filter((rev) => {
    if (filter === 'All') return true;
    if (filter === '5 Stars') return rev.rating === 5;
    if (filter === '4 Stars') return rev.rating === 4;
    if (filter === 'Leisure') return rev.tripType?.toLowerCase().includes('leisure');
    if (filter === 'Business') return rev.tripType?.toLowerCase().includes('business');
    return true;
  });

  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.name || !newReview.comment || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await submitReview({
        guest_name: newReview.name,
        trip_type: newReview.tripType,
        rating: Number(newReview.rating),
        comment: newReview.comment,
        member_id: user?.id ?? null,
      });
      setSubmitted(true);
      setNewReview({ name: '', tripType: 'Leisure stay', rating: 5, comment: '' });
    } catch (err) {
      console.warn('Error submitting review:', err);
      setSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mh">
      {/* Header */}
      <div className="mh-head">
        <h1>Guest Reviews</h1>
        <p className="mh-sub">
          Genuine feedback from travelers, business executives, and families visiting Mbeya.
        </p>
      </div>

      {/* Big 4.3 Score Card */}
      <div className="mh-score-card">
        <div className="mh-score">
          <b>4.3</b>
          <div>
            <div className="mh-stars" style={{ fontSize: 20 }}>★★★★★</div>
            <small>118 Google Reviews</small>
          </div>
        </div>
        <p style={{ margin: '8px 0 0', fontSize: 14, color: 'var(--mh-mute)' }}>
          Rated Very Good on Google for clean rooms, 24/7 hot showers, delicious food, and friendly service in Forest Mpya.
        </p>
        <button
          type="button"
          className="mh-btn mh-btn--ghost-green mh-btn--block"
          style={{ marginTop: 16 }}
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Close review form' : 'Write a review'}
        </button>
      </div>

      {/* Collapsible / Expandable Review Form */}
      {showForm && (
        <div style={{ padding: '0 20px', marginBottom: 20 }}>
          <div className="mh-form">
            <h3>Leave a Guest Review</h3>
            <p>Did you stay with us recently? We appreciate your feedback.</p>

            <form onSubmit={handleAddReview}>
              <div className="mh-field">
                <label htmlFor="rev-name">Your Name *</label>
                <input
                  id="rev-name"
                  type="text"
                  required
                  placeholder="e.g. David B."
                  value={newReview.name}
                  onChange={(e) => {
                    if (submitted) setSubmitted(false);
                    setNewReview({ ...newReview, name: e.target.value });
                  }}
                />
              </div>

              <div className="mh-field">
                <label htmlFor="rev-rating">Rating</label>
                <select
                  id="rev-rating"
                  value={newReview.rating}
                  onChange={(e) => {
                    if (submitted) setSubmitted(false);
                    setNewReview({ ...newReview, rating: Number(e.target.value) });
                  }}
                >
                  <option value={5}>★★★★★ (5/5 Excellent)</option>
                  <option value={4}>★★★★☆ (4/5 Very Good)</option>
                  <option value={3}>★★★☆☆ (3/5 Average)</option>
                </select>
              </div>

              <div className="mh-field">
                <label htmlFor="rev-trip">Trip Type</label>
                <select
                  id="rev-trip"
                  value={newReview.tripType}
                  onChange={(e) => {
                    if (submitted) setSubmitted(false);
                    setNewReview({ ...newReview, tripType: e.target.value });
                  }}
                >
                  <option value="Leisure stay">Leisure stay</option>
                  <option value="Business trip">Business trip</option>
                  <option value="Family holiday">Family holiday</option>
                  <option value="Weekend getaway">Weekend getaway</option>
                </select>
              </div>

              <div className="mh-field">
                <label htmlFor="rev-comment">Your Comments *</label>
                <textarea
                  id="rev-comment"
                  rows={3}
                  required
                  placeholder="Share details of your room, meals, or staff service..."
                  value={newReview.comment}
                  onChange={(e) => {
                    if (submitted) setSubmitted(false);
                    setNewReview({ ...newReview, comment: e.target.value });
                  }}
                />
              </div>

              {submitted && (
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
                  Thank you! Your review has been submitted for moderation.
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="mh-btn mh-btn--green mh-btn--block"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Filter Pills */}
      <div className="mh-filter-rail" role="tablist" aria-label="Review filter">
        {filterOptions.map((opt) => (
          <button
            key={opt}
            role="tab"
            aria-selected={filter === opt}
            onClick={() => setFilter(opt)}
            className={`mh-pill ${filter === opt ? 'is-active' : ''}`}
          >
            {opt}
          </button>
        ))}
      </div>

      {/* Reviews Cards List */}
      <div style={{ padding: '0 20px' }}>
        {initialLoading && reviews.length === 0 ? (
          [1, 2, 3].map((n) => (
            <div key={n} className="mh-rev mh-skeleton" style={{ minHeight: 120 }} />
          ))
        ) : filteredReviews.length === 0 ? (
          <div className="mh-note" style={{ margin: 0 }}>
            <h3>No reviews match</h3>
            <p>No reviews found for this selection.</p>
          </div>
        ) : (
          filteredReviews.map((rev) => (
            <article key={rev.id} className="mh-rev">
              <div className="mh-rev-header">
                <h4>{rev.name}</h4>
                <small>{rev.date}</small>
              </div>
              <div className="mh-rev-meta">{rev.tripType}</div>
              <div className="mh-stars" aria-label={`${rev.rating} stars`}>
                {'★'.repeat(rev.rating)}
              </div>
              <p>{rev.comment}</p>
            </article>
          ))
        )}
      </div>
    </div>
  );
};
