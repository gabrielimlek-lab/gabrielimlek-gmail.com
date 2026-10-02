import React, { useState } from 'react';
import { X, Settings, Shield, Download, Lock, CheckCircle2 } from 'lucide-react';
import { AlbumConfig, Photo } from '../types';

interface SettingsModalProps {
  config: AlbumConfig;
  allPhotos: Photo[];
  onClose: () => void;
  onSaveConfig: (updated: Partial<AlbumConfig & { passcode?: string }>) => Promise<void>;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  config,
  allPhotos,
  onClose,
  onSaveConfig
}) => {
  const [title, setTitle] = useState(config.title || 'Kita & Keluarga');
  const [subTitle, setSubTitle] = useState(config.subTitle || '');
  const [ownerName, setOwnerName] = useState(config.ownerName || 'Gabriel');
  const [partnerName, setPartnerName] = useState(config.partnerName || 'Sayang');
  const [anniversaryDate, setAnniversaryDate] = useState(config.anniversaryDate || '2023-08-17');
  const [requirePasscode, setRequirePasscode] = useState(config.requirePasscode || false);
  const [newPasscode, setNewPasscode] = useState('');
  
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      await onSaveConfig({
        title: title.trim(),
        subTitle: subTitle.trim(),
        ownerName: ownerName.trim(),
        partnerName: partnerName.trim(),
        anniversaryDate,
        requirePasscode,
        ...(newPasscode ? { passcode: newPasscode } : {})
      });
      setSuccessMsg('Pengaturan album berhasil diperbarui!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      console.error('Error saving settings', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleExportBackup = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(
      JSON.stringify({ config, photos: allPhotos, exportDate: new Date().toISOString() }, null, 2)
    );
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `backup-kenangan-${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-stone-200 text-stone-700">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-lg text-stone-900">
                Pengaturan Album
              </h2>
              <p className="text-xs text-stone-500">
                Sesuaikan nama, tanggal kenangan, dan privasi album
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

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-4 flex-1 text-xs">
          {successMsg && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          <div>
            <label className="block font-semibold text-stone-700 mb-1">
              Judul Album:
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-xs px-3.5 py-2 rounded-xl border border-stone-300"
              required
            />
          </div>

          <div>
            <label className="block font-semibold text-stone-700 mb-1">
              Deskripsi / Pesan Pembuka:
            </label>
            <textarea
              rows={2}
              value={subTitle}
              onChange={(e) => setSubTitle(e.target.value)}
              className="w-full text-xs px-3.5 py-2 rounded-xl border border-stone-300"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                Nama Pemilik (Anda):
              </label>
              <input
                type="text"
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                className="w-full text-xs px-3.5 py-2 rounded-xl border border-stone-300"
              />
            </div>
            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                Nama Panggilan Pacar:
              </label>
              <input
                type="text"
                value={partnerName}
                onChange={(e) => setPartnerName(e.target.value)}
                className="w-full text-xs px-3.5 py-2 rounded-xl border border-stone-300"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-stone-700 mb-1">
              Tanggal Jadian / Anniversary (untuk hitung hari):
            </label>
            <input
              type="date"
              value={anniversaryDate}
              onChange={(e) => setAnniversaryDate(e.target.value)}
              className="w-full text-xs px-3.5 py-2 rounded-xl border border-stone-300"
            />
          </div>

          {/* Passcode Security */}
          <div className="pt-3 border-t border-stone-100 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <label className="font-semibold text-stone-800 flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-rose-500" />
                  <span>Kunci dengan Kode Sandi (PIN)</span>
                </label>
                <p className="text-[11px] text-stone-500">
                  Hanya yang tahu PIN yang bisa masuk ke album
                </p>
              </div>
              <input
                type="checkbox"
                checked={requirePasscode}
                onChange={(e) => setRequirePasscode(e.target.checked)}
                className="w-4 h-4 text-rose-600 rounded border-stone-300 focus:ring-rose-500"
              />
            </div>

            {requirePasscode && (
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                  Atur Kode PIN Baru (cth: 1234):
                </label>
                <input
                  type="password"
                  placeholder="Masukkan 4 digit PIN rahasia..."
                  value={newPasscode}
                  onChange={(e) => setNewPasscode(e.target.value)}
                  className="w-full text-xs px-3 py-1.5 rounded-lg border border-stone-300"
                />
              </div>
            )}
          </div>

          {/* Backup Data Section */}
          <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
            <div>
              <p className="font-semibold text-stone-800">Cadangkan Kenangan</p>
              <p className="text-[11px] text-stone-500">
                Unduh seluruh data foto, komentar & pesan sebagai file JSON
              </p>
            </div>
            <button
              type="button"
              onClick={handleExportBackup}
              className="px-3 py-1.5 rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-700 text-xs font-semibold flex items-center gap-1.5 transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Unduh Backup</span>
            </button>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-stone-100 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-stone-600 hover:bg-stone-100 transition"
            >
              Tutup
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2 rounded-xl bg-stone-900 hover:bg-black text-white font-semibold transition"
            >
              {isSaving ? 'Menyimpan...' : 'Simpan Pengaturan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
