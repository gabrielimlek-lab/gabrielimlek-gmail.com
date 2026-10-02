import React, { useState } from 'react';
import { Lock, Heart, KeyRound } from 'lucide-react';
import { verifyPasscode } from '../services/api';

interface PasscodeLockProps {
  albumTitle: string;
  onUnlocked: () => void;
}

export const PasscodeLock: React.FC<PasscodeLockProps> = ({ albumTitle, onUnlocked }) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pin.trim()) return;

    try {
      setLoading(true);
      setError('');
      const ok = await verifyPasscode(pin.trim());
      if (ok) {
        onUnlocked();
      } else {
        setError('Kode sandi tidak cocok. Silakan tanyakan ke Gabriel atau cek kembali.');
      }
    } catch (err) {
      setError('Terjadi kendala saat memeriksa kode');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900 text-stone-100">
      <div className="w-full max-w-sm p-6 sm:p-8 bg-stone-800/90 rounded-3xl border border-stone-700 shadow-2xl text-center space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-rose-500/20 text-rose-400 mx-auto flex items-center justify-center ring-2 ring-rose-500/30">
          <Lock className="w-8 h-8" />
        </div>

        <div>
          <h2 className="font-serif text-2xl font-bold text-white tracking-tight">
            {albumTitle || 'Album Kenangan Privat'}
          </h2>
          <p className="mt-1.5 text-xs text-stone-400">
            Album ini dikunci untuk menjaga privasi momen keluarga & pacar. Masukkan PIN untuk membuka:
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="password"
              maxLength={8}
              autoFocus
              placeholder="Masukkan PIN..."
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className="w-full py-3 text-center tracking-widest text-lg font-mono rounded-2xl bg-stone-900 border border-stone-600 focus:outline-none focus:ring-2 focus:ring-rose-500 text-white placeholder:text-stone-600"
            />
          </div>

          {error && (
            <p className="text-xs text-rose-400 font-medium animate-pulse">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading || !pin.trim()}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white font-bold text-sm shadow-lg shadow-rose-900/40 transition disabled:opacity-50"
          >
            {loading ? 'Memeriksa...' : 'Buka Kenangan'}
          </button>
        </form>

        <div className="text-[11px] text-stone-500 flex items-center justify-center gap-1">
          <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
          <span>Hanya untuk pacar & keluarga tersayang</span>
        </div>
      </div>
    </div>
  );
};
