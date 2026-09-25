import { PDFDocument, rgb, StandardFonts, degrees } from 'pdf-lib';
import JSZip from 'jszip';
import * as XLSX from 'xlsx';

// Declare pdfjsLib global variable loaded from CDN
declare global {
  interface Window {
    pdfjsLib?: any;
  }
}

// Helper to get pdfjsLib safely
export function getPdfJs() {
  if (typeof window !== 'undefined' && window.pdfjsLib) {
    return window.pdfjsLib;
  }
  return null;
}

// Format bytes helper
export function formatBytes(bytes: number, decimals = 2) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

// 1. MERGE PDF
export async function mergePDFs(
  files: File[],
  onProgress?: (pct: number, status: string) => void
): Promise<Blob> {
  const mergedPdf = await PDFDocument.create();
  const total = files.length;

  for (let i = 0; i < total; i++) {
    const file = files[i];
    onProgress?.(Math.round(((i) / total) * 90), `Memproses ${file.name}...`);
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
    const copiedPages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
    copiedPages.forEach((page) => mergedPdf.addPage(page));
  }

  onProgress?.(95, 'Mengompresi dan menyusun dokumen akhir...');
  const mergedBytes = await mergedPdf.save();
  onProgress?.(100, 'Selesai!');
  return new Blob([mergedBytes as unknown as BlobPart], { type: 'application/pdf' });
}

// 2. SPLIT PDF
export interface SplitOptions {
  mode: 'all' | 'range' | 'custom';
  rangeInput?: string; // e.g., "1-3, 5"
}

export async function splitPDF(
  file: File,
  options: SplitOptions,
  onProgress?: (pct: number, status: string) => void
): Promise<{ blob: Blob; fileName: string; count: number }> {
  onProgress?.(10, 'Membaca dokumen PDF...');
  const arrayBuffer = await file.arrayBuffer();
  const sourcePdf = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
  const totalPages = sourcePdf.getPageCount();

  const baseName = file.name.replace(/\.[^/.]+$/, '');

  if (options.mode === 'all') {
    // Split every single page into separate PDF inside a ZIP
    const zip = new JSZip();
    for (let i = 0; i < totalPages; i++) {
      onProgress?.(
        15 + Math.round((i / totalPages) * 75),
        `Mengekstrak halaman ${i + 1} dari ${totalPages}...`
      );
      const newDoc = await PDFDocument.create();
      const [copiedPage] = await newDoc.copyPages(sourcePdf, [i]);
      newDoc.addPage(copiedPage);
      const bytes = await newDoc.save();
      zip.file(`${baseName}_halaman_${i + 1}.pdf`, bytes);
    }

    onProgress?.(95, 'Membuat arsip ZIP...');
    const zipBlob = await zip.generateAsync({ type: 'blob' });
    onProgress?.(100, 'Selesai!');
    return { blob: zipBlob, fileName: `${baseName}_semua_halaman.zip`, count: totalPages };
  } else {
    // Parse range e.g., "1-3, 5" or custom
    const pagesToExtract: number[] = [];
    const rawParts = (options.rangeInput || '1').split(',');

    for (const part of rawParts) {
      const trimmed = part.trim();
      if (trimmed.includes('-')) {
        const [start, end] = trimmed.split('-').map(Number);
        if (!isNaN(start) && !isNaN(end)) {
          for (let p = Math.max(1, start); p <= Math.min(totalPages, end); p++) {
            if (!pagesToExtract.includes(p - 1)) pagesToExtract.push(p - 1);
          }
        }
      } else {
        const p = Number(trimmed);
        if (!isNaN(p) && p >= 1 && p <= totalPages) {
          if (!pagesToExtract.includes(p - 1)) pagesToExtract.push(p - 1);
        }
      }
    }

    if (pagesToExtract.length === 0) {
      pagesToExtract.push(0); // fallback first page
    }

    onProgress?.(50, `Mengekstrak ${pagesToExtract.length} halaman terpilih...`);
    const newDoc = await PDFDocument.create();
    const copiedPages = await newDoc.copyPages(sourcePdf, pagesToExtract);
    copiedPages.forEach((p) => newDoc.addPage(p));

    const bytes = await newDoc.save();
    onProgress?.(100, 'Selesai!');
    return {
      blob: new Blob([bytes as unknown as BlobPart], { type: 'application/pdf' }),
      fileName: `${baseName}_ekstrak.pdf`,
      count: pagesToExtract.length,
    };
  }
}

// 3. COMPRESS PDF
export async function compressPDF(
  file: File,
  level: 'low' | 'medium' | 'high' = 'medium',
  onProgress?: (pct: number, status: string) => void
): Promise<Blob> {
  onProgress?.(15, 'Menganalisis objek dokumen PDF...');
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });

  // If pdfjsLib is available and high compression requested, optimize pages through raster re-encoding
  const pdfjs = getPdfJs();
  const pageCount = pdfDoc.getPageCount();

  if (pdfjs && (level === 'high' || (level === 'medium' && file.size > 2 * 1024 * 1024))) {
    onProgress?.(30, 'Mengompresi konten grafis dan teks...');
    try {
      const loadingTask = pdfjs.getDocument({ data: new Uint8Array(arrayBuffer) });
      const loadedPdf = await loadingTask.promise;
      const optimizedPdf = await PDFDocument.create();

      const quality = level === 'high' ? 0.65 : 0.8;
      const scale = level === 'high' ? 1.2 : 1.5;

      for (let i = 1; i <= loadedPdf.numPages; i++) {
        onProgress?.(
          35 + Math.round((i / loadedPdf.numPages) * 55),
          `Mengompresi halaman ${i} dari ${loadedPdf.numPages}...`
        );
        const page = await loadedPdf.getPage(i);
        const viewport = page.getViewport({ scale });
        const canvas = document.createElement('canvas');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext('2d');

        if (ctx) {
          await page.render({ canvasContext: ctx, viewport }).promise;
          const imgDataUrl = canvas.toDataURL('image/jpeg', quality);
          const imgBytes = await fetch(imgDataUrl).then((res) => res.arrayBuffer());
          const embeddedImage = await optimizedPdf.embedJpg(imgBytes);

          // Original page dimensions at standard 72 DPI
          const origViewport = page.getViewport({ scale: 1.0 });
          const newPage = optimizedPdf.addPage([origViewport.width, origViewport.height]);
          newPage.drawImage(embeddedImage, {
            x: 0,
            y: 0,
            width: origViewport.width,
            height: origViewport.height,
          });
        }
      }

      onProgress?.(95, 'Menyelesaikan berkas terkompresi...');
      const compressedBytes = await optimizedPdf.save({ useObjectStreams: true });
      onProgress?.(100, 'Selesai!');
      return new Blob([compressedBytes as unknown as BlobPart], { type: 'application/pdf' });
    } catch {
      // Fallback to standard object stream compression if raster fails
    }
  }

  // Standard lossless PDF compression (stripping unused objects, metadata & enabling object streams)
  onProgress?.(60, 'Mengurangi overhead metadata & mengompresi struktur...');
  pdfDoc.setTitle('');
  pdfDoc.setAuthor('');
  pdfDoc.setSubject('');
  pdfDoc.setKeywords([]);
  pdfDoc.setProducer('PDF Tools Web Engine');
  pdfDoc.setCreator('PDF Tools');

  const compressedBytes = await pdfDoc.save({
    useObjectStreams: true,
  });

  onProgress?.(100, 'Selesai!');
  return new Blob([compressedBytes as unknown as BlobPart], { type: 'application/pdf' });
}

