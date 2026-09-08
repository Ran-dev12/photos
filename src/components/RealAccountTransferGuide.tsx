import React, { useState } from 'react';
import {
  ExternalLink,
  Copy,
  Check,
  Download,
  Terminal,
  Cloud,
  HardDrive,
  Laptop,
  CheckCircle2,
  FolderLock,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Play,
  Key,
  HelpCircle,
  X,
  UserCheck,
  Clock,
  Layers,
} from 'lucide-react';
import { GoogleAccountProfile, ICloudAccountProfile } from '../types';
import { generateICloudDriveSyncScript } from '../utils/macScriptGenerator';
import { formatBytes } from '../utils/formatters';

interface RealAccountTransferGuideProps {
  googleProfile: GoogleAccountProfile;
  iCloudProfile: ICloudAccountProfile;
  onUpdateGoogleProfile: (profile: Partial<GoogleAccountProfile>) => void;
  onUpdateICloudProfile: (profile: Partial<ICloudAccountProfile>) => void;
  onClose: () => void;
}

export const RealAccountTransferGuide: React.FC<RealAccountTransferGuideProps> = ({
  googleProfile,
  iCloudProfile,
  onUpdateGoogleProfile,
  onUpdateICloudProfile,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'icloud_drive' | 'cloud_direct' | 'local_app' | 'accounts'>('icloud_drive');
  const [copiedCmd, setCopiedCmd] = useState(false);
  const [copiedScript, setCopiedScript] = useState(false);
  const [copiedLocalCmd, setCopiedLocalCmd] = useState(false);

  // Editable account inputs
  const [inputGoogleEmail, setInputGoogleEmail] = useState(googleProfile.email);
  const [inputGoogleName, setInputGoogleName] = useState(googleProfile.name);
  const [inputAppleId, setInputAppleId] = useState(iCloudProfile.appleId);
  const [inputTier, setInputTier] = useState(iCloudProfile.tier);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Script text
  const iCloudScript = generateICloudDriveSyncScript();

  // One-line bash setup command
  const oneLineBashCmd = `mkdir -p "$HOME/Library/Mobile Documents/com~apple~CloudDocs/Google_Photos_Archive" && open "$HOME/Library/Mobile Documents/com~apple~CloudDocs/Google_Photos_Archive"`;

  const localRunCmd = `# 1. Open Terminal and navigate to the project directory
npm install
npm run dev
# 2. Open in your browser
open http://localhost:3000`;

  const handleCopyCmd = (text: string, setter: (val: boolean) => void) => {
    navigator.clipboard.writeText(text);
    setter(true);
    setTimeout(() => setter(false), 2000);
  };

  const handleDownloadScript = () => {
    const blob = new Blob([iCloudScript], { type: 'application/x-sh' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sync-to-icloud-drive.command';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleSaveAccounts = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateGoogleProfile({
      email: inputGoogleEmail,
      name: inputGoogleName,
    });
    onUpdateICloudProfile({
      appleId: inputAppleId,
      tier: inputTier,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div
      id="real-account-transfer-modal"
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto"
    >
      <div className="bg-neutral-900 border border-white/10 rounded-2xl max-w-4xl w-full p-5 sm:p-6 shadow-2xl relative my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-white/10 shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 font-mono uppercase font-semibold">
                MacBook Real Account Guide
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono font-medium">
                Official Protocols
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white mt-1">
              Transfer Real Photos to iCloud Drive on MacBook
            </h2>
            <p className="text-xs text-neutral-400 mt-0.5">
              Complete step-by-step instructions to connect your real Google & Apple accounts and migrate photos safely.
            </p>
          </div>

          <button
            id="btn-close-real-guide"
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 flex items-center justify-center cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 pt-3 pb-4 border-b border-white/5 shrink-0">
          <button
            id="tab-icloud-drive"
            onClick={() => setActiveTab('icloud_drive')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all flex items-center gap-1.5 ${
              activeTab === 'icloud_drive'
                ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20'
                : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
            }`}
          >
            <HardDrive className="w-3.5 h-3.5" />
            <span>Method 1: Direct to iCloud Drive (macOS)</span>
          </button>

          <button
            id="tab-cloud-direct"
            onClick={() => setActiveTab('cloud_direct')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all flex items-center gap-1.5 ${
              activeTab === 'cloud_direct'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
            }`}
          >
            <Cloud className="w-3.5 h-3.5" />
            <span>Method 2: Official Cloud Transfer (Zero-Download)</span>
          </button>

          <button
            id="tab-local-app"
            onClick={() => setActiveTab('local_app')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all flex items-center gap-1.5 ${
              activeTab === 'local_app'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
            }`}
          >
            <Laptop className="w-3.5 h-3.5" />
            <span>Run on MacBook Locally</span>
          </button>

          <button
            id="tab-accounts"
            onClick={() => setActiveTab('accounts')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all flex items-center gap-1.5 ${
              activeTab === 'accounts'
                ? 'bg-neutral-200 text-neutral-900 shadow-md'
                : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Set My Real Accounts</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto py-4 pr-1 text-xs text-neutral-300 leading-relaxed space-y-4">
          {/* TAB 1: LOCAL ICLOUD DRIVE */}
          {activeTab === 'icloud_drive' && (
            <div className="space-y-4">
              <div className="bg-sky-500/10 border border-sky-500/20 rounded-xl p-3.5 text-neutral-200">
                <div className="flex items-center gap-2 text-sky-400 font-semibold mb-1">
                  <HardDrive className="w-4 h-4" />
                  <span>How iCloud Drive Sync Works on macOS</span>
                </div>
                <p className="text-neutral-300 text-[11px] leading-relaxed">
                  On your MacBook, iCloud Drive has a dedicated local file directory located at{' '}
                  <code className="bg-black/40 px-1 py-0.5 rounded font-mono text-sky-300">
                    ~/Library/Mobile Documents/com~apple~CloudDocs/
                  </code>
                  . Any photo folder placed inside this directory is automatically picked up by macOS’s background{' '}
                  <span className="font-mono text-neutral-200">bird</span> daemon and uploaded securely to your real iCloud storage!
                </p>
              </div>

              {/* Step by step */}
              <div className="space-y-3">
                <div className="bg-neutral-800/60 border border-white/5 rounded-xl p-3.5">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="w-5 h-5 rounded-full bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold text-[11px]">
                      1
                    </span>
                    <h4 className="font-semibold text-white">
                      Export Your Real Photos from Google Takeout
                    </h4>
                  </div>
                  <p className="text-neutral-400 text-[11px] mb-2.5">
                    Visit Google Takeout signed in with <strong className="text-white">{googleProfile.email}</strong>. Select Google Photos, choose zip file size (e.g. 10GB or 50GB), and download the archives to your MacBook.
                  </p>
                  <a
                    href="https://takeout.google.com/takeout/custom/photos"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-neutral-950 font-medium text-xs transition-colors shadow"
                  >
                    <span>Open Google Takeout Photos Export</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                <div className="bg-neutral-800/60 border border-white/5 rounded-xl p-3.5">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="w-5 h-5 rounded-full bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold text-[11px]">
                      2
                    </span>
                    <h4 className="font-semibold text-white">
                      Create Your iCloud Drive Staging Folder in Finder
                    </h4>
                  </div>
                  <p className="text-neutral-400 text-[11px] mb-2">
                    Run this 1-line command in macOS Terminal to instantly create the sync folder in your iCloud Drive and open it in Finder:
                  </p>
                  <div className="bg-black/50 border border-white/10 rounded-lg p-2.5 flex items-center justify-between font-mono text-[11px] text-neutral-300">
                    <span className="truncate pr-2">{oneLineBashCmd}</span>
                    <button
                      onClick={() => handleCopyCmd(oneLineBashCmd, setCopiedCmd)}
                      className="px-2.5 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-200 shrink-0 flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      {copiedCmd ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedCmd ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                </div>

                <div className="bg-neutral-800/60 border border-white/5 rounded-xl p-3.5">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="w-5 h-5 rounded-full bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold text-[11px]">
                      3
                    </span>
                    <h4 className="font-semibold text-white">
                      Move Photos & Keep MacBook Awake with Caffeinate
                    </h4>
                  </div>
                  <p className="text-neutral-400 text-[11px] mb-2.5">
                    Unzip your Google Takeout files and move them into the opened iCloud Drive folder. To ensure macOS continues uploading in the background without sleeping, download and double-click our automated script:
                  </p>
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={handleDownloadScript}
                      className="px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-medium text-xs flex items-center gap-1.5 shadow cursor-pointer transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download sync-to-icloud-drive.command</span>
                    </button>
                    <button
                      onClick={() => handleCopyCmd(iCloudScript, setCopiedScript)}
                      className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
                    >
                      {copiedScript ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedScript ? 'Script Copied' : 'Copy Shell Script'}</span>
                    </button>
                  </div>
                </div>

                <div className="bg-neutral-800/60 border border-white/5 rounded-xl p-3.5">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-[11px]">
                      4
                    </span>
                    <h4 className="font-semibold text-white">
                      Verify iCloud Sync in Finder & on iPhone / iPad
                    </h4>
                  </div>
                  <p className="text-neutral-400 text-[11px]">
                    In Finder, look at the status icon next to the <strong className="text-neutral-200">Google_Photos_Archive</strong> folder. A circular progress pie indicates active uploading; once complete, the files are securely stored in your real Apple iCloud account (<span className="text-sky-300 font-mono">{iCloudProfile.appleId}</span>) and accessible across all your Apple devices!
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: OFFICIAL DIRECT CLOUD TRANSFER */}
          {activeTab === 'cloud_direct' && (
            <div className="space-y-4">
              <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-3.5 text-neutral-200">
                <div className="flex items-center gap-2 text-indigo-400 font-semibold mb-1">
                  <Sparkles className="w-4 h-4" />
                  <span>The Official Apple & Google Direct Data Transfer Tool</span>
                </div>
                <p className="text-neutral-300 text-[11px] leading-relaxed">
                  In 2024, Apple and Google officially launched direct server-to-server photo transfer through the Data Transfer Initiative. This transfers your real photos directly between Google and Apple cloud servers without downloading anything to your MacBook!
                </p>
              </div>

              {/* Steps */}
              <div className="space-y-3">
                <div className="bg-neutral-800/60 border border-white/5 rounded-xl p-3.5 flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    1
                  </span>
                  <div className="flex-1">
                    <h4 className="font-semibold text-white text-xs">
                      Sign in to your real Google Account
                    </h4>
                    <p className="text-neutral-400 text-[11px] mt-0.5 mb-2">
                      Make sure you are logged in to your Google Account (<span className="text-white font-medium">{googleProfile.email}</span>).
                    </p>
                  </div>
                </div>

                <div className="bg-neutral-800/60 border border-white/5 rounded-xl p-3.5 flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    2
                  </span>
                  <div className="flex-1">
                    <h4 className="font-semibold text-white text-xs">
                      Launch the Direct Transfer Portal
                    </h4>
                    <p className="text-neutral-400 text-[11px] mt-0.5 mb-2.5">
                      Click the official transfer link below. Under "Choose destination", select <strong className="text-white">Apple - iCloud Photos</strong>.
                    </p>
                    <a
                      href="https://takeout.google.com/takeout/transfer/custom/photos"
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs shadow-lg shadow-indigo-600/20 cursor-pointer transition-colors"
                    >
                      <span>Open Official Apple & Google Transfer Tool</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>

                <div className="bg-neutral-800/60 border border-white/5 rounded-xl p-3.5 flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    3
                  </span>
                  <div className="flex-1">
                    <h4 className="font-semibold text-white text-xs">
                      Authenticate with your Real Apple ID
                    </h4>
                    <p className="text-neutral-400 text-[11px] mt-0.5">
                      Apple will prompt you to log in with your Apple ID (<span className="text-sky-300 font-mono">{iCloudProfile.appleId}</span>) and grant permission for incoming photo transfers. Apple will verify you have enough iCloud storage available.
                    </p>
                  </div>
                </div>

                <div className="bg-neutral-800/60 border border-white/5 rounded-xl p-3.5 flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    4
                  </span>
                  <div className="flex-1">
                    <h4 className="font-semibold text-white text-xs">
                      Background Cloud Execution
                    </h4>
                    <p className="text-neutral-400 text-[11px] mt-0.5">
                      The migration takes between a few hours to 3 days depending on library size. You can shut down your MacBook, disconnect Wi-Fi, or travel — the entire transfer happens in the cloud. You will receive an email confirmation when finished!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: RUN LOCAL APP */}
          {activeTab === 'local_app' && (
            <div className="space-y-4">
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3.5 text-neutral-200">
                <div className="flex items-center gap-2 text-emerald-400 font-semibold mb-1">
                  <Terminal className="w-4 h-4" />
                  <span>Running This App Locally on Your MacBook</span>
                </div>
                <p className="text-neutral-300 text-[11px] leading-relaxed">
                  You can run this application directly inside macOS on your MacBook. This gives you full access to local files, the macOS titlebar, wake lock controls, and battery optimization.
                </p>
              </div>

              {/* Command Box */}
              <div className="bg-black/60 border border-white/10 rounded-xl p-3.5">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/10 text-neutral-400">
                  <span className="text-[11px] font-mono">macOS Terminal Commands</span>
                  <button
                    onClick={() => handleCopyCmd(localRunCmd, setCopiedLocalCmd)}
                    className="px-2.5 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    {copiedLocalCmd ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedLocalCmd ? 'Copied' : 'Copy Commands'}</span>
                  </button>
                </div>
                <pre className="font-mono text-[11px] text-emerald-300 overflow-x-auto whitespace-pre leading-relaxed">
                  {localRunCmd}
                </pre>
              </div>

              {/* Requirements */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-neutral-800/60 border border-white/5 rounded-xl p-3">
                  <h4 className="font-semibold text-white text-xs mb-1">Prerequisites</h4>
                  <ul className="list-disc list-inside text-neutral-400 text-[11px] space-y-1">
                    <li>macOS Monterey, Ventura, Sonoma, or Sequoia</li>
                    <li>Node.js 18 or higher (<code className="text-neutral-300">brew install node</code>)</li>
                    <li>Terminal or iTerm2</li>
                  </ul>
                </div>

                <div className="bg-neutral-800/60 border border-white/5 rounded-xl p-3">
                  <h4 className="font-semibold text-white text-xs mb-1">Native MacBook Features</h4>
                  <ul className="list-disc list-inside text-neutral-400 text-[11px] space-y-1">
                    <li>Hardware Wake Lock keeps MacBook awake</li>
                    <li>Battery health protection pauses sync when unplugged</li>
                    <li>AppleScript automation for Photos.app & iCloud Drive</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: REAL ACCOUNTS */}
          {activeTab === 'accounts' && (
            <div className="space-y-4">
              <div className="bg-neutral-800/60 border border-white/5 rounded-xl p-3.5">
                <div className="flex items-center gap-2 text-neutral-200 font-semibold mb-1">
                  <UserCheck className="w-4 h-4 text-sky-400" />
                  <span>Configure Your Real Google & Apple Accounts</span>
                </div>
                <p className="text-neutral-400 text-[11px] mb-4">
                  Enter your real email addresses to customize your sync profile, estimate iCloud storage requirements, and generate tailored commands.
                </p>

                <form onSubmit={handleSaveAccounts} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Google Account */}
                    <div className="bg-neutral-900/60 p-3.5 rounded-xl border border-white/5 space-y-2">
                      <h4 className="text-xs font-semibold text-amber-400 flex items-center gap-1.5">
                        <FolderLock className="w-3.5 h-3.5" />
                        Google Account (Source)
                      </h4>
                      <div>
                        <label className="block text-[11px] text-neutral-400 mb-1">
                          Google Email Address:
                        </label>
                        <input
                          type="email"
                          required
                          value={inputGoogleEmail}
                          onChange={(e) => setInputGoogleEmail(e.target.value)}
                          className="w-full bg-neutral-800 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-400"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-neutral-400 mb-1">
                          Account Name:
                        </label>
                        <input
                          type="text"
                          value={inputGoogleName}
                          onChange={(e) => setInputGoogleName(e.target.value)}
                          className="w-full bg-neutral-800 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-400"
                        />
                      </div>
                    </div>

                    {/* Apple Account */}
                    <div className="bg-neutral-900/60 p-3.5 rounded-xl border border-white/5 space-y-2">
                      <h4 className="text-xs font-semibold text-sky-400 flex items-center gap-1.5">
                        <Cloud className="w-3.5 h-3.5" />
                        Apple ID / iCloud (Destination)
                      </h4>
                      <div>
                        <label className="block text-[11px] text-neutral-400 mb-1">
                          Apple ID / iCloud Email:
                        </label>
                        <input
                          type="email"
                          required
                          value={inputAppleId}
                          onChange={(e) => setInputAppleId(e.target.value)}
                          className="w-full bg-neutral-800 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-sky-400"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-neutral-400 mb-1">
                          iCloud Storage Plan:
                        </label>
                        <select
                          value={inputTier}
                          onChange={(e) => setInputTier(e.target.value)}
                          className="w-full bg-neutral-800 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-sky-400"
                        >
                          <option value="50 GB">50 GB ($0.99/mo)</option>
                          <option value="200 GB">200 GB ($2.99/mo)</option>
                          <option value="2 TB">2 TB ($9.99/mo)</option>
                          <option value="6 TB">6 TB ($29.99/mo)</option>
                          <option value="12 TB">12 TB ($59.99/mo)</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-[11px] text-neutral-400">
                      Settings are stored locally on your MacBook.
                    </span>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-medium text-xs shadow cursor-pointer transition-colors flex items-center gap-1.5"
                    >
                      {savedSuccess ? <CheckCircle2 className="w-3.5 h-3.5 text-white" /> : null}
                      <span>{savedSuccess ? 'Saved to Dashboard!' : 'Save Account Settings'}</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-white/10 flex items-center justify-between shrink-0 text-xs">
          <div className="flex items-center gap-1.5 text-neutral-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Official Apple & Google protocols safeguard all photo EXIF & Live Photos.</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-medium cursor-pointer transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
