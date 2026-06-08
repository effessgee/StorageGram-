import React, { useState, useEffect } from 'react';
import { 
  Send, Key, HelpCircle, CheckCircle, AlertCircle, ExternalLink, ShieldCheck, Check, Sparkles, RefreshCw, Phone, User, Lock, Layers, Globe, QrCode, Smartphone, Laptop, Shield, Zap, Trash, Server
} from 'lucide-react';
import { TelegramAccount } from '../types';

interface TelegramConfig {
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

interface TelegramAlignerProps {
  onConfigChange: (config: TelegramConfig) => void;
  config: TelegramConfig;
  accounts: TelegramAccount[];
  activeAccountId: string | null;
  onActivateAccount: (id: string) => void;
  onRemoveAccount: (id: string) => void;
}

const getTelegramProxyUrl = (subpath: string) => {
  let origin = '';
  if (typeof window !== 'undefined' && window.location && window.location.origin) {
    origin = window.location.origin;
  }
  // Safe validation fallback for packaged app sandboxes and APK environments
  if (!origin || origin === 'null' || origin.startsWith('file') || origin.includes('localhost') || origin.includes('127.0.0.1')) {
    origin = 'https://ais-pre-3btib5mfhkmkxrdim7knwf-9786406782.asia-southeast1.run.app';
  }
  return `${origin}/api/telegram-proxy${subpath}`;
};

const COUNTRY_CODES = [
  { code: '+1', country: 'United States / Canada', flag: '🇺🇸' },
  { code: '+44', country: 'United Kingdom', flag: '🇬🇧' },
  { code: '+91', country: 'India', flag: '🇮🇳' },
  { code: '+92', country: 'Pakistan', flag: '🇵🇰' },
  { code: '+81', country: 'Japan', flag: '🇯🇵' },
  { code: '+49', country: 'Germany', flag: '🇩🇪' },
  { code: '+33', country: 'France', flag: '🇫🇷' },
  { code: '+61', country: 'Australia', flag: '🇦🇺' },
  { code: '+55', country: 'Brazil', flag: '🇧🇷' },
  { code: '+971', country: 'United Arab Emirates', flag: '🇦🇪' },
  { code: '+34', country: 'Spain', flag: '🇪🇸' },
  { code: '+7', country: 'Russia', flag: '🇷🇺' },
  { code: '+86', country: 'China', flag: '🇨🇳' },
  { code: '+62', country: 'Indonesia', flag: '🇮🇩' },
  { code: '+234', country: 'Nigeria', flag: '🇳🇬' },
];

export default function TelegramAligner({ 
  onConfigChange, 
  config, 
  accounts, 
  activeAccountId, 
  onActivateAccount, 
  onRemoveAccount 
}: TelegramAlignerProps) {
  // Config states
  const [activeTab, setActiveTab] = useState<'bot' | 'user' | 'qr'>(config.alignmentType || 'bot');
  const [isLinkingNew, setIsLinkingNew] = useState(accounts.length === 0);
  
  // Bot States
  const [botToken, setBotToken] = useState(config.botToken);
  const [chatId, setChatId] = useState(config.chatId);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  // User Account MTProto States
  const [phoneCountryCode, setPhoneCountryCode] = useState(config.phoneCountryCode || '+1');
  const [phoneNumber, setPhoneNumber] = useState(config.phoneNumber || '');
  const [username, setUsername] = useState(config.username || '');
  const [pinCode, setPinCode] = useState('');
  const [pinSent, setPinSent] = useState(false);
  const [pinSending, setPinSending] = useState(false);
  const [verifyingPin, setVerifyingPin] = useState(false);
  const [handshakeLogs, setHandshakeLogs] = useState<string[]>([]);
  const [showHelp, setShowHelp] = useState(false);

  // QR Code States
  const [qrCountdown, setQrCountdown] = useState(90);
  const [qrCodeKey, setQrCodeKey] = useState('tg://login?token=sg_token_' + Math.floor(100000 + Math.random() * 900000));
  const [qrStatus, setQrStatus] = useState<'idle' | 'scanning' | 'verifying' | 'linked'>('idle');
  const [qrLogs, setQrLogs] = useState<string[]>([
    '⚡ [QR-Engine] Initializing disposable session identifier challenge...',
    '📡 [QR-Engine] Session key broadcast online: tg://login?token=sg_token_829302',
    '⏳ [QR-Gateway] Swarming WebSocket dispatcher status: Standby'
  ]);

  // Sync state with parent config - only do this when not actively linking a new draft!
  useEffect(() => {
    if (isLinkingNew) return;
    if (config.alignmentType) {
      setActiveTab(config.alignmentType);
    }
    setBotToken(config.botToken);
    setChatId(config.chatId);
    setPhoneCountryCode(config.phoneCountryCode || '+1');
    setPhoneNumber(config.phoneNumber || '');
    setUsername(config.username || '');
  }, [config, isLinkingNew]);

  // Automatically minimize linking form if successfully registered
  useEffect(() => {
    if (isLinkingNew && accounts.length > 0) {
      setIsLinkingNew(false);
    }
  }, [accounts, activeAccountId]);

  // QR Countdown and real-time refresh ticks
  useEffect(() => {
    if (activeTab !== 'qr' || config.isAligned) return;
    
    const interval = setInterval(() => {
      setQrCountdown(prev => {
        if (prev <= 1) {
          const freshKey = 'tg://login?token=sg_token_' + Math.floor(10000 + Math.random() * 90000);
          setQrCodeKey(freshKey);
          setQrLogs(prevLogs => [
            ...prevLogs,
            `[QR-Engine] 🔄 Key expired. Rotated disposable session key endpoint: ${freshKey.substring(0, 24)}...`
          ]);
          return 90;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [activeTab, config.isAligned]);

  // Append visual bridge handshaking output logs to recreate realistic Terminal telemetry
  const startHandshakeTelemetry = (onFinish: () => void) => {
    setHandshakeLogs([]);
    const lines = [
      '⚡ [MTProto] Initializing custom secure pipeline transport layer...',
      '🛰️ [Network] Establishing encrypted SSL handshake to DC5 (149.154.167.51:443)...',
      '🔐 [Security] Requesting temporary cryptographic authorization keys (DH exchanges)...',
      '📦 [Protocol] Framing MTProto packet auth.sendCode (API version 156)...',
      '🔑 [Gateway] Telegram request dispatched. Expecting SMS/Inline validation...'
    ];

    let current = 0;
    const interval = setInterval(() => {
      if (current < lines.length) {
        setHandshakeLogs(prev => [...prev, lines[current]]);
        current++;
      } else {
        clearInterval(interval);
        onFinish();
      }
    }, 450);
  };

  const handleSendPinCode = () => {
    if (!phoneNumber.trim()) {
      setTestResult({ success: false, message: 'Please specify a phone number with country code!' });
      return;
    }
    if (!username.trim()) {
      setTestResult({ success: false, message: 'Please specify your Telegram username (e.g. jsmith)!' });
      return;
    }

    setPinSending(true);
    setTestResult(null);

    startHandshakeTelemetry(() => {
      setPinSending(false);
      setPinSent(true);
      setTestResult({
        success: true,
        message: `📨 A 5-digit secure Login PIN has been sent to the active Telegram session for @${username.replace('@', '')} on ${phoneCountryCode} ${phoneNumber}. Please keep this browser window active.`
      });
    });
  };

  const handleVerifyPinCode = () => {
    if (pinCode.length !== 5) {
      setTestResult({ success: false, message: 'Please enter a valid 5-digit PIN code.' });
      return;
    }

    setVerifyingPin(true);
    setTestResult(null);

    // Beautiful simulated delay
    setTimeout(() => {
      setVerifyingPin(false);
      
      const cleanUsername = username.startsWith('@') ? username : `@${username}`;
      const mockResultMsg = `Successfully handshaked! Aligned Telegram personal User account: ${cleanUsername}`;

      setTestResult({
        success: true,
        message: mockResultMsg
      });

      // Update Parent context configuration
      onConfigChange({
        alignmentType: 'user',
        botToken: '',
        chatId: 'me', // Represents personal space "Saved Messages"
        isEnabled: true,
        botUsername: cleanUsername,
        botName: `User Cloud Space (${cleanUsername})`,
        isAligned: true,
        phoneNumber,
        phoneCountryCode,
        username: cleanUsername,
        userSessionActive: true
      });
    }, 1500);
  };

  const handleSimulateQrScan = () => {
    if (config.isAligned) return;
    setQrStatus('scanning');
    setQrLogs(prev => [
      ...prev,
      '⚡ [Connection] Handshaking ping received from remote mobile gateway client...',
      '📡 [Network] Reading optical authorization token signatures...'
    ]);

    setTimeout(() => {
      setQrStatus('verifying');
      setQrLogs(prev => [
        ...prev,
        '📱 [Mobile App] Connected User: Faisal (+92 *** *** 9284)',
        '🖥️ [Linked Devices] Client Request: StorageGram Desktop (Chrome/Webkit Container API)',
        '🔐 [Security] Demanding local confirmation dialog on linked smartphone...'
      ]);

      setTimeout(() => {
        setQrStatus('linked');
        setQrLogs(prev => [
          ...prev,
          '🟢 [Auth] Device confirmation APPROVED. Creating MTProto session token exchanges...',
          '🛰️ [Connection] Workspace coupled with Faisal via secure QR optical handshake!'
        ]);

        setTimeout(() => {
          onConfigChange({
            alignmentType: 'qr',
            botToken: '',
            chatId: 'me',
            isEnabled: true,
            botUsername: '@TeleScanPro',
            botName: 'Faisal (Saved Messages QR Link)',
            isAligned: true,
            phoneNumber: '+92 3** *******',
            phoneCountryCode: '+92',
            username: '@TeleScanPro',
            userSessionActive: true
          });
          setTestResult({
            success: true,
            message: '🎉 Successfully authenticated Faisal via Telegram Scan to Connect!'
          });
        }, 1000);
      }, 1500);
    }, 1200);
  };

  const handleTestConnection = async () => {
    if (!botToken.trim()) {
      setTestResult({ success: false, message: 'Please provide a Telegram Bot Token first!' });
      return;
    }

    setTesting(true);
    setTestResult(null);

    try {
      // Route request through our secure, CORS-free local backend proxy
      const response = await fetch(getTelegramProxyUrl(`/bot${botToken.trim()}/getMe`));
      const data = await response.json();

      if (data.ok && data.result) {
        const botName = data.result.first_name;
        const botUsername = data.result.username;

        setTestResult({
          success: true,
          message: `Successfully connected! Linked to Bot: @${botUsername} (${botName})`
        });

        // Auto aligned
        onConfigChange({
          alignmentType: 'bot',
          botToken: botToken.trim(),
          chatId: chatId.trim() || 'me', 
          isEnabled: true,
          botUsername,
          botName,
          isAligned: true,
          phoneNumber: '',
          phoneCountryCode: '',
          username: ''
        });
      } else {
        setTestResult({
          success: false,
          message: data.description || 'Verification failed. Please check your Bot Token.'
        });
      }
    } catch (err) {
      setTestResult({
        success: false,
        message: 'Could not connect to Telegram servers. Check network or Token format.'
      });
    } finally {
      setTesting(false);
    }
  };

  const handleQuickDemoFill = () => {
    if (activeTab === 'bot') {
      const demoToken = '123456789:ABCdemoTokenForStorageGramBypassLine';
      const demoChatId = '654321098';
      
      setBotToken(demoToken);
      setChatId(demoChatId);
      setTestResult({
        success: true,
        message: 'Demo credentials aligned! StorageGram is now simulated in Mock-Telegram pipeline!'
      });

      onConfigChange({
        alignmentType: 'bot',
        botToken: demoToken,
        chatId: demoChatId,
        isEnabled: true,
        botUsername: 'StorageGramSim_Bot',
        botName: 'StorageGram Secure Bot',
        isAligned: true
      });
    } else if (activeTab === 'user') {
      setPhoneNumber('555-019-2041');
      setUsername('@TeleStoragePro');
      setPhoneCountryCode('+1');
      setPinCode('48293');
      setPinSent(true);

      setTestResult({
        success: true,
        message: 'Mock verification PIN generated! Click "Verify Key & Finalize Linkage" to simulate connection.'
      });
    } else {
      // Instant QR linkage simulation
      onConfigChange({
        alignmentType: 'qr',
        botToken: '',
        chatId: 'me',
        isEnabled: true,
        botUsername: '@TeleScanPro',
        botName: 'Faisal (Saved Messages QR Link)',
        isAligned: true,
        phoneNumber: '+92 3** *******',
        phoneCountryCode: '+92',
        username: '@TeleScanPro',
        userSessionActive: true
      });
      setTestResult({
        success: true,
        message: 'Demo QR authentication completed successfully!'
      });
    }
  };

  const handleDisconnect = () => {
    setBotToken('');
    setChatId('');
    setPhoneNumber('');
    setUsername('');
    setPinCode('');
    setPinSent(false);
    setQrStatus('idle');
    setQrCountdown(90);
    setTestResult(null);
    setQrLogs([
      '⚡ [QR-Engine] Initializing disposable session identifier challenge...',
      '📡 [QR-Engine] Session key broadcast online: tg://login?token=sg_token_829302',
      '⏳ [QR-Gateway] Swarming WebSocket dispatcher status: Standby'
    ]);
    onConfigChange({
      alignmentType: 'bot',
      botToken: '',
      chatId: '',
      isEnabled: false,
      botUsername: undefined,
      botName: undefined,
      isAligned: false,
      phoneNumber: '',
      phoneCountryCode: '+1',
      username: '',
      userSessionActive: false
    });
  };

  const toggleEngine = () => {
    onConfigChange({
      ...config,
      isEnabled: !config.isEnabled
    });
  };

  return (
    <div className="bg-slate-900 border border-slate-850 rounded-3xl p-5 space-y-5 relative overflow-hidden">
      {/* Absolute faint background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none" />

      {/* Header Info */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
        <div>
          <h3 className="text-xs font-bold font-sans uppercase tracking-wider text-slate-200 flex items-center gap-1.5 leading-none">
            <Send className="w-3.5 h-3.5 text-cyan-400 rotate-[-15deg]" /> Telegram Cloud Integration
          </h3>
          <p className="text-[10px] text-slate-500 mt-1 font-sans leading-none">
            {accounts.length > 0 ? 'Manage multiple active accounts & channels for server-less storing' : 'Link any bot or account for server-less storing'}
          </p>
        </div>

        <button 
          onClick={() => setShowHelp(!showHelp)}
          className="text-slate-500 hover:text-cyan-400 transition-colors flex items-center gap-1 text-[10px] font-sans"
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>{showHelp ? 'Hide Guide' : 'How to connect'}</span>
        </button>
      </div>

      {/* Helper FAQ guide */}
      {showHelp && (
        <div className="bg-slate-950/95 border border-slate-850 rounded-2xl p-4 text-[11px] space-y-3 font-sans animate-fadeIn z-10 relative">
          <p className="font-bold text-cyan-400">⚡ Seamless Integration Methods Explained:</p>
          
          <div className="space-y-3 divide-y divide-slate-900">
            <div className="space-y-1">
              <span className="font-bold text-slate-200 block">📱 Scan to Connect (Desktop QR Flow):</span>
              <p className="text-slate-400">
                Go to <span className="text-cyan-300">Settings &gt; Devices &gt; Link Desktop Device</span> on your Telegram mobile app, and scan the dynamic glowing QR code. No numbers or credentials needed!
              </p>
            </div>
            
            <div className="space-y-1 pt-2">
              <span className="font-bold text-slate-200 block">👤 Personal Account Linking (Simulated Phone PIN Auth):</span>
              <p className="text-slate-400">
                This simulates the standard Telegram server signup. 
                Enter phone & username, and receive a secure 5-digit security code inside your active Telegram app.
              </p>
            </div>
            
            <div className="space-y-1 pt-2">
              <span className="font-bold text-slate-200 block">🤖 Custom Bot Backbone (Token Endpoint):</span>
              <p className="text-slate-400 text-[10px]">
                Create a dedicated private media bot with <span className="text-indigo-400">@BotFather</span>. This has zero packet-limits and writes direct media documents up to 50MB using free token transport parameters.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Linked Accounts List Dashboard */}
      {accounts.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-sans flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-cyan-400" /> Linked Accounts ({accounts.length})
            </h4>
            
            <button
              onClick={() => {
                setIsLinkingNew(!isLinkingNew);
                setTestResult(null);
              }}
              className={`text-[10px] font-bold font-sans px-3 py-1 rounded-xl transition-all cursor-pointer tracking-wide flex items-center gap-1.5 border ${
                isLinkingNew 
                  ? 'bg-slate-950 text-slate-400 hover:text-white border-slate-800' 
                  : 'bg-gradient-to-r from-cyan-950 to-indigo-950 text-cyan-350 hover:text-white border-cyan-905/60 hover:border-cyan-800'
              }`}
            >
              {isLinkingNew ? '✕ Cancel Form' : '➕ Link Account'}
            </button>
          </div>

          <div className="grid grid-cols-1 gap-2">
            {accounts.map((acc) => {
              const isActive = acc.id === activeAccountId;
              return (
                <div 
                  key={acc.id} 
                  className={`p-3 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 ${
                    isActive 
                      ? 'bg-gradient-to-r from-cyan-950/40 to-slate-900 border-cyan-800/55 shadow-md shadow-cyan-950/20' 
                      : 'bg-slate-950/45 border-slate-850 hover:border-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className={`p-2 rounded-xl flex items-center justify-center ${
                      isActive ? 'bg-cyan-900/35 text-cyan-400' : 'bg-slate-900/80 text-slate-505'
                    }`}>
                      {acc.type === 'bot' && <Server className="w-4 h-4" />}
                      {acc.type === 'user' && <User className="w-4 h-4" />}
                      {acc.type === 'qr' && <Smartphone className="w-4 h-4" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-white font-sans">{acc.name}</span>
                        <span className={`text-[8px] font-mono font-bold uppercase px-1 rounded ${
                          acc.type === 'bot' 
                            ? 'bg-blue-955/65 text-blue-400 border border-blue-900/30' 
                            : acc.type === 'user' 
                              ? 'bg-indigo-955/65 text-indigo-400 border border-indigo-900/30' 
                              : 'bg-emerald-955/65 text-emerald-400 border border-emerald-900/30'
                        }`}>
                          {acc.type === 'bot' ? 'Bot' : acc.type === 'user' ? 'PIN User' : 'QR Scan'}
                        </span>
                      </div>
                      <span className="text-[9px] text-slate-450 font-mono mt-0.5 block leading-none">
                        {acc.username} {acc.type === 'user' && acc.config.phoneNumber && `(${acc.config.phoneNumber})`}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 self-end sm:self-auto">
                    {isActive ? (
                      <span className="text-[9px] px-2.5 py-0.5 bg-cyan-955/80 border border-cyan-505/20 text-cyan-400 font-bold uppercase tracking-wider rounded-lg flex items-center gap-1.5 select-none animate-pulse">
                        <span className="w-1 h-2 rounded-full bg-cyan-400" />
                        Active Sync
                      </span>
                    ) : (
                      <button
                        onClick={() => onActivateAccount(acc.id)}
                        className="text-[9px] font-bold font-sans text-slate-400 hover:text-white hover:bg-slate-800 bg-slate-900/60 border border-slate-800 rounded-lg px-2.5 py-1 transition-all cursor-pointer"
                      >
                        Activate Sync
                      </button>
                    )}

                    <button
                      onClick={() => onRemoveAccount(acc.id)}
                      className="p-1 text-slate-500 hover:text-rose-400 hover:bg-rose-950/20 rounded-lg transition-all cursor-pointer"
                      title="Remove Account Linkage"
                    >
                      <Trash className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Link New Telegram Account Form wrapper */}
      {(accounts.length === 0 || isLinkingNew) && (
        <div className="space-y-4 border-t border-slate-800/50 pt-4 animate-slideDown">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest block font-sans">
              🛠️ Link Another Telegram Node:
            </span>
          </div>

          {/* Android App / APK Notice */}
          <div className="p-3.5 bg-gradient-to-r from-amber-950/30 via-slate-900/40 to-slate-900 border border-amber-500/20 rounded-2xl space-y-2 text-xs font-sans">
            <div className="flex items-center gap-2 text-amber-400 font-bold">
              <Smartphone className="w-4 h-4 animate-bounce" />
              <span>📱 Mobile APP / APK Integration Guide</span>
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              The <strong className="text-white">Scan QR</strong> and <strong className="text-white">Phone PIN</strong> tabs are interactive, client-side <strong className="text-amber-400">simulations</strong> designed for prototype demonstration.
            </p>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              To connect your <strong className="text-white">real, live Telegram cloud storage</strong> inside the APK on your phone, you must use the <strong className="text-cyan-405">🤖 Bot Code</strong> tab. It is the only connection method that communicates with real Telegram API endpoints.
            </p>
          </div>

          {/* Mode selectors (Bot tokens vs Phone number vs QR Code) */}
          <div className="grid grid-cols-3 gap-1 bg-slate-950 p-1 rounded-xl border border-slate-850">
            <button
              type="button"
              onClick={() => { setActiveTab('bot'); setTestResult(null); }}
              className={`py-1.5 px-1 rounded-lg text-[9px] font-bold uppercase tracking-wider font-sans text-center transition-all cursor-pointer ${
                activeTab === 'bot' 
                  ? 'bg-gradient-to-r from-cyan-950 to-indigo-950/85 border border-cyan-800 text-cyan-200 font-extrabold' 
                  : 'text-slate-400 hover:text-white border border-transparent'
              }`}
            >
              🤖 Bot Code
            </button>
            
            <button
              type="button"
              onClick={() => { setActiveTab('user'); setTestResult(null); }}
              className={`py-1.5 px-1 rounded-lg text-[9px] font-bold uppercase tracking-wider font-sans text-center transition-all cursor-pointer ${
                activeTab === 'user' 
                  ? 'bg-gradient-to-r from-cyan-950 to-indigo-950/85 border border-cyan-800 text-cyan-200 font-extrabold' 
                  : 'text-slate-400 hover:text-white border border-transparent'
              }`}
            >
              👤 Phone PIN
            </button>

            <button
              type="button"
              onClick={() => { setActiveTab('qr'); setTestResult(null); }}
              className={`py-1.5 px-1 rounded-lg text-[9px] font-bold uppercase tracking-wider font-sans text-center transition-all cursor-pointer ${
                activeTab === 'qr' 
                  ? 'bg-gradient-to-r from-cyan-950 to-indigo-950/85 border border-cyan-800 text-cyan-200 font-extrabold' 
                  : 'text-slate-400 hover:text-white border border-transparent'
              }`}
            >
              📱 Scan QR
            </button>
          </div>

          {/* Simulation Disclaimer Badge */}
          {activeTab !== 'bot' && (
            <div className="p-3 bg-indigo-950/20 border border-indigo-900/30 rounded-2xl text-[11px] font-sans text-indigo-300 flex items-start gap-2 animate-fadeIn">
              <AlertCircle className="w-4 h-4 text-indigo-400 mt-0.5 flex-shrink-0" />
              <div>
                <span className="font-bold block text-white mb-0.5">Interactive Showroom Mode Only</span>
                This tab runs a local simulation client without connecting to real remote servers. For active Telegram storage, configure the <strong className="text-cyan-400">Bot Code</strong> option.
              </div>
            </div>
          )}

          {/* Tab 1: Bot Aligner Configuration form */}
          {activeTab === 'bot' && (
            <div className="space-y-3.5 animate-fadeIn">
              <div className="space-y-1">
                <label className="text-[9px] font-bold font-sans text-slate-500 uppercase tracking-wider block">
                  Telegram Bot Token:
                </label>
                <div className="relative">
                  <Key className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input 
                    type="text"
                    value={botToken}
                    onChange={(e) => setBotToken(e.target.value)}
                    placeholder="e.g. 123456789:ABCdefGhIJKlmNoPQRsTUV..."
                    className="w-full bg-slate-950 border border-slate-850 rounded-xl py-1.5 pl-9 pr-3.5 text-xs font-mono text-slate-300 focus:outline-none focus:border-cyan-500 transition-all placeholder:text-slate-800"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-bold font-sans text-slate-500 uppercase tracking-wider block">
                  Target Channel/Chat ID:
                </label>
                <div className="relative">
                  <Send className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input 
                    type="text"
                    value={chatId}
                    onChange={(e) => setChatId(e.target.value)}
                    placeholder="e.g. 582910484 (numeric user/group ID)"
                    className="w-full bg-slate-950 border border-slate-850 rounded-xl py-1.5 pl-9 pr-3.5 text-xs font-mono text-slate-300 focus:outline-none focus:border-cyan-500 transition-all placeholder:text-slate-800"
                  />
                </div>
              </div>

              {/* Comprehensive Telegram Bot onboarding instructions */}
              <div className="bg-slate-950/70 border border-slate-855 rounded-2xl p-4 space-y-3 text-[11px] font-sans text-slate-300">
                <div className="font-bold text-cyan-400 flex items-center gap-1.5 border-b border-slate-900 pb-2">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Setup guide to receive and access uploaded files:</span>
                </div>
                
                <ul className="space-y-3 list-none pl-0">
                  <li className="flex items-start gap-1.5">
                    <span className="text-cyan-400 font-extrabold bg-slate-900 px-1 rounded">1</span>
                    <div>
                      <strong>Get Bot Token:</strong> Search for <a href="https://t.me/BotFather" target="_blank" rel="noopener noreferrer" className="text-cyan-400 underline font-semibold inline-flex items-center gap-0.5">@BotFather</a> on Telegram. Start the chat, send <code>/newbot</code>, complete the prompts, and paste the generated <code>HTTP API token</code> into the "Telegram Bot Token" field above.
                    </div>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-cyan-400 font-extrabold bg-slate-900 px-1 rounded">2</span>
                    <div>
                      <strong>Get Your Numeric Chat ID:</strong> Search Telegram for <a href="https://t.me/userinfobot" target="_blank" rel="noopener noreferrer" className="text-cyan-400 underline font-semibold inline-flex items-center gap-0.5">@userinfobot</a> or <strong>@RawDataBot</strong>. Send a quick message, and copy your numeric <code>Id</code> (e.g. <code>92830281</code>) into the "Target Channel/Chat ID" field.
                    </div>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-rose-400 font-extrabold bg-rose-950/30 px-1 rounded">⚠️</span>
                    <div>
                      <strong className="text-rose-300">CRITICAL REQUIREMENT:</strong> You must start your newly created Bot first! Search for your own Telegram bot by its username, and click the <strong className="text-amber-300">"START"</strong> button. If you do not do this first, Telegram's system will block the bot from sending any uploaded files to you, resulting in error logs!
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* Tab 2: User Account Phone Aligner Form */}
          {activeTab === 'user' && (
            <div className="space-y-3.5 animate-fadeIn">
              {/* Phone Field Section with Country Code Selector */}
              <div className="space-y-1">
                <label className="text-[9px] font-bold font-sans text-slate-500 uppercase tracking-wider block">
                  Telephone Number with Country Code:
                </label>
                <div className="flex gap-1.5">
                  <div className="relative flex-shrink-0">
                    <Globe className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                    <select
                      value={phoneCountryCode}
                      onChange={(e) => setPhoneCountryCode(e.target.value)}
                      disabled={pinSent}
                      className="bg-slate-950 border border-slate-850 rounded-xl py-1.5 pl-8 pr-1.5 text-xs font-semibold text-slate-300 focus:outline-none focus:border-cyan-500 transition-all cursor-pointer h-full max-w-[120px]"
                    >
                      {COUNTRY_CODES.map((item) => (
                        <option key={item.code} value={item.code}>
                          {item.flag} {item.code} ({item.country.substring(0, 8)}...)
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="relative flex-1">
                    <Phone className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      disabled={pinSent}
                      placeholder="e.g. 555-014-9284"
                      className="w-full bg-slate-950 border border-slate-850 rounded-xl py-1.5 pl-9 pr-3 text-xs font-mono text-slate-300 focus:outline-none focus:border-cyan-500 transition-all placeholder:text-slate-850"
                    />
                  </div>
                </div>
              </div>

              {/* Username Section */}
              <div className="space-y-1">
                <label className="text-[9px] font-bold font-sans text-slate-500 uppercase tracking-wider block">
                  Telegram Username:
                </label>
                <div className="relative">
                  <User className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    disabled={pinSent}
                    placeholder="e.g. @jsmith_tele"
                    className="w-full bg-slate-950 border border-slate-850 rounded-xl py-1.5 pl-9 pr-3 text-xs font-semibold text-slate-300 focus:outline-none focus:border-cyan-500 transition-all placeholder:text-slate-800"
                  />
                </div>
              </div>

              {handshakeLogs.length > 0 && (
                <div className="bg-slate-950 p-3 rounded-2xl border border-slate-855 font-mono text-[9px] text-cyan-300 space-y-1 overflow-hidden">
                  {handshakeLogs.map((log, idx) => (
                    <div key={idx} className="truncate animate-fadeIn">
                      {log}
                    </div>
                  ))}
                  {pinSending && (
                    <div className="flex items-center gap-1.5 py-1 text-slate-500 italic">
                      <RefreshCw className="w-3 h-3 animate-spin text-cyan-400" />
                      <span>Negotiating authenticating code transport...</span>
                    </div>
                  )}
                </div>
              )}

              {pinSent && (
                <div className="p-4 bg-slate-950 border border-cyan-955/40 rounded-2xl space-y-3 animate-slideUp">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wide flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5" /> Verification PIN Code:
                    </span>
                    <button 
                      onClick={() => { setPinSent(false); setHandshakeLogs([]); }}
                      className="text-[9px] text-slate-505 hover:text-cyan-400 font-sans"
                    >
                      Edit profile
                    </button>
                  </div>
                  
                  <p className="text-[10px] text-slate-400 font-sans leading-relaxed">
                    Enter the 5-digit authentication code pushed into your official Telegram chat by service credentials.
                  </p>

                  <div className="flex items-center justify-center gap-2">
                    <input
                      type="text"
                      maxLength={5}
                      value={pinCode}
                      onChange={(e) => setPinCode(e.target.value.replace(/\D/g, '').substring(0, 5))}
                      placeholder="• • • • •"
                      className="bg-slate-900 border border-slate-800 rounded-xl text-center font-mono py-1.5 text-base tracking-[0.6em] font-black focus:outline-none focus:border-cyan-500 w-full text-white max-w-[140px]"
                    />
                  </div>

                  <div className="pt-1">
                    <button
                      onClick={handleVerifyPinCode}
                      disabled={verifyingPin}
                      className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-1.5 rounded-xl text-xs flex items-center justify-center gap-1.5 select-none transition-all cursor-pointer"
                    >
                      {verifyingPin ? (
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <CheckCircle className="w-3.5 h-3.5" />
                      )}
                      <span>{verifyingPin ? 'Completing authentic registration handshake...' : 'Verify Key & Finalize Linkage'}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tab 3: Scan QR Code View */}
          {activeTab === 'qr' && (
            <div className="space-y-4 font-sans text-slate-300 text-[11px] animate-fadeIn">
              <div className="bg-slate-950 rounded-2xl p-4 border border-slate-850 flex flex-col md:flex-row items-center gap-5 relative overflow-hidden">
                <div className="flex-shrink-0 relative bg-white p-3.5 rounded-2xl shadow-xl shadow-cyan-950/20 border-2 border-cyan-400/30 flex items-center justify-center group overflow-hidden select-none">
                  {qrStatus === 'scanning' || qrStatus === 'verifying' ? (
                    <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_8px_rgba(34,211,238,1)] z-10 animate-[bounce_2s_infinite]" />
                  ) : (
                    <div className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent shadow-[0_0_3px_rgba(34,211,238,0.5)] z-10 animate-[pulse_1.5s_infinite]" />
                  )}

                  {qrStatus === 'verifying' && (
                    <div className="absolute inset-0 bg-slate-950/90 z-20 flex flex-col items-center justify-center gap-2">
                      <RefreshCw className="w-6 h-6 text-cyan-400 animate-spin" />
                      <span className="text-[10px] font-mono text-cyan-400 tracking-wider font-bold">VERIFYING PIN...</span>
                    </div>
                  )}

                  {qrStatus === 'linked' && (
                    <div className="absolute inset-0 bg-slate-950 z-20 flex flex-col items-center justify-center gap-1.5 animate-fadeIn">
                      <div className="p-2 rounded-full bg-cyan-950/80 border border-cyan-500/50">
                        <CheckCircle className="w-7 h-7 text-cyan-400 animate-bounce" />
                      </div>
                      <span className="text-[11px] font-bold text-white uppercase tracking-wider font-sans">LINKED!</span>
                      <span className="text-[8px] font-mono text-slate-500 leading-none">Coupling synced</span>
                    </div>
                  )}

                  <div className="relative w-28 h-28 opacity-90 transition-all duration-300 group-hover:scale-105">
                    <svg width="100%" height="100%" viewBox="0 0 100 100">
                      <rect x="2" y="2" width="22" height="22" rx="4" fill="#020617" />
                      <rect x="6" y="6" width="14" height="14" rx="2" fill="#ffffff" />
                      <rect x="10" y="10" width="6" height="6" fill="#020617" />

                      <rect x="76" y="2" width="22" height="22" rx="4" fill="#020617" />
                      <rect x="80" y="6" width="14" height="14" rx="2" fill="#ffffff" />
                      <rect x="84" y="84" width="6" height="6" fill="#020617" />

                      <rect x="2" y="76" width="22" height="22" rx="4" fill="#020617" />
                      <rect x="6" y="80" width="14" height="14" rx="2" fill="#ffffff" />
                      <rect x="10" y="84" width="6" height="6" fill="#020617" />

                      <rect x="30" y="2" width="5" height="5" rx="1.5" fill="#020617" />
                      <rect x="42" y="2" width="12" height="5" rx="1.5" fill="#0f172a" />
                      <rect x="60" y="2" width="5" height="5" rx="1.5" fill="#1e293b" />
                      <rect x="30" y="12" width="8" height="5" rx="1.5" fill="#334155" />
                      <rect x="48" y="10" width="5" height="15" rx="1.5" fill="#020617" />
                      <rect x="60" y="12" width="10" height="5" rx="1.5" fill="#0f172a" />

                      <rect x="30" y="30" width="5" height="5" rx="1" fill="#475569" />
                      <rect x="30" y="42" width="5" height="10" rx="1" fill="#0f172a" />
                      <rect x="2" y="32" width="15" height="5" rx="1" fill="#020617" />
                      <rect x="10" y="44" width="5" height="10" rx="1" fill="#1e293b" />
                      <rect x="18" y="58" width="10" height="5" rx="1" fill="#475569" />

                      <rect x="82" y="30" width="14" height="5" rx="1.5" fill="#020617" />
                      <rect x="90" y="42" width="5" height="15" rx="1.5" fill="#334155" />
                      <rect x="76" y="52" width="10" height="5" rx="1.5" fill="#0f172a" />
                      
                      <rect x="34" y="65" width="20" height="5" rx="1" fill="#1e293b" />
                      <rect x="65" y="65" width="5" height="15" rx="1" fill="#020617" />
                      <rect x="45" y="80" width="15" height="5" rx="1" fill="#0f172a" />
                      <rect x="72" y="78" width="24" height="8" rx="2" fill="#020617" />
                      <rect x="82" y="90" width="14" height="5" rx="1" fill="#475569" />

                      <circle cx="50" cy="50" r="14" fill="#22d3ee" stroke="#ffffff" strokeWidth="2.5" />
                      <path d="M44,49.5 L55,44.5 L51.5,52.5 L48.5,52 L47.5,54.5 L47,52 Z" fill="#020617" />
                    </svg>
                  </div>
                </div>

                <div className="flex-1 space-y-2.5">
                  <span className="text-[10px] font-bold text-cyan-400 tracking-wider uppercase block">
                    ⭐ Telegram Desktop Authentication Flow:
                  </span>
                  
                  <ul className="space-y-1.5 text-slate-350 list-none pl-0">
                    <li className="flex items-start gap-1.5 leading-tight">
                      <span className="bg-slate-900 border border-slate-800 text-cyan-400 font-bold px-1.5 py-0.5 rounded text-[9px] mt-0.5 flex-shrink-0">1</span>
                      <span>Launch <strong>Telegram</strong> on your smartphone.</span>
                    </li>
                    <li className="flex items-start gap-1.5 leading-tight">
                      <span className="bg-slate-900 border border-slate-800 text-cyan-400 font-bold px-1.5 py-0.5 rounded text-[9px] mt-0.5 flex-shrink-0">2</span>
                      <span>Navigate to <strong>Settings</strong> &gt; <strong>Devices</strong> &gt; <strong>Link Desktop Device</strong>.</span>
                    </li>
                    <li className="flex items-start gap-1.5 leading-tight">
                      <span className="bg-slate-900 border border-slate-800 text-cyan-400 font-bold px-1.5 py-0.5 rounded text-[9px] mt-0.5 flex-shrink-0">3</span>
                      <span>Hold your device camera up to capture the QR code above.</span>
                    </li>
                  </ul>

                  <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-mono">
                    <RefreshCw className={`w-3.5 h-3.5 animate-spin text-cyan-505`} />
                    <span>Code expires in <strong className="text-white">{qrCountdown} seconds</strong>.</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-950 p-3 rounded-2xl border border-slate-850 font-mono text-[9px] text-cyan-300 space-y-1">
                <div className="text-slate-505 text-[8px] uppercase tracking-wider border-b border-slate-905 pb-1 flex items-center justify-between">
                  <span>🖥️ Optical Handshake Dispatch Logs:</span>
                  <span className="text-cyan-500 animate-pulse font-bold">{qrStatus.toUpperCase()}</span>
                </div>
                <div className="space-y-1 max-h-[85px] overflow-y-auto pt-1 select-none">
                  {qrLogs.map((log, idx) => (
                    <div key={idx} className="truncate animate-fadeIn">
                      {log}
                    </div>
                  ))}
                </div>
              </div>

              {qrStatus !== 'linked' && (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleSimulateQrScan}
                    disabled={qrStatus !== 'idle'}
                    className="flex-1 py-1.5 px-3 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 disabled:from-slate-950 disabled:to-slate-950 text-white disabled:text-slate-500 font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md select-none border border-transparent disabled:border-slate-900"
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>{qrStatus === 'idle' ? 'Simulate Scan from Phone' : 'Validating Mobile scan...'}</span>
                  </button>

                  {qrStatus !== 'idle' && (
                    <button
                      type="button"
                      onClick={() => {
                        setQrStatus('idle');
                        setQrLogs(prev => [...prev, '🔄 [QR-Gateway] Scan aborted by user. Awaiting new frame...']);
                      }}
                      className="px-3 py-1.5 bg-slate-950 text-slate-400 hover:text-white hover:bg-slate-850 border border-slate-850 rounded-xl transition-all font-bold cursor-pointer select-none"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Notifications and Alerts box */}
          {testResult && (
            <div className={`p-3 rounded-xl border flex items-start gap-2 text-[10px] font-sans animate-fadeIn ${
              testResult.success 
                ? 'bg-emerald-950/20 border-emerald-900/40 text-emerald-300' 
                : 'bg-rose-950/20 border-rose-900/40 text-rose-300'
            }`}>
              {testResult.success ? (
                <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-400 mt-0.5 flex-shrink-0" />
              )}
              <span>{testResult.message}</span>
            </div>
          )}

          {/* Bottom control buttons (only active when not aligned yet) */}
          <div className="flex gap-2">
            {activeTab === 'bot' ? (
              <button
                onClick={handleTestConnection}
                disabled={testing}
                className="flex-1 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold py-2 px-3.5 rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 select-none shadow-md shadow-indigo-950"
              >
                {testing ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <CheckCircle className="w-3.5 h-3.5" />
                )}
                <span>{testing ? 'Verifying...' : 'Authorize Bot Interface'}</span>
              </button>
            ) : activeTab === 'user' ? (
              !pinSent && (
                <button
                  onClick={handleSendPinCode}
                  disabled={pinSending}
                  className="flex-1 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold py-2 px-3.5 rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 select-none shadow-md shadow-indigo-950"
                >
                  {pinSending ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Send className="w-3.5 h-3.5" />
                  )}
                  <span>{pinSending ? 'Negotiating Tunnel...' : 'Send Verification PIN Code'}</span>
                </button>
              )
            ) : null}

            {/* Quick interactive sandbox helper fillers */}
            {(!pinSent || activeTab === 'qr' || activeTab === 'bot') && (
              <button
                onClick={handleQuickDemoFill}
                className="bg-slate-950 hover:bg-slate-850 border border-slate-850 text-slate-400 hover:text-slate-200 font-bold py-2 px-3 rounded-xl text-xs transition-all cursor-pointer select-none"
                title="Populate mock credentials with verification logs for quick testing"
              >
                Demo Fill
              </button>
            )}
          </div>
        </div>
      )}

      {/* Sync Slider Control */}
      {accounts.length > 0 && !isLinkingNew && (
        <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-850 flex items-center justify-between animate-fadeIn">
          <div className="space-y-0.5 pr-2 select-none">
            <span className="text-[10px] font-bold font-sans text-cyan-400 flex items-center gap-1 leading-none">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin-slow" /> Auto Sync Engine Enabled
            </span>
            <span className="text-[9px] text-slate-500 font-sans block leading-relaxed mt-1">
              Activated node will automatically capture and backup your dropped locker files instantly!
            </span>
          </div>

          <label className="relative inline-flex items-center cursor-pointer select-none">
            <input 
              type="checkbox" 
              checked={config.isEnabled}
              onChange={toggleEngine}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-slate-900 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-slate-400 peer-checked:after:bg-cyan-400 after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-cyan-950 pb-0.5 border border-slate-800" />
          </label>
        </div>
      )}
    </div>
  );
}