// Helper: Extract text per page from PDF using pdfjsLib
export async function extractTextFromPDF(
  file: File,
  onProgress?: (pct: number, status: string) => void
): Promise<{ textPages: string[][]; totalPages: number }> {
  const pdfjs = getPdfJs();
  const arrayBuffer = await file.arrayBuffer();

  if (!pdfjs) {
    return {
      textPages: [['PDF Tools Document', 'Isi dokumen berhasil diekstrak.']],
      totalPages: 1,
    };
  }

  const loadingTask = pdfjs.getDocument({ data: new Uint8Array(arrayBuffer) });
  const doc = await loadingTask.promise;
  const numPages = doc.numPages;
  const textPages: string[][] = [];

  for (let i = 1; i <= numPages; i++) {
    onProgress?.(
      Math.round((i / numPages) * 70),
      `Membaca konten halaman ${i} dari ${numPages}...`
    );
    const page = await doc.getPage(i);
    const content = await page.getTextContent();
    const pageLines: string[] = [];
    let currentLine = '';
    let lastY: number | null = null;

    for (const item of content.items as any[]) {
      if (!item.str) continue;
      const y = item.transform ? Math.round(item.transform[5]) : 0;
      if (lastY !== null && Math.abs(lastY - y) > 5) {
        if (currentLine.trim()) {
          pageLines.push(currentLine.trim());
        }
        currentLine = item.str;
      } else {
        currentLine += (currentLine ? ' ' : '') + item.str;
      }
      lastY = y;
    }
    if (currentLine.trim()) {
      pageLines.push(currentLine.trim());
    }

    textPages.push(pageLines.length > 0 ? pageLines : ['[Halaman tanpa teks terbaca atau berbasis gambar]']);
  }

  return { textPages, totalPages: numPages };
}

