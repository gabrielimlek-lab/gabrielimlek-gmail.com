import React, { useState } from 'react';
import { Heart, MessageCircle, MapPin, Calendar, Star, Sparkles, User } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Photo, CurrentUser } from '../types';

interface PhotoCardProps {
  photo: Photo;
  currentUser: CurrentUser;
  onOpenPhoto: (photo: Photo) => void;
  onToggleLike: (photoId: string) => void;
  onToggleFavorite: (photoId: string, currentFav: boolean) => void;
}

export const PhotoCard: React.FC<PhotoCardProps> = ({
  photo,
  currentUser,
  onOpenPhoto,
  onToggleLike,
  onToggleFavorite
}) => {
  const [isLiking, setIsLiking] = useState(false);
  const isLiked = photo.likedBy?.includes(currentUser.name);

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLiking(true);

    if (!isLiked) {
      // Trigger tiny sweet confetti or heart splash
      confetti({
        particleCount: 18,
        spread: 45,
        origin: {
          x: e.clientX / window.innerWidth,
          y: e.clientY / window.innerHeight
        },
        colors: ['#f43f5e', '#ec4899', '#fbcfe8']
      });
    }

    onToggleLike(photo.id);
    setTimeout(() => setIsLiking(false), 300);
  };

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite(photo.id, photo.isFavorite);
  };

  // Category styling
  const categoryConfig = {
    pacar: {
      label: 'Bersama Pacar',
      bg: 'bg-rose-50 text-rose-700 border-rose-200/60',
      dot: 'bg-rose-500'
    },
    keluarga: {
      label: 'Keluarga',
      bg: 'bg-amber-50 text-amber-800 border-amber-200/60',
      dot: 'bg-amber-500'
    },
    spesial: {
      label: 'Momen Spesial',
      bg: 'bg-purple-50 text-purple-700 border-purple-200/60',
      dot: 'bg-purple-500'
    },
    liburan: {
      label: 'Liburan',
      bg: 'bg-sky-50 text-sky-700 border-sky-200/60',
      dot: 'bg-sky-500'
    }
  }[photo.category] || {
    label: photo.category,
    bg: 'bg-stone-50 text-stone-700 border-stone-200',
    dot: 'bg-stone-400'
  };

  return (
    <div
      onClick={() => onOpenPhoto(photo)}
      className="group relative bg-white rounded-2xl sm:rounded-3xl border border-stone-200/90 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden flex flex-col cursor-pointer"
    >
      {/* Photo Frame Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-100">
        <img
          src={photo.imageUrl}
          alt={photo.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Gradient Overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-stone-950/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
          {/* Category Tag */}
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide backdrop-blur-md border shadow-xs ${categoryConfig.bg}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${categoryConfig.dot}`} />
            {categoryConfig.label}
          </span>

          {/* Favorite Star Button */}
          <button
            onClick={handleFavorite}
            title={photo.isFavorite ? 'Hapus dari Favorit' : 'Tandai sebagai Favorit'}
            className="p-1.5 rounded-full bg-white/80 hover:bg-white text-stone-600 hover:text-amber-500 backdrop-blur-md shadow-xs transition active:scale-90"
          >
            <Star
              className={`w-4 h-4 transition ${
                photo.isFavorite ? 'fill-amber-400 text-amber-500' : 'text-stone-400'
              }`}
            />
          </button>
        </div>

        {/* Hover info pill on bottom of image */}
        <div className="absolute bottom-3 left-3 right-3 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-between pointer-events-none">
          <span className="font-medium bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-lg">
            🔍 Klik untuk perbesar & komentar
          </span>
          <span className="text-[11px] bg-black/40 backdrop-blur-md px-2 py-1 rounded-lg">
            {photo.comments?.length || 0} komentar
          </span>
        </div>
      </div>

      {/* Card Content & Details */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Title */}
          <h3 className="font-serif font-bold text-base sm:text-lg text-stone-900 leading-snug group-hover:text-rose-600 transition line-clamp-1">
            {photo.title}
          </h3>

          {/* Caption / Story */}
          {photo.caption && (
            <p className="mt-1 text-xs sm:text-sm text-stone-600 line-clamp-2 leading-relaxed">
              {photo.caption}
            </p>
          )}

          {/* Location and Date Metadata */}
          <div className="mt-3 flex flex-wrap items-center gap-y-1 gap-x-3 text-[11px] text-stone-500">
            {photo.location && (
              <span className="flex items-center gap-1 truncate max-w-[170px]" title={photo.location}>
                <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                <span className="truncate">{photo.location}</span>
              </span>
            )}
            <span className="flex items-center gap-1 shrink-0">
              <Calendar className="w-3.5 h-3.5 text-stone-400" />
              <span>{photo.date || 'Kenangan'}</span>
            </span>
          </div>

          {/* Tags */}
          {photo.tags && photo.tags.length > 0 && (
            <div className="mt-2.5 flex flex-wrap gap-1">
              {photo.tags.slice(0, 3).map((tag, idx) => (
                <span
                  key={idx}
                  className="text-[10px] text-stone-500 bg-stone-100 px-2 py-0.5 rounded-md font-medium"
                >
                  #{tag}
                </span>
              ))}
              {photo.tags.length > 3 && (
                <span className="text-[10px] text-stone-400 self-center">
                  +{photo.tags.length - 3}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Footer: Uploader & Reactions */}
        <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
          {/* Uploader info */}
          <div className="flex items-center gap-1.5 text-stone-500 text-[11px]">
            <span className="w-5 h-5 rounded-full bg-stone-200 text-stone-700 flex items-center justify-center font-bold text-[9px]">
              {photo.uploadedBy?.charAt(0) || 'K'}
            </span>
            <span className="truncate max-w-[110px]">
              {photo.uploadedBy || 'Gabriel'}
            </span>
          </div>

          {/* Action buttons (Like & Comment) */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleLike}
              className={`flex items-center gap-1 text-xs font-semibold transition active:scale-90 ${
                isLiked ? 'text-rose-600' : 'text-stone-500 hover:text-rose-600'
              } ${isLiking ? 'scale-125' : ''}`}
              title={isLiked ? 'Batal Suka' : 'Sukai Foto Ini'}
            >
              <Heart
                className={`w-4 h-4 transition ${
                  isLiked ? 'fill-rose-500 text-rose-500' : 'text-stone-400'
                }`}
              />
              <span>{photo.likesCount || 0}</span>
            </button>

            <div className="flex items-center gap-1 text-stone-400 text-xs">
              <MessageCircle className="w-4 h-4" />
              <span>{photo.comments?.length || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
