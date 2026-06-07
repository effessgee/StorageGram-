export type FileCategory = 'all' | 'photos' | 'documents';

export interface UnLimFile {
  id: string;
  name: string;
  size: number; // in bytes
  type: string;
  category: FileCategory;
  url: string;
  uploadedAt: string;
  thumbnailUrl?: string;
  telegramFileId?: string;
}

export interface StreamMetrics {
  streamId: number;
  progress: number; // 0 to 100
  bytesTransferred: number;
  speed: number; // MB/s
  status: 'idle' | 'uploading' | 'completed' | 'failed';
}

export interface SimulationConfig {
  streams: number;
  chunkSize: number; // KB
  networkSpeed: number; // simulated network cap in Mbps
}

export interface VpnNode {
  id: string;
  country: string;
  city: string;
  flag: string;
  ping: number; // ms
  load: number; // Percentage
  status: 'optimal' | 'stable' | 'high-load';
  isVip: boolean;
}

export interface BackgroundTask {
  id: string;
  fileName: string;
  fileSize: number;
  direction: 'upload' | 'download';
  progress: number;
  speed: number; // MB/s
  status: 'queued' | 'active' | 'suspended' | 'interrupted' | 'completed' | 'failed';
  retryCount: number;
  estimatedRemainingSec: number;
  isReal?: boolean;
  telegramFileId?: string;
}

export interface TelegramConfig {
  alignmentType?: 'bot' | 'user' | 'qr';
  botToken: string;
  chatId: string;
  isEnabled: boolean;
  botUsername?: string;
  botName?: string;
  isAligned: boolean;
  phoneNumber?: string;
  phoneCountryCode?: string;
  username?: string;
  userSessionActive?: boolean;
}