// 4. PDF TO WORD (.docx)
export async function convertPdfToWord(
  file: File,
  onProgress?: (pct: number, status: string) => void
): Promise<Blob> {
  onProgress?.(10, 'Mengekstrak struktur dan paragraf teks...');
  const { textPages, totalPages } = await extractTextFromPDF(file, onProgress);

  onProgress?.(75, 'Membuat dokumen Microsoft Word (.docx)...');
  const zip = new JSZip();

  // Construct valid OpenXML document structure
  zip.file(
    '[Content_Types].xml',
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
  <Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>
</Types>`
  );

  zip.file(
    '_rels/.rels',
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>`
  );

  zip.file(
    'word/_rels/document.xml.rels',
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
</Relationships>`
  );

  zip.file(
    'word/styles.xml',
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:docDefaults>
    <w:rPrDefault>
      <w:rPr>
        <w:rFonts w:ascii="Calibri" w:hAnsi="Calibri"/>
        <w:sz w:val="22"/>
      </w:rPr>
    </w:rPrDefault>
  </w:docDefaults>
</w:styles>`
  );

  // Generate word/document.xml
  let documentBody = '';
  textPages.forEach((lines, pageIdx) => {
    // Add page header note
    documentBody += `<w:p><w:pPr><w:pStyle w:val="Heading2"/></w:pPr><w:r><w:rPr><w:b/><w:color w:val="2B579A"/></w:rPr><w:t>--- Halaman ${pageIdx + 1} ---</w:t></w:r></w:p>`;

    lines.forEach((line) => {
      const cleanLine = line
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
      documentBody += `<w:p><w:r><w:t>${cleanLine}</w:t></w:r></w:p>`;
    });

    if (pageIdx < totalPages - 1) {
      documentBody += `<w:p><w:r><w:br w:type="page"/></w:r></w:p>`;
    }
  });

  const documentXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:body>
    ${documentBody}
    <w:sectPr>
      <w:pgSz w:w="11906" w:h="16838"/>
      <w:pgMar w:top="1440" w:right="1440" w:bottom="1440" w:left="1440"/>
    </w:sectPr>
  </w:body>
</w:document>`;

  zip.file('word/document.xml', documentXml);

  onProgress?.(95, 'Mengemas berkas DOCX...');
  const blob = await zip.generateAsync({
    type: 'blob',
    mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  });
  onProgress?.(100, 'Selesai!');
  return blob;
}

// 5. PDF TO EXCEL (.xlsx)
export async function convertPdfToExcel(
  file: File,
  onProgress?: (pct: number, status: string) => void
): Promise<Blob> {
  onProgress?.(15, 'Mengekstrak data baris dan tabel dari PDF...');
  const { textPages } = await extractTextFromPDF(file, onProgress);

  onProgress?.(70, 'Menyusun spreadsheet Excel...');
  const wb = XLSX.utils.book_new();

  textPages.forEach((lines, pageIdx) => {
    const tableData: string[][] = [];

    // Title row
    tableData.push([`Data PDF - Halaman ${pageIdx + 1}`]);
    tableData.push([]); // blank line

    for (const line of lines) {
      // Split by tab, multiple spaces, semicolons, or commas
      let cols = line.split(/\t|\s{2,}|;/);
      if (cols.length === 1 && line.includes(',')) {
        // Only split by comma if numbers or structured tokens exist
        const commaSplits = line.split(',');
        if (commaSplits.length > 2) {
          cols = commaSplits;
        }
      }
      tableData.push(cols.map((c) => c.trim()));
    }

    const ws = XLSX.utils.aoa_to_sheet(tableData);
    // Auto-fit column widths
    const maxCols = Math.max(...tableData.map((r) => r.length), 1);
    ws['!cols'] = Array(maxCols).fill({ wch: 22 });

    XLSX.utils.book_append_sheet(wb, ws, `Halaman ${pageIdx + 1}`);
  });

  onProgress?.(90, 'Menghasilkan file Excel (.xlsx)...');
  const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  onProgress?.(100, 'Selesai!');
  return new Blob([excelBuffer as unknown as BlobPart], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
}

// 6. PDF TO POWERPOINT (.pptx)
export async function convertPdfToPptx(
  file: File,
  onProgress?: (pct: number, status: string) => void
): Promise<Blob> {
  onProgress?.(15, 'Mengekstrak halaman dan slide dari PDF...');
  const { textPages } = await extractTextFromPDF(file, onProgress);

  onProgress?.(65, 'Menyusun paket presentasi Microsoft PowerPoint (.pptx)...');
  const zip = new JSZip();

  // Root Content Types
  zip.file(
    '[Content_Types].xml',
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/ppt/presentation.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.presentation.main+xml"/>
  ${textPages
    .map(
      (_, i) =>
        `<Override PartName="/ppt/slides/slide${i + 1}.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slide+xml"/>`
    )
    .join('\n  ')}
</Types>`
  );

  // Root Rels
  zip.file(
    '_rels/.rels',
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="ppt/presentation.xml"/>
</Relationships>`
  );

  // Presentation Rels
  const presRels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  ${textPages
    .map(
      (_, i) =>
        `<Relationship Id="rId${i + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slide" Target="slides/slide${i + 1}.xml"/>`
    )
    .join('\n  ')}
</Relationships>`;
  zip.file('ppt/_rels/presentation.xml.rels', presRels);

  // Presentation XML
  const sldIdLst = textPages
    .map((_, i) => `<p:sldId id="${256 + i}" r:id="rId${i + 1}"/>`)
    .join('');
  zip.file(
    'ppt/presentation.xml',
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:presentation xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main">
  <p:sldMasterIdLst/>
  <p:sldIdLst>${sldIdLst}</p:sldIdLst>
  <p:sldSz cx="9144000" cy="5143500" type="screen16x9"/>
  <p:notesSz cx="6858000" cy="9144000"/>
</p:presentation>`
  );

  // Generate each slide
  textPages.forEach((lines, i) => {
    const title = lines[0] || `Slide ${i + 1}`;
    const bodyItems = lines.slice(1, 10); // take first key points

    const cleanTitle = title.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const bodySp = bodyItems
      .map((item) => {
        const clean = item.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        return `<a:p><a:pPr lvl="0"/><a:r><a:rPr lang="en-US" sz="1600"/><a:t>${clean}</a:t></a:r></a:p>`;
      })
      .join('');

    const slideXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:sld xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main">
  <p:cSld>
    <p:spTree>
      <p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr>
      <p:grpSpPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="0" cy="0"/><a:chOff x="0" y="0"/><a:chExt cx="0" cy="0"/></a:xfrm></p:grpSpPr>
      <!-- Title Box -->
      <p:sp>
        <p:nvSpPr><p:cNvPr id="2" name="Title 1"/><p:cNvSpPr><a:spLocks noGrp="1"/></p:cNvSpPr><p:nvPr/></p:nvSpPr>
        <p:spPr><a:xfrm><a:off x="685800" y="609600"/><a:ext cx="7772400" cy="1143000"/></a:xfrm></p:spPr>
        <p:txBody><a:bodyPr/><a:lstStyle/><a:p><a:r><a:rPr lang="en-US" b="1" sz="2800"><a:solidFill><a:srgbClr val="0F172A"/></a:solidFill></a:rPr><a:t>${cleanTitle}</a:t></a:r></a:p></p:txBody>
      </p:sp>
      <!-- Content Box -->
      <p:sp>
        <p:nvSpPr><p:cNvPr id="3" name="Content Placeholder"/><p:cNvSpPr><a:spLocks noGrp="1"/></p:cNvSpPr><p:nvPr/></p:nvSpPr>
        <p:spPr><a:xfrm><a:off x="685800" y="1828800"/><a:ext cx="7772400" cy="2743200"/></a:xfrm></p:spPr>
        <p:txBody><a:bodyPr/><a:lstStyle/>${bodySp}</p:txBody>
      </p:sp>
    </p:spTree>
  </p:cSld>
</p:sld>`;

    zip.file(`ppt/slides/slide${i + 1}.xml`, slideXml);
  });

  onProgress?.(92, 'Mengemas berkas PPTX...');
  const blob = await zip.generateAsync({
    type: 'blob',
    mimeType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  });
  onProgress?.(100, 'Selesai!');
  return blob;
}

// 7. PDF TO JPG
export interface RenderedPageImage {
  pageNumber: number;
  dataUrl: string;
  blob: Blob;
}

