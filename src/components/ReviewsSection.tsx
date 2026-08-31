import React from 'react';
import { REVIEWS } from '../data/catalog';
import { Star, CheckCircle, Heart, Quote } from 'lucide-react';

export const ReviewsSection: React.FC = () => {
  return (
    <section className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-8">
      <div className="text-center space-y-2 mb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-black">
          <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
          <span>Experiencias Reales</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-amber-950 tracking-tight">
          Clientes Felices con sus Flores Eternas 🐝🌻
        </h2>
        <p className="text-xs sm:text-sm text-amber-800/80 font-medium max-w-md mx-auto">
          Cada flor está tejida con amor y dedicación para crear recuerdos imborrables.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {REVIEWS.map((review) => (
          <div
            key={review.id}
            className="p-5 bg-white rounded-3xl border border-amber-200 shadow-2xs hover:shadow-md transition-shadow relative flex flex-col justify-between"
          >
            <div className="space-y-3">
              {/* Star rating & Date */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <span className="text-[11px] text-amber-700/60 font-semibold">{review.date}</span>
              </div>

              {/* Comment */}
              <p className="text-xs sm:text-sm text-amber-950 font-medium leading-relaxed italic">
                "{review.comment}"
              </p>
            </div>

            {/* Author info */}
            <div className="mt-4 pt-3 border-t border-amber-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <img
                  src={review.avatar}
                  alt={review.author}
                  className="w-9 h-9 rounded-full object-cover border border-amber-200"
                />
                <div>
                  <h4 className="text-xs font-extrabold text-amber-950 flex items-center gap-1">
                    {review.author}
                    <CheckCircle className="w-3 h-3 text-emerald-600 fill-emerald-100" />
                  </h4>
                  <p className="text-[10px] text-amber-800/70 font-semibold truncate max-w-[140px]">
                    Compró: {review.productName}
                  </p>
                </div>
              </div>

              <span className="text-[10px] font-black text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                Verificado
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
