import React, { useState, useEffect } from 'react';
import {
  Heart,
  Users,
  Camera,
  Share2,
  Sparkles,
  MessageSquareHeart,
  Star,
  Plus,
  RefreshCw,
  Image as ImageIcon
} from 'lucide-react';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { PhotoCard } from './components/PhotoCard';
import { PhotoModal } from './components/PhotoModal';
import { UploadModal } from './components/UploadModal';
import { ShareAccessModal } from './components/ShareAccessModal';
import { LoveNotesBoard } from './components/LoveNotesBoard';
import { SettingsModal } from './components/SettingsModal';
import { SlideshowModal } from './components/SlideshowModal';
import { PasscodeLock } from './components/PasscodeLock';
import {
  Photo,
  MemoryNote,
  AlbumConfig,
  CategoryType,
  CurrentUser
} from './types';
import {
  fetchPhotos,
  uploadPhoto,
  updatePhoto,
  deletePhoto,
  toggleLikePhoto,
  addComment,
  deleteComment,
  fetchNotes,
  addNote,
  deleteNote,
  fetchAlbumInfo,
  updateAlbumInfo
} from './services/api';

const DEFAULT_USER: CurrentUser = {
  name: 'Gabriel',
  role: 'owner',
  avatarBg: 'bg-rose-600'
};