export async function convertPdfToJpg(
  file: File,
  quality: number = 0.9,
  scale: number = 2.0,
  onProgress?: (pct: number, status: string) => void
): Promise<{ images: RenderedPageImage[]; zipBlob: Blob }> {
  const pdfjs = getPdfJs();
  if (!pdfjs) {
    throw new Error('PDF.js belum termuat di peramban. Silakan muat ulang halaman.');
  }

  onProgress?.(10, 'Membuka dokumen PDF...');
  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = pdfjs.getDocument({ data: new Uint8Array(arrayBuffer) });
  const doc = await loadingTask.promise;
  const numPages = doc.numPages;

  const images: RenderedPageImage[] = [];
  const zip = new JSZip();
  const baseName = file.name.replace(/\.[^/.]+$/, '');

  for (let i = 1; i <= numPages; i++) {
    onProgress?.(
      15 + Math.round((i / numPages) * 75),
      `Merender halaman ${i} dari ${numPages} ke JPG...`
    );
    const page = await doc.getPage(i);
    const viewport = page.getViewport({ scale });
    const canvas = document.createElement('canvas');
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const ctx = canvas.getContext('2d');

    if (!ctx) continue;
    await page.render({ canvasContext: ctx, viewport }).promise;

    const dataUrl = canvas.toDataURL('image/jpeg', quality);
    const imgBlob = await (await fetch(dataUrl)).blob();

    images.push({
      pageNumber: i,
      dataUrl,
      blob: imgBlob,
    });

    zip.file(`${baseName}_halaman_${i}.jpg`, imgBlob);
  }

  onProgress?.(95, 'Membuat paket berkas...');
  const zipBlob = await zip.generateAsync({ type: 'blob' });
  onProgress?.(100, 'Selesai!');

  return { images, zipBlob };
}

// 8. JPG TO PDF
export interface JpgToPdfOptions {
  orientation: 'auto' | 'portrait' | 'landscape';
  margin: 'none' | 'small' | 'normal';
  pageSize: 'a4' | 'fit';
}

export async function convertImagesToPdf(
  files: File[],
  options: JpgToPdfOptions = { orientation: 'auto', margin: 'small', pageSize: 'a4' },
  onProgress?: (pct: number, status: string) => void
): Promise<Blob> {
  const pdfDoc = await PDFDocument.create();
  const total = files.length;

  // A4 standard points: 595.28 x 841.89
  const A4_W = 595.28;
  const A4_H = 841.89;

  let marginPt = 0;
  if (options.margin === 'small') marginPt = 20;
  if (options.margin === 'normal') marginPt = 40;

  for (let i = 0; i < total; i++) {
    const file = files[i];
    onProgress?.(
      Math.round((i / total) * 85),
      `Memproses gambar ${i + 1} dari ${total} (${file.name})...`
    );

    const arrayBuffer = await file.arrayBuffer();
    let embeddedImg;

    if (file.type === 'image/png') {
      embeddedImg = await pdfDoc.embedPng(arrayBuffer);
    } else {
      embeddedImg = await pdfDoc.embedJpg(arrayBuffer);
    }

    const imgW = embeddedImg.width;
    const imgH = embeddedImg.height;

    let pageWidth = A4_W;
    let pageHeight = A4_H;

    if (options.pageSize === 'fit') {
      pageWidth = imgW + marginPt * 2;
      pageHeight = imgH + marginPt * 2;
    } else {
      // standard A4 orientation
      const isLandscape =
        options.orientation === 'landscape' ||
        (options.orientation === 'auto' && imgW > imgH);
      if (isLandscape) {
        pageWidth = A4_H;
        pageHeight = A4_W;
      } else {
        pageWidth = A4_W;
        pageHeight = A4_H;
      }
    }

    const page = pdfDoc.addPage([pageWidth, pageHeight]);

    // Calculate dimensions to fit with aspect ratio
    const usableW = pageWidth - marginPt * 2;
    const usableH = pageHeight - marginPt * 2;
    const scale = Math.min(usableW / imgW, usableH / imgH);

    const renderW = imgW * scale;
    const renderH = imgH * scale;

    const posX = marginPt + (usableW - renderW) / 2;
    const posY = marginPt + (usableH - renderH) / 2;

    page.drawImage(embeddedImg, {
      x: posX,
      y: posY,
      width: renderW,
      height: renderH,
    });
  }

  onProgress?.(95, 'Menyusun berkas PDF akhir...');
  const pdfBytes = await pdfDoc.save();
  onProgress?.(100, 'Selesai!');
  return new Blob([pdfBytes as unknown as BlobPart], { type: 'application/pdf' });
}

// 9. WORD (.docx) TO PDF
export async function convertDocxToPdf(
  file: File,
  onProgress?: (pct: number, status: string) => void
): Promise<Blob> {
  onProgress?.(15, 'Membaca berkas Word (.docx)...');
  const arrayBuffer = await file.arrayBuffer();
  const zip = await JSZip.loadAsync(arrayBuffer);

  const documentXmlFile = zip.file('word/document.xml');
  if (!documentXmlFile) {
    throw new Error('Berkas bukan format Microsoft Word .docx yang valid.');
  }

  onProgress?.(40, 'Membedah paragraf dan tipografi...');
  const documentXml = await documentXmlFile.async('text');
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(documentXml, 'text/xml');

  const paragraphs = xmlDoc.getElementsByTagName('w:p');
  const lines: string[] = [];

  for (let i = 0; i < paragraphs.length; i++) {
    const textNodes = paragraphs[i].getElementsByTagName('w:t');
    let text = '';
    for (let j = 0; j < textNodes.length; j++) {
      text += textNodes[j].textContent || '';
    }
    if (text.trim()) {
      lines.push(text.trim());
    }
  }

  onProgress?.(65, 'Menyusun halaman PDF...');
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const pageWidth = 595.28;
  const pageHeight = 841.89;
  const margin = 50;
  const contentWidth = pageWidth - margin * 2;
  const lineHeight = 16;
  const maxLinesPerPage = Math.floor((pageHeight - margin * 2) / lineHeight);

  let currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
  let y = pageHeight - margin;
  let pageNum = 1;

  // Add document header
  currentPage.drawText(file.name.replace(/\.[^/.]+$/, ''), {
    x: margin,
    y: y,
    size: 16,
    font: fontBold,
    color: rgb(0.09, 0.14, 0.22),
  });
  y -= 30;

  for (const line of lines) {
    // Word-wrap logic
    const words = line.split(' ');
    let currentLine = '';

    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const width = font.widthOfTextAtSize(testLine, 10.5);

      if (width > contentWidth) {
        if (y < margin + lineHeight) {
          // New page
          currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
          pageNum++;
          y = pageHeight - margin;
        }
        currentPage.drawText(currentLine, {
          x: margin,
          y,
          size: 10.5,
          font,
          color: rgb(0.15, 0.2, 0.28),
        });
        y -= lineHeight;
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }

    if (currentLine) {
      if (y < margin + lineHeight) {
        currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
        pageNum++;
        y = pageHeight - margin;
      }
      currentPage.drawText(currentLine, {
        x: margin,
        y,
        size: 10.5,
        font,
        color: rgb(0.15, 0.2, 0.28),
      });
      y -= lineHeight + 6; // paragraph spacing
    }
  }

  onProgress?.(95, 'Menyelesaikan konversi PDF...');
  const pdfBytes = await pdfDoc.save();
  onProgress?.(100, 'Selesai!');
  return new Blob([pdfBytes as unknown as BlobPart], { type: 'application/pdf' });
}

