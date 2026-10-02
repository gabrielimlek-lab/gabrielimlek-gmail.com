import React from 'react';
import { Heart, Users, Star, Calendar, Sparkles, Search, Compass, MapPin } from 'lucide-react';
import { AlbumConfig, Photo } from '../types';

interface HeroBannerProps {
  config: AlbumConfig;
  stats: {
    totalPhotos: number;
    pacarPhotos: number;
    keluargaPhotos: number;
    spesialPhotos: number;
    liburanPhotos: number;
    favoritePhotos: number;
    totalNotes: number;
  };
  searchTerm: string;
  onSearchChange: (val: string) => void;
  showOnlyFavorites: boolean;
  onToggleFavorites: () => void;
  featuredPhoto?: Photo;
  onOpenPhoto: (photo: Photo) => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  config,
  stats,
  searchTerm,
  onSearchChange,
  showOnlyFavorites,
  onToggleFavorites,
  featuredPhoto,
  onOpenPhoto
}) => {
  // Calculate anniversary days if provided
  let daysTogether = 0;
  if (config.anniversaryDate) {
    const start = new Date(config.anniversaryDate).getTime();
    const now = new Date().getTime();
    const diff = now - start;
    if (diff > 0) {
      daysTogether = Math.floor(diff / (1000 * 60 * 60 * 24));
    }
  }

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-rose-900 via-stone-900 to-amber-950 text-white shadow-xl mb-8 p-6 sm:p-8 lg:p-10 border border-stone-800">
      {/* Decorative ambient background glows */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-rose-500/15 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-amber-500/15 blur-3xl pointer-events-none" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column: Title, emotional subtitle, stats */}
        <div className="lg:col-span-7 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs text-rose-200 font-medium">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Album Privat & Kenangan Terindah</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
            {config.title || 'Kita & Keluarga'}
          </h1>

          <p className="text-stone-300 text-sm sm:text-base max-w-xl leading-relaxed">
            {config.subTitle ||
              'Ruang hangat untuk mengabadikan setiap detik berharga bersama pacar tersayang dan keluarga tercinta, yang bisa diakses dan ditambahkan kapan saja oleh kita semua.'}
          </p>

          {/* Stat Badges */}
          <div className="flex flex-wrap gap-2.5 pt-2">
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 text-xs text-white">
              <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
              <span>
                <strong className="text-white font-bold">{stats.pacarPhotos}</strong> Foto Pacar
              </span>
            </div>

            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 text-xs text-white">
              <Users className="w-3.5 h-3.5 text-amber-300" />
              <span>
                <strong className="text-white font-bold">{stats.keluargaPhotos}</strong> Foto Keluarga
              </span>
            </div>

            {daysTogether > 0 && (
              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-rose-500/20 backdrop-blur-md border border-rose-400/30 text-xs text-rose-200">
                <Calendar className="w-3.5 h-3.5 text-rose-300" />
                <span>
                  <strong className="text-white font-bold">{daysTogether}</strong> Hari Bersama Sayang
                </span>
              </div>
            )}

            <button
              onClick={onToggleFavorites}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-medium transition ${
                showOnlyFavorites
                  ? 'bg-amber-400 text-stone-950 font-bold shadow-md shadow-amber-400/20'
                  : 'bg-white/10 hover:bg-white/20 text-amber-200 border border-white/10'
              }`}
            >
              <Star className={`w-3.5 h-3.5 ${showOnlyFavorites ? 'fill-stone-950' : 'fill-amber-300'}`} />
              <span>{showOnlyFavorites ? 'Tampilkan Semua' : `Foto Favorit (${stats.favoritePhotos})`}</span>
            </button>
          </div>

          {/* Quick Search */}
          <div className="pt-2 max-w-md">
            <div className="relative">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari foto berdasarkan nama, tempat, caption, atau pengunggah..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/10 border border-white/15 focus:bg-white/20 focus:border-rose-400 focus:outline-none text-white text-xs sm:text-sm placeholder:text-stone-400 transition"
              />
              {searchTerm && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-white text-xs"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Featured Memory Highlight */}
        {featuredPhoto && (
          <div className="lg:col-span-5">
            <div
              onClick={() => onOpenPhoto(featuredPhoto)}
              className="group relative cursor-pointer overflow-hidden rounded-2xl bg-stone-800/80 border border-white/15 p-3 shadow-2xl transition hover:border-rose-400/50 hover:shadow-rose-950/50"
            >
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-stone-950">
                <img
                  src={featuredPhoto.imageUrl}
                  alt={featuredPhoto.title}
                  className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-black/20" />
                
                {/* Highlight Badge */}
                <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full bg-rose-600/90 text-white text-[10px] font-bold tracking-wide backdrop-blur-xs flex items-center gap-1 shadow-xs">
                  <Sparkles className="w-3 h-3" />
                  <span>Kilas Balik Hari Ini</span>
                </div>

                {/* Photo info on image */}
                <div className="absolute bottom-3 left-3 right-3 text-left">
                  <h4 className="font-serif font-bold text-white text-base sm:text-lg line-clamp-1 group-hover:text-rose-200 transition">
                    {featuredPhoto.title}
                  </h4>
                  <div className="flex items-center gap-2 text-[11px] text-stone-300 mt-1">
                    {featuredPhoto.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-rose-400" />
                        {featuredPhoto.location}
                      </span>
                    )}
                    <span>• {featuredPhoto.date}</span>
                  </div>
                </div>
              </div>

              <div className="mt-2.5 px-1 flex items-center justify-between text-xs text-stone-400">
                <span className="truncate max-w-[200px]">
                  Diupload oleh <strong className="text-stone-300">{featuredPhoto.uploadedBy}</strong>
                </span>
                <span className="text-rose-300 font-medium group-hover:underline flex items-center gap-1">
                  Buka Kenangan →
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
