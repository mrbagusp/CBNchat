// Types
export type ChannelType = 'instagram' | 'facebook_page' | 'tiktok' | 'whatsapp'

export interface Organization {
  id: string; name: string; slug: string; plan: string
}

export interface Profile {
  id: string; organization_id: string; full_name: string;
  avatar_url: string | null; role: string; email: string
}

export interface Workspace {
  id: string; organization_id: string; channel: ChannelType; name: string;
  external_id: string; external_username: string; account_type: string;
  profile_picture_url: string; follower_count: number; media_count: number;
  status: string; plan: string; connected_at: string | null; trial_ends_at: string | null
}

export interface Automation {
  id: string; workspace_id: string; name: string; status: string;
  trigger_type: string; folder_id: string | null;
  stats: { triggered: number; completed: number; failed: number }; created_at: string
}

export interface AutomationRun {
  id: string; automation_id: string; automation_name: string;
  status: 'completed' | 'failed' | 'running';
  started_at: string; triggered_by: { comment_text?: string } | null
}

export interface Contact {
  id: string; workspace_id: string; channel: ChannelType;
  external_user_id: string; channel_username: string; full_name: string;
  profile_pic_url: string | null; first_seen_at: string; last_seen_at: string;
  tags: string[]; subscribed: boolean; source: string
}

// Organization
export const ORGANIZATION: Organization = {
  id: 'org-cbn', name: 'CBN Indonesia', slug: 'cbn-indonesia', plan: 'pro'
}

// Demo user
export const DEMO_PROFILE: Profile = {
  id: 'user-demo', organization_id: 'org-cbn', full_name: 'Demo User',
  avatar_url: null, role: 'owner', email: 'demo@cbnchat.local'
}

export const DEFAULT_WORKSPACE_ID = 'ws-superyouth'

// 4 Instagram workspaces
export const WORKSPACES: Workspace[] = [
  {
    id: 'ws-superyouth', organization_id: 'org-cbn', channel: 'instagram',
    name: 'Superyouth Generation', external_id: 'ig_001',
    external_username: 'superyouthgen', account_type: 'business',
    profile_picture_url: 'https://api.dicebear.com/7.x/shapes/svg?seed=Superyouth',
    follower_count: 45200, media_count: 183, status: 'connected', plan: 'pro',
    connected_at: '2026-01-15T08:00:00Z', trial_ends_at: '2026-04-21T23:59:59Z'
  },
  {
    id: 'ws-cahaya', organization_id: 'org-cbn', channel: 'instagram',
    name: 'Cahaya Bagi Negeri', external_id: 'ig_002',
    external_username: 'cahayabaginegeri', account_type: 'business',
    profile_picture_url: 'https://api.dicebear.com/7.x/shapes/svg?seed=Cahaya',
    follower_count: 12800, media_count: 94, status: 'connected', plan: 'pro',
    connected_at: '2026-02-10T08:00:00Z', trial_ends_at: null
  },
  {
    id: 'ws-superbook', organization_id: 'org-cbn', channel: 'instagram',
    name: 'Superbook Indonesia', external_id: 'ig_003',
    external_username: 'superbookindonesia', account_type: 'business',
    profile_picture_url: 'https://api.dicebear.com/7.x/shapes/svg?seed=Superbook',
    follower_count: 8400, media_count: 56, status: 'connected', plan: 'free',
    connected_at: '2026-03-01T08:00:00Z', trial_ends_at: null
  },
  {
    id: 'ws-doa', organization_id: 'org-cbn', channel: 'instagram',
    name: 'Ingin Didoakan', external_id: 'ig_004',
    external_username: 'ingindidoakan', account_type: 'creator',
    profile_picture_url: 'https://api.dicebear.com/7.x/shapes/svg?seed=Didoakan',
    follower_count: 3150, media_count: 28, status: 'connected', plan: 'pro',
    connected_at: '2026-03-20T08:00:00Z', trial_ends_at: null
  },
]