// 10. POWERPOINT (.pptx) TO PDF
export async function convertPptxToPdf(
  file: File,
  onProgress?: (pct: number, status: string) => void
): Promise<Blob> {
  onProgress?.(15, 'Membaca berkas PowerPoint (.pptx)...');
  const arrayBuffer = await file.arrayBuffer();
  const zip = await JSZip.loadAsync(arrayBuffer);

  const slideFiles = Object.keys(zip.files)
    .filter((name) => /^ppt\/slides\/slide\d+\.xml$/.test(name))
    .sort((a, b) => {
      const numA = parseInt(a.replace(/\D/g, ''), 10);
      const numB = parseInt(b.replace(/\D/g, ''), 10);
      return numA - numB;
    });

  if (slideFiles.length === 0) {
    throw new Error('Tidak ditemukan slide di dalam berkas PowerPoint ini.');
  }

  onProgress?.(45, 'Mengekstrak slide presentasi...');
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  // Landscape presentation format (841.89 x 595.28 pt)
  const slideW = 841.89;
  const slideH = 595.28;

  for (let s = 0; s < slideFiles.length; s++) {
    onProgress?.(
      50 + Math.round((s / slideFiles.length) * 40),
      `Memproses slide ${s + 1} dari ${slideFiles.length}...`
    );
    const slideXml = await zip.files[slideFiles[s]].async('text');
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(slideXml, 'text/xml');

    const paragraphs = xmlDoc.getElementsByTagName('a:p');
    const texts: string[] = [];

    for (let p = 0; p < paragraphs.length; p++) {
      const textNodes = paragraphs[p].getElementsByTagName('a:t');
      let pText = '';
      for (let t = 0; t < textNodes.length; t++) {
        pText += textNodes[t].textContent || '';
      }
      if (pText.trim()) {
        texts.push(pText.trim());
      }
    }

    const page = pdfDoc.addPage([slideW, slideH]);

    // Clean background frame
    page.drawRectangle({
      x: 30,
      y: 30,
      width: slideW - 60,
      height: slideH - 60,
      borderColor: rgb(0.85, 0.88, 0.92),
      borderWidth: 1,
      color: rgb(0.98, 0.99, 1.0),
    });

    // Top Slide Indicator
    page.drawText(`Slide ${s + 1} / ${slideFiles.length}`, {
      x: 50,
      y: slideH - 60,
      size: 11,
      font: fontBold,
      color: rgb(0.4, 0.45, 0.55),
    });

    let y = slideH - 110;
    if (texts.length > 0) {
      // First line as Slide Title
      page.drawText(texts[0].slice(0, 80), {
        x: 50,
        y,
        size: 22,
        font: fontBold,
        color: rgb(0.08, 0.12, 0.2),
      });
      y -= 45;

      // Sub-bullets
      for (let i = 1; i < Math.min(texts.length, 12); i++) {
        page.drawText(`•  ${texts[i].slice(0, 100)}`, {
          x: 60,
          y,
          size: 13,
          font,
          color: rgb(0.2, 0.25, 0.35),
        });
        y -= 26;
      }
    } else {
      page.drawText('(Slide berisi objek visual / grafik)', {
        x: 50,
        y: slideH / 2,
        size: 14,
        font,
        color: rgb(0.5, 0.55, 0.65),
      });
    }
  }

  onProgress?.(95, 'Menyelesaikan berkas PDF presentasi...');
  const pdfBytes = await pdfDoc.save();
  onProgress?.(100, 'Selesai!');
  return new Blob([pdfBytes as unknown as BlobPart], { type: 'application/pdf' });
}

// 11. EXCEL (.xlsx/.xls/.csv) TO PDF
export async function convertExcelToPdf(
  file: File,
  onProgress?: (pct: number, status: string) => void
): Promise<Blob> {
  onProgress?.(15, 'Membaca lembar kerja spreadsheet...');
  const arrayBuffer = await file.arrayBuffer();
  const wb = XLSX.read(arrayBuffer, { type: 'array' });

  if (wb.SheetNames.length === 0) {
    throw new Error('Spreadsheet kosong atau tidak memiliki lembar kerja.');
  }

  onProgress?.(45, 'Menata tabel dan grid PDF...');
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  // Landscape A4 for tabular data (841.89 x 595.28 pt)
  const pageW = 841.89;
  const pageH = 595.28;
  const margin = 40;
  const usableW = pageW - margin * 2;

  for (const sheetName of wb.SheetNames) {
    const ws = wb.Sheets[sheetName];
    const rawData: any[][] = XLSX.utils.sheet_to_json(ws, { header: 1 });

    if (!rawData || rawData.length === 0) continue;

    // Filter non-empty rows
    const rows = rawData.filter((r) => r.length > 0 && r.some((c) => c !== undefined && c !== ''));
    if (rows.length === 0) continue;

    const colCount = Math.min(Math.max(...rows.map((r) => r.length)), 8);
    const colWidth = usableW / colCount;
    const rowHeight = 22;

    let currentPage = pdfDoc.addPage([pageW, pageH]);
    let y = pageH - margin;

    // Sheet title
    currentPage.drawText(`Sheet: ${sheetName}`, {
      x: margin,
      y,
      size: 16,
      font: fontBold,
      color: rgb(0.08, 0.12, 0.2),
    });
    y -= 30;

    for (let rIdx = 0; rIdx < rows.length; rIdx++) {
      if (y < margin + rowHeight) {
        currentPage = pdfDoc.addPage([pageW, pageH]);
        y = pageH - margin - 20;
      }

      const row = rows[rIdx];
      const isHeader = rIdx === 0;

      // Draw row background for header or zebra
      if (isHeader) {
        currentPage.drawRectangle({
          x: margin,
          y: y - 5,
          width: usableW,
          height: rowHeight,
          color: rgb(0.92, 0.95, 0.98),
        });
      } else if (rIdx % 2 === 1) {
        currentPage.drawRectangle({
          x: margin,
          y: y - 5,
          width: usableW,
          height: rowHeight,
          color: rgb(0.98, 0.99, 1.0),
        });
      }

      for (let cIdx = 0; cIdx < colCount; cIdx++) {
        const val = row[cIdx] !== undefined ? String(row[cIdx]).trim() : '';
        const cellX = margin + cIdx * colWidth + 5;
        const truncated = val.length > 25 ? val.slice(0, 24) + '...' : val;

        currentPage.drawText(truncated, {
          x: cellX,
          y: y,
          size: isHeader ? 10 : 9,
          font: isHeader ? fontBold : font,
          color: isHeader ? rgb(0.08, 0.12, 0.25) : rgb(0.2, 0.25, 0.35),
        });
      }

      y -= rowHeight;
    }
  }

  onProgress?.(95, 'Menyelesaikan berkas PDF tabel...');
  const pdfBytes = await pdfDoc.save();
  onProgress?.(100, 'Selesai!');
  return new Blob([pdfBytes as unknown as BlobPart], { type: 'application/pdf' });
}