export default function App() {
  // Current user / identity state with localStorage persistence
  const [currentUser, setCurrentUser] = useState<CurrentUser>(() => {
    try {
      const saved = localStorage.getItem('kita_current_user');
      return saved ? JSON.parse(saved) : DEFAULT_USER;
    } catch {
      return DEFAULT_USER;
    }
  });

  // App data state
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [notes, setNotes] = useState<MemoryNote[]>([]);
  const [albumConfig, setAlbumConfig] = useState<AlbumConfig>({
    title: 'Kita & Keluarga',
    subTitle: 'Ruang Kenangan Bersama Pacar Tercinta & Keluarga',
    ownerName: 'Gabriel',
    partnerName: 'Sayang',
    anniversaryDate: '2023-08-17',
    requirePasscode: false
  });
  const [stats, setStats] = useState({
    totalPhotos: 0,
    pacarPhotos: 0,
    keluargaPhotos: 0,
    spesialPhotos: 0,
    liburanPhotos: 0,
    favoritePhotos: 0,
    totalNotes: 0
  });

  // UI state
  const [currentCategory, setCurrentCategory] = useState<CategoryType>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Modals
  const [activePhoto, setActivePhoto] = useState<Photo | null>(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSlideshowOpen, setIsSlideshowOpen] = useState(false);

  // Passcode lock state
  const [isLocked, setIsLocked] = useState(false);

  // Save current user to localStorage
  const handleUserChange = (newUser: CurrentUser) => {
    setCurrentUser(newUser);
    try {
      localStorage.setItem('kita_current_user', JSON.stringify(newUser));
    } catch (e) {
      console.warn('Could not save user to storage', e);
    }
  };

  // Initial load
  const loadData = async () => {
    try {
      setIsLoading(true);
      const [photosData, notesData, infoData] = await Promise.all([
        fetchPhotos(),
        fetchNotes(),
        fetchAlbumInfo()
      ]);

      setPhotos(photosData);
      setNotes(notesData);
      setAlbumConfig(infoData.config);
      setStats(infoData.stats);

      // Check passcode
      if (infoData.config.requirePasscode) {
        const unlocked = sessionStorage.getItem('kita_unlocked') === 'true';
        if (!unlocked) {
          setIsLocked(true);
        }
      }
    } catch (err) {
      console.error('Failed to load album data', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filtered photos
  const filteredPhotos = photos.filter((p) => {
    if (currentCategory !== 'all' && p.category !== currentCategory) return false;
    if (showOnlyFavorites && !p.isFavorite) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchTitle = p.title.toLowerCase().includes(q);
      const matchCaption = p.caption.toLowerCase().includes(q);
      const matchLoc = p.location?.toLowerCase().includes(q);
      const matchUploader = p.uploadedBy?.toLowerCase().includes(q);
      const matchTags = p.tags?.some((t) => t.toLowerCase().includes(q));
      if (!matchTitle && !matchCaption && !matchLoc && !matchUploader && !matchTags) return false;
    }
    return true;
  });

  // Pick random or first favorite for featured highlight
  const featuredPhoto = photos.find((p) => p.isFavorite) || photos[0];

  // Actions
  const handleToggleLike = async (photoId: string) => {
    // Optimistic update
    setPhotos((prev) =>
      prev.map((p) => {
        if (p.id !== photoId) return p;
        const alreadyLiked = p.likedBy?.includes(currentUser.name);
        const newLikedBy = alreadyLiked
          ? p.likedBy.filter((u) => u !== currentUser.name)
          : [...(p.likedBy || []), currentUser.name];
        const newLikesCount = alreadyLiked
          ? Math.max(0, p.likesCount - 1)
          : p.likesCount + 1;
        return { ...p, likesCount: newLikesCount, likedBy: newLikedBy };
      })
    );

    if (activePhoto && activePhoto.id === photoId) {
      const alreadyLiked = activePhoto.likedBy?.includes(currentUser.name);
      const newLikedBy = alreadyLiked
        ? activePhoto.likedBy.filter((u) => u !== currentUser.name)
        : [...(activePhoto.likedBy || []), currentUser.name];
      const newLikesCount = alreadyLiked
        ? Math.max(0, activePhoto.likesCount - 1)
        : activePhoto.likesCount + 1;
      setActivePhoto({ ...activePhoto, likesCount: newLikesCount, likedBy: newLikedBy });
    }

    try {
      const res = await toggleLikePhoto(photoId, currentUser.name);
      setPhotos((prev) =>
        prev.map((p) =>
          p.id === photoId
            ? { ...p, likesCount: res.likesCount, likedBy: res.likedBy }
            : p
        )
      );
    } catch (err) {
      console.error('Like toggle failed', err);
    }
  };

  const handleToggleFavorite = async (photoId: string, currentFav: boolean) => {
    const nextFav = !currentFav;
    setPhotos((prev) =>
      prev.map((p) => (p.id === photoId ? { ...p, isFavorite: nextFav } : p))
    );
    if (activePhoto && activePhoto.id === photoId) {
      setActivePhoto({ ...activePhoto, isFavorite: nextFav });
    }
    try {
      await updatePhoto(photoId, { isFavorite: nextFav });
      setStats((prev) => ({
        ...prev,
        favoritePhotos: nextFav ? prev.favoritePhotos + 1 : Math.max(0, prev.favoritePhotos - 1)
      }));
    } catch (err) {
      console.error('Favorite update failed', err);
    }
  };

  const handleAddComment = async (
    photoId: string,
    commentData: { author: string; role: string; text: string; emoji?: string }
  ) => {
    const updatedComments = await addComment(photoId, commentData);
    setPhotos((prev) =>
      prev.map((p) => (p.id === photoId ? { ...p, comments: updatedComments } : p))
    );
    if (activePhoto && activePhoto.id === photoId) {
      setActivePhoto({ ...activePhoto, comments: updatedComments });
    }
  };

  const handleDeleteComment = async (photoId: string, commentId: string) => {
    const updatedComments = await deleteComment(photoId, commentId);
    setPhotos((prev) =>
      prev.map((p) => (p.id === photoId ? { ...p, comments: updatedComments } : p))
    );
    if (activePhoto && activePhoto.id === photoId) {
      setActivePhoto({ ...activePhoto, comments: updatedComments });
    }
  };

  const handleDeletePhoto = async (photoId: string) => {
    await deletePhoto(photoId);
    setPhotos((prev) => prev.filter((p) => p.id !== photoId));
    setActivePhoto(null);
    // Reload stats
    const info = await fetchAlbumInfo();
    setStats(info.stats);
  };

  const handleUpdatePhoto = async (photoId: string, updates: Partial<Photo>) => {
    const updated = await updatePhoto(photoId, updates);
    setPhotos((prev) => prev.map((p) => (p.id === photoId ? updated : p)));
    if (activePhoto && activePhoto.id === photoId) {
      setActivePhoto(updated);
    }
  };

  const handleUploadSuccess = async (formData: FormData) => {
    const newPhoto = await uploadPhoto(formData);
    setPhotos((prev) => [newPhoto, ...prev]);
    const info = await fetchAlbumInfo();
    setStats(info.stats);
  };

  const handleAddNote = async (noteData: {
    from: string;
    to: string;
    role: string;
    message: string;
    color: string;
  }) => {
    const newNote = await addNote(noteData);
    setNotes((prev) => [newNote, ...prev]);
  };

  const handleDeleteNote = async (id: string) => {
    await deleteNote(id);
    setNotes((prev) => prev.filter((n) => n.id !== id));
  };

  const handleSaveConfig = async (updated: Partial<AlbumConfig & { passcode?: string }>) => {
    await updateAlbumInfo(updated);
    const info = await fetchAlbumInfo();
    setAlbumConfig(info.config);
  };

  if (isLocked) {
    return (
      <PasscodeLock
        albumTitle={albumConfig.title}
        onUnlocked={() => {
          sessionStorage.setItem('kita_unlocked', 'true');
          setIsLocked(false);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 flex flex-col">
      {/* Top Navbar */}
      <Navbar
        currentCategory={currentCategory}
        onSelectCategory={(cat) => {
          setCurrentCategory(cat);
          setShowOnlyFavorites(false);
        }}
        currentUser={currentUser}
        onChangeUser={handleUserChange}
        onOpenUpload={() => setIsUploadOpen(true)}
        onOpenShare={() => setIsShareOpen(true)}
        onOpenNotes={() => setIsNotesOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onStartSlideshow={() => setIsSlideshowOpen(true)}
        totalPhotos={photos.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 w-full">
        {/* Hero Section */}
        <HeroBanner
          config={albumConfig}
          stats={stats}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          showOnlyFavorites={showOnlyFavorites}
          onToggleFavorites={() => setShowOnlyFavorites(!showOnlyFavorites)}
          featuredPhoto={featuredPhoto}
          onOpenPhoto={(photo) => setActivePhoto(photo)}
        />

        {/* Category Header & Filter Indicator */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-2">
            <h2 className="font-serif font-bold text-xl sm:text-2xl text-stone-900">
              {showOnlyFavorites
                ? '⭐ Foto Favorit'
                : currentCategory === 'all'
                ? 'Semua Momen'
                : currentCategory === 'pacar'
                ? '❤️ Bersama Pacar Tercinta'
                : currentCategory === 'keluarga'
                ? '👨‍👩‍👧‍👦 Keluarga Tercinta'
                : currentCategory === 'spesial'
                ? '✨ Momen Spesial & Prestasi'
                : '🏖️ Liburan Bersama'}
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-stone-200/80 text-stone-700">
              {filteredPhotos.length} foto
            </span>
          </div>

          <div className="flex items-center gap-2">
            {searchTerm && (
              <span className="text-xs text-stone-500 bg-stone-100 px-3 py-1.5 rounded-xl border border-stone-200">
                Pencarian: "<strong>{searchTerm}</strong>"
                <button
                  onClick={() => setSearchTerm('')}
                  className="ml-1.5 text-stone-400 hover:text-stone-700"
                >
                  ✕
                </button>
              </span>
            )}

            <button
              onClick={() => setIsUploadOpen(true)}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold transition"
            >
              <Plus className="w-3.5 h-3.5 text-rose-500" />
              <span>Tambah Foto</span>
            </button>
          </div>
        </div>

        {/* Gallery Grid */}
        {isLoading ? (
          <div className="text-center py-24 space-y-3">
            <RefreshCw className="w-8 h-8 mx-auto text-rose-500 animate-spin" />
            <p className="text-stone-500 text-sm font-medium">Memuat kenangan berharga...</p>
          </div>
        ) : filteredPhotos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredPhotos.map((photo) => (
              <PhotoCard
                key={photo.id}
                photo={photo}
                currentUser={currentUser}
                onOpenPhoto={(p) => setActivePhoto(p)}
                onToggleLike={handleToggleLike}
                onToggleFavorite={handleToggleFavorite}
              />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-20 px-4 rounded-3xl bg-white border border-stone-200/80 shadow-xs max-w-lg mx-auto space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-rose-50 text-rose-500 mx-auto flex items-center justify-center">
              <Camera className="w-8 h-8" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-stone-900">
                Belum ada foto di sini
              </h3>
              <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
                {searchTerm
                  ? 'Tidak ada foto yang cocok dengan pencarian kata kunci tersebut.'
                  : 'Ayo jadikan album ini penuh kenangan! Unggah foto momen manis bersama pacar atau kebersamaan keluarga.'}
              </p>
            </div>
            <button
              onClick={() => setIsUploadOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white font-semibold text-xs shadow-md shadow-rose-200 transition"
            >
              + Unggah Foto Sekarang
            </button>
          </div>
        )}

        {/* Love Notes Teaser Strip */}
        {notes.length > 0 && (
          <div className="mt-14 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-amber-50 via-rose-50 to-pink-50 border border-rose-200/60 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white shadow-xs border border-rose-200 flex items-center justify-center text-rose-500 shrink-0">
                <MessageSquareHeart className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-serif font-bold text-base sm:text-lg text-stone-900">
                  Papan Pesan & Doa Keluarga ({notes.length} Pesan Tersimpan)
                </h4>
                <p className="text-xs text-stone-600 mt-0.5 line-clamp-1 italic">
                  "{notes[0].message}" — <strong className="text-stone-800">{notes[0].from}</strong>
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsNotesOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-stone-900 hover:bg-black text-white text-xs font-semibold shrink-0 shadow-sm transition"
            >
              Buka Papan Pesan Lengkap →
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-stone-200/80 bg-white py-8 text-stone-500 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-rose-500 text-white flex items-center justify-center font-serif text-xs">
              ❤️
            </div>
            <span className="font-serif font-bold text-stone-900">
              {albumConfig.title}
            </span>
            <span>• Dibuat dengan cinta untuk pacar & keluarga</span>
          </div>

          <div className="flex items-center gap-3 text-stone-400">
            <span>Bisa diakses dari semua smartphone & PC</span>
            <span>•</span>
            <button
              onClick={() => setIsShareOpen(true)}
              className="text-rose-600 hover:underline font-semibold"
            >
              Bagi Link Akses
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      {activePhoto && (
        <PhotoModal
          photo={activePhoto}
          allPhotos={filteredPhotos}
          currentUser={currentUser}
          onClose={() => setActivePhoto(null)}
          onSelectPhoto={(p) => setActivePhoto(p)}
          onToggleLike={handleToggleLike}
          onToggleFavorite={handleToggleFavorite}
          onAddComment={handleAddComment}
          onDeleteComment={handleDeleteComment}
          onDeletePhoto={handleDeletePhoto}
          onUpdatePhoto={handleUpdatePhoto}
        />
      )}

      {isUploadOpen && (
        <UploadModal
          currentUser={currentUser}
          onClose={() => setIsUploadOpen(false)}
          onUploadSuccess={handleUploadSuccess}
        />
      )}

      {isShareOpen && (
        <ShareAccessModal
          config={albumConfig}
          onClose={() => setIsShareOpen(false)}
        />
      )}

      {isNotesOpen && (
        <LoveNotesBoard
          notes={notes}
          currentUser={currentUser}
          onClose={() => setIsNotesOpen(false)}
          onAddNote={handleAddNote}
          onDeleteNote={handleDeleteNote}
        />
      )}

      {isSettingsOpen && (
        <SettingsModal
          config={albumConfig}
          allPhotos={photos}
          onClose={() => setIsSettingsOpen(false)}
          onSaveConfig={handleSaveConfig}
        />
      )}

      {isSlideshowOpen && (
        <SlideshowModal
          photos={filteredPhotos.length > 0 ? filteredPhotos : photos}
          onClose={() => setIsSlideshowOpen(false)}
        />
      )}
    </div>
  );
}
