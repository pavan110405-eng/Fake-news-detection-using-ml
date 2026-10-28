// Real Browser Document Parser for TXT, MD, CSV, JSON, PDF, and DOCX files
// Extracts clean, normalized text runs and institutional credibility markers for direct PAC evaluation

export interface ExtractedDocument {
  fileName: string;
  fileSize: number;
  fileType: string;
  title: string;
  text: string;
  wordCount: number;
  characterCount: number;
  paragraphs: string[];
  institutionalAuthorityFound: boolean;
  citationCount: number;
  authorityMarkers: string[];
  documentCategory: string;
}

export interface CuratedDocumentSample {
  id: string;
  fileName: string;
  fileType: 'PDF' | 'DOCX' | 'TXT';
  fileSizeKb: number;
  label: string;
  type: 'fake' | 'real';
  title: string;
  text: string;
  category: string;
  institutionalAuthority: boolean;
  citations: number;
}

export const CURATED_DOCUMENT_SAMPLES: CuratedDocumentSample[] = [
  {
    id: 'doc-fake-1',
    fileName: 'CLASSIFIED_MEMO_WATER_NANO_2026.pdf',
    fileType: 'PDF',
    fileSizeKb: 342,
    label: '🔴 Leaked Memo: Water Supply Microchips',
    type: 'fake',
    category: 'Conspiracy / Surveillance Hoax',
    title: 'Classified memo confirms mandatory digital microchips placed in municipal water',
    text: 'A classified document purportedly leaked from a secret global elite summit proves authorities are putting microscopic nano-trackers in municipal water supplies this Friday to control human brainwaves. Whistleblower reveals chilling agenda and warns citizens to boil water immediately before censorship.',
    institutionalAuthority: false,
    citations: 0,
  },
  {
    id: 'doc-fake-2',
    fileName: 'UNDERGROUND_CURE_DISCLOSURE.docx',
    fileType: 'DOCX',
    fileSizeKb: 184,
    label: '🔴 Medical Leak: Miracle Cancer Cure',
    type: 'fake',
    category: 'Biomedical Panacea Fraud',
    title: 'Secret underground doctors reveal miracle lemon mixture cures all cancers in 24 hours',
    text: 'A team of underground doctors revealed a secret lemon and baking soda mixture that cures all cancers, diabetes, and viral infections in 24 hours. The pharmaceutical cartel is hiding this miraculous breakthrough to protect chemotherapy profits. Share immediately before it gets taken down by mainstream media.',
    institutionalAuthority: false,
    citations: 0,
  },
  {
    id: 'doc-fake-3',
    fileName: 'TREASURY_EMERGENCY_DIRECTIVE_LEAK.txt',
    fileType: 'TXT',
    fileSizeKb: 92,
    label: '🔴 Financial Panic: Private Bank Account Seizure',
    type: 'fake',
    category: 'Macroeconomic Panic Hoax',
    title: 'Emergency decree leaked from anonymous treasury insider confirms imminent confiscation of all bank accounts',
    text: 'Urgent unverified decree circulating on private channels claims treasury authorities will seize all private savings accounts above one thousand dollars at midnight tonight and convert balances to government debt vouchers. Financial advisors urge immediate physical currency withdrawal before bank holidays are declared.',
    institutionalAuthority: false,
    citations: 0,
  },
  {
    id: 'doc-real-1',
    fileName: 'NEJM_Melanoma_Phase3_Trial_Adjuvant.pdf',
    fileType: 'PDF',
    fileSizeKb: 890,
    label: '🟢 Clinical Trial: NEJM Oncology Study',
    type: 'real',
    category: 'Peer-Reviewed Clinical Medicine',
    title: 'Clinical trial shows targeted immunotherapy reduces melanoma recurrence in randomized study',
    text: 'Results from a randomized Phase 3 clinical trial published in the New England Journal of Medicine showed a significant reduction in cancer recurrence among patients receiving adjuvant targeted antibody therapy compared with observation. The study tracked 800 patients across 45 academic medical centers with verified statistical power (p < 0.001).',
    institutionalAuthority: true,
    citations: 34,
  },
  {
    id: 'doc-real-2',
    fileName: 'FEDERAL_RESERVE_FOMC_POLICY_RELEASE.txt',
    fileType: 'TXT',
    fileSizeKb: 68,
    label: '🟢 Official Release: Fed Monetary Policy',
    type: 'real',
    category: 'Macroeconomic Policy Statement',
    title: 'Federal Reserve maintains benchmark interest rate after scheduled policy meeting',
    text: 'The Federal Open Market Committee decided to hold its benchmark interest rate unchanged following a scheduled two-day monetary policy meeting. Fed Chair noted that while inflation has eased from peak levels, the committee remains committed to monitoring labor market data and economic indicators before adjusting monetary policy.',
    institutionalAuthority: true,
    citations: 12,
  },
  {
    id: 'doc-real-3',
    fileName: 'DOE_NATIONAL_GRID_RELIABILITY_AUDIT.docx',
    fileType: 'DOCX',
    fileSizeKb: 450,
    label: '🟢 Government Audit: Energy Grid Assessment',
    type: 'real',
    category: 'Official Engineering Audit',
    title: 'Department of Energy publishes national electrical grid resilience assessment for 2026',
    text: 'The United States Department of Energy released an audited technical assessment confirming that regional transmission interconnects maintained 99.98% operational reliability across peak weather fluctuations. The audit evaluated battery storage integration, thermal generation reserves, and high-voltage transmission upgrades across all independent system operators.',
    institutionalAuthority: true,
    citations: 28,
  },
];

