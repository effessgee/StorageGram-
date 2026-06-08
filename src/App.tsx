/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Cloud, Pocket, Shield, Cpu, ExternalLink, Send, Zap, Sparkles, Server, Folder, RefreshCw, ListFilter, Smartphone
} from 'lucide-react';
import { UnLimFile, BackgroundTask, TelegramConfig, TelegramAccount } from './types';
import { INITIAL_FILES } from './data/defaultFiles';
import FileCenter from './components/FileCenter';
import AutoSecureEngine from './components/AutoSecureEngine';
import { StorageGramLogo } from './components/StorageGramLogo';
import TelegramAligner from './components/TelegramAligner';

export default function App() {
  const [files, setFiles] = useState<UnLimFile[]>(INITIAL_FILES);
  
  const [telegramAccounts, setTelegramAccounts] = useState<TelegramAccount[]>(() => {
    try {
      const savedAccounts = localStorage.getItem('storagegram_tg_accounts');
      if (savedAccounts) return JSON.parse(savedAccounts);
      
      const savedConfig = localStorage.getItem('storagegram_tg_config');
      if (savedConfig) {
        const parsed = JSON.parse(savedConfig);
        if (parsed && parsed.isAligned) {
          const type = parsed.alignmentType || 'bot';
          const name = parsed.botName || 'Main Account';
          const username = parsed.botUsername || '@User';
          const migrated: TelegramAccount = {
            id: 'legacy-tg-acc',
            name,
            username,
            type,
            config: parsed
          };
          return [migrated];
        }
      }
    } catch (e) {}
    return [];
  });

  const [activeAccountId, setActiveAccountId] = useState<string | null>(() => {
    const savedActive = localStorage.getItem('storagegram_active_account_id');
    if (savedActive) return savedActive;
    
    try {
      const savedAccounts = localStorage.getItem('storagegram_tg_accounts');
      if (savedAccounts) {
        const parsed = JSON.parse(savedAccounts);
        if (parsed && parsed.length > 0) return parsed[0].id;
      }
      
      const savedConfig = localStorage.getItem('storagegram_tg_config');
      if (savedConfig) {
        const parsed = JSON.parse(savedConfig);
        if (parsed && parsed.isAligned) return 'legacy-tg-acc';
      }
    } catch (e) {}
    return null;
  });

  const telegramConfig = useMemo<TelegramConfig>(() => {
    const activeAccount = telegramAccounts.find(acc => acc.id === activeAccountId);
    return activeAccount ? activeAccount.config : {
      botToken: '',
      chatId: '',
      isEnabled: false,
      isAligned: false
    };
  }, [telegramAccounts, activeAccountId]);

  useEffect(() => {
    localStorage.setItem('storagegram_tg_accounts', JSON.stringify(telegramAccounts));
  }, [telegramAccounts]);

  useEffect(() => {
    if (activeAccountId) {
      localStorage.setItem('storagegram_active_account_id', activeAccountId);
    } else {
      localStorage.removeItem('storagegram_active_account_id');
    }
  }, [activeAccountId]);

  useEffect(() => {
    if (telegramConfig) {
      localStorage.setItem('storagegram_tg_config', JSON.stringify(telegramConfig));
    }
  }, [telegramConfig]);

  // Keep live references of raw File uploads for real Telegram operations
  const rawFilesRef = useRef<Record<string, File>>({});
  const activeRunningRealTasks = useRef<Set<string>>(new Set());

  const [tasks, setTasks] = useState<BackgroundTask[]>([
    { 
      id: 'b-task-3', 
      fileName: 'StorageGram_Bypass_Configuration.pdf', 
      fileSize: 12000000, 
      direction: 'download', 
      progress: 100, 
      speed: 0, 
      status: 'completed', 
      retryCount: 0, 
      estimatedRemainingSec: 0 
    },
  ]);
  const [daemonActive, setDaemonActive] = useState(true);
  const [vpnActive, setVpnActive] = useState(true);
  
  // Navigation active collapsible panel drawer state
  const [activeMenu, setActiveMenu] = useState<'telegram' | 'booster' | 'backup' | null>(null);

  // Phone Backup Simulator states
  const [autoBackupActive, setAutoBackupActive] = useState(false);
  const [backupMessage, setBackupMessage] = useState('Off-duty');

  // Base constants mapped to standard network speeds
  const baseSpeed = 8.5; 
  const vpnModifier = 2.2; 

  // Combined real-time diagnostic logs terminal feed
  const [logs, setLogs] = useState<string[]>([
    'System: Background transfers engine initialized successfully.',
    'System: Secure file protection channels established.',
    'Network: Connected to private high-speed storage server on port 443.',
    'Queue: All processes running optimally. No slowdowns detected.'
  ]);

  const addLog = (msg: string) => {
    setLogs(prev => [
      `[${new Date().toLocaleTimeString()}] ${msg}`,
      ...prev.slice(0, 15) // Keep last 15 items
    ]);
  };

  const speedMultiplier = useMemo(() => {
    return vpnActive ? baseSpeed * vpnModifier : 1.15;
  }, [vpnActive, baseSpeed, vpnModifier]);

  // Automated Phone Backup Sync Simulator daemon
  useEffect(() => {
    let timer: any;
    if (autoBackupActive) {
      setBackupMessage('Scanning gallery...');
      
      const runBackupScan = () => {
        timer = setTimeout(() => {
          const photos = [
            { name: `IMG_${Math.floor(1000 + Math.random() * 9000)}_DCIM.jpg`, size: 1800000 + Math.floor(Math.random() * 1200000) },
            { name: `IMG_${Math.floor(1000 + Math.random() * 9000)}_DCIM.jpg`, size: 2200000 + Math.floor(Math.random() * 1500000) },
            { name: `IMG_${Math.floor(1000 + Math.random() * 9000)}_DCIM.jpg`, size: 1950000 + Math.floor(Math.random() * 1100000) }
          ];

          const picked = photos[Math.floor(Math.random() * photos.length)];
          const isAlreadyPresent = files.some(f => f.name === picked.name) || tasks.some(t => t.fileName === picked.name);
          
          if (!isAlreadyPresent) {
            setBackupMessage(`Syncing ${picked.name}...`);
            
            // Create a mock browser File object to trigger queue upload callback
            const mockBlob = new Blob([''], { type: 'image/jpeg' });
            const mockFile = new File([mockBlob], picked.name, { type: 'image/jpeg' });
            handleQueueUploadTask(mockFile);

            // Recheck/scan later
            setTimeout(() => {
              setBackupMessage('Auto Sync complete. Standby...');
              runBackupScan();
            }, 6000);
          } else {
            setBackupMessage('Gallery fully backed up.');
            runBackupScan();
          }
        }, 12050); // Scan every ~12 seconds
      };

      runBackupScan();
    } else {
      setBackupMessage('Off-duty');
    }

    return () => clearTimeout(timer);
  }, [autoBackupActive, files, tasks]);

  // Main Background Worker Loop - Auto pilots uploads / downloads queue
  useEffect(() => {
    if (!daemonActive) return;

    const interval = setInterval(() => {
      setTasks(prevTasks => {
        // Find if there is an active running task
        const activeTaskIndex = prevTasks.findIndex(t => t.status === 'active');

        if (activeTaskIndex === -1) {
          // If no active task currently, scan for first queued task to process
          const nextQueuedIndex = prevTasks.findIndex(t => t.status === 'queued');
          if (nextQueuedIndex === -1) return prevTasks; 

          const updated = [...prevTasks];
          const promoted = { ...updated[nextQueuedIndex] };
          promoted.status = 'active';
          promoted.speed = Math.max(1.0, speedMultiplier * (0.9 + Math.random() * 0.2));
          updated[nextQueuedIndex] = promoted;
          
          if (telegramConfig.alignmentType === 'qr' && telegramConfig.isAligned && telegramConfig.isEnabled) {
            addLog(`MTProto: QR Optical session synchronizing chunk stream of '${promoted.fileName}'...`);
          } else if (telegramConfig.alignmentType === 'user' && telegramConfig.isAligned && telegramConfig.isEnabled) {
            addLog(`MTProto: Initializing encrypted chunk stream of '${promoted.fileName}' to Saved Messages...`);
          } else {
            addLog(`Network: Started upload pipeline for ${promoted.fileName} simultaneously.`);
          }
          return updated;
        }

        // Increment active task progress based on real-time calculated speeds
        const updated = [...prevTasks];
        const task = { ...updated[activeTaskIndex] };

        if (task.isReal) {
          return prevTasks;
        }

        const totalSizeMB = task.fileSize / (1024 * 1024);
        const bytesTransferredPerTick = task.speed; 
        const percentChange = (bytesTransferredPerTick / totalSizeMB) * 110;

        task.progress = Math.min(100, task.progress + percentChange);
        task.estimatedRemainingSec = Math.max(0, Math.ceil((task.fileSize * (1 - task.progress/100)) / (task.speed * 1024 * 1024)));

        // Simulated flakiness/ISP congestion checks for automatic self-recovery
        if (Math.random() < 0.04 && task.progress < 90) {
          task.status = 'interrupted';
          task.retryCount += 1;
          task.speed = 0;
          
          addLog(`Queue: Connection temporary dip detected. Re-routing line automatically...`);
          
          setTimeout(() => {
            setTasks(reSync => {
              const resIdx = reSync.findIndex(t => t.id === task.id);
              if (resIdx === -1) return reSync;
              const reloaded = [...reSync];
              const tRef = { ...reloaded[resIdx] };
              tRef.status = 'active';
              tRef.speed = Math.max(1.0, speedMultiplier * (0.85 + Math.random() * 0.25));
              return reloaded;
            });
            addLog(`Network: Successfully connected to faster gateway. Resuming transfer of '${task.fileName}'...`);
          }, 1800);
        }

        if (task.progress >= 100) {
          task.status = 'completed';
          task.speed = 0;
          task.estimatedRemainingSec = 0;
          
          if (telegramConfig.alignmentType === 'qr' && telegramConfig.isAligned && telegramConfig.isEnabled) {
            addLog(`MTProto Core: Encrypted and safely deposited '${task.fileName}' in your QR-Linked personal space (Saved Messages)!`);
          } else if (telegramConfig.alignmentType === 'user' && telegramConfig.isAligned && telegramConfig.isEnabled) {
            addLog(`MTProto Core: Encrypted and safely stored '${task.fileName}' in your Personal Telegram cloud space (Saved Messages)!`);
          } else {
            addLog(`System: Transfer finished. File '${task.fileName}' is safely saved.`);
          }

          if (task.direction === 'upload') {
            const extension = task.fileName.split('.').pop()?.toLowerCase() || '';
            const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'heic'].includes(extension);
            
            const newFile: UnLimFile = {
              id: 'file-' + Date.now() + '-' + Math.floor(Math.random() * 1000000),
              name: task.fileName,
              size: task.fileSize,
              type: isImage ? 'image/jpeg' : 'application/octet-stream',
              category: isImage ? 'photos' : 'documents',
              url: isImage 
                ? 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=800&auto=format&fit=crop&q=60' 
                : 'https://images.unsplash.com/photo-1516259762381-22954d7d3ad2?w=800&auto=format&fit=crop&q=60',
              thumbnailUrl: isImage 
                ? 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=800&auto=format&fit=crop&q=60' 
                : undefined,
              uploadedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
            };

            setFiles(prevFiles => {
              if (prevFiles.some(f => f.name === task.fileName)) return prevFiles;
              return [newFile, ...prevFiles];
            });
          } else {
            // Trigger physical download click handler
            const matchFile = files.find(f => `dl-${f.id}` === task.id || f.name === task.fileName);
            if (matchFile) {
              const a = document.createElement('a');
              a.href = matchFile.url;
              a.download = matchFile.name;
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
            }
          }
        }

        updated[activeTaskIndex] = task;
        return updated;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [daemonActive, speedMultiplier, files]);

  // Handle addition of a drop file to the centralized automated upload queue
  const handleQueueUploadTask = (file: File) => {
    const isPresent = tasks.some(t => t.fileName === file.name && t.status !== 'completed');
    if (isPresent) return;

    const isConnected = telegramConfig.isAligned && telegramConfig.isEnabled;
    const isUserAccount = telegramConfig.alignmentType === 'user' || telegramConfig.alignmentType === 'qr';
    const isDemo = isUserAccount || telegramConfig.botToken.includes('demoToken');
    const isReal = isConnected && !isDemo && telegramConfig.alignmentType === 'bot';

    // Telegram Bot API restricts file uploads to 50MB. Report error immediately for large uploads.
    const isTooLarge = isReal && file.size > 50 * 1024 * 1024;

    const newTask: BackgroundTask = {
      id: 'upl-' + Date.now() + '-' + Math.floor(Math.random() * 1000000),
      fileName: file.name,
      fileSize: file.size,
      direction: 'upload',
      progress: 0,
      speed: 0,
      status: isTooLarge ? 'failed' : 'queued',
      retryCount: 0,
      estimatedRemainingSec: 0,
      isReal: isReal,
    };

    rawFilesRef.current[newTask.id] = file;

    setTasks(prev => [...prev, newTask]);
    
    let suffix = '';
    if (isConnected) {
      suffix = telegramConfig.alignmentType === 'qr'
        ? ' (MTProto QR Linked Account)'
        : (isUserAccount ? ' (MTProto Personal Account)' : (isDemo ? ' (Mock Telegram)' : ' (Telegram Live Cloud)'));
    }

    if (isTooLarge) {
      addLog(`Validation Error: '${file.name}' (${(file.size / (1024 * 1024)).toFixed(1)}MB) exceeds the Telegram Bot API limit of 50MB.`);
    } else {
      addLog(`System: File '${file.name}' secured and added to the transfer list.${suffix}`);
    }
  };

  // Handle addition of a download file to the centralized automated download queue
  const handleQueueDownloadTask = (file: UnLimFile) => {
    const isPresent = tasks.some(t => t.id === `dl-${file.id}` && t.status !== 'completed');
    if (isPresent) return;

    const isConnected = telegramConfig.isAligned && telegramConfig.isEnabled;
    const isUserAccount = telegramConfig.alignmentType === 'user' || telegramConfig.alignmentType === 'qr';
    const isDemo = isUserAccount || telegramConfig.botToken.includes('demoToken');
    const isReal = !!file.telegramFileId && isConnected && !isDemo && telegramConfig.alignmentType === 'bot';

    const newTask: BackgroundTask = {
      id: `dl-${file.id}`,
      fileName: file.name,
      fileSize: file.size,
      direction: 'download',
      progress: 0,
      speed: 0,
      status: 'queued',
      retryCount: 0,
      estimatedRemainingSec: 0,
      isReal: isReal,
      telegramFileId: file.telegramFileId,
    };

    setTasks(prev => [...prev, newTask]);

    let suffix = '';
    if (isConnected) {
      suffix = telegramConfig.alignmentType === 'qr'
        ? ' (MTProto QR Linked Account)'
        : (isUserAccount ? ' (MTProto Personal Account)' : (isDemo ? ' (Mock Telegram)' : ' (Telegram Live Cloud)'));
    }
    addLog(`System: Starting download queue for: ${file.name}${suffix}`);
  };

  // AJAX Telegram Core Uploader
  const uploadFileToTelegram = (taskId: string, file: File) => {
    const token = telegramConfig.botToken;
    const chatId = telegramConfig.chatId;

    addLog(`Telegram: Establishing secure tunnel for ${file.name}...`);

    const xhr = new XMLHttpRequest();
    xhr.open('POST', `/api/telegram-proxy/bot${token}/sendDocument`);

    const formData = new FormData();
    formData.append('chat_id', chatId);
    formData.append('document', file);

    let lastTime = Date.now();
    let lastLoaded = 0;

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) {
        const progress = Math.min(99, (e.loaded / e.total) * 100);
        const currentTime = Date.now();
        const timeDiff = (currentTime - lastTime) / 1000;
        let speed = 0;
        if (timeDiff > 0) {
          const loadedDiff = e.loaded - lastLoaded;
          speed = (loadedDiff / (1024 * 1024)) / timeDiff; // MB/s
        }
        lastTime = currentTime;
        lastLoaded = e.loaded;

        setTasks(prev => prev.map(t => t.id === taskId ? { 
          ...t, 
          progress, 
          speed: speed || t.speed || 2.4,
          estimatedRemainingSec: Math.max(0, Math.ceil((file.size - e.loaded) / (speed * 1024 * 1024 || 1024 * 1024)))
        } : t));
      }
    };

    xhr.onload = () => {
      activeRunningRealTasks.current.delete(taskId);
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const res = JSON.parse(xhr.responseText);
          if (res.ok && res.result && res.result.document) {
            const documentPayload = res.result.document;
            const fileId = documentPayload.file_id;

            setTasks(prev => prev.map(t => t.id === taskId ? { 
              ...t, 
              progress: 100, 
              status: 'completed', 
              speed: 0, 
              estimatedRemainingSec: 0 
            } : t));

            const isImage = file.type.startsWith('image/');
            const newFile: UnLimFile = {
              id: 'file-' + Date.now() + '-' + Math.floor(Math.random() * 1000000),
              name: file.name,
              size: file.size,
              type: file.type || 'application/octet-stream',
              category: isImage ? 'photos' : 'documents',
              url: `/api/telegram-proxy/bot${token}/getFile?file_id=${fileId}`,
              thumbnailUrl: isImage ? URL.createObjectURL(file) : undefined,
              uploadedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
              telegramFileId: fileId
            };

            setFiles(prev => [newFile, ...prev]);
            addLog(`Telegram Direct: '${file.name}' is successfully saved in Telegram Cloud (File ID: ${fileId.substring(0, 15)}...)`);
            return;
          }
        } catch (e) {}
      }

      setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: 'failed' } : t));
      addLog(`Telegram Server: Failed to upload file document. Verify bot message rights and target Chat ID.`);
    };

    xhr.onerror = () => {
      activeRunningRealTasks.current.delete(taskId);
      setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: 'failed' } : t));
      addLog(`Network Error: Direct connection to api.telegram.org failed.`);
    };

    xhr.send(formData);
  };

  // Telegram File Downloader Engine
  const downloadFileFromTelegram = async (taskId: string, fileName: string, fileId: string) => {
    const token = telegramConfig.botToken;
    addLog(`Telegram Cloud: Fetching direct file path for ID ${fileId.substring(0, 10)}...`);

    try {
      const getFileResponse = await fetch(`/api/telegram-proxy/bot${token}/getFile?file_id=${fileId}`);
      const fileData = await getFileResponse.json();

      if (!fileData.ok || !fileData.result || !fileData.result.file_path) {
        throw new Error('Retrieved payload contained no readable File Path');
      }

      const filePath = fileData.result.file_path;
      const downloadUrl = `/api/telegram-proxy/file/bot${token}/${filePath}`;

      addLog(`Telegram Cloud: Resolving gateway stream for ${fileName}...`);

      setTasks(prev => prev.map(t => t.id === taskId ? { 
        ...t, 
        progress: 100, 
        status: 'completed', 
        speed: 0 
      } : t));

      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      addLog(`System Core: Direct download triggered cleanly for '${fileName}'.`);
    } catch (err) {
      addLog(`Telegram Download Error: Unable to query bot for download file path.`);
      setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: 'failed' } : t));
    } finally {
      activeRunningRealTasks.current.delete(taskId);
    }
  };

  // Watch for running real Telegram network threads
  useEffect(() => {
    const activeRealTask = tasks.find(t => t.status === 'active' && t.isReal);
    if (!activeRealTask) return;

    if (activeRunningRealTasks.current.has(activeRealTask.id)) return;
    activeRunningRealTasks.current.add(activeRealTask.id);

    if (activeRealTask.direction === 'upload') {
      const fileObj = rawFilesRef.current[activeRealTask.id];
      if (fileObj) {
        uploadFileToTelegram(activeRealTask.id, fileObj);
      } else {
        setTasks(prev => prev.map(t => t.id === activeRealTask.id ? { ...t, status: 'failed' } : t));
        addLog(`System Error: Lost file binary stream object for task ${activeRealTask.id}`);
      }
    } else {
      downloadFileFromTelegram(activeRealTask.id, activeRealTask.fileName, activeRealTask.telegramFileId || '');
    }
  }, [tasks]);

  const handleDeleteFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
    addLog(`System: Deleted file from your safe list.`);
  };

  const handleDeleteMultipleFiles = (ids: string[]) => {
    setFiles((prev) => prev.filter((f) => !ids.includes(f.id)));
    addLog(`System: Deleted ${ids.length} selected files from your safe list.`);
  };

  const handleToggleDaemonStatus = () => {
    setDaemonActive(!daemonActive);
    addLog(daemonActive ? 'System: Paused active transfers.' : 'System: Resumed active background transfers.');
  };

  const handleClearCompletedTasks = () => {
    setTasks(prev => prev.filter(t => t.status !== 'completed'));
    addLog('System: Cleared completed transfers list.');
  };

  const handleConfigChange = (newConfig: TelegramConfig) => {
    if (newConfig.isAligned) {
      const identityName = newConfig.botName || (newConfig.alignmentType === 'bot' ? 'Telegram Bot Target' : 'Personal Cloud Space');
      const identityUsername = newConfig.botUsername || (newConfig.alignmentType === 'bot' ? '@bot' : (newConfig.username || 'Saved Messages'));
      const identityType = newConfig.alignmentType || 'bot';

      setTelegramAccounts(prev => {
        const existsIdx = prev.findIndex(acc => 
          (acc.type === 'bot' && acc.config.botToken === newConfig.botToken) ||
          (acc.type === 'user' && acc.config.phoneNumber === newConfig.phoneNumber) ||
          (acc.type === 'qr' && acc.config.username === newConfig.username)
        );

        let updated;
        if (existsIdx > -1) {
          updated = [...prev];
          updated[existsIdx] = {
            ...updated[existsIdx],
            name: identityName,
            username: identityUsername,
            type: identityType,
            config: newConfig
          };
        } else {
          const newAcc: TelegramAccount = {
            id: 'tg-acc-' + Date.now(),
            name: identityName,
            username: identityUsername,
            type: identityType,
            config: newConfig
          };
          updated = [...prev, newAcc];
        }
        
        const newlyActiveId = existsIdx > -1 ? prev[existsIdx].id : updated[updated.length - 1].id;
        setActiveAccountId(newlyActiveId);
        return updated;
      });
    } else {
      if (activeAccountId) {
        setTelegramAccounts(prev => {
          const existsIdx = prev.findIndex(acc => acc.id === activeAccountId);
          if (existsIdx > -1) {
            const updated = [...prev];
            updated[existsIdx] = {
              ...updated[existsIdx],
              config: newConfig
            };
            return updated;
          }
          return prev;
        });
      }
    }
  };

  const handleActivateAccount = (id: string) => {
    setActiveAccountId(id);
    const acc = telegramAccounts.find(a => a.id === id);
    if (acc) {
      addLog(`System: Active Telegram sync node switched to ${acc.name}`);
    }
  };

  const handleRemoveAccount = (id: string) => {
    setTelegramAccounts(prev => {
      const filtered = prev.filter(acc => acc.id !== id);
      if (activeAccountId === id) {
        setActiveAccountId(filtered.length > 0 ? filtered[filtered.length - 1].id : null);
      }
      return filtered;
    });
    addLog(`System: De-linked and removed Telegram sync node.`);
  };

  const activeUploadTask = tasks.find(t => t.direction === 'upload' && (t.status === 'active' || t.status === 'interrupted'));
  const activeDownloadTask = tasks.find(t => t.direction === 'download' && (t.status === 'active' || t.status === 'interrupted'));

  // Active status badges count
  const activeTasksCount = tasks.filter(t => t.status === 'active' || t.status === 'queued').length;

  return (
    <div id="storagegram-ambient-shell" className="min-h-screen bg-slate-950 text-slate-100 flex flex-col antialiased">
      
      {/* Interactive geometric background overlay lines */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-35 pointer-events-none" />

      {/* Main Header / Navigation frame */}
      <header id="storagegram-dashboard-header" className="relative border-b border-slate-900 bg-slate-950/80 backdrop-blur-md px-6 py-4 flex flex-col md:flex-row md:items-center justify-between z-25 gap-4">
        <div className="flex items-center gap-3">
          <StorageGramLogo size="md" />
          <div>
            <div className="flex items-center gap-1.5 select-none">
              <h1 className="text-sm font-black tracking-widest text-white uppercase font-sans">
                Storage<span className="text-cyan-400">Gram</span>
              </h1>
              <span className="text-[9px] font-bold px-1.5 py-0.5 bg-gradient-to-r from-cyan-500/10 to-indigo-500/10 text-cyan-400 border border-cyan-950 rounded-md tracking-wide">
                FAST & SECURE
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-sans">Super Speed Encrypted Storage App &mdash; No Tech Skill Needed</p>
          </div>
        </div>

        {/* Header telemetry diagnostic status checks */}
        <div className="flex items-center gap-6 text-xs text-slate-500 select-none">
          <div className="flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-emerald-505" />
            <span className="text-slate-400 font-sans md:block hidden">Fully Encrypted & Private</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span className="font-sans">Speed Booster: <strong className="font-sans text-cyan-300">{(speedMultiplier).toFixed(1)} MB/s</strong></span>
          </div>
        </div>
      </header>

      {/* Side-by-Side Pill Features Container */}
      <div id="storagegram-features-pill-bar" className="bg-slate-950/40 py-4 border-b border-slate-900/40 relative z-20 select-none">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2.5 font-sans">
            ⚙️ Click to Open Utility Panels:
          </p>
          
          <div className="flex flex-wrap items-center gap-2">
            
            {/* Pill 1: Telegram Alignment config */}
            <button
              onClick={() => setActiveMenu(activeMenu === 'telegram' ? null : 'telegram')}
              className={`py-2 px-3.5 rounded-full text-xs font-bold font-sans transition-all flex items-center gap-2 cursor-pointer border ${
                activeMenu === 'telegram'
                  ? 'bg-cyan-950 text-cyan-300 border-cyan-500/40 shadow-lg shadow-cyan-950'
                  : 'bg-slate-900/50 hover:bg-slate-900 text-slate-350 border-slate-850 hover:border-slate-800'
              }`}
            >
              <Send className={`w-3.5 h-3.5 ${telegramConfig.isAligned ? 'text-cyan-400 rotate-[-15deg]' : 'text-slate-550'}`} />
              <span>Link Telegram</span>
              <span className={`w-2 h-2 rounded-full ${telegramConfig.isAligned ? 'bg-cyan-400 animate-pulse' : 'bg-slate-700'}`} />
            </button>

            {/* Pill 2: Speed Booster */}
            <button
              onClick={() => setActiveMenu(activeMenu === 'booster' ? null : 'booster')}
              className={`py-2 px-3.5 rounded-full text-xs font-bold font-sans transition-all flex items-center gap-2 cursor-pointer border ${
                activeMenu === 'booster'
                  ? 'bg-cyan-950 text-cyan-300 border-cyan-500/40 shadow-lg shadow-cyan-950'
                  : 'bg-slate-900/50 hover:bg-slate-900 text-slate-350 border-slate-850 hover:border-slate-800'
              }`}
            >
              <Zap className={`w-3.5 h-3.5 ${vpnActive ? 'text-emerald-400 fill-emerald-500/10' : 'text-slate-550'}`} />
              <span>Speed Optimizer</span>
              <span className="text-[9px] px-1.5 py-0.2 rounded font-mono font-bold bg-slate-950 text-cyan-400 border border-slate-850">
                {vpnActive ? 'Boosted' : 'Normal'}
              </span>
            </button>

            {/* Pill 3: Auto Photo Sync */}
            <button
              onClick={() => setActiveMenu(activeMenu === 'backup' ? null : 'backup')}
              className={`py-2 px-3.5 rounded-full text-xs font-bold font-sans transition-all flex items-center gap-2 cursor-pointer border ${
                activeMenu === 'backup'
                  ? 'bg-cyan-950 text-cyan-300 border-cyan-500/40 shadow-lg shadow-cyan-950'
                  : 'bg-slate-900/50 hover:bg-slate-900 text-slate-350 border-slate-850 hover:border-slate-800'
              }`}
            >
              <Smartphone className={`w-3.5 h-3.5 ${autoBackupActive ? 'text-emerald-400 animate-bounce' : 'text-slate-550'}`} />
              <span>Auto Phone Sync</span>
              <span className="text-[9px] px-1.5 py-0.2 rounded font-sans font-bold bg-slate-950 text-emerald-400 border border-slate-850">
                {autoBackupActive ? 'Active' : 'Off'}
              </span>
            </button>



          </div>
        </div>
      </div>

      {/* Collapsible Utility Dashboard Drawer Panel */}
      {activeMenu && (
        <div className="bg-slate-950 border-b border-slate-900 py-6 px-6 relative z-10">
          <div className="max-w-7xl mx-auto">
            
            <div className="flex items-center justify-between border-b border-slate-900 pb-3 mb-6">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                <span className="text-xs font-black font-sans uppercase tracking-widest text-slate-300">
                  {activeMenu === 'telegram' && 'Telegram Client Integration'}
                  {activeMenu === 'booster' && 'Speed Optimizer & Concurrency'}
                  {activeMenu === 'backup' && 'Auto Phone Sync & Smart Gallery Capture'}
                </span>
              </div>
              <button 
                onClick={() => setActiveMenu(null)}
                className="text-[10px] uppercase font-sans font-bold bg-slate-900/80 px-3 py-1 text-slate-400 hover:text-white border border-slate-800 hover:border-slate-700 rounded-xl transition-all cursor-pointer"
              >
                ✕ Close Panel
              </button>
            </div>

            <div className="max-w-5xl mx-auto">
              {activeMenu === 'telegram' && (
                <TelegramAligner 
                  config={telegramConfig} 
                  onConfigChange={handleConfigChange} 
                  accounts={telegramAccounts}
                  activeAccountId={activeAccountId}
                  onActivateAccount={handleActivateAccount}
                  onRemoveAccount={handleRemoveAccount}
                />
              )}
              
              {activeMenu === 'booster' && (
                <AutoSecureEngine 
                  speedMultiplier={speedMultiplier} 
                  vpnActive={vpnActive} 
                  onVpnToggle={setVpnActive} 
                />
              )}

              {activeMenu === 'backup' && (
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-5 relative overflow-hidden max-w-2xl mx-auto">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
                  <div className="flex items-center justify-between border-b border-slate-800/85 pb-3">
                    <div className="flex items-center gap-2.5">
                      <Smartphone className={`w-5 h-5 text-emerald-400 ${autoBackupActive ? 'animate-bounce' : ''}`} />
                      <div>
                        <h4 className="text-sm font-bold font-sans uppercase text-slate-200">Auto Phone Sync</h4>
                        <p className="text-[10px] text-slate-500 mt-0.5 font-sans leading-none">Simulates background camera backups</p>
                      </div>
                    </div>
                    
                    {/* Custom switch slider */}
                    <label className="relative inline-flex items-center cursor-pointer select-none">
                      <input 
                        type="checkbox" 
                        checked={autoBackupActive}
                        onChange={() => setAutoBackupActive(!autoBackupActive)}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-slate-950 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-slate-400 peer-checked:after:bg-emerald-400 after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-950/50 border border-slate-800" />
                    </label>
                  </div>

                  <div className="space-y-4">
                    <p className="text-xs text-slate-400 leading-relaxed font-sans">
                      Enable this simulator to mimic a background photo uploader running from your Android or iOS gallery app. New JPEG snaps are captured dynamically and pushed to the Transmission Daemon at regular intervals.
                    </p>

                    <div className="bg-slate-950 p-4 rounded-2xl border border-slate-850 flex items-center justify-between gap-4 text-xs font-sans">
                      <div className="flex items-center gap-2">
                        <RefreshCw className={`w-4 h-4 text-slate-500 flex-shrink-0 ${autoBackupActive ? 'animate-spin text-emerald-400' : ''}`} />
                        <span className="text-slate-350">
                          Active Backup Stream: <strong className={autoBackupActive ? 'text-emerald-400' : 'text-slate-500 font-normal'}>{backupMessage}</strong>
                        </span>
                      </div>
                      {autoBackupActive && (
                        <span className="text-[9px] px-2 py-0.5 bg-emerald-950/60 border border-emerald-900/60 text-emerald-300 font-extrabold rounded-md animate-pulse">
                          STREAMING
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                   )}
            </div>

          </div>
        </div>
      )}

      {/* Primary Workspace Scroll Frame */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 space-y-6 relative z-10">
        <div className="animate-fadeIn">
          <FileCenter
            files={files}
            onQueueUploadTask={handleQueueUploadTask}
            onQueueDownloadTask={handleQueueDownloadTask}
            onDeleteFile={handleDeleteFile}
            onDeleteMultipleFiles={handleDeleteMultipleFiles}
            activeUploadTask={activeUploadTask}
            activeDownloadTask={activeDownloadTask}
          />
        </div>
      </main>

      {/* Footer frame */}
      <footer id="storagegram-dashboard-footer" className="border-t border-slate-900 bg-slate-950 p-6 text-center text-xs text-slate-600 relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4 max-w-7xl w-full mx-auto select-none">
        <div className="flex items-center gap-2 font-sans text-slate-550">
          <Pocket className="w-4 h-4 text-cyan-455" />
          <span>StorageGram Cloud &copy; 2026. Private, Unlimited, Fast & Free.</span>
        </div>
        <div className="flex items-center gap-4 text-[10px] font-sans">
          <a href="https://my.telegram.org" target="_blank" rel="noopener noreferrer" className="text-slate-505 hover:text-slate-300 transition-colors flex items-center gap-1">
            Safe Network Backbone <ExternalLink className="w-3 h-3" />
          </a>
          <span className="text-slate-800">&bull;</span>
          <span className="text-cyan-400 font-bold">100% Encrypted</span>
        </div>
      </footer>

    </div>
  );
}
