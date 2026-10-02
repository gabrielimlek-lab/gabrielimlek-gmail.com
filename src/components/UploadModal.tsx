import React, { useState, useRef } from 'react';
import {
  X,
  Upload,
  Image as ImageIcon,
  Heart,
  Users,
  Sparkles,
  Calendar,
  MapPin,
  Tag,
  Link as LinkIcon
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CurrentUser, CategoryType } from '../types';

interface UploadModalProps {
  currentUser: CurrentUser;
  onClose: () => void;
  onUploadSuccess: (formData: FormData) => Promise<void>;
}

export const UploadModal: React.FC<UploadModalProps> = ({
  currentUser,
  onClose,
  onUploadSuccess
}) => {
  const [uploadMode, setUploadMode] = useState<'file' | 'url'>('file');
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imageUrlInput, setImageUrlInput] = useState('');
  
  const [title, setTitle] = useState('');
  const [caption, setCaption] = useState('');
  const [category, setCategory] = useState<'pacar' | 'keluarga' | 'spesial' | 'liburan'>('pacar');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [location, setLocation] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
      setErrorMsg('');

      // Auto set title if empty
      if (!title) {
        const cleanName = selectedFile.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
        setTitle(cleanName.charAt(0).toUpperCase() + cleanName.slice(1));
      }
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type.startsWith('image/')) {
        setFile(droppedFile);
        setPreviewUrl(URL.createObjectURL(droppedFile));
        setErrorMsg('');
      } else {
        setErrorMsg('Hanya file foto/gambar yang diperbolehkan');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (uploadMode === 'file' && !file) {
      setErrorMsg('Silakan pilih file foto terlebih dahulu');
      return;
    }

    if (uploadMode === 'url' && !imageUrlInput.trim()) {
      setErrorMsg('Silakan masukkan link/URL gambar');
      return;
    }

    if (!title.trim()) {
      setErrorMsg('Harap isi judul momen');
      return;
    }

    try {
      setIsSubmitting(true);
      const formData = new FormData();
      if (uploadMode === 'file' && file) {
        formData.append('photoFile', file);
      } else {
        formData.append('imageUrl', imageUrlInput.trim());
      }

      formData.append('title', title.trim());
      formData.append('caption', caption.trim());
      formData.append('category', category);
      formData.append('date', date);
      formData.append('location', location.trim());
      formData.append('uploadedBy', currentUser.name);
      formData.append('uploadedByRole', currentUser.role);
      formData.append('isFavorite', isFavorite ? 'true' : 'false');
      formData.append('tags', tagsInput);

      await onUploadSuccess(formData);

      // Trigger celebration confetti
      confetti({
        particleCount: 40,
        spread: 70,
        origin: { y: 0.6 }
      });

      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Gagal menyimpan foto. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between bg-stone-50/50">
          <div>
            <h2 className="font-serif font-bold text-lg text-stone-900 flex items-center gap-2">
              <Upload className="w-5 h-5 text-rose-500" />
              <span>Simpan Foto Kenangan Baru</span>
            </h2>
            <p className="text-xs text-stone-500">
              Mengunggah sebagai: <strong className="text-stone-700">{currentUser.name}</strong>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-stone-200/80 text-stone-500 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
              {errorMsg}
            </div>
          )}

          {/* Mode Switcher: File or URL */}
          <div className="flex rounded-xl bg-stone-100 p-1 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setUploadMode('file')}
              className={`flex-1 py-1.5 rounded-lg transition ${
                uploadMode === 'file' ? 'bg-white shadow-xs text-stone-900' : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              Unggah File dari HP / Laptop
            </button>
            <button
              type="button"
              onClick={() => setUploadMode('url')}
              className={`flex-1 py-1.5 rounded-lg transition ${
                uploadMode === 'url' ? 'bg-white shadow-xs text-stone-900' : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              Gunakan Link Gambar (URL)
            </button>
          </div>

          {/* Upload Area */}
          {uploadMode === 'file' ? (
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`relative border-2 border-dashed rounded-2xl p-4 sm:p-6 text-center cursor-pointer transition ${
                previewUrl ? 'border-rose-400 bg-rose-50/20' : 'border-stone-300 hover:border-rose-400 bg-stone-50/50'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />

              {previewUrl ? (
                <div className="space-y-3">
                  <div className="relative max-h-56 mx-auto rounded-xl overflow-hidden shadow-sm inline-block">
                    <img src={previewUrl} alt="Preview" className="max-h-56 object-contain rounded-xl" />
                  </div>
                  <p className="text-xs text-rose-600 font-medium">
                    Klik untuk mengganti foto ({file?.name})
                  </p>
                </div>
              ) : (
                <div className="space-y-2 py-4">
                  <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 mx-auto flex items-center justify-center">
                    <ImageIcon className="w-6 h-6" />
                  </div>
                  <div className="text-xs sm:text-sm font-semibold text-stone-700">
                    Pilih foto dari galeri atau seret ke sini
                  </div>
                  <p className="text-[11px] text-stone-400">
                    Mendukung JPG, PNG, WEBP, HEIC hingga 25MB
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              <label className="block text-xs font-semibold text-stone-700">
                Link URL Gambar:
              </label>
              <div className="relative">
                <LinkIcon className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={imageUrlInput}
                  onChange={(e) => {
                    setImageUrlInput(e.target.value);
                    setPreviewUrl(e.target.value);
                  }}
                  className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-rose-400"
                />
              </div>
              {imageUrlInput && (
                <div className="max-h-40 rounded-xl overflow-hidden bg-stone-100 p-1 flex justify-center">
                  <img
                    src={imageUrlInput}
                    alt="Preview"
                    className="max-h-36 object-contain rounded-lg"
                    onError={() => setErrorMsg('Gambar tidak dapat dimuat dari URL ini')}
                  />
                </div>
              )}
            </div>
          )}

          {/* Form Fields */}
          <div className="space-y-3">
            {/* Title */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Judul Momen <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Cth: Kencan Romantis di Bandung, Wisuda, Makan Bareng Mama"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full text-xs sm:text-sm px-3.5 py-2 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-rose-400"
              />
            </div>

            {/* Category Selector */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                Kategori Kenangan
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => setCategory('pacar')}
                  className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
                    category === 'pacar'
                      ? 'bg-rose-50 border-rose-300 text-rose-700 ring-2 ring-rose-200'
                      : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  <Heart className="w-3.5 h-3.5 fill-current text-rose-500" />
                  <span>Bersama Pacar</span>
                </button>

                <button
                  type="button"
                  onClick={() => setCategory('keluarga')}
                  className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
                    category === 'keluarga'
                      ? 'bg-amber-50 border-amber-300 text-amber-800 ring-2 ring-amber-200'
                      : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  <Users className="w-3.5 h-3.5 text-amber-600" />
                  <span>Keluarga</span>
                </button>

                <button
                  type="button"
                  onClick={() => setCategory('spesial')}
                  className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
                    category === 'spesial'
                      ? 'bg-purple-50 border-purple-300 text-purple-700 ring-2 ring-purple-200'
                      : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-purple-500" />
                  <span>Momen Spesial</span>
                </button>

                <button
                  type="button"
                  onClick={() => setCategory('liburan')}
                  className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
                    category === 'liburan'
                      ? 'bg-sky-50 border-sky-300 text-sky-700 ring-2 ring-sky-200'
                      : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  <span>Liburan</span>
                </button>
              </div>
            </div>

            {/* Caption / Story */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Cerita / Pesan Kenangan
              </label>
              <textarea
                placeholder="Ceritakan sedikit cerita manis atau lucu di balik momen ini..."
                rows={3}
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                className="w-full text-xs sm:text-sm px-3.5 py-2 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-rose-400"
              />
            </div>

            {/* Location & Date */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-rose-500" />
                  <span>Lokasi</span>
                </label>
                <input
                  type="text"
                  placeholder="Cth: Ubud, Bali / Rumah Mama"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full text-xs px-3.5 py-2 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-rose-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-stone-400" />
                  <span>Tanggal Momen</span>
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full text-xs px-3.5 py-2 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-rose-400"
                />
              </div>
            </div>

            {/* Tags & Favorite Checkbox */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center pt-1">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1 flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5 text-stone-400" />
                  <span>Tag / Kata Kunci (pisahkan koma)</span>
                </label>
                <input
                  type="text"
                  placeholder="kencan, sunset, liburan"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  className="w-full text-xs px-3 py-1.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-rose-400"
                />
              </div>

              <div className="flex items-center gap-2 pt-4">
                <input
                  type="checkbox"
                  id="favoriteCheck"
                  checked={isFavorite}
                  onChange={(e) => setIsFavorite(e.target.checked)}
                  className="w-4 h-4 text-rose-600 rounded border-stone-300 focus:ring-rose-500 cursor-pointer"
                />
                <label htmlFor="favoriteCheck" className="text-xs font-medium text-stone-700 cursor-pointer">
                  Tandai sebagai Foto Favorit ⭐
                </label>
              </div>
            </div>
          </div>

          {/* Footer Submit Buttons */}
          <div className="pt-4 border-t border-stone-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-100 transition"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 disabled:opacity-50 text-white text-xs sm:text-sm font-semibold shadow-md shadow-rose-200 transition"
            >
              {isSubmitting ? 'Menyimpan Kenangan...' : 'Simpan ke Album'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
