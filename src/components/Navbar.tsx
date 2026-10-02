import React, { useState } from 'react';
import {
  Heart,
  Users,
  Camera,
  Share2,
  Volume2,
  VolumeX,
  Sparkles,
  Settings,
  MessageSquareHeart,
  ChevronDown,
  UserCheck
} from 'lucide-react';
import { CategoryType, CurrentUser, UserRole } from '../types';
import { ambientMusic } from '../utils/audioPlayer';

interface NavbarProps {
  currentCategory: CategoryType;
  onSelectCategory: (cat: CategoryType) => void;
  currentUser: CurrentUser;
  onChangeUser: (user: CurrentUser) => void;
  onOpenUpload: () => void;
  onOpenShare: () => void;
  onOpenNotes: () => void;
  onOpenSettings: () => void;
  onStartSlideshow: () => void;
  totalPhotos: number;
}

const PRESET_MEMBERS: { name: string; role: UserRole; avatarBg: string; badge: string }[] = [
  { name: 'Gabriel', role: 'owner', avatarBg: 'bg-rose-600', badge: 'Pemilik' },
  { name: 'Pacar Tercinta', role: 'pacar', avatarBg: 'bg-pink-500', badge: 'Pacar' },
  { name: 'Mama', role: 'keluarga', avatarBg: 'bg-amber-600', badge: 'Ibu' },
  { name: 'Papa', role: 'keluarga', avatarBg: 'bg-blue-600', badge: 'Ayah' },
  { name: 'Adik / Kakak', role: 'keluarga', avatarBg: 'bg-emerald-600', badge: 'Saudara' },
  { name: 'Keluarga Besar', role: 'keluarga', avatarBg: 'bg-purple-600', badge: 'Keluarga' }
];

