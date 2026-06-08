import React, { useState, useRef, useEffect } from 'react';
import { 
  Folder, Image, FileText, UploadCloud, Trash, Search, Eye, Download, ArrowDownToLine
} from 'lucide-react';
import { UnLimFile, FileCategory, BackgroundTask } from '../types';

interface FileCenterProps {
  files: UnLimFile[];
  onQueueUploadTask: (file: File) => void;
  onQueueDownloadTask: (file: UnLimFile) => void;
  onDeleteFile: (id: string) => void;
  onDeleteMultipleFiles?: (ids: string[]) => void;
  activeUploadTask?: BackgroundTask;
  activeDownloadTask?: BackgroundTask;
}

export default function FileCenter({
  files,
  onQueueUploadTask,
  onQueueDownloadTask,
  onDeleteFile,
  onDeleteMultipleFiles,
  activeUploadTask,
  activeDownloadTask,
}: FileCenterProps) {
  const [activeCategory, setActiveCategory] = useState<FileCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [photoPreviewUrl, setPhotoPreviewUrl] = useState<string | null>(null);
  const [selectedFileIds, setSelectedFileIds] = useState<string[]>([]);

  // Synchronize selection state when list changes
  useEffect(() => {
    const validIds = files.map(f => f.id);
    setSelectedFileIds(prev => prev.filter(id => validIds.includes(id)));
  }, [files]);

  const handleDeleteSelected = () => {
    if (selectedFileIds.length === 0) return;
    if (onDeleteMultipleFiles) {
      onDeleteMultipleFiles(selectedFileIds);
    } else {
      selectedFileIds.forEach(id => onDeleteFile(id));
    }
    setSelectedFileIds([]);
  };

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const formatFileSize = (bytes: number): string => {
    if (bytes >= 1048576) {
      return (bytes / 1048576).toFixed(2) + ' MB';
    }
    return (bytes / 1024).toFixed(1) + ' KB';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      Array.from(e.dataTransfer.files).forEach(file => {
        onQueueUploadTask(file as File);
      });
    }
  };

  const handleBrowseFiles = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      Array.from(e.target.files).forEach(file => {
        onQueueUploadTask(file as File);
      });
    }
  };

  // Filter & Search Logic
  const filteredFiles = files.filter((f) => {
    const matchesCategory = activeCategory === 'all' || f.category === activeCategory;
    const matchesQuery = f.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  const getCategoryIcon = (category: FileCategory) => {
    switch (category) {
      case 'photos': return <Image className="w-4 h-4 text-emerald-400" />;
      case 'documents': return <FileText className="w-4 h-4 text-amber-400" />;
      default: return <Folder className="w-4 h-4 text-slate-400" />;
    }
  };

  // Re-generate socket progress values mathematically for visual richness
  const getSubSocketProgress = (taskProgress: number, socketId: number) => {
    // Generate scattered offsets across 8 fictional channel ports
    const offset = (socketId * 11) % 25;
    return Math.min(100, Math.max(0, Math.floor(taskProgress * 1.1) - offset));
  };

  return (
    <div id="storagegram-file-center-root" className="space-y-6 w-full">
        
        {/* Drop Zone */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleBrowseFiles}
          className={`border-2 border-dashed rounded-3xl p-8 flex flex-col items-center justify-center text-center cursor-pointer relative overflow-hidden group transition-all duration-300 ${
            dragOver 
              ? 'border-emerald-400 bg-emerald-950/10 shadow-lg shadow-emerald-500/5' 
              : 'border-slate-800 bg-slate-900/40 hover:bg-slate-900 hover:border-slate-705'
          }`}
        >
          {/* Subtle neon dropzone background */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-44 h-44 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none group-hover:bg-cyan-500/10 transition-all duration-300" />

          {/* Ready to Upload Idle State */}
          <div className="space-y-4 select-none">
            <div className="mx-auto p-4 bg-slate-950 rounded-2xl w-fit group-hover:scale-105 transition-all outline outline-slate-800">
              <UploadCloud className="w-8 h-8 text-slate-400 group-hover:text-emerald-400 transition-all duration-300" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-200 font-sans">
                Drag & Drop files here, or <span className="text-emerald-400 group-hover:underline">click to browse</span>
              </p>
              <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto leading-normal font-sans">
                Supports all files & video sizes. Dropping will queue transfers instantly in parallel below.
              </p>
            </div>
          </div>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            multiple
            className="hidden"
          />
        </div>

        {/* Storage Explorer Header and list */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4">
          
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
            <div className="flex flex-wrap items-center gap-3">
              <h3 className="text-xs font-extrabold font-sans uppercase tracking-wider text-slate-300 flex items-center gap-1.5 leading-none">
                <Folder className="w-4 h-4 text-emerald-400" /> Safe Storage Explorer
              </h3>
              
              {/* Inline horizontal category tabs */}
              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-850">
                {[
                  { id: 'all', label: 'All Saved', count: files.length },
                  { id: 'photos', label: 'Photos', count: files.filter(f => f.category === 'photos').length },
                  { id: 'documents', label: 'Documents', count: files.filter(f => f.category === 'documents').length },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id as FileCategory)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider font-sans transition-all cursor-pointer ${
                      activeCategory === cat.id
                        ? 'bg-emerald-950/80 border border-emerald-900/50 text-emerald-400 font-extrabold'
                        : 'text-slate-400 hover:text-white border border-transparent'
                    }`}
                  >
                    {cat.label} ({cat.count})
                  </button>
                ))}
              </div>

              {selectedFileIds.length > 0 && (
                <button
                  onClick={handleDeleteSelected}
                  className="bg-rose-950/80 text-rose-300 hover:bg-rose-900 hover:text-white border border-rose-900/50 flex items-center gap-1 px-2.5 py-1 rounded-xl text-[10px] font-bold transition-all cursor-pointer animate-fadeIn shadow-sm"
                  title="Purge all checked files"
                >
                  <Trash className="w-3 h-3 text-rose-450" />
                  <span>Delete Selected ({selectedFileIds.length})</span>
                </button>
              )}
            </div>

            {/* Simple Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search saved files..."
                className="w-full sm:w-52 bg-slate-950 border border-slate-850 rounded-xl py-1.5 pl-9 pr-3 text-xs text-slate-300 focus:outline-none focus:border-cyan-500 transition-all font-medium placeholder-slate-655 font-sans"
              />
            </div>
          </div>

          {/* Active Multi-Socket Downloader HUD */}
          {activeDownloadTask && (
            <div className="bg-gradient-to-br from-slate-950 to-slate-940 border border-cyan-500/30 rounded-2xl p-5 space-y-4 animate-fadeIn relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
              
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-900 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-cyan-500/10 text-cyan-400 rounded-xl animate-bounce">
                    <ArrowDownToLine className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold font-sans uppercase text-slate-100 flex items-center gap-1">
                      High-Speed Downloader <span className="text-[8px] bg-cyan-950 text-cyan-400 font-bold px-1.5 py-0.2 rounded border border-cyan-900/40 font-sans tracking-wide">SECURED</span>
                    </h4>
                    <p className="text-[11px] text-slate-300 mt-0.5 font-bold truncate max-w-xs sm:max-w-md">
                      Downloading: {activeDownloadTask.fileName}
                    </p>
                  </div>
                </div>

                <div className="text-right font-sans text-[11px] flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto">
                  <span className="text-cyan-400 font-bold flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    Speed: {activeDownloadTask.speed.toFixed(1)} MB/s
                  </span>
                  <span className="text-slate-550 text-[10px] mt-0.5">8 Fast Parallel Safe Lanes</span>
                </div>
              </div>

              {/* Grid of 8 concurrent pipe channels */}
              <div>
                <p className="text-[9px] font-sans uppercase tracking-wider text-slate-500 mb-2 select-none">Simultaneous Transmission Lanes</p>
                <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                  {Array.from({ length: 8 }).map((_, i) => {
                    const prog = getSubSocketProgress(activeDownloadTask.progress, i + 1);
                    return (
                      <div key={i} className="bg-slate-950/90 p-2 rounded-xl border border-slate-850 text-center relative overflow-hidden">
                        <div 
                          className="absolute bottom-0 left-0 bg-cyan-500/10 h-full transition-all duration-300"
                          style={{ width: `${prog}%` }}
                        />
                        <span className="text-[9px] text-slate-500 font-sans block relative">LANE {i + 1}</span>
                        <span className="text-[10px] text-cyan-400 font-sans font-bold block mt-1 relative">{prog}%</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Master progress slider */}
              <div className="space-y-1">
                <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden relative border border-slate-905">
                  <div 
                    className="absolute top-0 left-0 bg-gradient-to-r from-cyan-400 via-indigo-400 to-emerald-400 h-full rounded-full transition-all duration-200" 
                    style={{ width: `${activeDownloadTask.progress}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-slate-400 font-sans select-none">
                  <span>Putting your file pieces back together...</span>
                  <span className="text-cyan-400 font-bold">{activeDownloadTask.progress.toFixed(0)}%</span>
                </div>
              </div>
            </div>
          )}

          {/* Files grid list */}
          {filteredFiles.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-805 text-[10px] text-slate-500 tracking-wider font-sans select-none">
                    <th className="py-2.5 px-3 w-10">
                      <div className="flex items-center justify-center">
                        <input 
                          type="checkbox"
                          checked={filteredFiles.length > 0 && filteredFiles.every(f => selectedFileIds.includes(f.id))}
                          onChange={(e) => {
                            if (e.target.checked) {
                              const newSelected = Array.from(new Set([...selectedFileIds, ...filteredFiles.map(f => f.id)]));
                              setSelectedFileIds(newSelected);
                            } else {
                              const filteredIds = filteredFiles.map(f => f.id);
                              setSelectedFileIds(prev => prev.filter(id => !filteredIds.includes(id)));
                            }
                          }}
                          className="rounded border-slate-800 bg-slate-950 text-cyan-500 focus:ring-opacity-50 checked:bg-cyan-500 cursor-pointer w-3.5 h-3.5 accent-cyan-500"
                        />
                      </div>
                    </th>
                    <th className="py-2.5 px-3">File Name</th>
                    <th className="py-2.5 px-3">Folder</th>
                    <th className="py-2.5 px-3">Size</th>
                    <th className="py-2.5 px-3">Date Added</th>
                    <th className="py-2.5 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850/40 text-xs">
                  {filteredFiles.map((file) => {
                    const isDownloading = activeDownloadTask && activeDownloadTask.id === `dl-${file.id}`;
                    return (
                      <tr 
                        key={file.id} 
                        className="hover:bg-slate-950/30 group transition-all duration-150"
                      >
                        {/* Checkbox */}
                        <td className="py-3 px-3 w-10">
                          <div className="flex items-center justify-center">
                            <input 
                              type="checkbox"
                              checked={selectedFileIds.includes(file.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedFileIds(prev => [...prev, file.id]);
                                } else {
                                  setSelectedFileIds(prev => prev.filter(id => id !== file.id));
                                }
                              }}
                              className="rounded border-slate-800 bg-slate-950 text-cyan-500 focus:ring-opacity-50 checked:bg-cyan-500 cursor-pointer w-3.5 h-3.5 accent-cyan-500"
                            />
                          </div>
                        </td>

                        {/* File Name & Preview Icon */}
                        <td className="py-3 px-3 relative">
                          <div className="flex items-center gap-3">
                            
                            {/* Thumbnails if photo, else type icon */}
                            {file.category === 'photos' && file.thumbnailUrl ? (
                              <div className="relative overflow-hidden w-9 h-9 rounded-lg border border-slate-800">
                                <img 
                                  src={file.thumbnailUrl} 
                                  alt={file.name} 
                                  className="w-full h-full object-cover group-hover:scale-105 transition-all cursor-pointer"
                                  onClick={() => setPhotoPreviewUrl(file.url)}
                                  referrerPolicy="no-referrer"
                                />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all pointer-events-none">
                                  <Eye className="w-3.5 h-3.5 text-white" />
                                </div>
                              </div>
                            ) : (
                              <div className="p-2.5 bg-slate-950 border border-slate-850 rounded-lg">
                                {getCategoryIcon(file.category)}
                              </div>
                            )}

                            <div>
                              <p className="font-semibold text-slate-100 max-w-[180px] sm:max-w-[240px] truncate font-sans" title={file.name}>
                                {file.name}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Location Folder */}
                        <td className="py-3 px-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold tracking-tight capitalize select-none font-sans ${
                            file.category === 'photos' 
                              ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-900/30'
                              : 'bg-amber-950/40 text-amber-400 border border-amber-900/30'
                          }`}>
                            {file.category === 'photos' ? 'photo' : 'document'}
                          </span>
                        </td>

                        {/* Size details */}
                        <td className="py-3 px-3 text-slate-400 font-sans font-bold text-[11px]">
                          {formatFileSize(file.size)}
                        </td>

                        {/* Upload stamp */}
                        <td className="py-3 px-3 text-slate-500 font-sans text-[10px]">
                          {file.uploadedAt}
                        </td>

                        {/* Quick actions triggers */}
                        <td className="py-3 px-3 text-right font-sans">
                          <div className="flex items-center justify-end gap-1.5 opacity-80 group-hover:opacity-100 transition-all">
                            
                            {/* Parallel socket bypass downloader to device/phone storage */}
                            <button
                              onClick={() => onQueueDownloadTask(file)}
                              disabled={isDownloading || activeDownloadTask !== undefined}
                              className={`p-1.5 rounded-md border transition-all cursor-pointer ${
                                isDownloading
                                  ? 'bg-cyan-950 text-cyan-400 border-cyan-500/30'
                                  : 'bg-slate-950 hover:bg-slate-800 text-slate-300 border-slate-850 hover:border-slate-705 disabled:opacity-40'
                              }`}
                              title="Download file to device safely"
                            >
                              <Download className={`w-3.5 h-3.5 ${isDownloading ? 'animate-bounce' : ''}`} />
                            </button>

                            {/* Delete record */}
                            <button
                              onClick={() => onDeleteFile(file.id)}
                              className="p-1.5 rounded-md bg-slate-950 hover:bg-rose-950 text-slate-500 hover:text-rose-400 border border-slate-850 hover:border-rose-900/50 transition-all cursor-pointer"
                              title="Delete file permanently"
                            >
                              <Trash className="w-3.5 h-3.5" />
                            </button>

                          </div>
                        </td>

                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center text-slate-500 space-y-3 bg-slate-950/20 rounded-2xl border border-slate-850/50">
              <Folder className="w-10 h-10 text-slate-600 animate-pulse" />
              <div>
                <p className="text-xs font-semibold text-slate-400 select-none">No Files Detected</p>
                <p className="text-[11px] max-w-xs mt-1 leading-normal select-none">
                  Your storage list is clear. Select or drop custom files in the upload area above to start saving them!
                </p>
              </div>
            </div>
          )}

        </div>

      {/* Lightbox / Gallery Zoom modal */}
      {photoPreviewUrl && (
        <div 
          className="fixed inset-0 bg-slate-950/80 z-[999] backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setPhotoPreviewUrl(null)}
        >
          <div 
            className="relative bg-slate-900 rounded-3xl max-w-2xl w-full border border-slate-800 p-2 overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <img 
              src={photoPreviewUrl} 
              alt="Cloud Zoom" 
              className="w-full h-auto max-h-[75vh] object-contain rounded-2xl" 
              referrerPolicy="no-referrer"
            />
            <div 
              className="absolute top-4 right-4 bg-slate-950/80 p-2 rounded-full border border-slate-800 hover:bg-slate-900 cursor-pointer text-white" 
              onClick={() => setPhotoPreviewUrl(null)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
