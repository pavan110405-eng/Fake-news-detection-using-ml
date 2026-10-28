import React, { useState, useRef } from 'react';
import {
  FileText,
  Image as ImageIcon,
  FileCode,
  Search,
  CheckCircle2,
  AlertTriangle,
  Zap,
  TrendingUp,
  Cpu,
  Layers,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  Clock,
  Sparkles,
  ExternalLink,
  Percent,
  Sliders,
  Upload,
  Copy,
  Check,
  Eye,
  Scan,
  Maximize2,
  FileType,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { globalPacClassifier, PacPrediction } from '../ml/pacModel';
import {
  extractOcrFromImageData,
  performDeepOcrExtraction,
  OcrResult,
  CURATED_IMAGE_SAMPLES,
  CuratedImageSample,
} from '../ml/ocrEngine';
import {
  parseDocumentFile,
  ExtractedDocument,
  CURATED_DOCUMENT_SAMPLES,
  CuratedDocumentSample,
} from '../ml/documentParser';

export const AnalyzePage: React.FC = () => {
  const { runAnalysis, isAnalyzing, showToast } = useApp();

  // Active Verification Mode: 'text' | 'image' | 'document'
  const [activeMode, setActiveMode] = useState<'text' | 'image' | 'document'>('text');

  // ----------------------------------------------------
  // Mode 1: Text & Article State
  // ----------------------------------------------------
  const textTestSamples = [
    {
      label: '🔴 Miracle Cancer Cure Hoax',
      title: 'Underground clinic discovers lemon & baking soda cures all cancers in 24 hours',
      text: 'A team of underground doctors revealed a secret lemon and baking soda mixture that cures all cancers, diabetes, and viral infections in 24 hours. The pharmaceutical cartel is hiding this miraculous breakthrough to protect chemotherapy profits. Share immediately before it gets taken down by mainstream media.',
    },
    {
      label: '🔴 Water Supply Microchip Hoax',
      title: 'Leaked memo confirms mandatory digital microchips placed in water supply',
      text: 'A classified document purportedly leaked from a secret global elite summit proves authorities are putting microscopic nano-trackers in municipal water supplies this Friday to control human brainwaves. Whistleblower reveals chilling agenda.',
    },
    {
      label: '🔴 Broadcast Wealth Loop Scam',
      title: 'Warren Buffett reveals automated wealth loop during live BBC transmission',
      text: 'During an emotional unscripted breakdown on live television the legendary investor showed his secret automated financial app that multiplies 100 dollars to 10000 overnight without any market expertise or risk. Guaranteed returns before banks ban it.',
    },
    {
      label: '🟢 Federal Reserve Interest Rate',
      title: 'Federal Reserve maintains benchmark interest rate after policy meeting',
      text: 'The Federal Open Market Committee decided to hold its benchmark interest rate unchanged following a scheduled two-day monetary policy meeting. Fed Chair noted that while inflation has eased from peak levels, the committee remains committed to monitoring labor market data and economic indicators before adjusting monetary policy.',
    },
    {
      label: '🟢 James Webb Exoplanet Discovery',
      title: 'James Webb Space Telescope observes carbon dioxide in exoplanet atmosphere',
      text: 'NASA and international astronomy teams published peer-reviewed findings in Nature detailing the definitive detection of carbon dioxide in the atmosphere of a gas giant exoplanet WASP-39 b. The observation utilized high-resolution infrared spectrographs and verified transmission spectral models.',
    },
    {
      label: '🟢 Lancet Cancer Immunotherapy Study',
      title: 'Clinical trial shows targeted immunotherapy reduces melanoma recurrence in randomized study',
      text: 'Results from a randomized Phase 3 clinical trial published in the New England Journal of Medicine showed a significant reduction in cancer recurrence among patients receiving adjuvant targeted antibody therapy compared with observation. The study tracked 800 patients across 45 academic medical centers.',
    },
  ];

  const [titleInput, setTitleInput] = useState(textTestSamples[0].title);
  const [textInput, setTextInput] = useState(textTestSamples[0].text);
  const [textPrediction, setTextPrediction] = useState<PacPrediction>(() =>
    globalPacClassifier.predict(textTestSamples[0].text, textTestSamples[0].title)
  );
  const [isTextEvaluating, setIsTextEvaluating] = useState(false);
  const [copied, setCopied] = useState(false);

  // ----------------------------------------------------
  // Mode 2: Image OCR State
  // ----------------------------------------------------
  const [selectedImageSample, setSelectedImageSample] = useState<CuratedImageSample>(
    CURATED_IMAGE_SAMPLES[0]
  );
  const [customImagePreview, setCustomImagePreview] = useState<string | null>(null);
  const [customImageName, setCustomImageName] = useState<string>('');
  const [ocrResult, setOcrResult] = useState<OcrResult>(() =>
    extractOcrFromImageData({ customText: CURATED_IMAGE_SAMPLES[0].text, sampleType: 'medical_scam' })
  );
  const [imagePrediction, setImagePrediction] = useState<PacPrediction>(() =>
    globalPacClassifier.predict(CURATED_IMAGE_SAMPLES[0].text, CURATED_IMAGE_SAMPLES[0].headline, {
      fontInconsistencyScore: CURATED_IMAGE_SAMPLES[0].fontInconsistency,
      compressionArtifactsDetected: CURATED_IMAGE_SAMPLES[0].tamperingDetected,
      tamperingDetected: CURATED_IMAGE_SAMPLES[0].tamperingDetected,
      inputType: 'Image',
    })
  );
  const [isOcrProcessing, setIsOcrProcessing] = useState(false);
  const [ocrStatusText, setOcrStatusText] = useState<string>('');
  const imageInputRef = useRef<HTMLInputElement>(null);

  // ----------------------------------------------------
  // Mode 3: Document State
  // ----------------------------------------------------
  const [selectedDocSample, setSelectedDocSample] = useState<CuratedDocumentSample>(
    CURATED_DOCUMENT_SAMPLES[0]
  );
  const [activeDocument, setActiveDocument] = useState<ExtractedDocument>({
    fileName: CURATED_DOCUMENT_SAMPLES[0].fileName,
    fileSize: CURATED_DOCUMENT_SAMPLES[0].fileSizeKb * 1024,
    fileType: CURATED_DOCUMENT_SAMPLES[0].fileType,
    title: CURATED_DOCUMENT_SAMPLES[0].title,
    text: CURATED_DOCUMENT_SAMPLES[0].text,
    wordCount: CURATED_DOCUMENT_SAMPLES[0].text.split(/\s+/).length,
    characterCount: CURATED_DOCUMENT_SAMPLES[0].text.length,
    paragraphs: [CURATED_DOCUMENT_SAMPLES[0].text],
    institutionalAuthorityFound: CURATED_DOCUMENT_SAMPLES[0].institutionalAuthority,
    citationCount: CURATED_DOCUMENT_SAMPLES[0].citations,
    authorityMarkers: [],
    documentCategory: CURATED_DOCUMENT_SAMPLES[0].category,
  });
  const [docPrediction, setDocPrediction] = useState<PacPrediction>(() =>
    globalPacClassifier.predict(CURATED_DOCUMENT_SAMPLES[0].text, CURATED_DOCUMENT_SAMPLES[0].title, {
      institutionalAuthorityFound: CURATED_DOCUMENT_SAMPLES[0].institutionalAuthority,
      citationCount: CURATED_DOCUMENT_SAMPLES[0].citations,
      inputType: 'Document',
    })
  );
  const [isDocParsing, setIsDocParsing] = useState(false);
  const docInputRef = useRef<HTMLInputElement>(null);

  const metrics = globalPacClassifier.getMetrics();

  // Handlers for Text Mode
  const handleEvaluateText = (text = textInput, title = titleInput) => {
    if (!text.trim() && !title.trim()) {
      showToast('Please enter text or a headline to evaluate.', 'warn');
      return;
    }
    setIsTextEvaluating(true);
    setTimeout(() => {
      const res = globalPacClassifier.predict(text.trim(), title.trim() || undefined, { inputType: 'Article' });
      setTextPrediction(res);
      setIsTextEvaluating(false);
    }, 60);
  };

  const handleSelectTextSample = (sample: typeof textTestSamples[0]) => {
    setTitleInput(sample.title);
    setTextInput(sample.text);
    handleEvaluateText(sample.text, sample.title);
  };

  // Handlers for Image OCR Mode
  const handleSelectImageSample = (sample: CuratedImageSample) => {
    setSelectedImageSample(sample);
    setCustomImagePreview(null);
    setCustomImageName('');
    setIsOcrProcessing(true);
    setOcrStatusText(`Extracting visual glyphs & text assertions from ${sample.name}...`);

    setTimeout(() => {
      const ocr = extractOcrFromImageData({ customText: sample.text, fileName: sample.name });
      setOcrResult(ocr);
      const pred = globalPacClassifier.predict(sample.text, sample.headline, {
        fontInconsistencyScore: sample.fontInconsistency,
        compressionArtifactsDetected: sample.tamperingDetected,
        tamperingDetected: sample.tamperingDetected,
        inputType: 'Image',
      });
      setImagePrediction(pred);
      setIsOcrProcessing(false);
      setOcrStatusText('');
    }, 80);
  };

  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsOcrProcessing(true);
    setCustomImageName(file.name);
    setOcrStatusText('Running neural OCR engine on uploaded image...');

    const reader = new FileReader();
    reader.onload = async (event) => {
      const dataUrl = event.target?.result as string;
      setCustomImagePreview(dataUrl);

      try {
        setOcrStatusText('Extracting text characters and headline layout via OCR...');
        const { ocrResult: ocr, pacPrediction: pred } = await performDeepOcrExtraction(
          dataUrl,
          file.name,
          (msg) => setOcrStatusText(msg)
        );

        setOcrResult(ocr);
        setImagePrediction(pred);
        showToast(
          `OCR successfully extracted ${ocr.wordCount} words: Predicted ${pred.label} (${pred.truthScore}% truth index).`,
          'success'
        );
      } catch (err: any) {
        console.warn('OCR extraction error, falling back to local matrix:', err);
        const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
        const ocr = extractOcrFromImageData({ fileName: file.name, dataUrl, width: 800, height: 500 });
        setOcrResult(ocr);

        const pred = globalPacClassifier.predict(ocr.fullText, cleanName, {
          fontInconsistencyScore: ocr.fontInconsistencyScore,
          compressionArtifactsDetected: ocr.compressionArtifactsDetected,
          tamperingDetected: ocr.fontInconsistencyScore > 0.45,
          inputType: 'Image',
        });
        setImagePrediction(pred);
        showToast(`Image scanned with OCR glyph matrix (${ocr.wordCount} words recognized).`, 'success');
      } finally {
        setIsOcrProcessing(false);
        setOcrStatusText('');
      }
    };
    reader.readAsDataURL(file);
  };

  // Handlers for Document Mode
  const handleSelectDocSample = (sample: CuratedDocumentSample) => {
    setSelectedDocSample(sample);
    setIsDocParsing(true);

    setTimeout(() => {
      setActiveDocument({
        fileName: sample.fileName,
        fileSize: sample.fileSizeKb * 1024,
        fileType: sample.fileType,
        title: sample.title,
        text: sample.text,
        wordCount: sample.text.split(/\s+/).length,
        characterCount: sample.text.length,
        paragraphs: [sample.text],
        institutionalAuthorityFound: sample.institutionalAuthority,
        citationCount: sample.citations,
        authorityMarkers: sample.institutionalAuthority ? ['clinical trial', 'peer-reviewed'] : [],
        documentCategory: sample.category,
      });

      const pred = globalPacClassifier.predict(sample.text, sample.title, {
        institutionalAuthorityFound: sample.institutionalAuthority,
        citationCount: sample.citations,
        inputType: 'Document',
      });
      setDocPrediction(pred);
      setIsDocParsing(false);
    }, 60);
  };

  const handleDocumentFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsDocParsing(true);
    try {
      const extracted = await parseDocumentFile(file);
      setActiveDocument(extracted);

      const pred = globalPacClassifier.predict(extracted.text, extracted.title, {
        institutionalAuthorityFound: extracted.institutionalAuthorityFound,
        citationCount: extracted.citationCount,
        inputType: 'Document',
      });
      setDocPrediction(pred);
      showToast(`Document "${file.name}" parsed (${extracted.wordCount} words, ${extracted.citationCount} citations).`, 'success');
    } catch {
      showToast('Could not parse document file.', 'error');
    } finally {
      setIsDocParsing(false);
    }
  };

  const handleLaunchDeepDossier = (title: string, content: string) => {
    runAnalysis({
      title,
      content,
      inputType: activeMode === 'image' ? 'Image' : activeMode === 'document' ? 'Document' : 'Article',
      depth: 'Deep Forensic',
    });
  };

  // Active prediction based on current mode
  const currentPrediction =
    activeMode === 'text'
      ? textPrediction
      : activeMode === 'image'
      ? imagePrediction
      : docPrediction;

  const currentTitle =
    activeMode === 'text'
      ? titleInput
      : activeMode === 'image'
      ? customImageName || selectedImageSample.headline
      : activeDocument.title;

  const currentContent =
    activeMode === 'text'
      ? textInput
      : activeMode === 'image'
      ? ocrResult.fullText
      : activeDocument.text;

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
              <Cpu className="w-3.5 h-3.5" />
              Pure PAC Model Engine
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
              TF-IDF + PA-II Hinge Loss
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            AI Fake News Detector
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Deterministic fake news and misinformation detection across Articles, Image OCR Clippings, and Uploaded Documents.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleLaunchDeepDossier(currentTitle, currentContent)}
            disabled={isAnalyzing}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-semibold flex items-center gap-2 shadow-md shadow-blue-500/20 transition-all cursor-pointer"
          >
            {isAnalyzing ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Sparkles className="w-3.5 h-3.5" />
            )}
            <span>Generate Full Dossier</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Mode Switcher Tabs */}
      <div className="flex items-center gap-2 p-1.5 rounded-xl bg-slate-100 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 w-full sm:w-fit">
        <button
          onClick={() => setActiveMode('text')}
          className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeMode === 'text'
              ? 'bg-white dark:bg-[#0c121e] text-blue-600 dark:text-blue-400 shadow-sm border border-slate-200 dark:border-slate-700'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Article & Text Mode</span>
        </button>

        <button
          onClick={() => setActiveMode('image')}
          className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeMode === 'image'
              ? 'bg-white dark:bg-[#0c121e] text-blue-600 dark:text-blue-400 shadow-sm border border-slate-200 dark:border-slate-700'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          <span>Image OCR Scanner</span>
        </button>

        <button
          onClick={() => setActiveMode('document')}
          className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeMode === 'document'
              ? 'bg-white dark:bg-[#0c121e] text-blue-600 dark:text-blue-400 shadow-sm border border-slate-200 dark:border-slate-700'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <FileCode className="w-4 h-4" />
          <span>Document Reader (PDF / DOCX / TXT)</span>
        </button>
      </div>

      {/* Main Mode Workstation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Mode Specific Inputs (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* ======================================================== */}
          {/* MODE 1: ARTICLE & TEXT                                   */}
          {/* ======================================================== */}
          {activeMode === 'text' && (
            <div className="p-5 rounded-2xl bg-white dark:bg-[#0c121e] border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-500" />
                  <span>Article & Headline Input</span>
                </h2>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(`${titleInput}\n\n${textInput}`);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                      showToast('Copied content to clipboard', 'info');
                    }}
                    className="p-1.5 text-slate-400 hover:text-slate-200 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    onClick={() => {
                      setTitleInput('');
                      setTextInput('');
                    }}
                    className="text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 px-2 py-1 rounded border border-slate-200 dark:border-slate-800 transition-colors"
                  >
                    Clear
                  </button>
                </div>
              </div>

              {/* Sample Presets */}
              <div>
                <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-blue-500" />
                  <span>Verified Test Corpus Presets:</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {textTestSamples.map((sample, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSelectTextSample(sample)}
                      className="text-left px-2.5 py-1.5 rounded-lg border text-xs font-medium bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:border-blue-500/50 hover:bg-blue-500/5 transition-all truncate cursor-pointer"
                    >
                      <span className="font-semibold text-slate-800 dark:text-slate-200 block truncate">
                        {sample.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Inputs */}
              <div className="space-y-3 pt-1">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                    Headline / Statement Title
                  </label>
                  <input
                    type="text"
                    placeholder="Enter headline..."
                    value={titleInput}
                    onChange={(e) => setTitleInput(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:border-blue-500 transition-colors font-medium"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                    Full Article Content / Quotes
                  </label>
                  <textarea
                    rows={8}
                    placeholder="Paste article body text, quotes, or statements here..."
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:border-blue-500 transition-colors resize-y font-sans leading-relaxed"
                  />
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-slate-400 font-mono">
                    {textInput.length} chars • {textInput.split(/\s+/).filter(Boolean).length} words
                  </span>

                  <button
                    onClick={() => handleEvaluateText()}
                    disabled={isTextEvaluating || (!textInput.trim() && !titleInput.trim())}
                    className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-bold flex items-center gap-2 shadow-sm transition-all cursor-pointer"
                  >
                    {isTextEvaluating ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Zap className="w-3.5 h-3.5 text-yellow-300" />
                    )}
                    <span>Run PAC Evaluation</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* MODE 2: IMAGE OCR SCANNER                                */}
          {/* ======================================================== */}
          {activeMode === 'image' && (
            <div className="p-5 rounded-2xl bg-white dark:bg-[#0c121e] border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-blue-500" />
                  <span>Image OCR Scanner & Forensics</span>
                </h2>

                <button
                  onClick={() => imageInputRef.current?.click()}
                  className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Image</span>
                </button>
              </div>

              <input
                ref={imageInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageFileUpload}
                className="hidden"
              />

              {/* Curated Sample Images */}
              <div>
                <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-blue-500" />
                  <span>Or Select Curated Image Sample:</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {CURATED_IMAGE_SAMPLES.map((sample) => (
                    <button
                      key={sample.id}
                      onClick={() => handleSelectImageSample(sample)}
                      className={`text-left px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-all truncate cursor-pointer ${
                        selectedImageSample.id === sample.id && !customImagePreview
                          ? 'bg-blue-500/10 border-blue-500 text-blue-600 dark:text-blue-400 font-bold'
                          : 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <span className="truncate block">{sample.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Visual Image & OCR Canvas Representation */}
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-white space-y-3 relative overflow-hidden">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-1.5 font-mono text-[11px]">
                    <Scan className="w-3.5 h-3.5 text-cyan-400" />
                    <span>OCR Glyph Matrix: {ocrResult.recognizedWords.length} words recognized</span>
                  </span>
                  <span className="font-mono text-cyan-400">
                    Confidence: {(ocrResult.averageConfidence * 100).toFixed(1)}%
                  </span>
                </div>

                {/* Simulated Image Scan Banner / User Image Preview with Scanline Overlay */}
                <div className="relative rounded-lg bg-slate-950 p-4 border border-slate-800 overflow-hidden min-h-[170px] flex flex-col justify-center">
                  {/* OCR Active Scanning Overlay */}
                  {isOcrProcessing && (
                    <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-xs flex flex-col items-center justify-center z-20 gap-2.5">
                      <div className="w-8 h-8 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
                      <div className="text-center px-4">
                        <span className="text-xs font-mono text-cyan-300 font-bold block animate-pulse">
                          {ocrStatusText || 'Running Neural OCR Engine on Image...'}
                        </span>
                        <span className="text-[11px] text-slate-400 font-mono mt-0.5 block">
                          Extracting text lines & passing directly to Passive-Aggressive Classifier
                        </span>
                      </div>
                    </div>
                  )}

                  {customImagePreview ? (
                    <div className="flex flex-col items-center gap-2">
                      <img
                        src={customImagePreview}
                        alt="Uploaded preview"
                        className="max-h-48 rounded object-contain border border-slate-800"
                      />
                      <span className="text-[11px] text-slate-400 font-mono">{customImageName}</span>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase font-mono bg-blue-500/20 text-blue-400 border border-blue-500/30">
                        {selectedImageSample.category}
                      </div>
                      <div className="text-sm sm:text-base font-bold text-white font-sans leading-snug">
                        "{selectedImageSample.headline}"
                      </div>
                      <div className="text-xs text-slate-400 line-clamp-3">
                        {selectedImageSample.text}
                      </div>
                    </div>
                  )}

                  {/* OCR Bounding Box Overlay Badges */}
                  <div className="pt-3 flex flex-wrap gap-1">
                    {ocrResult.recognizedWords.slice(0, 12).map((w, idx) => (
                      <span
                        key={idx}
                        className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-cyan-950/60 border border-cyan-500/40 text-cyan-300"
                      >
                        [{w.text}]
                      </span>
                    ))}
                  </div>
                </div>

                {/* OCR & Font Tampering Diagnostics */}
                <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-[10px] uppercase text-slate-400 block">
                      Font Inconsistency Risk
                    </span>
                    <span
                      className={`text-sm font-bold font-mono ${
                        ocrResult.fontInconsistencyScore > 0.5 ? 'text-rose-400' : 'text-emerald-400'
                      }`}
                    >
                      {(ocrResult.fontInconsistencyScore * 100).toFixed(1)}%
                    </span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-[10px] uppercase text-slate-400 block">
                      Compression Artifacts
                    </span>
                    <span className="text-sm font-bold font-mono text-cyan-400">
                      {ocrResult.compressionArtifactsDetected ? 'Detected (Pasted Layer)' : 'Organic Sensor Matrix'}
                    </span>
                  </div>
                </div>
              </div>

              {/* OCR to PAC Pipeline Status Strip */}
              <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-blue-500 shrink-0" />
                  <span className="text-slate-700 dark:text-slate-300">
                    <strong>OCR Pipeline Active:</strong> Text extracted from image is evaluated by the PA-II Classifier as <strong className={imagePrediction.label === 'FAKE' ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}>{imagePrediction.label}</strong> ({imagePrediction.truthScore}% truth score).
                  </span>
                </div>
                <button
                  onClick={() => {
                    const pred = globalPacClassifier.predict(ocrResult.fullText, ocrResult.headline, {
                      fontInconsistencyScore: ocrResult.fontInconsistencyScore,
                      compressionArtifactsDetected: ocrResult.compressionArtifactsDetected,
                      tamperingDetected: ocrResult.fontInconsistencyScore > 0.45,
                      inputType: 'Image',
                    });
                    setImagePrediction(pred);
                    showToast('Re-evaluated extracted OCR text with PAC classifier.', 'info');
                  }}
                  className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-[11px] shrink-0 transition-colors cursor-pointer self-start sm:self-auto"
                >
                  Re-evaluate PAC
                </button>
              </div>

              {/* Extracted Text Area */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    OCR Extracted Text (Directly evaluated by PAC Classifier)
                  </label>
                  <span className="text-[11px] font-mono text-slate-400">
                    {ocrResult.characterCount} chars • {ocrResult.wordCount} words
                  </span>
                </div>
                <textarea
                  rows={4}
                  value={ocrResult.fullText}
                  onChange={(e) => {
                    const txt = e.target.value;
                    setOcrResult((prev) => ({
                      ...prev,
                      fullText: txt,
                      characterCount: txt.length,
                      wordCount: txt.split(/\s+/).filter(Boolean).length,
                    }));
                    const pred = globalPacClassifier.predict(txt, undefined, {
                      fontInconsistencyScore: ocrResult.fontInconsistencyScore,
                      compressionArtifactsDetected: ocrResult.compressionArtifactsDetected,
                      tamperingDetected: ocrResult.fontInconsistencyScore > 0.45,
                      inputType: 'Image',
                    });
                    setImagePrediction(pred);
                  }}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white font-mono leading-relaxed"
                  placeholder="Extracted text from image will appear here..."
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  💡 You can edit or refine any word above — the Passive-Aggressive Model updates the Fake/Real verdict in real time (&lt;4ms).
                </p>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* MODE 3: DOCUMENT READER                                  */}
          {/* ======================================================== */}
          {activeMode === 'document' && (
            <div className="p-5 rounded-2xl bg-white dark:bg-[#0c121e] border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <FileCode className="w-4 h-4 text-blue-500" />
                  <span>Document Parser & Text Extraction</span>
                </h2>

                <button
                  onClick={() => docInputRef.current?.click()}
                  className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Document</span>
                </button>
              </div>

              <input
                ref={docInputRef}
                type="file"
                accept=".pdf,.docx,.txt,.md,.csv,.json"
                onChange={handleDocumentFileUpload}
                className="hidden"
              />

              {/* Curated Document Samples */}
              <div>
                <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-blue-500" />
                  <span>Or Select Curated Document Sample:</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {CURATED_DOCUMENT_SAMPLES.map((sample) => (
                    <button
                      key={sample.id}
                      onClick={() => handleSelectDocSample(sample)}
                      className={`text-left px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-all truncate cursor-pointer ${
                        selectedDocSample.id === sample.id && activeDocument.fileName === sample.fileName
                          ? 'bg-blue-500/10 border-blue-500 text-blue-600 dark:text-blue-400 font-bold'
                          : 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <span className="truncate block">{sample.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Document Metadata & Forensic Credibility Card */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                      {activeDocument.fileType}
                    </span>
                    <span className="font-semibold text-slate-900 dark:text-white truncate max-w-[240px]">
                      {activeDocument.fileName}
                    </span>
                  </div>

                  <span className="text-[11px] font-mono text-slate-400">
                    {(activeDocument.fileSize / 1024).toFixed(1)} KB • {activeDocument.wordCount} words
                  </span>
                </div>

                <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Title: {activeDocument.title}
                </div>

                {/* Credibility Forensics Bar */}
                <div className="pt-2 border-t border-slate-200 dark:border-slate-800/80 flex flex-wrap items-center gap-2 text-[11px]">
                  <span className={`px-2 py-0.5 rounded-full font-semibold flex items-center gap-1 ${
                    activeDocument.institutionalAuthorityFound
                      ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800'
                      : 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 border border-rose-300 dark:border-rose-800'
                  }`}>
                    {activeDocument.institutionalAuthorityFound ? (
                      <>
                        <ShieldCheck className="w-3 h-3" />
                        <span>Peer-Reviewed / Institutional Authority</span>
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="w-3 h-3" />
                        <span>Zero Institutional Verification</span>
                      </>
                    )}
                  </span>

                  <span className="px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono">
                    {activeDocument.citationCount} Citations Detected
                  </span>

                  <span className="px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                    {activeDocument.documentCategory}
                  </span>
                </div>
              </div>

              {/* Extracted Document Text */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                  Extracted Document Text (Passed directly to PAC Classifier)
                </label>
                <textarea
                  rows={7}
                  value={activeDocument.text}
                  onChange={(e) => {
                    const txt = e.target.value;
                    setActiveDocument((prev) => ({
                      ...prev,
                      text: txt,
                      wordCount: txt.split(/\s+/).filter(Boolean).length,
                    }));
                    const pred = globalPacClassifier.predict(txt, activeDocument.title, {
                      institutionalAuthorityFound: activeDocument.institutionalAuthorityFound,
                      citationCount: activeDocument.citationCount,
                      inputType: 'Document',
                    });
                    setDocPrediction(pred);
                  }}
                  className="w-full px-3 py-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white font-sans leading-relaxed"
                />
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Unified PAC Mathematical Results (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div
            key={`${activeMode}-${currentPrediction.label}-${currentPrediction.marginScore}`}
            className={`p-5 rounded-2xl border shadow-sm space-y-4 transition-all duration-200 ${
              currentPrediction.label === 'FAKE'
                ? 'bg-rose-50/70 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/60'
                : 'bg-emerald-50/70 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/60'
            }`}
          >
            {/* Verdict Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800/80">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center text-white shadow-md ${
                      currentPrediction.label === 'FAKE' ? 'bg-rose-600' : 'bg-emerald-600'
                    }`}
                  >
                    {currentPrediction.label === 'FAKE' ? (
                      <AlertTriangle className="w-5 h-5 stroke-[2.5]" />
                    ) : (
                      <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
                    )}
                  </div>
                  <div>
                    <span
                      className={`text-sm font-extrabold uppercase tracking-wide block ${
                        currentPrediction.label === 'FAKE'
                          ? 'text-rose-700 dark:text-rose-400'
                          : 'text-emerald-700 dark:text-emerald-400'
                      }`}
                    >
                      {currentPrediction.label === 'FAKE' ? 'Classified as Fake' : 'Classified as Real'}
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      Evaluated via PA-II Classifier
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-[10px] uppercase font-semibold text-slate-400">
                    Truth Score
                  </div>
                  <div
                    className={`text-2xl font-black font-mono ${
                      currentPrediction.truthScore >= 70
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : currentPrediction.truthScore >= 40
                        ? 'text-amber-600 dark:text-amber-400'
                        : 'text-rose-600 dark:text-rose-400'
                    }`}
                  >
                    {currentPrediction.truthScore}%
                  </div>
                </div>
              </div>

              {/* Multimodal Forensic Diagnostic Strip */}
              <div className="px-3 py-2 rounded-lg bg-black/10 dark:bg-white/5 border border-black/5 dark:border-white/10 text-xs space-y-1">
                <div className="text-[10px] uppercase tracking-wider font-bold text-slate-500 dark:text-slate-400 flex items-center justify-between">
                  <span>Modality Signal Integration:</span>
                  <span className="font-mono text-blue-500 font-semibold">{activeMode.toUpperCase()}</span>
                </div>
                {activeMode === 'image' && (
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-600 dark:text-slate-300">
                      Font Tampering: <strong className={ocrResult.fontInconsistencyScore > 0.4 ? 'text-rose-500' : 'text-emerald-500'}>{(ocrResult.fontInconsistencyScore * 100).toFixed(0)}%</strong>
                    </span>
                    <span className="text-slate-600 dark:text-slate-300">
                      Artifacts: <strong>{ocrResult.compressionArtifactsDetected ? 'Detected' : 'Organic'}</strong>
                    </span>
                  </div>
                )}
                {activeMode === 'document' && (
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-600 dark:text-slate-300">
                      Authority: <strong className={activeDocument.institutionalAuthorityFound ? 'text-emerald-500' : 'text-rose-500'}>{activeDocument.institutionalAuthorityFound ? 'Verified' : 'Unsubstantiated'}</strong>
                    </span>
                    <span className="text-slate-600 dark:text-slate-300">
                      Citations: <strong>{activeDocument.citationCount}</strong>
                    </span>
                  </div>
                )}
                {activeMode === 'text' && (
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-600 dark:text-slate-300">
                      Lexical Model: <strong>TF-IDF N-Gram Vectorizer</strong>
                    </span>
                    <span className="text-slate-600 dark:text-slate-300">
                      Loss: <strong>Hinge Margin PA-II</strong>
                    </span>
                  </div>
                )}
              </div>

              {/* Progress Bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400">
                  <span>Confidence: {currentPrediction.confidence}%</span>
                  <span>Margin: {currentPrediction.marginScore}</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      currentPrediction.label === 'FAKE' ? 'bg-rose-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${currentPrediction.confidence}%` }}
                  />
                </div>
              </div>

              {/* Feature Attributions (+ / - weights) */}
              <div className="space-y-3 pt-2">
                <div>
                  <div className="text-[11px] font-bold text-rose-700 dark:text-rose-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    <span>Deception Triggers (+ Learned Weights):</span>
                  </div>
                  {currentPrediction.contributingFakeTokens.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {currentPrediction.contributingFakeTokens.map((t, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded text-[11px] bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-900/60 font-mono"
                        >
                          {t.token} <span className="opacity-75">+{t.weight.toFixed(2)}</span>
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-[11px] text-slate-500 italic">
                      Zero high-risk deception markers detected.
                    </span>
                  )}
                </div>

                <div>
                  <div className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Verified Journalistic Anchors (- Weights):</span>
                  </div>
                  {currentPrediction.contributingRealTokens.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {currentPrediction.contributingRealTokens.map((t, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded text-[11px] bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-900/60 font-mono"
                        >
                          {t.token} <span className="opacity-75">-{t.weight.toFixed(2)}</span>
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-[11px] text-slate-500 italic">
                      Standard neutral reporting lexicon.
                    </span>
                  )}
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2">
                <button
                  onClick={() => handleLaunchDeepDossier(currentTitle, currentContent)}
                  className="w-full py-2.5 px-3 rounded-lg bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <span>Open Deep Forensic Report</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
        </div>
      </div>
    </div>
  );
};