// 3 automations for Superyouth
export const AUTOMATIONS: Automation[] = [
  {
    id: 'auto-1', workspace_id: 'ws-superyouth', name: 'Auto-DM from new comments',
    status: 'live', trigger_type: 'post_comment', folder_id: 'folder-1',
    stats: { triggered: 247, completed: 231, failed: 16 }, created_at: '2026-03-01T10:00:00Z'
  },
  {
    id: 'auto-2', workspace_id: 'ws-superyouth', name: 'Story reply -> offer ebook',
    status: 'draft', trigger_type: 'story_reply', folder_id: 'folder-2',
    stats: { triggered: 0, completed: 0, failed: 0 }, created_at: '2026-04-10T10:00:00Z'
  },
  {
    id: 'auto-3', workspace_id: 'ws-superyouth', name: 'AI reply for prayer requests',
    status: 'live', trigger_type: 'dm_message', folder_id: null,
    stats: { triggered: 89, completed: 85, failed: 4 }, created_at: '2026-04-05T10:00:00Z'
  },
]

// Generate 20 automation runs with timestamps from last 7 days
function generateRuns(): AutomationRun[] {
  const statuses: Array<'completed' | 'failed' | 'running'> = ['completed', 'completed', 'completed', 'completed', 'failed', 'running']
  const comments = ['info please', 'amin', 'mau ikut', 'link dong', 'saya mau', 'hallelujah', 'gimana caranya?', 'DM ya', 'amen', 'keren banget']
  const runs: AutomationRun[] = []
  const now = 1745020800000 // fixed timestamp to avoid hydration mismatch
  for (let i = 0; i < 20; i++) {
    const hoursAgo = (i * 8) + 1
    runs.push({
      id: `run-${i}`,
      automation_id: i % 3 === 0 ? 'auto-3' : 'auto-1',
      automation_name: i % 3 === 0 ? 'AI reply for prayer requests' : 'Auto-DM from new comments',
      status: statuses[i % statuses.length],
      started_at: new Date(now - hoursAgo * 3600000).toISOString(),
      triggered_by: { comment_text: comments[i % comments.length] },
    })
  }
  return runs.sort((a, b) => new Date(b.started_at).getTime() - new Date(a.started_at).getTime())
}
export const AUTOMATION_RUNS = generateRuns()

// Generate 30 contacts
function generateContacts(): Contact[] {
  const usernames = [
    'yusuf.kristian', 'maria_doa', 'hamba_tuhan23', 'terangbagi.sesama',
    'kasihkristus_id', 'bertumbuh.dlmkristus', 'anakdoa_jkt', 'pemudakatolik',
    'injiluntuksemua', 'doaku.didengar', 'pengharapan_baru', 'iman.teguh',
    'kasih_sayang_id', 'berdoa_setiaphari', 'gereja.muda', 'pelayan_tuhan',
    'sukacita_surga', 'firman.hidup', 'anugerah_allah', 'murid.kristus',
    'terang.dunia', 'garam.bumi_id', 'salib.kasih', 'doa.pagi',
    'renungan.harian', 'ibadah.online', 'rohani.muda', 'berkat.melimpah',
    'mazmur_23', 'yohanes.316'
  ]
  const tags = ['new_lead', 'doa', 'yesus_curhat', 'paid_event']
  const sources = ['comment', 'dm', 'story_reply', 'comment', 'comment']
  const wsIds = ['ws-superyouth', 'ws-superyouth', 'ws-cahaya', 'ws-superbook', 'ws-doa']
  const now = 1745020800000
  return usernames.map((u, i) => ({
    id: `contact-${i}`,
    workspace_id: wsIds[i % wsIds.length],
    channel: 'instagram' as ChannelType,
    external_user_id: `iguser_${i}`,
    channel_username: u,
    full_name: u.replace(/[._]/g, ' ').replace(/(^\w|\s\w)/g, m => m.toUpperCase()).replace(/\d+/g, '').trim(),
    profile_pic_url: `https://api.dicebear.com/7.x/initials/svg?seed=${u}`,
    first_seen_at: new Date(now - (30 - i) * 86400000).toISOString(),
    last_seen_at: new Date(now - i * 3600000).toISOString(),
    tags: [tags[i % tags.length], ...(i % 3 === 0 ? [tags[(i + 1) % tags.length]] : [])],
    subscribed: i % 7 !== 0,
    source: sources[i % sources.length],
  }))
}
export const CONTACTS = generateContacts()

