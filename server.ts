import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import multer from 'multer';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = parseInt(process.env.PORT || '3000', 10);

// Setup upload directory
const uploadDir = path.resolve(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Setup data directory
const dataDir = path.resolve(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbFilePath = path.join(dataDir, 'database.json');

// Types
export interface Comment {
  id: string;
  author: string;
  role: 'owner' | 'pacar' | 'keluarga' | 'tamu';
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
  uploadedByRole: 'owner' | 'pacar' | 'keluarga' | 'tamu';
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
  role: 'owner' | 'pacar' | 'keluarga' | 'tamu';
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
  passcode: string;
}

interface DatabaseSchema {
  photos: Photo[];
  notes: MemoryNote[];
  config: AlbumConfig;
}

const initialPhotos: Photo[] = [
  {
    id: 'p1',
    title: 'Kencan Sore di Tepi Danau',
    caption: 'Momen berdua sambil menikmati matahari terbenam dan secangkir kopi hangat. Kamu senyumnya manis banget hari itu ❤️',
    category: 'pacar',
    imageUrl: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=1200&q=80',
    date: '2024-05-18',
    location: 'Danau Situ Patenggang, Bandung',
    uploadedBy: 'Gabriel',
    uploadedByRole: 'owner',
    likesCount: 14,
    likedBy: ['Pacar Tercinta', 'Gabriel', 'Mama'],
    isFavorite: true,
    comments: [
      {
        id: 'c1',
        author: 'Pacar Tercinta',
        role: 'pacar',
        text: 'Aaa gemes bangett! Inget gak waktu itu kita hampir kehujanan pas balik ke mobil haha 💕',
        createdAt: '2024-05-18T20:15:00Z',
        emoji: '🥰'
      },
      {
        id: 'c2',
        author: 'Gabriel',
        role: 'owner',
        text: 'Inget dong sayang, tapi kopinya waktu itu enak banget kan ☕',
        createdAt: '2024-05-18T20:30:00Z',
        emoji: '❤️'
      }
    ],
    tags: ['kencan', 'sunset', 'bandung', 'berdua'],
    createdAt: '2024-05-18T18:00:00Z'
  },
  {
    id: 'p2',
    title: 'Makan Malam Ulang Tahun Mama',
    caption: 'Kumpul keluarga lengkap merayakan hari bahagia Mama tercinta. Senang sekali melihat senyum Mama dan Papa bahagia!',
    category: 'keluarga',
    imageUrl: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1200&q=80',
    date: '2024-06-12',
    location: 'Restoran Bunga Rampai, Menteng',
    uploadedBy: 'Gabriel',
    uploadedByRole: 'owner',
    likesCount: 22,
    likedBy: ['Mama', 'Papa', 'Adik', 'Pacar Tercinta', 'Gabriel'],
    isFavorite: true,
    comments: [
      {
        id: 'c3',
        author: 'Mama',
        role: 'keluarga',
        text: 'Terima kasih banyak anak-anakku yang baik dan soleh, Mama sangat bersyukur punya kalian semua ❤️',
        createdAt: '2024-06-12T22:00:00Z',
        emoji: '🙏'
      },
      {
        id: 'c4',
        author: 'Pacar Tercinta',
        role: 'pacar',
        text: 'Selamat ulang tahun Tante! Semoga sehat selalu dan panjang umur, kado dari aku semoga suka ya tante 😊🎂',
        createdAt: '2024-06-12T22:15:00Z',
        emoji: '🎂'
      }
    ],
    tags: ['keluarga', 'ulangtahun', 'mama', 'bahagia'],
    createdAt: '2024-06-12T21:00:00Z'
  },
  {
    id: 'p3',
    title: 'Liburan Santai ke Pantai Bersama Pacar',
    caption: 'Jalan di tepi pantai berpasir putih, angin sepoi-sepoi, dan suara deburan ombak. Salah satu liburan terbaik kita!',
    category: 'pacar',
    imageUrl: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=1200&q=80',
    date: '2024-07-20',
    location: 'Pantai Melasti, Bali',
    uploadedBy: 'Pacar Tercinta',
    uploadedByRole: 'pacar',
    likesCount: 19,
    likedBy: ['Gabriel', 'Pacar Tercinta', 'Mama'],
    isFavorite: true,
    comments: [
      {
        id: 'c5',
        author: 'Gabriel',
        role: 'owner',
        text: 'Liburan berikutnya kita ke Labuan Bajo ya sayang! 🏝️',
        createdAt: '2024-07-20T21:00:00Z',
        emoji: '✨'
      }
    ],
    tags: ['pantai', 'bali', 'liburan', 'romantic'],
    createdAt: '2024-07-20T19:00:00Z'
  },
  {
    id: 'p4',
    title: 'Kumpul Lebaran Keluarga Besar',
    caption: 'Foto bersama di teras rumah kakek setelah sungkeman. Makanan opor ayam dan ketupat buatan nenek paling juara.',
    category: 'keluarga',
    imageUrl: 'https://images.unsplash.com/photo-1543807535-eceef0bc6599?auto=format&fit=crop&w=1200&q=80',
    date: '2024-04-10',
    location: 'Yogyakarta',
    uploadedBy: 'Gabriel',
    uploadedByRole: 'owner',
    likesCount: 28,
    likedBy: ['Gabriel', 'Mama', 'Papa', 'Adik', 'Sepupu'],
    isFavorite: false,
    comments: [
      {
        id: 'c6',
        author: 'Adik',
        role: 'keluarga',
        text: 'Muka aku paling heboh sendiri di pojokan haha!',
        createdAt: '2024-04-10T16:00:00Z',
        emoji: '😂'
      }
    ],
    tags: ['lebaran', 'keluargabesar', 'silaturahmi', 'jogja'],
    createdAt: '2024-04-10T15:30:00Z'
  },
  {
    id: 'p5',
    title: 'Merayakan Wisuda Bersama Orang-Orang Tercinta',
    caption: 'Hari paling berharga didampingi orang tua dan pacar tersayang. Gelar ini kupersembahkan untuk doa kalian semua.',
    category: 'spesial',
    imageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80',
    date: '2024-09-05',
    location: 'Balairung Kampus',
    uploadedBy: 'Gabriel',
    uploadedByRole: 'owner',
    likesCount: 35,
    likedBy: ['Gabriel', 'Pacar Tercinta', 'Mama', 'Papa', 'Adik'],
    isFavorite: true,
    comments: [
      {
        id: 'c7',
        author: 'Pacar Tercinta',
        role: 'pacar',
        text: 'Bangga bangett sama kamu sayang! Usaha kerasmu selama ini terbayar lunas. Love you! 🎓💖',
        createdAt: '2024-09-05T14:30:00Z',
        emoji: '🎓'
      },
      {
        id: 'c8',
        author: 'Papa',
        role: 'keluarga',
        text: 'Selamat nak! Teruslah rendah hati dan berguna bagi sesama.',
        createdAt: '2024-09-05T15:00:00Z',
        emoji: '👏'
      }
    ],
    tags: ['wisuda', 'keluarga', 'pacar', 'kebanggaan', 'spesial'],
    createdAt: '2024-09-05T14:00:00Z'
  },
  {
    id: 'p6',
    title: 'Roadtrip & Piknik Pegunungan',
    caption: 'Membawa bekal dari rumah, gelar tikar di bawah pohon pinus yang sejuk. Obrolan hangat tanpa henti.',
    category: 'liburan',
    imageUrl: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80',
    date: '2024-08-14',
    location: 'Hutan Pinus Mangunan',
    uploadedBy: 'Pacar Tercinta',
    uploadedByRole: 'pacar',
    likesCount: 16,
    likedBy: ['Gabriel', 'Pacar Tercinta'],
    isFavorite: false,
    comments: [],
    tags: ['piknik', 'alam', 'berdua', 'liburan'],
    createdAt: '2024-08-14T17:00:00Z'
  }
];

const initialNotes: MemoryNote[] = [
  {
    id: 'n1',
    from: 'Pacar Tercinta',
    to: 'Untuk Gabriel',
    role: 'pacar',
    message: 'Terima kasih udah selalu ada, selalu sabar, dan selalu buat aku tersenyum setiap hari. Web album ini lucu banget idenya, aku suka! Love you always ❤️',
    color: 'rose',
    createdAt: '2024-10-01T10:00:00Z'
  },
  {
    id: 'n2',
    from: 'Mama',
    to: 'Untuk Gabriel & Sayang',
    role: 'keluarga',
    message: 'Mama selalu mendoakan yang terbaik untuk kalian berdua. Jaga kesehatan, saling mendukung dalam suka dan duka ya nak.',
    color: 'amber',
    createdAt: '2024-09-28T14:20:00Z'
  },
  {
    id: 'n3',
    from: 'Gabriel',
    to: 'Untuk Pacar & Keluarga',
    role: 'owner',
    message: 'Website ini kubuat khusus agar semua momen bahagia kita bersama gak pernah hilang dan selalu bisa kita buka kapan saja. Terima kasih telah jadi bagian terindah dalam hidupku.',
    color: 'emerald',
    createdAt: '2024-10-01T08:00:00Z'
  }
];

const initialConfig: AlbumConfig = {
  title: 'Kita & Keluarga',
  subTitle: 'Ruang Kenangan Bersama Pacar Tercinta & Keluarga',
  ownerName: 'Gabriel',
  partnerName: 'Sayang',
  anniversaryDate: '2023-08-17',
  requirePasscode: false,
  passcode: '1234'
};

function getDb(): DatabaseSchema {
  try {
    if (fs.existsSync(dbFilePath)) {
      const raw = fs.readFileSync(dbFilePath, 'utf-8');
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Error reading database file, resetting to initial data:', e);
  }
  const dbData: DatabaseSchema = {
    photos: initialPhotos,
    notes: initialNotes,
    config: initialConfig
  };
  saveDb(dbData);
  return dbData;
}

function saveDb(data: DatabaseSchema) {
  try {
    fs.writeFileSync(dbFilePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (e) {
    console.error('Error writing database:', e);
  }
}

// Multer storage
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase() || '.jpg';
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `photo-${uniqueSuffix}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 25 * 1024 * 1024 }, // 25MB max
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Hanya file gambar yang diperbolehkan!'));
    }
  }
});

// Middleware
app.use(express.json({ limit: '30mb' }));
app.use(express.urlencoded({ extended: true, limit: '30mb' }));

// Serve uploaded images statically
app.use('/uploads', express.static(uploadDir));

// API: Get All Photos
app.get('/api/photos', (req: Request, res: Response) => {
  const db = getDb();
  const { category, search, tag, favorite } = req.query;

  let results = [...db.photos];

  if (category && category !== 'all') {
    results = results.filter((p) => p.category === category);
  }

  if (favorite === 'true') {
    results = results.filter((p) => p.isFavorite);
  }

  if (tag) {
    const targetTag = String(tag).toLowerCase();
    results = results.filter((p) => p.tags.some((t) => t.toLowerCase() === targetTag));
  }

  if (search) {
    const q = String(search).toLowerCase();
    results = results.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.caption.toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q) ||
        p.uploadedBy.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
    );
  }

  // Sort descending by date or createdAt
  results.sort((a, b) => new Date(b.date || b.createdAt).getTime() - new Date(a.date || a.createdAt).getTime());

  res.json({ success: true, photos: results, total: results.length });
});

// API: Add Photo (supports single file upload or json body with imageUrl)
app.post('/api/photos', upload.single('photoFile'), (req: Request, res: Response) => {
  try {
    const db = getDb();
    const body = req.body;

    let imageUrl = body.imageUrl;
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
    }

    if (!imageUrl) {
      return res.status(400).json({ success: false, message: 'Harap sertakan file foto atau URL gambar!' });
    }

    let parsedTags: string[] = [];
    if (Array.isArray(body.tags)) {
      parsedTags = body.tags;
    } else if (typeof body.tags === 'string') {
      parsedTags = body.tags
        .split(',')
        .map((t: string) => t.trim().toLowerCase())
        .filter(Boolean);
    }

    const newPhoto: Photo = {
      id: 'photo_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      title: body.title || 'Momen Berharga',
      caption: body.caption || '',
      category: body.category || 'pacar',
      imageUrl,
      date: body.date || new Date().toISOString().split('T')[0],
      location: body.location || '',
      uploadedBy: body.uploadedBy || 'Gabriel',
      uploadedByRole: body.uploadedByRole || 'owner',
      likesCount: 0,
      likedBy: [],
      isFavorite: body.isFavorite === 'true' || body.isFavorite === true,
      comments: [],
      tags: parsedTags,
      createdAt: new Date().toISOString()
    };

    db.photos.unshift(newPhoto);
    saveDb(db);

    res.status(201).json({ success: true, photo: newPhoto });
  } catch (error: any) {
    console.error('Error adding photo:', error);
    res.status(500).json({ success: false, message: error.message || 'Gagal menyimpan foto' });
  }
});

// API: Update Photo
app.put('/api/photos/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const db = getDb();
  const photoIndex = db.photos.findIndex((p) => p.id === id);

  if (photoIndex === -1) {
    return res.status(404).json({ success: false, message: 'Foto tidak ditemukan' });
  }

  const existing = db.photos[photoIndex];
  const { title, caption, category, date, location, isFavorite, tags } = req.body;

  let parsedTags = existing.tags;
  if (Array.isArray(tags)) {
    parsedTags = tags;
  } else if (typeof tags === 'string') {
    parsedTags = tags.split(',').map((t: string) => t.trim().toLowerCase()).filter(Boolean);
  }

  db.photos[photoIndex] = {
    ...existing,
    title: title !== undefined ? title : existing.title,
    caption: caption !== undefined ? caption : existing.caption,
    category: category !== undefined ? category : existing.category,
    date: date !== undefined ? date : existing.date,
    location: location !== undefined ? location : existing.location,
    isFavorite: isFavorite !== undefined ? isFavorite : existing.isFavorite,
    tags: parsedTags
  };

  saveDb(db);
  res.json({ success: true, photo: db.photos[photoIndex] });
});

// API: Delete Photo
app.delete('/api/photos/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const db = getDb();
  const photoIndex = db.photos.findIndex((p) => p.id === id);

  if (photoIndex === -1) {
    return res.status(404).json({ success: false, message: 'Foto tidak ditemukan' });
  }

  const deletedPhoto = db.photos[photoIndex];
  // If uploaded locally in uploads folder, delete file safely
  if (deletedPhoto.imageUrl.startsWith('/uploads/')) {
    const filename = path.basename(deletedPhoto.imageUrl);
    const filePath = path.join(uploadDir, filename);
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
      } catch (err) {
        console.error('Error removing local file:', err);
      }
    }
  }

  db.photos.splice(photoIndex, 1);
  saveDb(db);

  res.json({ success: true, message: 'Foto berhasil dihapus' });
});

// API: Like / React Photo
app.post('/api/photos/:id/like', (req: Request, res: Response) => {
  const { id } = req.params;
  const { userName = 'Keluarga' } = req.body;
  const db = getDb();
  const photo = db.photos.find((p) => p.id === id);

  if (!photo) {
    return res.status(404).json({ success: false, message: 'Foto tidak ditemukan' });
  }

  const alreadyLiked = photo.likedBy.includes(userName);
  if (alreadyLiked) {
    photo.likedBy = photo.likedBy.filter((u) => u !== userName);
    photo.likesCount = Math.max(0, photo.likesCount - 1);
  } else {
    photo.likedBy.push(userName);
    photo.likesCount += 1;
  }

  saveDb(db);
  res.json({ success: true, likesCount: photo.likesCount, likedBy: photo.likedBy, isLiked: !alreadyLiked });
});

// API: Add Comment to Photo
app.post('/api/photos/:id/comments', (req: Request, res: Response) => {
  const { id } = req.params;
  const { author, role, text, emoji } = req.body;

  if (!text || !text.trim()) {
    return res.status(400).json({ success: false, message: 'Komentar tidak boleh kosong' });
  }

  const db = getDb();
  const photo = db.photos.find((p) => p.id === id);

  if (!photo) {
    return res.status(404).json({ success: false, message: 'Foto tidak ditemukan' });
  }

  const newComment: Comment = {
    id: 'comm_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
    author: author || 'Keluarga',
    role: role || 'keluarga',
    text: text.trim(),
    emoji: emoji || '❤️',
    createdAt: new Date().toISOString()
  };

  photo.comments.push(newComment);
  saveDb(db);

  res.status(201).json({ success: true, comment: newComment, comments: photo.comments });
});

// API: Delete Comment
app.delete('/api/photos/:id/comments/:commentId', (req: Request, res: Response) => {
  const { id, commentId } = req.params;
  const db = getDb();
  const photo = db.photos.find((p) => p.id === id);

  if (!photo) {
    return res.status(404).json({ success: false, message: 'Foto tidak ditemukan' });
  }

  photo.comments = photo.comments.filter((c) => c.id !== commentId);
  saveDb(db);

  res.json({ success: true, comments: photo.comments });
});

// API: Notes / Love & Family Messages
app.get('/api/notes', (_req: Request, res: Response) => {
  const db = getDb();
  res.json({ success: true, notes: db.notes });
});

app.post('/api/notes', (req: Request, res: Response) => {
  const { from, to, role, message, color } = req.body;
  if (!message || !message.trim()) {
    return res.status(400).json({ success: false, message: 'Pesan tidak boleh kosong' });
  }

  const db = getDb();
  const newNote: MemoryNote = {
    id: 'note_' + Date.now(),
    from: from || 'Sayang',
    to: to || 'Untuk Semua',
    role: role || 'keluarga',
    message: message.trim(),
    color: color || 'rose',
    createdAt: new Date().toISOString()
  };

  db.notes.unshift(newNote);
  saveDb(db);

  res.status(201).json({ success: true, note: newNote });
});

app.delete('/api/notes/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const db = getDb();
  db.notes = db.notes.filter((n) => n.id !== id);
  saveDb(db);
  res.json({ success: true });
});

// API: Album Configuration & Info
app.get('/api/info', (_req: Request, res: Response) => {
  const db = getDb();
  // Don't send plain passcode
  const safeConfig = {
    ...db.config,
    hasPasscode: !!db.config.passcode && db.config.requirePasscode
  };
  delete (safeConfig as any).passcode;

  res.json({
    success: true,
    config: safeConfig,
    stats: {
      totalPhotos: db.photos.length,
      pacarPhotos: db.photos.filter((p) => p.category === 'pacar').length,
      keluargaPhotos: db.photos.filter((p) => p.category === 'keluarga').length,
      spesialPhotos: db.photos.filter((p) => p.category === 'spesial').length,
      liburanPhotos: db.photos.filter((p) => p.category === 'liburan').length,
      favoritePhotos: db.photos.filter((p) => p.isFavorite).length,
      totalNotes: db.notes.length
    }
  });
});

app.put('/api/info', (req: Request, res: Response) => {
  const db = getDb();
  const { title, subTitle, ownerName, partnerName, anniversaryDate, requirePasscode, passcode } = req.body;

  db.config = {
    ...db.config,
    title: title !== undefined ? title : db.config.title,
    subTitle: subTitle !== undefined ? subTitle : db.config.subTitle,
    ownerName: ownerName !== undefined ? ownerName : db.config.ownerName,
    partnerName: partnerName !== undefined ? partnerName : db.config.partnerName,
    anniversaryDate: anniversaryDate !== undefined ? anniversaryDate : db.config.anniversaryDate,
    requirePasscode: requirePasscode !== undefined ? requirePasscode : db.config.requirePasscode,
    passcode: passcode !== undefined ? passcode : db.config.passcode
  };

  saveDb(db);
  res.json({ success: true, message: 'Pengaturan album berhasil diperbarui' });
});

// API: Verify Passcode
app.post('/api/verify-passcode', (req: Request, res: Response) => {
  const { passcode } = req.body;
  const db = getDb();

  if (!db.config.requirePasscode) {
    return res.json({ success: true, verified: true });
  }

  if (passcode === db.config.passcode) {
    return res.json({ success: true, verified: true });
  }

  return res.status(401).json({ success: false, verified: false, message: 'Kode akses salah. Coba lagi!' });
});

// Start Server with Vite or Static
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`[Kita & Keluarga] Server berjalan di port ${port}`);
  });
}

startServer().catch((err) => {
  console.error('Gagal menjalankan server:', err);
});
