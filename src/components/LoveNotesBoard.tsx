import React, { useState } from 'react';
import { X, Plus, Heart, Trash2, Send, Sparkles, MessageSquareHeart } from 'lucide-react';
import confetti from 'canvas-confetti';
import { MemoryNote, CurrentUser } from '../types';

interface LoveNotesBoardProps {
  notes: MemoryNote[];
  currentUser: CurrentUser;
  onClose: () => void;
  onAddNote: (note: { from: string; to: string; role: string; message: string; color: string }) => Promise<void>;
  onDeleteNote: (id: string) => Promise<void>;
}

const COLOR_OPTIONS = [
  { id: 'rose', name: 'Merah Muda Romantis', bg: 'bg-rose-100 text-rose-950 border-rose-300' },
  { id: 'amber', name: 'Kuning Hangat', bg: 'bg-amber-100 text-amber-950 border-amber-300' },
  { id: 'emerald', name: 'Hijau Sejuk', bg: 'bg-emerald-100 text-emerald-950 border-emerald-300' },
  { id: 'sky', name: 'Biru Lembut', bg: 'bg-sky-100 text-sky-950 border-sky-300' },
  { id: 'purple', name: 'Ungu Manis', bg: 'bg-purple-100 text-purple-950 border-purple-300' }
];

export const LoveNotesBoard: React.FC<LoveNotesBoardProps> = ({
  notes,
  currentUser,
  onClose,
  onAddNote,
  onDeleteNote
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [fromName, setFromName] = useState(currentUser.name);
  const [toName, setToName] = useState('Untuk Kita Berdua & Keluarga');
  const [message, setMessage] = useState('');
  const [color, setColor] = useState('rose');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isSubmitting) return;

    try {
      setIsSubmitting(true);
      await onAddNote({
        from: fromName.trim() || currentUser.name,
        to: toName.trim(),
        role: currentUser.role,
        message: message.trim(),
        color
      });

      confetti({
        particleCount: 25,
        spread: 50,
        origin: { y: 0.5 }
      });

      setMessage('');
      setShowAddForm(false);
    } catch (err) {
      console.error('Failed to add note', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getColorClass = (col: string) => {
    const match = COLOR_OPTIONS.find((c) => c.id === col);
    return match ? match.bg : 'bg-rose-100 text-rose-950 border-rose-300';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-stone-50 rounded-3xl shadow-2xl border border-stone-200 overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-white border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-100 text-amber-700">
              <MessageSquareHeart className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-lg text-stone-900">
                Papan Pesan Kasih & Doa Keluarga
              </h2>
              <p className="text-xs text-stone-500">
                Titipkan kata-kata manis, doa, atau kenangan indah untuk pacar & keluarga tercinta
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition"
            >
              <Plus className="w-4 h-4" />
              <span>{showAddForm ? 'Tutup Form' : 'Tulis Pesan Baru'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-stone-100 text-stone-500 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* Add Form Accordion */}
          {showAddForm && (
            <form
              onSubmit={handleSubmit}
              className="p-5 rounded-2xl bg-white border-2 border-dashed border-rose-300 shadow-md space-y-4 animate-in fade-in duration-200"
            >
              <h3 className="font-serif font-bold text-sm text-stone-900 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Tulis Catatan / Pesan Cinta Baru</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Dari Siapa:</label>
                  <input
                    type="text"
                    value={fromName}
                    onChange={(e) => setFromName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300"
                    placeholder="Nama Anda"
                  />
                </div>
                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Ditujukan Untuk:</label>
                  <input
                    type="text"
                    value={toName}
                    onChange={(e) => setToName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300"
                    placeholder="Cth: Untuk Gabriel / Untuk Mama / Pacar"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-stone-700 font-semibold mb-1">
                  Isi Pesan / Doa:
                </label>
                <textarea
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Ketik pesan manis, doa terbaik, atau kenangan yang berkesan..."
                  className="w-full text-xs px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-rose-400"
                  required
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-stone-500 font-medium">Warna Kertas:</span>
                  <div className="flex gap-1.5">
                    {COLOR_OPTIONS.map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => setColor(c.id)}
                        className={`w-6 h-6 rounded-full border-2 ${
                          c.bg.split(' ')[0]
                        } ${color === c.id ? 'ring-2 ring-stone-900 ring-offset-1' : 'opacity-80'}`}
                        title={c.name}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="px-3 py-1.5 text-xs text-stone-500 hover:bg-stone-100 rounded-xl"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={!message.trim() || isSubmitting}
                    className="px-4 py-1.5 text-xs bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-semibold flex items-center gap-1 shadow-sm transition"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Tempelkan Pesan</span>
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* Sticky Notes Grid */}
          {notes && notes.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {notes.map((note) => (
                <div
                  key={note.id}
                  className={`p-5 rounded-2xl border shadow-sm relative group transition-all duration-300 hover:-translate-y-1 hover:shadow-md flex flex-col justify-between ${getColorClass(
                    note.color
                  )}`}
                >
                  {/* Pin illustration */}
                  <div className="w-3 h-3 rounded-full bg-red-400 border border-white mx-auto shadow-xs -mt-2 mb-2" />

                  <div className="space-y-2">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-stone-600">
                      Kepada: <span className="underline">{note.to}</span>
                    </div>

                    <p className="font-serif text-sm sm:text-base leading-relaxed italic">
                      "{note.message}"
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-black/10 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-stone-800">
                        ❤️ Dari: {note.from}
                      </div>
                      <div className="text-[10px] text-stone-500">
                        {new Date(note.createdAt).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </div>
                    </div>

                    {/* Delete button if matching current user or owner */}
                    {(currentUser.name === note.from || currentUser.role === 'owner') && (
                      <button
                        onClick={() => onDeleteNote(note.id)}
                        className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-black/10 text-stone-600 hover:text-rose-700 transition"
                        title="Hapus Pesan"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-stone-400">
              <MessageSquareHeart className="w-12 h-12 mx-auto text-stone-300 mb-2" />
              <p className="font-medium text-stone-600 text-sm">Belum ada pesan yang ditempel</p>
              <p className="text-xs text-stone-400 mt-1">
                Jadilah yang pertama menulis pesan manis untuk pacar atau doa untuk keluarga!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
