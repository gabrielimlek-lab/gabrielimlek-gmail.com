import React, { useState } from 'react';
import { X, Copy, Check, Share2, Smartphone, ShieldCheck, MessageCircle, Heart, Users } from 'lucide-react';
import confetti from 'canvas-confetti';
import { AlbumConfig } from '../types';

interface ShareAccessModalProps {
  config: AlbumConfig;
  onClose: () => void;
}

export const ShareAccessModal: React.FC<ShareAccessModalProps> = ({ config, onClose }) => {
  const [copied, setCopied] = useState(false);
  
  // Current app URL
  const shareUrl = typeof window !== 'undefined' ? window.location.origin : 'https://...';

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    confetti({
      particleCount: 20,
      spread: 40,
      origin: { y: 0.6 }
    });
    setTimeout(() => setCopied(false), 2500);
  };

  const handleShareWhatsapp = () => {
    const text = encodeURIComponent(
      `Halo! ❤️ Ini website album kenangan privat kita bersama (${config.title}). Kamu bisa buka langsung dari HP, lihat semua foto, kasih komentar, dan upload foto kenangan kamu juga di sini:\n\n${shareUrl}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-rose-50 to-amber-50 border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-rose-500 text-white shadow-xs">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-lg text-stone-900">
                Bagikan Akses ke Pacar & Keluarga
              </h2>
              <p className="text-xs text-stone-500">
                Mereka dapat membuka web ini dari smartphone atau laptop kapan saja
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-stone-200/80 text-stone-500 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 text-stone-700 text-xs sm:text-sm">
          {/* Link Box */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-stone-800">
              Link Web Album Kenangan:
            </label>
            <div className="flex items-center gap-2">
              <div className="flex-1 px-3.5 py-2.5 rounded-xl bg-stone-100 border border-stone-300 font-mono text-xs text-stone-800 truncate select-all">
                {shareUrl}
              </div>
              <button
                onClick={handleCopy}
                className="px-4 py-2.5 rounded-xl bg-stone-900 hover:bg-black text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm transition active:scale-95"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Tersalin!' : 'Salin Link'}</span>
              </button>
            </div>
          </div>

          {/* Quick WhatsApp Share */}
          <button
            onClick={handleShareWhatsapp}
            className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 transition active:scale-98"
          >
            <MessageCircle className="w-4 h-4 fill-white" />
            <span>Kirim Link via WhatsApp (Pacar / Grup Keluarga)</span>
          </button>

          {/* How It Works Guide */}
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-3">
            <h4 className="font-bold text-xs text-stone-900 flex items-center gap-1.5">
              <Smartphone className="w-4 h-4 text-rose-500" />
              <span>Cara Pacar & Keluarga Mengakses:</span>
            </h4>
            
            <div className="space-y-2 text-xs text-stone-600">
              <div className="flex gap-2">
                <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-700 font-bold flex items-center justify-center shrink-0 text-[10px]">
                  1
                </span>
                <span>
                  <strong>Langsung Buka di Browser:</strong> Cukup klik link dari WhatsApp, website akan terbuka di Chrome/Safari HP tanpa perlu instal aplikasi apa pun.
                </span>
              </div>

              <div className="flex gap-2">
                <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-700 font-bold flex items-center justify-center shrink-0 text-[10px]">
                  2
                </span>
                <span>
                  <strong>Pilih Identitas Sendiri:</strong> Di pojok kanan atas, pacar bisa klik "Akses Sebagai" lalu memilih namanya (atau mengetik nama sendiri).
                </span>
              </div>

              <div className="flex gap-2">
                <span className="w-5 h-5 rounded-full bg-sky-100 text-sky-700 font-bold flex items-center justify-center shrink-0 text-[10px]">
                  3
                </span>
                <span>
                  <strong>Bisa Langsung Upload & Komentar:</strong> Pacar dan keluarga bisa langsung mengunggah foto baru dari galeri HP mereka, memberi suka hati ❤️, dan menulis komentar!
                </span>
              </div>
            </div>
          </div>

          {/* Privacy Note */}
          <div className="flex items-center gap-2 text-stone-500 text-[11px] pt-1">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              Album ini bersifat privat dan hanya orang yang memiliki link yang dapat melihat dan menambahkan foto.
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-stone-50 border-t border-stone-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-800 text-xs font-semibold transition"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