// Dashboard stats with sparkline data
export function getDashboardStats(_workspaceId: string) {
  return {
    triggered: { value: 336, change: '+12%' },
    newContacts: { value: 184, change: '+8%' },
    messagesSent: { value: 1247, change: '+23%' },
    crmLeads: { value: 94, change: '+15%' },
    sparklines: {
      triggered: [28, 34, 41, 38, 52, 67, 76],
      newContacts: [18, 22, 28, 24, 31, 29, 32],
      messagesSent: [128, 156, 189, 175, 204, 198, 197],
      crmLeads: [8, 11, 14, 13, 17, 15, 16],
    },
  }
}

// Automation folders
export const FOLDERS = [
  { id: 'folder-1', workspace_id: 'ws-superyouth', name: 'RESPONDEN CAROUSEL' },
  { id: 'folder-2', workspace_id: 'ws-superyouth', name: 'RESPONDEN GRAFIS' },
]

// ─── Media (Instagram posts) ──────────────────────────────────────────────────

export interface MediaItem {
  id: string
  media_type: 'VIDEO' | 'IMAGE' | 'CAROUSEL'
  thumbnail_url: string
  caption: string
  timestamp: string
  permalink: string
}

export const MOCK_MEDIA: MediaItem[] = [
  { id: 'media-1', media_type: 'VIDEO', thumbnail_url: 'https://api.dicebear.com/7.x/shapes/svg?seed=video1&backgroundColor=f43f5e', caption: 'DULU BULLY PENGIKUT YESUS, SEKARANG PERCAYA YESUS!', timestamp: '2026-04-15T10:00:00Z', permalink: '#' },
  { id: 'media-2', media_type: 'VIDEO', thumbnail_url: 'https://api.dicebear.com/7.x/shapes/svg?seed=video2&backgroundColor=8b5cf6', caption: 'Yesus itu di hidup kami, bukan sekedar cerita...', timestamp: '2026-04-14T10:00:00Z', permalink: '#' },
  { id: 'media-3', media_type: 'VIDEO', thumbnail_url: 'https://api.dicebear.com/7.x/shapes/svg?seed=video3&backgroundColor=0ea5e9', caption: 'APA YANG MEMBUAT DADE YOSEF PILIH MENJADI KRISTEN?', timestamp: '2026-04-14T08:00:00Z', permalink: '#' },
  { id: 'media-4', media_type: 'IMAGE', thumbnail_url: 'https://api.dicebear.com/7.x/shapes/svg?seed=image4&backgroundColor=f59e0b', caption: 'YANG MENYALIBKAN YESUS BERJASA ATAU BERDOSA?', timestamp: '2026-04-13T10:00:00Z', permalink: '#' },
  { id: 'media-5', media_type: 'VIDEO', thumbnail_url: 'https://api.dicebear.com/7.x/shapes/svg?seed=video5&backgroundColor=10b981', caption: 'ALKITAB DIROBEK DAN DISEMBUNYIKAN ORTU, TAPI AKU TIDAK MENYERAH!', timestamp: '2026-04-13T08:00:00Z', permalink: '#' },
  { id: 'media-6', media_type: 'IMAGE', thumbnail_url: 'https://api.dicebear.com/7.x/shapes/svg?seed=image6&backgroundColor=ec4899', caption: 'YESUS TIDAK DISALIB TAPI DISERUPAKAN?', timestamp: '2026-04-12T10:00:00Z', permalink: '#' },
  { id: 'media-7', media_type: 'VIDEO', thumbnail_url: 'https://api.dicebear.com/7.x/shapes/svg?seed=video7&backgroundColor=6366f1', caption: 'Kesaksian: Dari Atheist Menjadi Percaya Tuhan', timestamp: '2026-04-11T10:00:00Z', permalink: '#' },
  { id: 'media-8', media_type: 'IMAGE', thumbnail_url: 'https://api.dicebear.com/7.x/shapes/svg?seed=image8&backgroundColor=14b8a6', caption: 'DOA YANG MENGUBAH SEGALANYA', timestamp: '2026-04-10T10:00:00Z', permalink: '#' },
  { id: 'media-9', media_type: 'VIDEO', thumbnail_url: 'https://api.dicebear.com/7.x/shapes/svg?seed=video9&backgroundColor=f97316', caption: 'Mengapa Anak Muda Perlu Komunitas Rohani?', timestamp: '2026-04-09T10:00:00Z', permalink: '#' },
  { id: 'media-10', media_type: 'CAROUSEL', thumbnail_url: 'https://api.dicebear.com/7.x/shapes/svg?seed=carousel10&backgroundColor=a855f7', caption: '5 Ayat Alkitab untuk Kamu yang Sedang Berjuang', timestamp: '2026-04-08T10:00:00Z', permalink: '#' },
  { id: 'media-11', media_type: 'VIDEO', thumbnail_url: 'https://api.dicebear.com/7.x/shapes/svg?seed=video11&backgroundColor=ef4444', caption: 'Curhat Session: Ketika Keluarga Tidak Mendukung Imanmu', timestamp: '2026-04-07T10:00:00Z', permalink: '#' },
  { id: 'media-12', media_type: 'IMAGE', thumbnail_url: 'https://api.dicebear.com/7.x/shapes/svg?seed=image12&backgroundColor=0891b2', caption: 'JANJI TUHAN TIDAK PERNAH GAGAL', timestamp: '2026-04-06T10:00:00Z', permalink: '#' },
  { id: 'media-13', media_type: 'VIDEO', thumbnail_url: 'https://api.dicebear.com/7.x/shapes/svg?seed=video13&backgroundColor=84cc16', caption: 'Baptis Air: Apa Artinya dan Mengapa Penting?', timestamp: '2026-04-05T10:00:00Z', permalink: '#' },
  { id: 'media-14', media_type: 'IMAGE', thumbnail_url: 'https://api.dicebear.com/7.x/shapes/svg?seed=image14&backgroundColor=e11d48', caption: 'Natal Bukan Sekedar Hari Libur', timestamp: '2026-04-04T10:00:00Z', permalink: '#' },
  { id: 'media-15', media_type: 'VIDEO', thumbnail_url: 'https://api.dicebear.com/7.x/shapes/svg?seed=video15&backgroundColor=7c3aed', caption: 'Mujizat Masih Terjadi Hari Ini', timestamp: '2026-04-03T10:00:00Z', permalink: '#' },
  { id: 'media-16', media_type: 'CAROUSEL', thumbnail_url: 'https://api.dicebear.com/7.x/shapes/svg?seed=carousel16&backgroundColor=059669', caption: 'Renungan Mingguan: Kasih Tanpa Syarat', timestamp: '2026-04-02T10:00:00Z', permalink: '#' },
  { id: 'media-17', media_type: 'VIDEO', thumbnail_url: 'https://api.dicebear.com/7.x/shapes/svg?seed=video17&backgroundColor=d946ef', caption: 'Bagaimana Menghadapi Penolakan Karena Iman?', timestamp: '2026-04-01T10:00:00Z', permalink: '#' },
  { id: 'media-18', media_type: 'IMAGE', thumbnail_url: 'https://api.dicebear.com/7.x/shapes/svg?seed=image18&backgroundColor=f43f5e', caption: 'Tuhan Punya Rencana Indah Untukmu', timestamp: '2026-03-31T10:00:00Z', permalink: '#' },
  { id: 'media-19', media_type: 'VIDEO', thumbnail_url: 'https://api.dicebear.com/7.x/shapes/svg?seed=video19&backgroundColor=0ea5e9', caption: 'Live Worship: Malam Penyembahan Bersama', timestamp: '2026-03-30T10:00:00Z', permalink: '#' },
  { id: 'media-20', media_type: 'IMAGE', thumbnail_url: 'https://api.dicebear.com/7.x/shapes/svg?seed=image20&backgroundColor=f59e0b', caption: 'Quote of the Day: Filipi 4:13', timestamp: '2026-03-29T10:00:00Z', permalink: '#' },
  { id: 'media-21', media_type: 'VIDEO', thumbnail_url: 'https://api.dicebear.com/7.x/shapes/svg?seed=video21&backgroundColor=10b981', caption: 'Kesaksian: Sembuh dari Depresi Karena Doa', timestamp: '2026-03-28T10:00:00Z', permalink: '#' },
  { id: 'media-22', media_type: 'CAROUSEL', thumbnail_url: 'https://api.dicebear.com/7.x/shapes/svg?seed=carousel22&backgroundColor=8b5cf6', caption: '7 Langkah Memulai Kehidupan Doa', timestamp: '2026-03-27T10:00:00Z', permalink: '#' },
  { id: 'media-23', media_type: 'VIDEO', thumbnail_url: 'https://api.dicebear.com/7.x/shapes/svg?seed=video23&backgroundColor=ec4899', caption: 'Diskusi: Apakah Agama Masih Relevan?', timestamp: '2026-03-26T10:00:00Z', permalink: '#' },
  { id: 'media-24', media_type: 'IMAGE', thumbnail_url: 'https://api.dicebear.com/7.x/shapes/svg?seed=image24&backgroundColor=14b8a6', caption: 'Selamat Hari Minggu! Sudah Ibadah?', timestamp: '2026-03-25T10:00:00Z', permalink: '#' },
  { id: 'media-25', media_type: 'VIDEO', thumbnail_url: 'https://api.dicebear.com/7.x/shapes/svg?seed=video25&backgroundColor=6366f1', caption: 'Belajar Alkitab Bersama: Kitab Mazmur', timestamp: '2026-03-24T10:00:00Z', permalink: '#' },
  { id: 'media-26', media_type: 'IMAGE', thumbnail_url: 'https://api.dicebear.com/7.x/shapes/svg?seed=image26&backgroundColor=f97316', caption: 'Doa Pagi: Tuhan Berkati Hari Ini', timestamp: '2026-03-23T10:00:00Z', permalink: '#' },
  { id: 'media-27', media_type: 'VIDEO', thumbnail_url: 'https://api.dicebear.com/7.x/shapes/svg?seed=video27&backgroundColor=a855f7', caption: 'Podcast: Iman di Tempat Kerja', timestamp: '2026-03-22T10:00:00Z', permalink: '#' },
  { id: 'media-28', media_type: 'CAROUSEL', thumbnail_url: 'https://api.dicebear.com/7.x/shapes/svg?seed=carousel28&backgroundColor=ef4444', caption: 'Infografis: Perjalanan Paulus', timestamp: '2026-03-21T10:00:00Z', permalink: '#' },
  { id: 'media-29', media_type: 'VIDEO', thumbnail_url: 'https://api.dicebear.com/7.x/shapes/svg?seed=video29&backgroundColor=0891b2', caption: 'Q&A: Menjawab Pertanyaan Tentang Iman Kristen', timestamp: '2026-03-20T10:00:00Z', permalink: '#' },
  { id: 'media-30', media_type: 'IMAGE', thumbnail_url: 'https://api.dicebear.com/7.x/shapes/svg?seed=image30&backgroundColor=84cc16', caption: 'Tuhan Itu Baik, Selamanya!', timestamp: '2026-03-19T10:00:00Z', permalink: '#' },
]
