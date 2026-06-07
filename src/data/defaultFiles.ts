import { UnLimFile } from '../types';

export const INITIAL_FILES: UnLimFile[] = [
  {
    id: 'photo-1',
    name: 'DCIM_Cloud_Backup_Summer.jpg',
    size: 2450000, // 2.45 MB
    type: 'image/jpeg',
    category: 'photos',
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=60',
    thumbnailUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=150&auto=format&fit=crop&q=60',
    uploadedAt: '2026-06-07 01:10',
  },
  {
    id: 'photo-2',
    name: 'Cosmic_Galaxy_Wallpaper.png',
    size: 4890000,
    type: 'image/png',
    category: 'photos',
    url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=60',
    thumbnailUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=150&auto=format&fit=crop&q=60',
    uploadedAt: '2026-06-07 04:32',
  },
  {
    id: 'doc-1',
    name: 'Telegram_API_Limit_Bypass_Spec.pdf',
    size: 1250000,
    type: 'application/pdf',
    category: 'documents',
    url: '#',
    uploadedAt: '2026-06-03 18:45',
  },
  {
    id: 'doc-2',
    name: 'Multistream_Parallel_Upload_Guide.docx',
    size: 890000,
    type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    category: 'documents',
    url: '#',
    uploadedAt: '2026-06-07 02:15',
  },
];
