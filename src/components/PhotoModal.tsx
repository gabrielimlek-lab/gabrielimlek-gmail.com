import React, { useState, useEffect } from 'react';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Heart,
  MessageCircle,
  MapPin,
  Calendar,
  Download,
  Trash2,
  Edit3,
  Send,
  User,
  Star,
  Sparkles,
  Share2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Photo, CurrentUser, Comment } from '../types';

interface PhotoModalProps {
  photo: Photo;
  allPhotos: Photo[];
  currentUser: CurrentUser;
  onClose: () => void;
  onSelectPhoto: (photo: Photo) => void;
  onToggleLike: (photoId: string) => void;
  onToggleFavorite: (photoId: string, currentFav: boolean) => void;
  onAddComment: (
    photoId: string,
    comment: { author: string; role: string; text: string; emoji?: string }
  ) => Promise<void>;
  onDeleteComment: (photoId: string, commentId: string) => Promise<void>;
  onDeletePhoto: (photoId: string) => Promise<void>;
  onUpdatePhoto: (photoId: string, updates: Partial<Photo>) => Promise<void>;
}

const QUICK_EMOJIS = ['❤️', '🥰', '😍', '😂', '👏', '🎂', '🥺', '✨', '💐'];

export const PhotoModal: React.FC<PhotoModalProps> = ({
  photo,
  allPhotos,
  currentUser,
  onClose,
  onSelectPhoto,
  onToggleLike,
  onToggleFavorite,
  onAddComment,
  onDeleteComment,
  onDeletePhoto,
  onUpdatePhoto
}) => {
  const [commentText, setCommentText] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('❤️');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(photo.title);
  const [editCaption, setEditCaption] = useState(photo.caption);
  const [editLocation, setEditLocation] = useState(photo.location);
  const [editDate, setEditDate] = useState(photo.date);
  const [isDeleting, setIsDeleting] = useState(false);

  // Find index in photo array for navigation
  const currentIndex = allPhotos.findIndex((p) => p.id === photo.id);
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < allPhotos.length - 1;

  const handlePrev = () => {
    if (hasPrev) onSelectPhoto(allPhotos[currentIndex - 1]);
  };

  const handleNext = () => {
    if (hasNext) onSelectPhoto(allPhotos[currentIndex + 1]);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft' && hasPrev) handlePrev();
      if (e.key === 'ArrowRight' && hasNext) handleNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, hasPrev, hasNext]);

  const isLiked = photo.likedBy?.includes(currentUser.name);

  const handleLike = (e: React.MouseEvent) => {
    if (!isLiked) {
      confetti({
        particleCount: 25,
        spread: 60,
        origin: { x: 0.5, y: 0.5 },
        colors: ['#f43f5e', '#ec4899', '#fda4af']
      });
    }
    onToggleLike(photo.id);
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || isSubmittingComment) return;

    try {
      setIsSubmittingComment(true);
      await onAddComment(photo.id, {
        author: currentUser.name,
        role: currentUser.role,
        text: commentText.trim(),
        emoji: selectedEmoji
      });
      setCommentText('');
    } catch (err) {
      console.error('Error submitting comment:', err);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleSaveEdit = async () => {
    try {
      await onUpdatePhoto(photo.id, {
        title: editTitle,
        caption: editCaption,
        location: editLocation,
        date: editDate
      });
      setIsEditing(false);
    } catch (err) {
      console.error('Failed to update photo', err);
    }
  };

  const handleDeletePhoto = async () => {
    if (window.confirm('Yakin ingin menghapus foto kenangan ini?')) {
      try {
        setIsDeleting(true);
        await onDeletePhoto(photo.id);
        onClose();
      } catch (err) {
        console.error('Failed to delete photo', err);
        setIsDeleting(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      {/* Background click to close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-6xl max-h-[94vh] bg-stone-900 rounded-3xl overflow-hidden shadow-2xl flex flex-col lg:flex-row border border-stone-800">
        
        {/* Close Button Top Right */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 z-30 p-2 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-md transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Side: Photo Viewer */}
        <div className="relative flex-1 bg-black flex items-center justify-center min-h-[300px] lg:min-h-[580px] overflow-hidden select-none">
          <img
            src={photo.imageUrl}
            alt={photo.title}
            className="max-h-[85vh] w-auto max-w-full object-contain mx-auto transition-transform"
          />

          {/* Navigation Arrows */}
          {hasPrev && (
            <button
              onClick={handlePrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-md transition shadow-md"
              title="Foto Sebelumnya"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}
          {hasNext && (
            <button
              onClick={handleNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-md transition shadow-md"
              title="Foto Berikutnya"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}

          {/* Photo Download & Fullscreen Controls Bottom Left */}
          <div className="absolute bottom-3 left-3 flex items-center gap-2">
            <a
              href={photo.imageUrl}
              download={`${photo.title || 'kenangan'}.jpg`}
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 rounded-xl bg-black/60 hover:bg-black/80 text-white text-xs backdrop-blur-md transition flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Unduh Asli</span>
            </a>
          </div>
        </div>

        {/* Right Side: Details, Story & Comments */}
        <div className="w-full lg:w-96 xl:w-[420px] bg-white flex flex-col justify-between max-h-[85vh] overflow-y-auto">
          {/* Header Info */}
          <div className="p-5 border-b border-stone-100 space-y-3">
            {!isEditing ? (
              <>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-stone-100 text-stone-600">
                      {photo.category === 'pacar'
                        ? 'Bersama Pacar'
                        : photo.category === 'keluarga'
                        ? 'Keluarga'
                        : photo.category === 'spesial'
                        ? 'Momen Spesial'
                        : 'Liburan'}
                    </span>
                    <h2 className="font-serif font-bold text-xl text-stone-900 mt-1">
                      {photo.title}
                    </h2>
                  </div>

                  {/* Actions (Edit / Delete / Star) */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onToggleFavorite(photo.id, photo.isFavorite)}
                      title={photo.isFavorite ? 'Favorit' : 'Jadikan Favorit'}
                      className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-400 hover:text-amber-500 transition"
                    >
                      <Star
                        className={`w-4 h-4 ${
                          photo.isFavorite ? 'fill-amber-400 text-amber-500' : ''
                        }`}
                      />
                    </button>
                    <button
                      onClick={() => setIsEditing(true)}
                      title="Edit Judul/Cerita"
                      className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-400 hover:text-stone-700 transition"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={handleDeletePhoto}
                      disabled={isDeleting}
                      title="Hapus Foto"
                      className="p-1.5 rounded-lg hover:bg-rose-50 text-stone-400 hover:text-rose-600 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {photo.caption && (
                  <p className="text-stone-700 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap bg-stone-50 p-3 rounded-xl border border-stone-100">
                    "{photo.caption}"
                  </p>
                )}

                <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-stone-500">
                  {photo.location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-rose-500" />
                      {photo.location}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-stone-400" />
                    {photo.date || 'Kenangan'}
                  </span>
                </div>

                <div className="text-[11px] text-stone-400">
                  Diupload oleh <strong className="text-stone-700">{photo.uploadedBy}</strong>
                </div>
              </>
            ) : (
              /* Edit Mode */
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-stone-800">Edit Info Foto</h3>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  placeholder="Judul Foto"
                  className="w-full text-xs p-2 rounded-lg border border-stone-300"
                />
                <textarea
                  value={editCaption}
                  onChange={(e) => setEditCaption(e.target.value)}
                  placeholder="Cerita atau kenangan di balik foto..."
                  rows={3}
                  className="w-full text-xs p-2 rounded-lg border border-stone-300"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={editLocation}
                    onChange={(e) => setEditLocation(e.target.value)}
                    placeholder="Lokasi (cth: Bali)"
                    className="w-full text-xs p-2 rounded-lg border border-stone-300"
                  />
                  <input
                    type="date"
                    value={editDate}
                    onChange={(e) => setEditDate(e.target.value)}
                    className="w-full text-xs p-2 rounded-lg border border-stone-300"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-1">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-2.5 py-1 text-xs text-stone-500 hover:bg-stone-100 rounded"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleSaveEdit}
                    className="px-3 py-1 text-xs bg-rose-600 text-white rounded font-medium"
                  >
                    Simpan Perubahan
                  </button>
                </div>
              </div>
            )}

            {/* Like Counter & Likers summary */}
            <div className="pt-2 flex items-center justify-between border-t border-stone-100">
              <button
                onClick={handleLike}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition active:scale-95 ${
                  isLiked
                    ? 'bg-rose-50 border-rose-200 text-rose-600'
                    : 'bg-stone-50 hover:bg-rose-50 border-stone-200 text-stone-700'
                }`}
              >
                <Heart
                  className={`w-4 h-4 ${
                    isLiked ? 'fill-rose-500 text-rose-500' : 'text-stone-400'
                  }`}
                />
                <span>{photo.likesCount || 0} Kasih Cinta</span>
              </button>

              {photo.likedBy && photo.likedBy.length > 0 && (
                <span className="text-[11px] text-stone-400 truncate max-w-[190px]">
                  Disukai oleh: {photo.likedBy.join(', ')}
                </span>
              )}
            </div>
          </div>

          {/* Comments Section */}
          <div className="p-5 flex-1 overflow-y-auto space-y-3.5">
            <h4 className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
              <MessageCircle className="w-3.5 h-3.5 text-rose-500" />
              <span>Komentar & Kesan ({photo.comments?.length || 0})</span>
            </h4>

            {photo.comments && photo.comments.length > 0 ? (
              <div className="space-y-3">
                {photo.comments.map((comm) => (
                  <div
                    key={comm.id}
                    className="p-3 rounded-2xl bg-stone-50 border border-stone-100/90 text-xs space-y-1 relative group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-800 font-bold text-[10px] flex items-center justify-center">
                          {comm.author.charAt(0)}
                        </span>
                        <span className="font-semibold text-stone-800">{comm.author}</span>
                        {comm.emoji && <span>{comm.emoji}</span>}
                      </div>
                      <span className="text-[10px] text-stone-400">
                        {new Date(comm.createdAt).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short'
                        })}
                      </span>
                    </div>

                    <p className="text-stone-600 pl-6 leading-relaxed">{comm.text}</p>

                    {/* Delete comment option if current user is author or owner */}
                    {(currentUser.name === comm.author || currentUser.role === 'owner') && (
                      <button
                        onClick={() => onDeleteComment(photo.id, comm.id)}
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-[10px] text-stone-400 hover:text-rose-600 transition"
                        title="Hapus Komentar"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-stone-400 text-xs">
                Belum ada komentar. Jadilah yang pertama meninggalkan pesan manis! ❤️
              </div>
            )}
          </div>

          {/* Comment Input Footer */}
          <div className="p-4 border-t border-stone-100 bg-stone-50/70">
            {/* Quick Emoji selection */}
            <div className="flex items-center gap-1.5 mb-2 overflow-x-auto no-scrollbar pb-1">
              <span className="text-[10px] text-stone-400 font-medium">Reaksi:</span>
              {QUICK_EMOJIS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => {
                    setSelectedEmoji(emoji);
                    setCommentText((prev) => prev + ' ' + emoji);
                  }}
                  className="text-sm p-1 rounded-md hover:bg-stone-200/80 transition active:scale-95"
                >
                  {emoji}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmitComment} className="flex gap-2">
              <input
                type="text"
                placeholder={`Tulis kesan sebagai ${currentUser.name}...`}
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="flex-1 text-xs px-3.5 py-2.5 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-rose-400 bg-white"
              />
              <button
                type="submit"
                disabled={!commentText.trim() || isSubmittingComment}
                className="px-3.5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white font-medium text-xs flex items-center gap-1 transition"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