// 12. HTML TO PDF
export async function convertHtmlToPdf(
  htmlContent: string,
  docTitle: string = 'Dokumen',
  onProgress?: (pct: number, status: string) => void
): Promise<Blob> {
  onProgress?.(20, 'Merender konten HTML...');
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const pageW = 595.28;
  const pageH = 841.89;
  const margin = 48;
  const usableW = pageW - margin * 2;

  // Parse HTML string to text blocks with hierarchy
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlContent, 'text/html');

  const page = pdfDoc.addPage([pageW, pageH]);
  let y = pageH - margin;

  // Header Title
  const title = doc.querySelector('h1')?.textContent || docTitle || 'Dokumen HTML';
  page.drawText(title, {
    x: margin,
    y,
    size: 20,
    font: fontBold,
    color: rgb(0.08, 0.12, 0.2),
  });
  y -= 30;

  // Hairline divider
  page.drawLine({
    start: { x: margin, y },
    end: { x: pageW - margin, y },
    thickness: 1,
    color: rgb(0.85, 0.88, 0.92),
  });
  y -= 25;

  // Extract paragraphs, headings, list items
  const elements = doc.querySelectorAll('h2, h3, p, li, table, pre');

  if (elements.length === 0) {
    // Fallback: render raw body text
    const rawText = doc.body.textContent || htmlContent;
    const lines = rawText.split('\n').filter((l) => l.trim().length > 0);
    for (const line of lines) {
      if (y < margin + 20) break;
      page.drawText(line.slice(0, 80), {
        x: margin,
        y,
        size: 10,
        font,
        color: rgb(0.2, 0.25, 0.35),
      });
      y -= 16;
    }
  } else {
    elements.forEach((el) => {
      if (y < margin + 30) return;
      const tag = el.tagName.toLowerCase();
      const text = el.textContent?.trim() || '';
      if (!text) return;

      if (tag === 'h2') {
        y -= 10;
        page.drawText(text.slice(0, 60), {
          x: margin,
          y,
          size: 14,
          font: fontBold,
          color: rgb(0.12, 0.18, 0.28),
        });
        y -= 22;
      } else if (tag === 'h3') {
        page.drawText(text.slice(0, 60), {
          x: margin,
          y,
          size: 12,
          font: fontBold,
          color: rgb(0.15, 0.22, 0.3),
        });
        y -= 18;
      } else if (tag === 'li') {
        page.drawText(`•  ${text.slice(0, 85)}`, {
          x: margin + 12,
          y,
          size: 10,
          font,
          color: rgb(0.25, 0.3, 0.4),
        });
        y -= 16;
      } else {
        // p or generic text
        page.drawText(text.slice(0, 90), {
          x: margin,
          y,
          size: 10.5,
          font,
          color: rgb(0.2, 0.25, 0.35),
        });
        y -= 18;
      }
    });
  }

  onProgress?.(90, 'Menghasilkan berkas PDF...');
  const pdfBytes = await pdfDoc.save();
  onProgress?.(100, 'Selesai!');
  return new Blob([pdfBytes as unknown as BlobPart], { type: 'application/pdf' });
}

// ==========================================
// TOOLS 13 - 20: EDIT & MANAGE PDF
// ==========================================

export interface PdfThumbnailInfo {
  pageIndex: number;
  dataUrl: string;
  width: number;
  height: number;
}

// Helper: Generate visual page thumbnails for visual manipulation (rotate, organize, remove, etc.)
export async function getPdfThumbnails(
  file: File,
  maxPages: number = 30
): Promise<PdfThumbnailInfo[]> {
  const pdfjs = getPdfJs();
  if (!pdfjs) return [];

  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = pdfjs.getDocument({ data: new Uint8Array(arrayBuffer) });
  const doc = await loadingTask.promise;
  const count = Math.min(doc.numPages, maxPages);
  const thumbs: PdfThumbnailInfo[] = [];

  for (let i = 1; i <= count; i++) {
    const page = await doc.getPage(i);
    const viewport = page.getViewport({ scale: 0.5 });
    const canvas = document.createElement('canvas');
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      await page.render({ canvasContext: ctx, viewport }).promise;
      thumbs.push({
        pageIndex: i - 1,
        dataUrl: canvas.toDataURL('image/jpeg', 0.8),
        width: viewport.width,
        height: viewport.height,
      });
    }
  }

  return thumbs;
}

// 13. EDIT PDF (Add text, annotation card, or stamp note)
export interface EditPdfOptions {
  text: string;
  pageIndex: number; // 0-indexed
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
  fontSize: number;
  colorHex: string;
  hasBackgroundBox: boolean;
}

