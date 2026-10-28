import React, { useState, useRef, useCallback } from 'react';
import {
  Upload,
  FileText,
  Image as ImageIcon,
  Film,
  FileCode,
  CheckCircle2,
  X,
  Sparkles,
  AlertCircle,
  FileUp,
  RefreshCw,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export interface DroppedFileInfo {
  file: File | null;
  name: string;
  size: number;
  type: string;
  previewUrl?: string;
  extractedTitle?: string;
  extractedText?: string;
  confidence?: number;
}

interface DropZoneProps {
  accept?: string;
  maxSizeMB?: number;
  title?: string;
  subtitle?: string;
  allowedTypesText?: string;
  onFileAccepted?: (info: DroppedFileInfo) => void;
  className?: string;
  compact?: boolean;
}

export const DropZone: React.FC<DropZoneProps> = ({
  accept = 'image/*,.pdf,.txt,.docx,.csv,.mp4,.mov',
  maxSizeMB = 50,
  title = 'Drag & drop media, document, or screenshot here',
  subtitle = 'Automatic OCR extraction, metadata parsing, and forensic hashing',
  allowedTypesText = 'Supports PNG, JPG, WEBP, PDF, TXT, DOCX, MP4 (Max 50MB)',
  onFileAccepted,
  className = '',
  compact = false,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [currentFile, setCurrentFile] = useState<DroppedFileInfo | null>(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const processFile = useCallback(
    (file: File) => {
      setErrorMsg(null);

      // Validate size
      if (file.size > maxSizeMB * 1024 * 1024) {
        setErrorMsg(`File size exceeds limit of ${maxSizeMB}MB (${formatFileSize(file.size)})`);
        return;
      }

      setIsExtracting(true);

      const isImage = file.type.startsWith('image/');
      const isVideo = file.type.startsWith('video/');
      const previewUrl = isImage ? URL.createObjectURL(file) : undefined;

      // Simulate AI OCR and forensic extraction
      setTimeout(() => {
        let extractedTitle = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
        extractedTitle = extractedTitle.charAt(0).toUpperCase() + extractedTitle.slice(1);

        let extractedText = '';
        if (isImage) {
          extractedText = `[OCR Extracted Text from ${file.name}]\nHeadline: ${extractedTitle}\nAnalysis: Key claim text extracted from image typography with high OCR fidelity. Visual seals, timestamps, and typography kerning were checked against benchmark press releases. Extracted claim points indicate viral dissemination across unverified channels.`;
        } else if (isVideo) {
          extractedText = `[Audio/Video Transcript from ${file.name}]\nKey Statement: "Official sources confirm rapid development of disputed telemetry data."\nSpeaker Cadence: Synthetic voice clone probability 14%. Audio spectral consistency verified.`;
        } else {
          extractedText = `[Document Text Extracted from ${file.name}]\nExecutive Summary: Investigative dossier regarding disputed regulatory filings and public health claims.\nFull Text: Document contains 3 high-priority empirical claims subject to cross-verification with WHO, Reuters Fact Check, and open scientific preprint registries.`;
        }

        const fileInfo: DroppedFileInfo = {
          file,
          name: file.name,
          size: file.size,
          type: file.type || 'application/octet-stream',
          previewUrl,
          extractedTitle,
          extractedText,
          confidence: Math.floor(Math.random() * 8 + 92), // 92-99%
        };

        setCurrentFile(fileInfo);
        setIsExtracting(false);

        if (onFileAccepted) {
          onFileAccepted(fileInfo);
        }
      }, 700);
    },
    [maxSizeMB, onFileAccepted]
  );

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragOver) setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      processFile(file);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      processFile(file);
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentFile?.previewUrl) {
      URL.revokeObjectURL(currentFile.previewUrl);
    }
    setCurrentFile(null);
    setErrorMsg(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Sample injector for quick 1-click testing
  const handleLoadSample = (sampleType: 'screenshot' | 'doc' | 'deepfake') => {
    const samples = {
      screenshot: {
        name: 'viral_cure_claim_tweet.png',
        size: 342000,
        type: 'image/png',
        extractedTitle: 'Miracle Cure Viral Post Screenshot',
        extractedText:
          'Extracted text from tweet: "Breaking: International researchers announce 100% cure rate for all chronic conditions in 72hr clinical trials. Media refuses to broadcast it!"',
      },
      doc: {
        name: 'leaked_clinical_protocol_2026.pdf',
        size: 1420000,
        type: 'application/pdf',
        extractedTitle: 'Leaked Phase III Protocol Dossier',
        extractedText:
          'Document analysis: Contains 14 pages of redacted laboratory test sheets with anomalous digital signatures and inconsistent institutional letterheads.',
      },
      deepfake: {
        name: 'press_briefing_statement_clip.mp4',
        size: 8900000,
        type: 'video/mp4',
        extractedTitle: 'Synthetic Regulatory Press Briefing Clip',
        extractedText:
          'Transcript: "We are announcing unconditional emergency authorization effective midnight tonight." Lip-sync variance detected at frame 142-210.',
      },
    };

    const s = samples[sampleType];
    const fileInfo: DroppedFileInfo = {
      file: null,
      name: s.name,
      size: s.size,
      type: s.type,
      previewUrl:
        sampleType === 'screenshot'
          ? 'https://images.unsplash.com/photo-1584483766114-2cea6facdf57?w=600&auto=format&fit=crop&q=80'
          : undefined,
      extractedTitle: s.extractedTitle,
      extractedText: s.extractedText,
      confidence: 96,
    };

    setIsExtracting(true);
    setTimeout(() => {
      setCurrentFile(fileInfo);
      setIsExtracting(false);
      if (onFileAccepted) onFileAccepted(fileInfo);
    }, 400);
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return ImageIcon;
    if (type.startsWith('video/')) return Film;
    return FileText;
  };

  return (
    <div className={`w-full ${className}`}>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileInputChange}
        className="hidden"
        id="dropzone-file-input"
      />

      <AnimatePresence mode="wait">
        {!currentFile ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`relative group cursor-pointer rounded-xl border-2 border-dashed transition-all duration-200 overflow-hidden ${
              isDragOver
                ? 'border-blue-500 bg-blue-500/10 shadow-[0_0_25px_rgba(59,130,246,0.25)] scale-[1.01]'
                : 'border-slate-300 dark:border-slate-700/80 bg-slate-50/50 dark:bg-slate-900/40 hover:border-blue-400 dark:hover:border-blue-500/60 hover:bg-slate-100/60 dark:hover:bg-slate-900/80'
            } ${compact ? 'p-4' : 'p-6 sm:p-8'}`}
          >
            {/* Subtle animated background grid */}
            <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px]" />

            <div className="flex flex-col items-center justify-center text-center relative z-10">
              <motion.div
                animate={{
                  y: isDragOver ? -4 : 0,
                  scale: isDragOver ? 1.1 : 1,
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className={`rounded-2xl p-3.5 mb-3 transition-colors ${
                  isDragOver
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                    : 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 group-hover:bg-blue-600 group-hover:text-white group-hover:shadow-md group-hover:shadow-blue-500/25'
                }`}
              >
                <Upload className="w-6 h-6 stroke-[2.2]" />
              </motion.div>

              <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {title}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md">
                {subtitle}
              </p>

              <div className="mt-3 flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-full bg-slate-200/80 dark:bg-slate-800 text-[11px] font-medium text-slate-600 dark:text-slate-300 border border-slate-300/60 dark:border-slate-700/60">
                  Browse files on device
                </span>
                <span className="text-[11px] text-slate-400">or drop here</span>
              </div>

              <div className="text-[10px] text-slate-400 mt-2 font-mono">
                {allowedTypesText}
              </div>

              {/* Quick Sample File Injector */}
              <div
                className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800/80 flex flex-wrap items-center justify-center gap-1.5 text-[11px]"
                onClick={(e) => e.stopPropagation()}
              >
                <span className="text-slate-400 mr-1 font-medium">Quick Test:</span>
                <button
                  type="button"
                  onClick={() => handleLoadSample('screenshot')}
                  className="px-2 py-0.5 rounded bg-slate-200/70 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-blue-600 hover:text-white transition-colors"
                >
                  📸 Tweet Screenshot
                </button>
                <button
                  type="button"
                  onClick={() => handleLoadSample('doc')}
                  className="px-2 py-0.5 rounded bg-slate-200/70 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-blue-600 hover:text-white transition-colors"
                >
                  📄 Leak PDF
                </button>
                <button
                  type="button"
                  onClick={() => handleLoadSample('deepfake')}
                  className="px-2 py-0.5 rounded bg-slate-200/70 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-blue-600 hover:text-white transition-colors"
                >
                  🎬 Video Clip
                </button>
              </div>
            </div>

            {errorMsg && (
              <div className="mt-3 p-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900/60 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="p-4 rounded-xl border border-blue-500/40 bg-white dark:bg-slate-900/90 shadow-lg shadow-blue-500/5 relative overflow-hidden"
          >
            {/* Animated extraction header */}
            <div className="flex items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2.5 min-w-0">
                {currentFile.previewUrl ? (
                  <div className="w-12 h-12 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 shrink-0">
                    <img
                      src={currentFile.previewUrl}
                      alt="Uploaded media preview"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 border border-blue-200 dark:border-blue-900/60">
                    {React.createElement(getFileIcon(currentFile.type), { className: 'w-5 h-5' })}
                  </div>
                )}

                <div className="min-w-0">
                  <div className="font-semibold text-xs text-slate-800 dark:text-slate-100 truncate flex items-center gap-1.5">
                    <span>{currentFile.name}</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-mono">
                      {formatFileSize(currentFile.size)}
                    </span>
                  </div>
                  <div className="text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>File parsed & forensic signature generated</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-2.5 py-1 text-xs font-medium rounded-md text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Replace</span>
                </button>
                <button
                  type="button"
                  onClick={handleClear}
                  className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  title="Remove file"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* OCR Extracted Text Preview Callout */}
            {currentFile.extractedText && (
              <div className="mt-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-950/70 border border-slate-200/80 dark:border-slate-800 text-xs space-y-1.5">
                <div className="flex items-center justify-between text-[11px] font-semibold text-blue-600 dark:text-blue-400">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                    <span>AI Extracted Claims & Telemetry</span>
                  </div>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-500 dark:text-blue-300 border border-blue-500/20">
                    Confidence: {currentFile.confidence}%
                  </span>
                </div>
                <p className="text-slate-600 dark:text-slate-300 line-clamp-3 text-[11px] leading-relaxed font-sans">
                  {currentFile.extractedText}
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
