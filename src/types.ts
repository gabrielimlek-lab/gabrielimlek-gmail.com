export type CategoryType = 'all' | 'pacar' | 'keluarga' | 'spesial' | 'liburan';

export type UserRole = 'owner' | 'pacar' | 'keluarga' | 'tamu';

export interface Comment {
  id: string;
  author: string;
  role: UserRole;
  text: string;
  createdAt: string;
  emoji?: string;
}

export interface Photo {
  id: string;
  title: string;
  caption: string;
  category: 'pacar' | 'keluarga' | 'spesial' | 'liburan';
  imageUrl: string;
  date: string;
  location: string;
  uploadedBy: string;
  uploadedByRole: UserRole;
  likesCount: number;
  likedBy: string[];
  isFavorite: boolean;
  comments: Comment[];
  tags: string[];
  createdAt: string;
}

export interface MemoryNote {
  id: string;
  from: string;
  to: string;
  role: UserRole;
  message: string;
  color: string;
  createdAt: string;
}

export interface AlbumConfig {
  title: string;
  subTitle: string;
  ownerName: string;
  partnerName: string;
  anniversaryDate: string;
  requirePasscode: boolean;
  hasPasscode?: boolean;
}

export interface CurrentUser {
  name: string;
  role: UserRole;
  avatarBg: string;
}