export const Navbar: React.FC<NavbarProps> = ({
  currentCategory,
  onSelectCategory,
  currentUser,
  onChangeUser,
  onOpenUpload,
  onOpenShare,
  onOpenNotes,
  onOpenSettings,
  onStartSlideshow,
  totalPhotos
}) => {
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [customNameInput, setCustomNameInput] = useState('');
  const [isEditingCustom, setIsEditingCustom] = useState(false);

  const toggleMusic = () => {
    const playing = ambientMusic.toggle((status) => setIsPlayingMusic(status));
    setIsPlayingMusic(playing);
  };

  const handleSelectMember = (member: { name: string; role: UserRole; avatarBg: string }) => {
    onChangeUser(member);
    setShowUserDropdown(false);
  };

  const handleSaveCustomUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customNameInput.trim()) return;
    onChangeUser({
      name: customNameInput.trim(),
      role: 'keluarga',
      avatarBg: 'bg-indigo-600'
    });
    setCustomNameInput('');
    setIsEditingCustom(false);
    setShowUserDropdown(false);
  };

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-stone-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2 sm:gap-4">
          
          {/* Brand Logo & Title */}
          <div className="flex items-center gap-3 cursor-pointer select-none" onClick={() => onSelectCategory('all')}>
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-rose-500 via-rose-400 to-amber-300 flex items-center justify-center text-white shadow-md shadow-rose-200 ring-2 ring-rose-200/50">
              <Heart className="w-5 h-5 sm:w-6 sm:h-6 fill-white stroke-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-serif font-bold text-lg sm:text-xl text-stone-900 tracking-tight">
                  Kita & Keluarga
                </span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wide bg-rose-100 text-rose-800">
                  Privat
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-stone-500 hidden sm:block">
                Ruang kenangan bersama pacar & keluarga
              </p>
            </div>
          </div>

          {/* Action Tools & User Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Ambient Music Button */}
            <button
              onClick={toggleMusic}
              title={isPlayingMusic ? 'Matikan Nada Latar Lembut' : 'Putar Nada Latar Romantis & Santai'}
              className={`p-2 sm:p-2.5 rounded-xl border text-xs sm:text-sm font-medium transition-all flex items-center gap-1.5 ${
                isPlayingMusic
                  ? 'bg-rose-50 border-rose-200 text-rose-700 animate-pulse'
                  : 'bg-stone-50 hover:bg-stone-100 border-stone-200 text-stone-600'
              }`}
            >
              {isPlayingMusic ? (
                <>
                  <Volume2 className="w-4 h-4 text-rose-600" />
                  <span className="hidden md:inline text-[11px]">Musik Nyala</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-4 h-4 text-stone-400" />
                  <span className="hidden md:inline text-[11px]">Musik Latar</span>
                </>
              )}
            </button>

            {/* Slideshow button */}
            {totalPhotos > 0 && (
              <button
                onClick={onStartSlideshow}
                title="Putar Bioskop Kenangan (Slideshow)"
                className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold transition"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Slideshow</span>
              </button>
            )}

            {/* Notes Board */}
            <button
              onClick={onOpenNotes}
              title="Papan Pesan & Doa Keluarga"
              className="p-2 sm:px-3 sm:py-2 rounded-xl bg-amber-50 hover:bg-amber-100/80 border border-amber-200 text-amber-800 text-xs font-semibold transition flex items-center gap-1.5"
            >
              <MessageSquareHeart className="w-4 h-4 text-amber-600" />
              <span className="hidden sm:inline">Papan Pesan</span>
            </button>

            {/* Share / Invite Link */}
            <button
              onClick={onOpenShare}
              title="Bagikan Akses ke Pacar atau Keluarga"
              className="p-2 sm:px-3 sm:py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold transition flex items-center gap-1.5"
            >
              <Share2 className="w-4 h-4 text-stone-600" />
              <span className="hidden sm:inline">Bagi Akses</span>
            </button>

            {/* Upload Button */}
            <button
              onClick={onOpenUpload}
              className="flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white text-xs sm:text-sm font-semibold shadow-md shadow-rose-200 active:scale-95 transition"
            >
              <Camera className="w-4 h-4" />
              <span>Unggah Foto</span>
            </button>

            {/* Member Profile Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className="flex items-center gap-2 p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl border border-stone-200 hover:bg-stone-50 transition text-left"
                title="Ganti Identitas Pengakses (Gabriel / Pacar / Mama dll)"
              >
                <div
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg ${currentUser.avatarBg} text-white flex items-center justify-center font-bold text-xs sm:text-sm shadow-xs`}
                >
                  {currentUser.name.charAt(0)}
                </div>
                <div className="hidden lg:block">
                  <div className="text-xs font-bold text-stone-800 leading-tight flex items-center gap-1">
                    {currentUser.name}
                    <ChevronDown className="w-3 h-3 text-stone-400" />
                  </div>
                  <div className="text-[10px] text-stone-500 uppercase tracking-wider font-semibold">
                    {currentUser.role === 'owner'
                      ? 'Pemilik'
                      : currentUser.role === 'pacar'
                      ? 'Pacar'
                      : 'Keluarga'}
                  </div>
                </div>
              </button>

              {/* Dropdown Menu */}
              {showUserDropdown && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-stone-200/90 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-2 border-b border-stone-100">
                    <p className="text-xs font-semibold text-stone-700">Akses Sebagai Siapa?</p>
                    <p className="text-[11px] text-stone-400">
                      Pilih peran agar komentar & foto diunggah atas nama Anda:
                    </p>
                  </div>

                  <div className="p-1 space-y-0.5">
                    {PRESET_MEMBERS.map((member) => (
                      <button
                        key={member.name}
                        onClick={() => handleSelectMember(member)}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition ${
                          currentUser.name === member.name
                            ? 'bg-rose-50 text-rose-900 font-semibold'
                            : 'hover:bg-stone-50 text-stone-700'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-6 h-6 rounded-md ${member.avatarBg} text-white text-[11px] font-bold flex items-center justify-center`}
                          >
                            {member.name.charAt(0)}
                          </div>
                          <span>{member.name}</span>
                        </div>
                        <span className="text-[10px] text-stone-500 bg-stone-100 px-1.5 py-0.5 rounded">
                          {member.badge}
                        </span>
                      </button>
                    ))}
                  </div>

                  {/* Custom Name Section */}
                  <div className="pt-2 mt-1 border-t border-stone-100 px-3 pb-1">
                    {!isEditingCustom ? (
                      <button
                        onClick={() => setIsEditingCustom(true)}
                        className="text-xs text-rose-600 hover:text-rose-700 font-medium flex items-center gap-1 w-full text-left"
                      >
                        + Tulis Nama Sendiri
                      </button>
                    ) : (
                      <form onSubmit={handleSaveCustomUser} className="space-y-1.5">
                        <input
                          type="text"
                          placeholder="Ketik nama Anda..."
                          value={customNameInput}
                          onChange={(e) => setCustomNameInput(e.target.value)}
                          className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-1 focus:ring-rose-500"
                          autoFocus
                        />
                        <div className="flex gap-1 justify-end">
                          <button
                            type="button"
                            onClick={() => setIsEditingCustom(false)}
                            className="text-[11px] px-2 py-1 text-stone-500 hover:bg-stone-100 rounded"
                          >
                            Batal
                          </button>
                          <button
                            type="submit"
                            className="text-[11px] px-2.5 py-1 bg-rose-600 text-white rounded font-medium"
                          >
                            Gunakan
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Settings button */}
            <button
              onClick={onOpenSettings}
              title="Pengaturan Album"
              className="p-2 rounded-xl text-stone-500 hover:text-stone-800 hover:bg-stone-100 transition"
            >
              <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        {/* Categories Tab Navigation Bar */}
        <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto py-2.5 border-t border-stone-100 no-scrollbar">
          <button
            onClick={() => onSelectCategory('all')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              currentCategory === 'all'
                ? 'bg-stone-900 text-white shadow-xs'
                : 'bg-stone-100/80 hover:bg-stone-200/80 text-stone-600'
            }`}
          >
            Semua Momen
          </button>
          <button
            onClick={() => onSelectCategory('pacar')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              currentCategory === 'pacar'
                ? 'bg-rose-500 text-white shadow-sm shadow-rose-200'
                : 'bg-rose-50 hover:bg-rose-100 text-rose-800'
            }`}
          >
            <Heart className="w-3.5 h-3.5 fill-current" />
            Bersama Pacar
          </button>
          <button
            onClick={() => onSelectCategory('keluarga')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              currentCategory === 'keluarga'
                ? 'bg-amber-600 text-white shadow-sm shadow-amber-200'
                : 'bg-amber-50 hover:bg-amber-100 text-amber-800'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            Keluarga Tercinta
          </button>
          <button
            onClick={() => onSelectCategory('spesial')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              currentCategory === 'spesial'
                ? 'bg-purple-600 text-white shadow-sm shadow-purple-200'
                : 'bg-purple-50 hover:bg-purple-100 text-purple-800'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Momen Spesial
          </button>
          <button
            onClick={() => onSelectCategory('liburan')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              currentCategory === 'liburan'
                ? 'bg-sky-600 text-white shadow-sm shadow-sky-200'
                : 'bg-sky-50 hover:bg-sky-100 text-sky-800'
            }`}
          >
            Liburan Bersama
          </button>
        </div>
      </div>
    </header>
  );
};
