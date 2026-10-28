import React, { useState } from 'react';
import {
  Camera,
  Upload,
  AlertTriangle,
  CheckCircle2,
  Cpu,
  Layers,
  Sliders,
  Eye,
  Scan,
  Maximize2,
  RefreshCw,
  Zap,
  FileText,
  Video,
  Activity,
  Search,
  Binary,
  Compass,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../context/AppContext';
import { DropZone, DroppedFileInfo } from '../components/common/DropZone';
import { extractOcrFromImageData, runCnnForensics, runVideoForensics, globalPacClassifier } from '../ml';

export const MediaForensicsPage: React.FC = () => {
  const { showToast } = useApp();

  const [activeTab, setActiveTab] = useState<'ocr' | 'cnn' | 'video'>('ocr');
  const [selectedPreset, setSelectedPreset] = useState<'medical_scam' | 'viral_meme' | 'deepfake_clipping' | 'verified_wire' | 'custom'>('viral_meme');
  const [customText, setCustomText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Live ML States
  const [ocrResult, setOcrResult] = useState(() => extractOcrFromImageData({ sampleType: 'viral_meme' }));
  const [pacClassification, setPacClassification] = useState(() => globalPacClassifier.predict(ocrResult.fullText, ocrResult.headline));
  const [cnnResult, setCnnResult] = useState(() => runCnnForensics('viral_meme'));
  const [videoResult, setVideoResult] = useState(() => runVideoForensics('deepfake'));

  const handleRunOcrAndCnn = (preset: typeof selectedPreset, overrideText?: string) => {
    setIsProcessing(true);
    setTimeout(() => {
      const textToUse = overrideText !== undefined ? overrideText : (preset === 'custom' ? customText : undefined);
      const newOcr = extractOcrFromImageData({ sampleType: preset, customText: textToUse });
      const newPac = globalPacClassifier.predict(newOcr.fullText, newOcr.headline);
      const newCnn = runCnnForensics(preset);
      const newVideo = runVideoForensics(preset === 'verified_wire' ? 'authentic' : 'deepfake');

      setOcrResult(newOcr);
      setPacClassification(newPac);
      setCnnResult(newCnn);
      setVideoResult(newVideo);
      setIsProcessing(false);
      showToast(`Multi-Modal ML extraction completed (${newOcr.wordCount} words, ${newCnn.manipulationScore}% CNN tampering score)`, 'success');
    }, 300);
  };

  const handleCustomFileUpload = (file: DroppedFileInfo) => {
    setSelectedPreset('custom');
    const text = file.extractedText || file.extractedTitle || file.name;
    setCustomText(text);
    handleRunOcrAndCnn('custom', text);
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 font-sans tracking-tight">
              Multi-Modal Media Forensics & Neural OCR
            </h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
              PURE ML ENGINE
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time Optical Character Recognition (OCR), Convolutional Neural Network (CNN) feature maps, and Video temporal consistency analysis.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center bg-slate-100 dark:bg-[#0b132b] p-1 rounded-lg border border-slate-200 dark:border-slate-800">
          <button
            onClick={() => setActiveTab('ocr')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              activeTab === 'ocr'
                ? 'bg-white dark:bg-blue-600 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Scan className="w-3.5 h-3.5 text-blue-500 dark:text-blue-300" />
            <span>Neural OCR Engine</span>
          </button>
          <button
            onClick={() => setActiveTab('cnn')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              activeTab === 'cnn'
                ? 'bg-white dark:bg-blue-600 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-purple-500 dark:text-purple-300" />
            <span>CNN Vision Forensics</span>
          </button>
          <button
            onClick={() => setActiveTab('video')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              activeTab === 'video'
                ? 'bg-white dark:bg-blue-600 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Video className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-300" />
            <span>Video Temporal Forensics</span>
          </button>
        </div>
      </div>

      {/* Preset Selector & File Ingestion */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-3 p-4 rounded-xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              Ingestion Benchmark Presets
            </span>
            <span className="text-[11px] font-mono text-slate-400">
              Processing: {ocrResult.processingTimeMs}ms
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: 'viral_meme', label: 'Viral Meme Clipping', badge: 'Fake News' },
              { id: 'deepfake_clipping', label: 'Leaked Memo Artifact', badge: 'Fabrication' },
              { id: 'medical_scam', label: 'Cure Scam Ad Image', badge: 'Pharma Hoax' },
              { id: 'verified_wire', label: 'Reuters Wire Photo', badge: 'Authentic' },
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => {
                  setSelectedPreset(p.id as any);
                  handleRunOcrAndCnn(p.id as any);
                }}
                className={`p-2.5 rounded-lg text-left text-xs transition-all border ${
                  selectedPreset === p.id
                    ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/30 text-blue-900 dark:text-blue-200 shadow-xs'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#131d38] text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="font-semibold">{p.label}</div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">{p.badge}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Quick Drop Zone */}
        <div className="p-3 rounded-xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col justify-center">
          <DropZone
            compact={true}
            onFileAccepted={handleCustomFileUpload}
            title="Drop image or video"
          />
        </div>
      </div>

      {/* Main Forensic Content Based on Tab */}
      <AnimatePresence mode="wait">
        {activeTab === 'ocr' && (
          <motion.div
            key="ocr"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Simulated Visual Scan Frame with Bounding Boxes */}
              <div className="lg:col-span-7 space-y-4">
                <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 shadow-sm relative overflow-hidden">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <Scan className="w-4 h-4 text-blue-400 animate-pulse" />
                      <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
                        Neural Optical Glyph Frame ({ocrResult.recognizedWords.length} Detected Words)
                      </span>
                    </div>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-blue-900/60 text-blue-300 border border-blue-700/50">
                      Avg Conf: {(ocrResult.averageConfidence * 100).toFixed(1)}%
                    </span>
                  </div>

                  {/* Visual Render Canvas */}
                  <div className="my-4 p-4 rounded-lg bg-slate-950 border border-slate-800/80 min-h-[220px] flex flex-wrap content-start gap-2 relative">
                    {/* Tampering overlay if high inconsistency */}
                    {ocrResult.fontInconsistencyScore > 0.5 && (
                      <div className="absolute top-2 right-2 px-2 py-1 rounded bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[10px] font-mono flex items-center gap-1 z-10">
                        <AlertTriangle className="w-3 h-3" />
                        <span>Font Kerning & Compression Mismatch ({(ocrResult.fontInconsistencyScore * 100).toFixed(0)}%)</span>
                      </div>
                    )}

                    {ocrResult.recognizedWords.map((w, idx) => (
                      <div
                        key={idx}
                        className={`px-2 py-1 rounded text-xs font-mono border transition-all ${
                          w.tamperingRisk > 0.5
                            ? 'bg-amber-950/40 border-amber-500 text-amber-200 shadow-2xs'
                            : 'bg-blue-950/30 border-blue-500/40 text-blue-200'
                        }`}
                        title={`Confidence: ${(w.confidence * 100).toFixed(0)}% | Tamper Risk: ${(w.tamperingRisk * 100).toFixed(0)}%`}
                      >
                        <span className="font-semibold">{w.text}</span>
                        <span className="text-[9px] text-slate-400 ml-1">{(w.confidence * 100).toFixed(0)}%</span>
                      </div>
                    ))}
                  </div>

                  {/* Extracted Raw OCR String */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                      Extracted Text Transcript
                    </label>
                    <div className="p-3 rounded-md bg-slate-950/80 border border-slate-800 text-xs font-mono text-slate-300 leading-relaxed">
                      "{ocrResult.fullText}"
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Automated PAC ML Classifier on Extracted OCR Text */}
              <div className="lg:col-span-5 space-y-4">
                <div className="p-5 rounded-xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                      <Cpu className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                        PAC ML Truth Verdict on OCR Text
                      </span>
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold font-mono ${
                      pacClassification.label === 'FAKE'
                        ? 'bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-300 border border-red-200 dark:border-red-900/50'
                        : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/50'
                    }`}>
                      {pacClassification.label} NEWS
                    </span>
                  </div>

                  {/* Score Gauges */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-lg bg-slate-50 dark:bg-[#131d38] border border-slate-200 dark:border-slate-800 text-center">
                      <div className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">
                        PAC Truth Index
                      </div>
                      <div className={`text-2xl font-bold font-mono mt-1 ${
                        pacClassification.truthScore > 60 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
                      }`}>
                        {pacClassification.truthScore}/100
                      </div>
                    </div>

                    <div className="p-3 rounded-lg bg-slate-50 dark:bg-[#131d38] border border-slate-200 dark:border-slate-800 text-center">
                      <div className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">
                        Model Confidence
                      </div>
                      <div className="text-2xl font-bold font-mono text-blue-600 dark:text-blue-400 mt-1">
                        {pacClassification.confidence}%
                      </div>
                    </div>
                  </div>

                  {/* Contributing Lexical Tokens */}
                  <div className="space-y-2">
                    <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Contributing N-Gram Feature Attributions:
                    </div>
                    {pacClassification.contributingFakeTokens.length > 0 ? (
                      <div className="space-y-1.5">
                        {pacClassification.contributingFakeTokens.map((t, i) => (
                          <div
                            key={i}
                            className="flex items-center justify-between p-2 rounded-md bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/40 text-xs font-mono"
                          >
                            <span className="text-red-800 dark:text-red-200 font-semibold">"{t.token}"</span>
                            <span className="text-red-600 dark:text-red-400 font-bold">+{t.weight.toFixed(3)}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-3 rounded-md bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/40 text-xs text-emerald-800 dark:text-emerald-200">
                        No significant disinformation token markers detected in OCR stream.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'cnn' && (
          <motion.div
            key="cnn"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: CNN Conv2D Layer Activations */}
              <div className="lg:col-span-8 space-y-4">
                <div className="p-5 rounded-xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                      <Layers className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                        Multi-Scale Conv2D Neural Filter Activations
                      </span>
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold font-mono ${
                      cnnResult.isManipulated
                        ? 'bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-300'
                        : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300'
                    }`}>
                      {cnnResult.verdict}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {cnnResult.layerActivations.map((l, idx) => (
                      <div
                        key={idx}
                        className={`p-3.5 rounded-lg border transition-all ${
                          l.anomalyDetected
                            ? 'bg-red-50/60 dark:bg-red-950/20 border-red-200 dark:border-red-900/40'
                            : 'bg-slate-50/70 dark:bg-[#131d38] border-slate-200 dark:border-slate-800'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{l.layerName}</span>
                          <span className={`text-xs font-mono font-bold ${
                            l.anomalyDetected ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400'
                          }`}>
                            {l.activationScore}%
                          </span>
                        </div>
                        <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 mt-1">
                          Kernel: {l.kernelType}
                        </div>
                        <div className="text-xs text-slate-600 dark:text-slate-300 mt-1.5">
                          {l.description}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* 8x8 Spatial ELA Heat Grid */}
                  <div className="pt-2">
                    <div className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-2 flex items-center justify-between">
                      <span>Spatial 8x8 Quantization & ELA Error Heat Grid</span>
                      <span className="text-[10px] font-mono text-slate-400">High Intensity = Edited Region</span>
                    </div>
                    <div className="grid grid-cols-8 gap-1.5 p-3 rounded-lg bg-slate-900 border border-slate-800">
                      {cnnResult.heatmapGrid.map((cell, idx) => {
                        const isHigh = cell.intensity > 50;
                        return (
                          <div
                            key={idx}
                            className={`h-7 rounded flex items-center justify-center text-[9px] font-mono font-bold transition-all ${
                              isHigh
                                ? 'bg-red-600/80 text-white shadow-xs'
                                : 'bg-slate-800/80 text-slate-400'
                            }`}
                            title={`Cell [${cell.x}, ${cell.y}]: ${cell.intensity}% anomaly intensity`}
                          >
                            {cell.intensity}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Artifacts & Summary */}
              <div className="lg:col-span-4 space-y-4">
                <div className="p-5 rounded-xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                    Detected Visual Artifacts
                  </h3>

                  <div className="space-y-2">
                    {cnnResult.detectedArtifacts.map((art, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-2 p-2.5 rounded-lg bg-slate-50 dark:bg-[#131d38] border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300"
                      >
                        <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                        <span>{art}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                    <div className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                      CNN Forensic Verdict
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      {cnnResult.forensicSummary}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'video' && (
          <motion.div
            key="video"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="space-y-6"
          >
            <div className="p-5 rounded-xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                    Frame-by-Frame Temporal Jitter & LipSync Trajectory
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Optical flow vectors, facial boundary coherence, and audio-visual sync across 300 analyzed frames.
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold font-mono ${
                  videoResult.overallDeepfakeProbability > 50
                    ? 'bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-300'
                    : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300'
                }`}>
                  {videoResult.verdict} ({videoResult.overallDeepfakeProbability}% Risk)
                </span>
              </div>

              {/* Timeline Grid */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Sampled Frame Risk Timeline:
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-2">
                  {videoResult.frameTimeline.map((f, i) => (
                    <div
                      key={i}
                      className={`p-2.5 rounded-lg border text-xs font-mono transition-all ${
                        f.flaggedAnomaly
                          ? 'bg-red-50 dark:bg-red-950/30 border-red-300 dark:border-red-900/50 text-red-900 dark:text-red-200'
                          : 'bg-slate-50 dark:bg-[#131d38] border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div className="flex justify-between font-bold">
                        <span>{f.timestamp}</span>
                        <span>#{f.frameIndex}</span>
                      </div>
                      <div className="mt-1 flex justify-between text-[10px]">
                        <span>Jitter: {f.opticalFlowJitter}%</span>
                        <span>LipSync: {f.lipSyncConfidence}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