const CREDIBILITY_PATTERNS = [
  'published in',
  'clinical trial',
  'peer-reviewed',
  'randomized',
  'statistical',
  'department of',
  'federal reserve',
  'world health organization',
  'university',
  'methodology',
  'journal of',
  'reuters',
  'associated press',
  'doi:',
  'sample size',
  'confidence interval',
];

/**
 * Parses user-uploaded file and extracts clean textual content with credibility forensics
 */
export async function parseDocumentFile(file: File): Promise<ExtractedDocument> {
  const fileName = file.name;
  const fileSize = file.size;
  const extension = fileName.split('.').pop()?.toUpperCase() || 'DOCUMENT';

  let rawText = '';

  if (
    fileName.endsWith('.txt') ||
    fileName.endsWith('.md') ||
    fileName.endsWith('.csv') ||
    fileName.endsWith('.json') ||
    file.type.includes('text')
  ) {
    rawText = await file.text();
  } else if (fileName.endsWith('.docx')) {
    // DOCX XML Extraction: Search for <w:t> tags
    try {
      const buffer = await file.arrayBuffer();
      const bytes = new Uint8Array(buffer);
      const decodedString = new TextDecoder('utf-8', { fatal: false }).decode(bytes);

      const xmlTextMatches = decodedString.match(/<w:t[^>]*>([^<]+)<\/w:t>/g);
      if (xmlTextMatches && xmlTextMatches.length > 0) {
        rawText = xmlTextMatches
          .map((tag) => tag.replace(/<[^>]+>/g, '').trim())
          .filter(Boolean)
          .join(' ');
      } else {
        const readableMatches = decodedString.match(/[A-Za-z0-9.,!?;:'"()\- ]{10,}/g);
        rawText = readableMatches ? readableMatches.join(' ') : decodedString;
      }
    } catch {
      rawText = `Document: ${fileName}`;
    }
  } else if (fileName.endsWith('.pdf')) {
    // PDF Stream Extraction: Extract text from Tj / TJ operators and streams
    try {
      const buffer = await file.arrayBuffer();
      const bytes = new Uint8Array(buffer);
      const decodedString = new TextDecoder('latin1').decode(bytes);

      const textChunks: string[] = [];
      const tjMatches = decodedString.match(/\((.*?)\)\s*Tj/g);
      if (tjMatches && tjMatches.length > 0) {
        tjMatches.forEach((m) => {
          const inner = m.replace(/^\(/, '').replace(/\)\s*Tj$/, '').trim();
          if (inner.length > 2) textChunks.push(inner);
        });
      }

      if (textChunks.length > 0) {
        rawText = textChunks.join(' ');
      } else {
        const readableRuns = decodedString.match(/[A-Za-z0-9.,!?;:'"()\- ]{15,}/g);
        rawText = readableRuns ? readableRuns.join(' ') : decodedString;
      }
    } catch {
      rawText = `Document: ${fileName}`;
    }
  } else {
    try {
      const buffer = await file.arrayBuffer();
      const bytes = new Uint8Array(buffer);
      const decodedString = new TextDecoder('utf-8', { fatal: false }).decode(bytes);
      const matches = decodedString.match(/[a-zA-Z0-9.,!?'"()\-:;\s]{12,}/g);
      rawText = matches ? matches.join('\n\n') : decodedString;
    } catch {
      rawText = `Document: ${fileName}`;
    }
  }

  // Clean extracted text
  const cleanText = rawText
    .replace(/[\r\t]+/g, ' ')
    .replace(/[^\x20-\x7E\n]/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim();

  const words = cleanText.split(/\s+/).filter(Boolean);
  const paragraphs = cleanText
    .split(/\n{2,}|\.\s{2,}/)
    .map((p) => p.trim())
    .filter((p) => p.length > 25);

  const lower = cleanText.toLowerCase();
  const matchedMarkers: string[] = [];
  CREDIBILITY_PATTERNS.forEach((p) => {
    if (lower.includes(p)) matchedMarkers.push(p);
  });

  const institutionalAuthorityFound = matchedMarkers.length >= 2;
  const citationCount = (cleanText.match(/\[\d+\]|\(\d{4}\)|et al\.|doi:/gi) || []).length;

  const title = fileName.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
  let documentCategory = 'Standard Analytical Document';
  if (/trial|clinical|medicine|nejm|lancet/i.test(fileName)) documentCategory = 'Clinical Trial / Medical Journal';
  else if (/fed|treasury|fomc|bank|monetary/i.test(fileName)) documentCategory = 'Central Bank / Economic Release';
  else if (/memo|classified|secret|leak/i.test(fileName)) documentCategory = 'Classified Memo / Whistleblower Claim';

  return {
    fileName,
    fileSize,
    fileType: extension,
    title,
    text: cleanText.length > 20 ? cleanText : `${title}: Document uploaded for PAC verification analysis.`,
    wordCount: words.length,
    characterCount: cleanText.length,
    paragraphs: paragraphs.length > 0 ? paragraphs : [cleanText],
    institutionalAuthorityFound,
    citationCount,
    authorityMarkers: matchedMarkers,
    documentCategory,
  };
}
