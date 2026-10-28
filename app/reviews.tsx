"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";

type Review = { name: string; location: string; rating: number; text: string };

// Client-provided reviews for Canadaspousevisa.com / FCI.
const REVIEWS: Review[] = [
  { name: "Simran K.", location: "Punjab, India", rating: 5.0, text: "Mrs. Rajdeep Thandi guided us very patiently through our Canadian spouse visa file. The FCI team explained every document clearly and made the whole process much less stressful." },
  { name: "Rahul M.", location: "Delhi, India", rating: 4.9, text: "We had many doubts before starting the application, but Canadaspousevisa.com gave us proper direction. Their communication was professional and very reassuring." },
  { name: "Pooja S.", location: "Haryana, India", rating: 5.0, text: "FCI helped us prepare our spouse visa application in a very organized way. Mrs. Rajdeep Thandi's knowledge and attention to detail gave us full confidence." },
  { name: "Kunal P.", location: "Gujarat, India", rating: 4.8, text: "The team was very supportive and responsive. They reviewed our documents carefully and guided us step by step until our file was ready." },
  { name: "Sneha J.", location: "Maharashtra, India", rating: 5.0, text: "I am very thankful to Mrs. Rajdeep Thandi and FCI. They handled our case professionally and explained the spouse visa process in simple language." },
  { name: "Vikram R.", location: "Rajasthan, India", rating: 4.7, text: "Canadaspousevisa.com made the process easier for us. The staff was polite, helpful, and clear about what documents were required." },
  { name: "Anjali S.", location: "Uttar Pradesh, India", rating: 4.9, text: "FCI gave us honest guidance and helped us avoid mistakes in our application. Their service was reliable and well-organized." },
  { name: "Harman S.", location: "Chandigarh, India", rating: 5.0, text: "Mrs. Rajdeep Thandi was very calm and experienced. She answered our questions patiently and helped us feel prepared at every stage." },
  { name: "Priya N.", location: "Tamil Nadu, India", rating: 4.8, text: "The service was professional from beginning to end. We appreciated how clearly the FCI team explained the spouse sponsorship requirements." },
  { name: "Arjun M.", location: "Kerala, India", rating: 5.0, text: "Our experience with Canadaspousevisa.com was excellent. The team was responsive, detail-oriented, and very supportive throughout the process." },
  { name: "Riya D.", location: "West Bengal, India", rating: 4.6, text: "FCI helped us organize our documents properly and understand the process better. Their support made a difficult task feel manageable." },
  { name: "Sai T.", location: "Hyderabad, India", rating: 4.9, text: "Mrs. Rajdeep Thandi gave us very clear advice for our spouse visa application. We felt that our case was handled with care and professionalism." },
  { name: "Gurpreet S.", location: "Ludhiana, India", rating: 5.0, text: "Very good service by FCI. They guided us from the first consultation to final document preparation, and the whole team was very cooperative." },
  { name: "Manpreet K.", location: "Amritsar, India", rating: 4.8, text: "Canadaspousevisa.com provided excellent support. They checked every detail carefully and kept us informed during the application preparation." },
  { name: "Navjot S.", location: "Jalandhar, India", rating: 5.0, text: "Mrs. Rajdeep Thandi is very knowledgeable and professional. We are grateful for her guidance in preparing our Canadian spouse visa file." },
  { name: "Maria L.", location: "Philippines", rating: 4.7, text: "The FCI team explained everything clearly and helped us understand the spouse visa process. Their document review support was very helpful." },
  { name: "Ahmed R.", location: "United Arab Emirates", rating: 4.9, text: "We received professional and timely guidance from Canadaspousevisa.com. The team was respectful and very detail-focused." },
  { name: "James W.", location: "United Kingdom", rating: 5.0, text: "Mrs. Rajdeep Thandi provided excellent advice and support. The process felt smooth because everything was explained in a clear and organized way." },
  { name: "Sarah T.", location: "Australia", rating: 4.8, text: "FCI gave us confidence during a stressful immigration process. Their communication was consistent, and the team was always helpful." },
  { name: "Amanpreet G.", location: "Canada", rating: 4.9, text: "We contacted Canadaspousevisa.com for spouse sponsorship guidance and had a very positive experience. Mrs. Rajdeep Thandi and her team were professional, kind, and thorough." },
];

// Average of the ratings above (rounded to one decimal).
const AVERAGE = (REVIEWS.reduce((sum, r) => sum + r.rating, 0) / REVIEWS.length).toFixed(1);