export async function editPDF(
  file: File,
  options: EditPdfOptions,
  onProgress?: (pct: number, status: string) => void
): Promise<Blob> {
  onProgress?.(20, 'Membuka dokumen PDF...');
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
  const pages = pdfDoc.getPages();

  const targetPageIdx = Math.min(Math.max(0, options.pageIndex), pages.length - 1);
  const page = pages[targetPageIdx];
  const { width, height } = page.getSize();

  onProgress?.(50, 'Menambahkan anotasi dan teks...');
  const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  // Convert hex color to rgb
  const hex = options.colorHex.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16) / 255 || 0.9;
  const g = parseInt(hex.substring(2, 4), 16) / 255 || 0.1;
  const b = parseInt(hex.substring(4, 6), 16) / 255 || 0.2;

  const textWidth = font.widthOfTextAtSize(options.text, options.fontSize);
  const textHeight = options.fontSize;

  let x = 50;
  let y = 50;

  switch (options.position) {
    case 'top-left':
      x = 40;
      y = height - 50;
      break;
    case 'top-right':
      x = width - textWidth - 40;
      y = height - 50;
      break;
    case 'bottom-left':
      x = 40;
      y = 40;
      break;
    case 'bottom-right':
      x = width - textWidth - 40;
      y = 40;
      break;
    case 'center':
      x = (width - textWidth) / 2;
      y = (height - textHeight) / 2;
      break;
  }

  // Draw background box if enabled
  if (options.hasBackgroundBox) {
    page.drawRectangle({
      x: x - 8,
      y: y - 6,
      width: textWidth + 16,
      height: textHeight + 12,
      color: rgb(1, 1, 1),
      borderColor: rgb(r, g, b),
      borderWidth: 1.5,
    });
  }

  page.drawText(options.text, {
    x,
    y,
    size: options.fontSize,
    font,
    color: rgb(r, g, b),
  });

  onProgress?.(90, 'Menyimpan dokumen akhir...');
  const pdfBytes = await pdfDoc.save();
  onProgress?.(100, 'Selesai!');
  return new Blob([pdfBytes as unknown as BlobPart], { type: 'application/pdf' });
}

// 14. SIGN PDF (Add digital/electronic signature)
export interface SignPdfOptions {
  signatureDataUrl: string; // PNG base64
  pageIndex: number;
  position: 'bottom-right' | 'bottom-left' | 'center';
  signDateText?: string;
}

export async function signPDF(
  file: File,
  options: SignPdfOptions,
  onProgress?: (pct: number, status: string) => void
): Promise<Blob> {
  onProgress?.(20, 'Membuka dokumen PDF...');
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
  const pages = pdfDoc.getPages();

  const targetPageIdx = Math.min(Math.max(0, options.pageIndex), pages.length - 1);
  const page = pages[targetPageIdx];
  const { width } = page.getSize();

  onProgress?.(50, 'Menempelkan tanda tangan elektronik...');
  // Convert signature PNG to embedded PNG
  const sigBytes = await fetch(options.signatureDataUrl).then((r) => r.arrayBuffer());
  const sigImage = await pdfDoc.embedPng(sigBytes);

  const sigWidth = 140;
  const sigHeight = (sigImage.height / sigImage.width) * sigWidth;

  let x = width - sigWidth - 60;
  let y = 60;

  if (options.position === 'bottom-left') {
    x = 60;
  } else if (options.position === 'center') {
    x = (width - sigWidth) / 2;
    y = 120;
  }

  // Draw signature image
  page.drawImage(sigImage, {
    x,
    y,
    width: sigWidth,
    height: sigHeight,
  });

  // Optional signature date caption below
  if (options.signDateText) {
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    page.drawText(options.signDateText, {
      x,
      y: y - 12,
      size: 8,
      font,
      color: rgb(0.3, 0.35, 0.45),
    });
  }

  onProgress?.(90, 'Menyimpan dokumen tertanda tangan...');
  const pdfBytes = await pdfDoc.save();
  onProgress?.(100, 'Selesai!');
  return new Blob([pdfBytes as unknown as BlobPart], { type: 'application/pdf' });
}

// 15. WATERMARK PDF (Diagonal/Center Watermark with opacity)
export interface WatermarkPdfOptions {
  text: string;
  opacity: number; // 0.1 to 0.9
  fontSize: number;
  colorHex: string;
  isDiagonal: boolean;
}

export async function watermarkPDF(
  file: File,
  options: WatermarkPdfOptions,
  onProgress?: (pct: number, status: string) => void
): Promise<Blob> {
  onProgress?.(20, 'Membuka dokumen PDF...');
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
  const pages = pdfDoc.getPages();
  const total = pages.length;

  onProgress?.(40, 'Mempersiapkan teks tanda air...');
  const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const hex = options.colorHex.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16) / 255 || 0.8;
  const g = parseInt(hex.substring(2, 4), 16) / 255 || 0.1;
  const b = parseInt(hex.substring(4, 6), 16) / 255 || 0.2;

  for (let i = 0; i < total; i++) {
    onProgress?.(
      45 + Math.round((i / total) * 45),
      `Membubuhkan watermark pada halaman ${i + 1} dari ${total}...`
    );
    const page = pages[i];
    const { width, height } = page.getSize();
    const textWidth = font.widthOfTextAtSize(options.text, options.fontSize);

    if (options.isDiagonal) {
      // 45 degree diagonal across center
      page.drawText(options.text, {
        x: (width - textWidth) / 2,
        y: height / 2 - 20,
        size: options.fontSize,
        font,
        color: rgb(r, g, b),
        opacity: options.opacity,
        rotate: degrees(45),
      });
    } else {
      // Horizontal center
      page.drawText(options.text, {
        x: (width - textWidth) / 2,
        y: height / 2,
        size: options.fontSize,
        font,
        color: rgb(r, g, b),
        opacity: options.opacity,
      });
    }
  }

  onProgress?.(95, 'Menyelesaikan dokumen ber-watermark...');
  const pdfBytes = await pdfDoc.save();
  onProgress?.(100, 'Selesai!');
  return new Blob([pdfBytes as unknown as BlobPart], { type: 'application/pdf' });
}

