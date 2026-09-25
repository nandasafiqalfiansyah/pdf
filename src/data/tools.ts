import { ToolDef } from '../types';

export const PDF_TOOLS: ToolDef[] = [
  {
    id: 'merge-pdf',
    title: 'Merge PDF',
    shortDesc: 'Menggabungkan beberapa file PDF menjadi satu dokumen berurutan.',
    fullDesc: 'Gabungkan dua atau lebih dokumen PDF menjadi satu berkas terpadu dengan susunan halaman yang dapat diatur ulang sesuai keinginan Anda.',
    icon: 'Merge',
    category: 'organize',
    accentColor: '#3b82f6', // Blue
    accept: '.pdf,application/pdf',
    multiple: true,
  },
  {
    id: 'split-pdf',
    title: 'Split PDF',
    shortDesc: 'Memisahkan PDF menjadi beberapa file atau halaman tertentu.',
    fullDesc: 'Pisahkan dokumen PDF besar menjadi halaman individual berformat ZIP atau ambil rentang halaman spesifik (misal: 1-3, 5) secara instan.',
    icon: 'Split',
    category: 'organize',
    accentColor: '#8b5cf6', // Violet
    accept: '.pdf,application/pdf',
    multiple: false,
  },
  {
    id: 'compress-pdf',
    title: 'Compress PDF',
    shortDesc: 'Mengurangi ukuran file PDF tanpa menurunkan keterbacaan dokumen.',
    fullDesc: 'Kecilkan bobot file PDF agar mudah dikirim via email atau WhatsApp dengan pilihan tingkat kompresi otomatis dan privasi terjaga.',
    icon: 'Minimize2',
    category: 'optimize',
    accentColor: '#10b981', // Emerald
    accept: '.pdf,application/pdf',
    multiple: false,
  },
  {
    id: 'pdf-to-word',
    title: 'PDF to Word',
    shortDesc: 'Konversi dokumen PDF menjadi file Microsoft Word (.docx).',
    fullDesc: 'Ubah teks dan struktur dari berkas PDF menjadi dokumen Microsoft Word (.docx) yang dapat disunting kembali dengan mudah.',
    icon: 'FileText',
    category: 'convert-from',
    accentColor: '#2563eb', // Royal Blue
    accept: '.pdf,application/pdf',
    multiple: false,
  },
  {
    id: 'pdf-to-excel',
    title: 'PDF to Excel',
    shortDesc: 'Ekstrak tabel dan data dari PDF ke spreadsheet Excel (.xlsx).',
    fullDesc: 'Tarik baris tabel, data numerik, dan kolom dari dokumen PDF langsung ke dalam lembar kerja Microsoft Excel (.xlsx).',
    icon: 'Table',
    category: 'convert-from',
    accentColor: '#059669', // Forest Green
    accept: '.pdf,application/pdf',
    multiple: false,
  },
  {
    id: 'pdf-to-powerpoint',
    title: 'PDF to PowerPoint',
    shortDesc: 'Ubah halaman PDF menjadi slide presentasi PowerPoint (.pptx).',
    fullDesc: 'Konversi setiap halaman dokumen presentasi PDF Anda menjadi slide presentasi Microsoft PowerPoint (.pptx) yang siap dipresentasikan.',
    icon: 'Presentation',
    category: 'convert-from',
    accentColor: '#ea580c', // Orange
    accept: '.pdf,application/pdf',
    multiple: false,
  },
  {
    id: 'pdf-to-jpg',
    title: 'PDF to JPG',
    shortDesc: 'Mengubah halaman PDF menjadi gambar resolusi tinggi (JPG).',
    fullDesc: 'Ekstrak tiap halaman dokumen PDF ke gambar JPG berkualitas tinggi. Unduh gambar per halaman atau seluruhnya dalam satu arsip ZIP.',
    icon: 'Image',
    category: 'convert-from',
    accentColor: '#d97706', // Amber
    accept: '.pdf,application/pdf',
    multiple: false,
  },
  {
    id: 'jpg-to-pdf',
    title: 'JPG to PDF',
    shortDesc: 'Mengubah gambar foto atau scan menjadi dokumen PDF rapi.',
    fullDesc: 'Satukan file JPG, PNG, atau WebP menjadi satu dokumen PDF standar A4 dengan orientasi otomatis atau margin yang rapi.',
    icon: 'FileImage',
    category: 'convert-to',
    accentColor: '#f43f5e', // Rose
    accept: 'image/jpeg,image/png,image/webp,image/jpg',
    multiple: true,
  },
  {
    id: 'word-to-pdf',
    title: 'Word to PDF',
    shortDesc: 'Mengubah dokumen Word (.docx) menjadi file PDF berkualitas.',
    fullDesc: 'Ubah file dokumen teks Microsoft Word (.docx) menjadi dokumen PDF portabel yang tata letaknya tidak akan bergeser di perangkat mana pun.',
    icon: 'FileUp',
    category: 'convert-to',
    accentColor: '#0284c7', // Sky Blue
    accept: '.docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    multiple: false,
  },
  {
    id: 'powerpoint-to-pdf',
    title: 'PowerPoint to PDF',
    shortDesc: 'Mengubah slide presentasi (.pptx) menjadi dokumen PDF.',
    fullDesc: 'Konversi deck presentasi PowerPoint (.pptx) Anda menjadi berkas PDF lanskap siap cetak dan mudah dibagikan kepada peserta.',
    icon: 'MonitorPlay',
    category: 'convert-to',
    accentColor: '#f97316', // Orange Red
    accept: '.pptx,application/vnd.openxmlformats-officedocument.presentationml.presentation',
    multiple: false,
  },
  {
    id: 'excel-to-pdf',
    title: 'Excel to PDF',
    shortDesc: 'Mengubah lembar kerja Excel (.xlsx) menjadi dokumen PDF.',
    fullDesc: 'Cetak lembar kerja spreadsheet Excel (.xlsx/.xls/.csv) menjadi dokumen PDF dengan tabel bergaris yang mudah dibaca.',
    icon: 'FileSpreadsheet',
    category: 'convert-to',
    accentColor: '#16a34a', // Emerald Green
    accept: '.xlsx,.xls,.csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    multiple: false,
  },
  {
    id: 'html-to-pdf',
    title: 'HTML to PDF',
    shortDesc: 'Mengubah halaman atau kode HTML menjadi berkas PDF rapi.',
    fullDesc: 'Konversi kode HTML, format struk, faktur invoice, atau template resume menjadi dokumen PDF profesional siap cetak.',
    icon: 'Code2',
    category: 'convert-to',
    accentColor: '#06b6d4', // Cyan
    accept: '.html,.htm,text/html',
    multiple: false,
  },
  {
    id: 'edit-pdf',
    title: 'Edit PDF',
    shortDesc: 'Menambahkan teks, catatan, gambar, atau anotasi ke dokumen PDF.',
    fullDesc: 'Bubuhkan teks keterangan, catatan kaki, tanggal, atau stempel informasi tambahan langsung ke halaman dokumen PDF Anda.',
    icon: 'Edit3',
    category: 'edit-manage',
    accentColor: '#ec4899', // Pink
    accept: '.pdf,application/pdf',
    multiple: false,
  },
  {
    id: 'sign-pdf',
    title: 'Sign PDF',
    shortDesc: 'Menambahkan tanda tangan elektronik basah atau digital ke PDF.',
    fullDesc: 'Gambar tanda tangan langsung dengan kuas halus, pilih warna tinta, atau unggah gambar paraf untuk ditempelkan di halaman dokumen.',
    icon: 'PenLine',
    category: 'edit-manage',
    accentColor: '#6366f1', // Indigo
    accept: '.pdf,application/pdf',
    multiple: false,
  },
  {
    id: 'watermark-pdf',
    title: 'Watermark PDF',
    shortDesc: 'Menambahkan watermark teks atau logo perlindungan hak cipta.',
    fullDesc: 'Beri tanda air (RAHASIA, DRAF, COPY, atau teks khusus) dengan kontrol transparansi, ukuran font, rotasi diagonal 45°, dan posisi repetitif.',
    icon: 'Stamp',
    category: 'edit-manage',
    accentColor: '#14b8a6', // Teal
    accept: '.pdf,application/pdf',
    multiple: false,
  },
  {
    id: 'rotate-pdf',
    title: 'Rotate PDF',
    shortDesc: 'Memutar orientasi halaman PDF (90°, 180°, 270°) per halaman atau semua.',
    fullDesc: 'Putar balik halaman yang terbalik hasil scan atau lanskap menjadi potret dengan rotasi per halaman atau serentak ke seluruh dokumen.',
    icon: 'RotateCw',
    category: 'edit-manage',
    accentColor: '#f59e0b', // Amber
    accept: '.pdf,application/pdf',
    multiple: false,
  },
  {
    id: 'organize-pdf',
    title: 'Organize PDF',
    shortDesc: 'Mengatur ulang urutan lembar halaman dokumen secara visual.',
    fullDesc: 'Pindahkan posisi halaman maju atau mundur secara visual dengan antarmuka thumbnail interaktif agar urutan dokumen tertata sempurna.',
    icon: 'LayoutGrid',
    category: 'organize',
    accentColor: '#8b5cf6', // Purple
    accept: '.pdf,application/pdf',
    multiple: false,
  },
  {
    id: 'remove-pages',
    title: 'Remove Pages',
    shortDesc: 'Menghapus halaman tertentu yang tidak diinginkan dari PDF.',
    fullDesc: 'Pilih lembar halaman kosong, salah cetak, atau halaman sensitif untuk dihapus secara permanen dan unduh versi PDF yang bersih.',
    icon: 'FileX',
    category: 'organize',
    accentColor: '#ef4444', // Red
    accept: '.pdf,application/pdf',
    multiple: false,
  },
  {
    id: 'extract-pages',
    title: 'Extract Pages',
    shortDesc: 'Mengambil dan memisahkan halaman pilihan menjadi dokumen PDF baru.',
    fullDesc: 'Ambil lembar dokumen penting (misalnya halaman rangkuman atau lampiran spesifik) dan simpan sebagai satu file PDF baru yang ringkas.',
    icon: 'Copy',
    category: 'organize',
    accentColor: '#3b82f6', // Blue
    accept: '.pdf,application/pdf',
    multiple: false,
  },
  {
    id: 'crop-pdf',
    title: 'Crop PDF',
    shortDesc: 'Memotong area margin atau batas tepi halaman PDF.',
    fullDesc: 'Potong batas tepi putih berlebih pada halaman PDF agar konten fokus dan terlihat lebih pas saat dicetak atau dibaca di layar digital.',
    icon: 'Crop',
    category: 'optimize',
    accentColor: '#10b981', // Emerald
    accept: '.pdf,application/pdf',
    multiple: false,
  },
];

export const CATEGORIES = [
  { id: 'all', label: 'Semua Alat (20)' },
  { id: 'edit-manage', label: '✏️ Edit & Kelola' },
  { id: 'organize', label: 'Organisasi Halaman' },
  { id: 'convert-from', label: 'Konversi dari PDF' },
  { id: 'convert-to', label: 'Konversi ke PDF' },
  { id: 'optimize', label: 'Optimalisasi' },
] as const;