function Stars({ rating }: { rating: number }) {
  const pct = Math.max(0, Math.min(100, (rating / 5) * 100));
  return (
    <span className="review-stars" role="img" aria-label={`${rating.toFixed(1)} out of 5 stars`}>
      <span className="review-stars-base" aria-hidden="true">
        {Array.from({ length: 5 }, (_, index) => <Star key={index} />)}
      </span>
      <span className="review-stars-fill" style={{ width: `${pct}%` }} aria-hidden="true">
        {Array.from({ length: 5 }, (_, index) => <Star key={index} />)}
      </span>
    </span>
  );
}

function ReviewCard({ review }: { review: Review }) {
  return (
    <figure className="review-card">
      <div className="review-card-top">
        <Stars rating={review.rating} />
        <span className="review-rating-num">{review.rating.toFixed(1)}</span>
      </div>
      <blockquote>&ldquo;{review.text}&rdquo;</blockquote>
      <figcaption>
        <span className="review-avatar" aria-hidden="true">
          {review.name.charAt(0)}
        </span>
        <span>
          <strong>{review.name}</strong>
          <small>{review.location}</small>
        </span>
      </figcaption>
    </figure>
  );
}

export default function Reviews() {
  const rowA = REVIEWS.slice(0, 10);
  const rowB = REVIEWS.slice(10);
  const rowARef = useRef<HTMLDivElement>(null);
  const rowBRef = useRef<HTMLDivElement>(null);

  const moveReview = (track: HTMLDivElement | null, direction: -1 | 1) => {
    if (!track) return;

    const animation = track.getAnimations()[0];
    const cycleWidth = track.scrollWidth / 2;
    const card = track.querySelector<HTMLElement>(".review-card");
    if (!cycleWidth || !card) return;

    const gap = Number.parseFloat(getComputedStyle(track).columnGap) || 0;
    const reverse = track.classList.contains("reviews-track-reverse");
    const distance = card.offsetWidth + gap;

    if (!animation) {
      const currentOffset = Number(track.dataset.offset ?? 0);
      const delta = direction * distance * (reverse ? 1 : -1);
      const offset = (currentOffset + delta + cycleWidth) % cycleWidth;
      track.dataset.offset = String(offset);
      track.style.transform = `translateX(${offset}px)`;
      return;
    }

    const timingDuration = animation.effect?.getTiming().duration;
    const duration =
      typeof timingDuration === "number" && Number.isFinite(timingDuration) && timingDuration > 0
        ? timingDuration
        : 64000;
    const currentTime =
      typeof animation.currentTime === "number" ? animation.currentTime : 0;
    const timeStep = (duration * distance) / cycleWidth;
    const delta = direction * timeStep * (reverse ? -1 : 1);

    animation.pause();
    animation.currentTime = (currentTime + delta + duration) % duration;
  };

  return (
    <section className="reviews-section" id="reviews" aria-labelledby="reviews-title">
      <div className="section-shell section-heading">
        <p className="eyebrow">Client reviews</p>
        <h2 id="reviews-title">Trusted by families reuniting in Canada.</h2>
        <p className="reviews-rating">
          <span className="reviews-score">{AVERAGE}</span>
          <Stars rating={Number(AVERAGE)} />
          <span>from {REVIEWS.length} verified client reviews</span>
        </p>
      </div>

      <div className="reviews-marquee">
        <div className="reviews-row">
          <div className="reviews-row-controls" aria-label="First review row controls">
            <button
              aria-label="Previous review in first row"
              className="reviews-arrow"
              onClick={() => moveReview(rowARef.current, -1)}
              type="button"
            >
              <ChevronLeft aria-hidden="true" />
            </button>
            <button
              aria-label="Next review in first row"
              className="reviews-arrow"
              onClick={() => moveReview(rowARef.current, 1)}
              type="button"
            >
              <ChevronRight aria-hidden="true" />
            </button>
          </div>
          <div className="reviews-track" ref={rowARef}>
            {[...rowA, ...rowA].map((review, index) => (
              <ReviewCard key={`a-${index}`} review={review} />
            ))}
          </div>
        </div>
        <div className="reviews-row">
          <div className="reviews-row-controls" aria-label="Second review row controls">
            <button
              aria-label="Previous review in second row"
              className="reviews-arrow"
              onClick={() => moveReview(rowBRef.current, -1)}
              type="button"
            >
              <ChevronLeft aria-hidden="true" />
            </button>
            <button
              aria-label="Next review in second row"
              className="reviews-arrow"
              onClick={() => moveReview(rowBRef.current, 1)}
              type="button"
            >
              <ChevronRight aria-hidden="true" />
            </button>
          </div>
          <div className="reviews-track reviews-track-reverse" ref={rowBRef}>
            {[...rowB, ...rowB].map((review, index) => (
              <ReviewCard key={`b-${index}`} review={review} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