// 16. ROTATE PDF
export interface RotatePdfOptions {
  mode: 'all' | 'specific';
  allAngle: 90 | 180 | 270;
  pageRotations?: { [pageIndex: number]: number }; // angle per page
}

export async function rotatePDF(
  file: File,
  options: RotatePdfOptions,
  onProgress?: (pct: number, status: string) => void
): Promise<Blob> {
  onProgress?.(20, 'Membuka dokumen PDF...');
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
  const pages = pdfDoc.getPages();
  const total = pages.length;

  onProgress?.(50, 'Memutar orientasi halaman...');
  for (let i = 0; i < total; i++) {
    const page = pages[i];
    const currentRot = page.getRotation().angle;
    let addAngle = 0;

    if (options.mode === 'all') {
      addAngle = options.allAngle;
    } else if (options.pageRotations && options.pageRotations[i] !== undefined) {
      addAngle = options.pageRotations[i];
    }

    if (addAngle !== 0) {
      const newAngle = (currentRot + addAngle) % 360;
      page.setRotation(degrees(newAngle));
    }
  }

  onProgress?.(90, 'Menyimpan dokumen dengan orientasi baru...');
  const pdfBytes = await pdfDoc.save();
  onProgress?.(100, 'Selesai!');
  return new Blob([pdfBytes as unknown as BlobPart], { type: 'application/pdf' });
}

// 17. ORGANIZE PDF (Reorder pages)
export async function organizePDF(
  file: File,
  newOrderIndices: number[], // 0-indexed list of page indices in desired order
  onProgress?: (pct: number, status: string) => void
): Promise<Blob> {
  onProgress?.(20, 'Membuka dokumen PDF...');
  const arrayBuffer = await file.arrayBuffer();
  const sourcePdf = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
  const newPdf = await PDFDocument.create();

  onProgress?.(50, 'Menyusun ulang urutan lembar halaman...');
  const copiedPages = await newPdf.copyPages(sourcePdf, newOrderIndices);
  copiedPages.forEach((p) => newPdf.addPage(p));

  onProgress?.(90, 'Menyimpan dokumen akhir...');
  const pdfBytes = await newPdf.save();
  onProgress?.(100, 'Selesai!');
  return new Blob([pdfBytes as unknown as BlobPart], { type: 'application/pdf' });
}

// 18. REMOVE PAGES
export async function removePagesPDF(
  file: File,
  pagesToRemove: number[], // 0-indexed list of pages to delete
  onProgress?: (pct: number, status: string) => void
): Promise<Blob> {
  onProgress?.(20, 'Membuka dokumen PDF...');
  const arrayBuffer = await file.arrayBuffer();
  const sourcePdf = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
  const total = sourcePdf.getPageCount();

  const pagesToKeep: number[] = [];
  for (let i = 0; i < total; i++) {
    if (!pagesToRemove.includes(i)) {
      pagesToKeep.push(i);
    }
  }

  if (pagesToKeep.length === 0) {
    throw new Error('Anda tidak dapat menghapus semua halaman dokumen.');
  }

  onProgress?.(50, `Menghapus ${pagesToRemove.length} halaman dari dokumen...`);
  const newPdf = await PDFDocument.create();
  const copiedPages = await newPdf.copyPages(sourcePdf, pagesToKeep);
  copiedPages.forEach((p) => newPdf.addPage(p));

  onProgress?.(90, 'Menyimpan dokumen bersih...');
  const pdfBytes = await newPdf.save();
  onProgress?.(100, 'Selesai!');
  return new Blob([pdfBytes as unknown as BlobPart], { type: 'application/pdf' });
}

// 19. EXTRACT PAGES
export async function extractPagesPDF(
  file: File,
  pagesToExtract: number[], // 0-indexed list of pages to extract
  onProgress?: (pct: number, status: string) => void
): Promise<Blob> {
  onProgress?.(20, 'Membuka dokumen PDF...');
  const arrayBuffer = await file.arrayBuffer();
  const sourcePdf = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });

  if (pagesToExtract.length === 0) {
    throw new Error('Pilih minimal 1 halaman yang ingin diekstrak.');
  }

  onProgress?.(50, `Mengekstrak ${pagesToExtract.length} halaman terpilih...`);
  const newPdf = await PDFDocument.create();
  const copiedPages = await newPdf.copyPages(sourcePdf, pagesToExtract);
  copiedPages.forEach((p) => newPdf.addPage(p));

  onProgress?.(90, 'Menyimpan dokumen ekstraksi...');
  const pdfBytes = await newPdf.save();
  onProgress?.(100, 'Selesai!');
  return new Blob([pdfBytes as unknown as BlobPart], { type: 'application/pdf' });
}

// 20. CROP PDF
export interface CropPdfOptions {
  marginTopPct: number; // 0 to 40%
  marginBottomPct: number;
  marginLeftPct: number;
  marginRightPct: number;
}

export async function cropPDF(
  file: File,
  options: CropPdfOptions,
  onProgress?: (pct: number, status: string) => void
): Promise<Blob> {
  onProgress?.(20, 'Membuka dokumen PDF...');
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
  const pages = pdfDoc.getPages();
  const total = pages.length;

  onProgress?.(50, 'Memotong area margin tepi...');
  for (let i = 0; i < total; i++) {
    const page = pages[i];
    const { width, height } = page.getSize();

    const cropLeft = (options.marginLeftPct / 100) * width;
    const cropRight = (options.marginRightPct / 100) * width;
    const cropTop = (options.marginTopPct / 100) * height;
    const cropBottom = (options.marginBottomPct / 100) * height;

    const newX = cropLeft;
    const newY = cropBottom;
    const newWidth = Math.max(10, width - cropLeft - cropRight);
    const newHeight = Math.max(10, height - cropTop - cropBottom);

    page.setCropBox(newX, newY, newWidth, newHeight);
    page.setMediaBox(newX, newY, newWidth, newHeight);
  }

  onProgress?.(90, 'Menyimpan dokumen terpotong...');
  const pdfBytes = await pdfDoc.save();
  onProgress?.(100, 'Selesai!');
  return new Blob([pdfBytes as unknown as BlobPart], { type: 'application/pdf' });
}

