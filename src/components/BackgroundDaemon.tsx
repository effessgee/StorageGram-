import React from 'react';
import { Terminal, Play, Pause, RefreshCw, Layers, CheckCircle, ShieldCheck, Zap, HardDrive, LayoutList, Trash2, ShieldAlert } from 'lucide-react';
import { BackgroundTask } from '../types';

interface BackgroundDaemonProps {
  tasks: BackgroundTask[];
  daemonActive: boolean;
  logs: string[];
  onToggleDaemon: () => void;
  onClearCompleted: () => void;
}

export default function BackgroundDaemon({ 
  tasks, 
  daemonActive, 
  logs, 
  onToggleDaemon, 
  onClearCompleted 
}: BackgroundDaemonProps) {

  const formatSize = (bytes: number) => {
    if (bytes >= 1048576) {
      return (bytes / 1048576).toFixed(1) + ' MB';
    }
    return (bytes / 1024).toFixed(0) + ' KB';
  };

  const activeTask = tasks.find(t => t.status === 'active');
  const finishedTasksCount = tasks.filter(t => t.status === 'completed').length;

  return (
    <div id="storagegram-daemon-control" className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
      
      {/* Decorative dark vector grid backgrounds */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Column Left: Daemon Status & CLI Ticker */}
      <div className="lg:col-span-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-cyan-400" />
            <h3 className="text-sm font-bold font-sans uppercase text-slate-100 flex items-center gap-1.5">
              Background Task Tracker
            </h3>
          </div>
          <div className="flex items-center gap-1.5">
            <span className={`h-2 w-2 rounded-full ${daemonActive ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
            <span className="text-[10px] font-sans uppercase text-slate-400">{daemonActive ? 'Running' : 'Paused'}</span>
          </div>
        </div>

        <p className="text-xs text-slate-400 leading-normal">
          StorageGram runs safely in the background. It prevents your file transfers from failing even if you close this tab, lock your phone screen, or face unstable internet.
        </p>

        {/* Live CLI log ticker */}
        <div className="bg-slate-950 rounded-2xl border border-slate-850 p-4 font-sans text-[10px] space-y-1.5 h-[160px] overflow-y-auto select-none relative">
          <div className="sticky top-0 bg-slate-950/90 pb-1 border-b border-slate-900 flex justify-between items-center mb-1">
            <span className="text-slate-500 font-bold uppercase tracking-wider text-[8px] flex items-center gap-1">
              <Terminal className="w-3.5 h-3.5 text-cyan-400" /> System Activity Log
            </span>
            <span className="text-[8px] text-emerald-400 bg-emerald-950/40 px-1.5 py-0.2 rounded border border-emerald-900/40 font-semibold">
              Online
            </span>
          </div>
          {logs.map((log, idx) => {
            // Simplify log lines on-the-fly to prevent scary CLI codes for regular users
            let cleanLog = log
              .replace(/System \[StorageGram OS\]:/g, 'System:')
              .replace(/Daemon \[Thread-\d+\]:/g, 'Network:')
              .replace(/Daemon \[Queue-Hub\]:/g, 'Queue:')
              .replace(/MTProto Engine/g, 'File Sync')
              .replace(/DC4 Core gateway over port 443/g, 'secure server link')
              .replace(/Buffer locked: Encrypted and queued/g, 'Prepared & secured file')
              .replace(/into transmission blocks/g, '')
              .replace(/Stream initialized. Split/g, 'Started upload pipeline for')
              .replace(/file buffer into 16 concurrent socket partitions/g, 'simultaneously')
              .replace(/Daemon Success: Stream completed and fully assembled byte packages for/g, 'Successfully saved')
              .replace(/Initiated multi-socket down-pull route for encrypted record:/g, 'Downloading:');
            return (
              <p key={idx} className={idx === 0 ? 'text-emerald-400 font-medium' : 'text-slate-500'}>
                {cleanLog}
              </p>
            );
          })}
        </div>

        {/* Controls Layout */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          <button
            onClick={onToggleDaemon}
            className={`py-2 px-3.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer border ${
              daemonActive 
                ? 'bg-slate-950 text-slate-300 border-slate-850 hover:bg-slate-900' 
                : 'bg-emerald-500 text-slate-950 border-emerald-400 hover:bg-emerald-400 shadow-md shadow-emerald-500/10'
            }`}
          >
            {daemonActive ? (
              <>
                <Pause className="w-3.5 h-3.5" /> Pause Transfers
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-slate-950" /> Resume Transfers
              </>
            )}
          </button>

          <button
            onClick={onClearCompleted}
            disabled={finishedTasksCount === 0}
            className={`py-2 px-3.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all border font-sans ${
              finishedTasksCount > 0
                ? 'bg-slate-950 text-slate-400 border-slate-800 hover:text-rose-400 hover:border-slate-705 cursor-pointer'
                : 'bg-slate-950/45 text-slate-600 border-slate-900/40 opacity-50 cursor-not-allowed'
            }`}
          >
            <Trash2 className="w-3.5 h-3.5" /> Clear Completed
          </button>
        </div>
      </div>

      {/* Column Right: Interactive Auto Transfers table grid */}
      <div className="lg:col-span-7 space-y-4">
        <div className="flex justify-between items-center bg-slate-950/60 px-3 py-2 rounded-xl border border-slate-850">
          <div className="flex items-center gap-2">
            <LayoutList className="w-4 h-4 text-cyan-400" />
            <span className="text-[11px] font-bold font-sans tracking-wide text-slate-300 uppercase">
              Current Transfer Queue ({tasks.length} active)
            </span>
          </div>
          
          <div className="flex items-center gap-1.5">
            <span className="text-[9px] font-mono bg-cyan-950 text-cyan-400 border border-cyan-900/40 px-1.5 rounded-md font-bold uppercase">
              Queue Auto-pilot
            </span>
          </div>
        </div>

        {/* List of Tasks, synced directly to dropping zone uploads */}
        <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
          {tasks.length > 0 ? (
            tasks.map((task) => (
              <div 
                key={task.id} 
                className={`p-3.5 rounded-2xl border transition-all ${
                  task.status === 'active' 
                    ? 'bg-slate-950 border-indigo-500/40 shadow-md shadow-indigo-550/5' 
                    : task.status === 'queued'
                    ? 'bg-slate-950/50 border-slate-850'
                    : 'bg-slate-950/15 border-slate-900 opacity-60'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="truncate">
                    <p className="text-xs font-bold text-slate-200 truncate flex items-center gap-2">
                      <span className={`px-1.5 py-0.2 rounded text-[8px] font-black tracking-wider font-sans uppercase select-none ${
                        task.direction === 'upload' ? 'bg-cyan-950 text-cyan-450' : 'bg-indigo-950 text-indigo-400'
                      }`}>
                        {task.direction === 'upload' ? 'Saving File' : 'Downloading'}
                      </span>
                      <span className="truncate" title={task.fileName}>{task.fileName}</span>
                    </p>
                    <p className="text-[10px] text-slate-500 font-sans mt-0.5">
                      File Size: {formatSize(task.fileSize)}
                      {task.retryCount > 0 && (
                        <span className="text-amber-500 font-bold ml-2">
                          (&bull; Re-routing automatically: Trial #{task.retryCount})
                        </span>
                      )}
                    </p>
                  </div>

                  <span className={`text-[9px] font-sans font-black uppercase px-2 py-0.5 rounded border ${
                    task.status === 'active'
                      ? 'bg-emerald-950/40 text-emerald-400 border-emerald-990/30'
                      : task.status === 'completed'
                      ? 'bg-slate-900 text-slate-500 border-slate-800'
                      : task.status === 'interrupted'
                      ? 'bg-rose-950/60 text-rose-400 border-rose-905/30 animate-pulse'
                      : 'bg-slate-950 text-slate-600 border-slate-900/30'
                  }`}>
                    {task.status === 'active' ? 'processing' : task.status}
                  </span>
                </div>

                {/* Progress Bar indicator */}
                <div className="space-y-1">
                  <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden relative">
                    <div 
                      className={`absolute top-0 left-0 h-full rounded-full transition-all duration-300 ${
                        task.status === 'interrupted' 
                          ? 'bg-rose-500' 
                          : 'bg-gradient-to-r from-cyan-400 via-indigo-400 to-emerald-400'
                      }`} 
                      style={{ width: `${task.progress}%` }}
                    />
                  </div>
                  <div className="flex justify-between items-center text-[9px] text-slate-500 font-sans select-none">
                    <span>{task.progress.toFixed(0)}% done</span>
                    {task.status === 'active' && (
                      <span className="text-cyan-400 font-bold">
                        Upload Speed: {task.speed.toFixed(1)} MB/s &bull; ~{task.estimatedRemainingSec}s left
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-10 text-center text-slate-500 border border-dashed border-slate-850 rounded-3xl bg-slate-950/20">
              <HardDrive className="w-8 h-8 text-slate-700 animate-pulse" />
              <p className="text-xs font-bold text-slate-400 mt-2">No Active Transfers</p>
              <p className="text-[10px] max-w-xs mt-0.5 leading-normal">
                Transfers list is clear. Simply drop or select files under the Files tab to start transfers instantly.
              </p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
