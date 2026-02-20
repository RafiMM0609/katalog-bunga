'use client'

import { Star } from "lucide-react";

interface RatingStarsProps {
  rating: number;
  onRatingChange: (rating: number) => void;
  interactive?: boolean;
}

export default function RatingStars({ 
  rating, 
  onRatingChange, 
  interactive = true 
}: RatingStarsProps) {
  return (
    <div className="flex gap-2">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          onClick={() => interactive && onRatingChange(star)}
          disabled={!interactive}
          className={`transition-transform ${
            interactive ? 'active:scale-90 hover:scale-110 focus:outline-none' : ''
          }`}
        >
          <Star
            size={32}
            fill={star <= rating ? "#FBBF24" : "none"}
            className={
              star <= rating
                ? "text-yellow-400"
                : "text-gray-300 hover:text-yellow-200"
            }
          />
        </button>
      ))}
    </div>
  );
}
