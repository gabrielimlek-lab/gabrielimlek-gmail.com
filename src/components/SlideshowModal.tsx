import React, { useState, useEffect } from 'react';
import { X, Play, Pause, ChevronLeft, ChevronRight, Heart, MapPin, Calendar } from 'lucide-react';
import { Photo } from '../types';

interface SlideshowModalProps {
  photos: Photo[];
  onClose: () => void;
  initialIndex?: number;
}

export const SlideshowModal: React.FC<SlideshowModalProps> = ({
  photos,
  onClose,
  initialIndex = 0
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isPlaying, setIsPlaying] = useState(true);

  const currentPhoto = photos[currentIndex] || photos[0];

  useEffect(() => {
    if (!isPlaying || photos.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % photos.length);
    }, 4500);

    return () => clearInterval(timer);
  }, [isPlaying, photos.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === ' ' || e.key === 'Spacebar') {
        e.preventDefault();
        setIsPlaying((prev) => !prev);
      }
      if (e.key === 'ArrowLeft') {
        setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);
      }
      if (e.key === 'ArrowRight') {
        setCurrentIndex((prev) => (prev + 1) % photos.length);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [photos.length, onClose]);

  if (!currentPhoto) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col justify-between animate-in fade-in duration-300">
      {/* Blurred dynamic backdrop */}
      <div
        className="absolute inset-0 bg-cover bg-center filter blur-3xl opacity-30 scale-110 pointer-events-none transition-all duration-1000"
        style={{ backgroundImage: `url(${currentPhoto.imageUrl})` }}
      />

      {/* Top Header Bar */}
      <div className="relative z-10 px-6 py-4 flex items-center justify-between bg-gradient-to-b from-black/80 to-transparent text-white">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-rose-600/80 flex items-center justify-center">
            <Heart className="w-4 h-4 fill-white text-white" />
          </div>
          <div>
            <h2 className="font-serif font-bold text-sm sm:text-base tracking-wide">
              Bioskop Kenangan Kita
            </h2>
            <p className="text-[11px] text-stone-400">
              {currentIndex + 1} dari {photos.length} foto
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md text-xs font-semibold flex items-center gap-1.5 transition"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isPlaying ? 'Jeda' : 'Lanjut'}</span>
          </button>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Center Main Stage */}
      <div className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-8 overflow-hidden select-none">
        <button
          onClick={() => setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length)}
          className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-md transition"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <img
          key={currentPhoto.id}
          src={currentPhoto.imageUrl}
          alt={currentPhoto.title}
          className="max-h-[72vh] max-w-full object-contain rounded-2xl shadow-2xl transition-all duration-700 animate-in fade-in zoom-in-95"
        />

        <button
          onClick={() => setCurrentIndex((prev) => (prev + 1) % photos.length)}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-md transition"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Bottom Caption Bar */}
      <div className="relative z-10 p-6 bg-gradient-to-t from-black/90 via-black/60 to-transparent text-white text-center max-w-3xl mx-auto w-full">
        <h3 className="font-serif font-bold text-lg sm:text-2xl text-white">
          {currentPhoto.title}
        </h3>
        {currentPhoto.caption && (
          <p className="mt-1 text-xs sm:text-sm text-stone-300 italic">
            "{currentPhoto.caption}"
          </p>
        )}
        <div className="mt-2 flex items-center justify-center gap-4 text-[11px] text-stone-400">
          {currentPhoto.location && (
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3 text-rose-400" />
              {currentPhoto.location}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {currentPhoto.date}
          </span>
          <span>Diupload oleh {currentPhoto.uploadedBy}</span>
        </div>
      </div>
    </div>
  );
};
