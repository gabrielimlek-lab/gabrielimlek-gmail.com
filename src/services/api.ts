import { Photo, MemoryNote, AlbumConfig } from '../types';

export async function fetchPhotos(filters?: {
  category?: string;
  search?: string;
  tag?: string;
  favorite?: boolean;
}): Promise<Photo[]> {
  const params = new URLSearchParams();
  if (filters?.category && filters.category !== 'all') params.append('category', filters.category);
  if (filters?.search) params.append('search', filters.search);
  if (filters?.tag) params.append('tag', filters.tag);
  if (filters?.favorite) params.append('favorite', 'true');

  const url = `/api/photos?${params.toString()}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Gagal mengambil data foto');
  const data = await res.json();
  return data.photos || [];
}

export async function uploadPhoto(formData: FormData): Promise<Photo> {
  const res = await fetch('/api/photos', {
    method: 'POST',
    body: formData,
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || 'Gagal mengunggah foto');
  }
  return data.photo;
}

export async function updatePhoto(id: string, updates: Partial<Photo>): Promise<Photo> {
  const res = await fetch(`/api/photos/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || 'Gagal memperbarui foto');
  }
  return data.photo;
}

export async function deletePhoto(id: string): Promise<void> {
  const res = await fetch(`/api/photos/${id}`, {
    method: 'DELETE',
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || 'Gagal menghapus foto');
  }
}

export async function toggleLikePhoto(
  id: string,
  userName: string
): Promise<{ likesCount: number; likedBy: string[]; isLiked: boolean }> {
  const res = await fetch(`/api/photos/${id}/like`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userName }),
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || 'Gagal menyukai foto');
  }
  return {
    likesCount: data.likesCount,
    likedBy: data.likedBy,
    isLiked: data.isLiked,
  };
}

export async function addComment(
  photoId: string,
  commentData: { author: string; role: string; text: string; emoji?: string }
) {
  const res = await fetch(`/api/photos/${photoId}/comments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(commentData),
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || 'Gagal mengirim komentar');
  }
  return data.comments;
}

export async function deleteComment(photoId: string, commentId: string) {
  const res = await fetch(`/api/photos/${photoId}/comments/${commentId}`, {
    method: 'DELETE',
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || 'Gagal menghapus komentar');
  }
  return data.comments;
}

export async function fetchNotes(): Promise<MemoryNote[]> {
  const res = await fetch('/api/notes');
  if (!res.ok) throw new Error('Gagal mengambil catatan kenangan');
  const data = await res.json();
  return data.notes || [];
}

export async function addNote(noteData: {
  from: string;
  to: string;
  role: string;
  message: string;
  color?: string;
}): Promise<MemoryNote> {
  const res = await fetch('/api/notes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(noteData),
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || 'Gagal menyimpan pesan');
  }
  return data.note;
}

export async function deleteNote(id: string): Promise<void> {
  const res = await fetch(`/api/notes/${id}`, {
    method: 'DELETE',
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || 'Gagal menghapus pesan');
  }
}

export async function fetchAlbumInfo(): Promise<{ config: AlbumConfig; stats: any }> {
  const res = await fetch('/api/info');
  if (!res.ok) throw new Error('Gagal mengambil info album');
  const data = await res.json();
  return { config: data.config, stats: data.stats };
}

export async function updateAlbumInfo(configData: Partial<AlbumConfig & { passcode?: string }>) {
  const res = await fetch('/api/info', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(configData),
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || 'Gagal memperbarui album');
  }
}

export async function verifyPasscode(passcode: string): Promise<boolean> {
  const res = await fetch('/api/verify-passcode', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ passcode }),
  });
  const data = await res.json();
  return data.verified === true;
}
