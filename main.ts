// News image generator for 19 November 2026
// Generates a professional news summary image using only Node.js standard library

import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { deflateSync } from 'node:zlib';

// 5x7 bitmap font patterns for basic ASCII
const FONT_PATTERNS: Record<string, string[]> = {
  '0': ['01110','10001','10011','10101','11001','10001','01110'],
  '1': ['00100','01100','00100','00100','00100','00100','01110'],
  '2': ['01110','10001','00001','00010','00100','01000','11111'],
  '3': ['11110','00001','00001','01110','00001','00001','11110'],
  '4': ['00010','00110','01010','10010','11111','00010','00010'],
  '5': ['11111','10000','11110','00001','00001','10001','01110'],
  '6': ['01110','10000','11110','10001','10001','10001','01110'],
  '7': ['11111','00001','00010','00100','01000','10000','10000'],
  '8': ['01110','10001','10001','01110','10001','10001','01110'],
  '9': ['01110','10001','10001','01111','00001','00010','01100'],
  'A': ['01110','10001','10001','11111','10001','10001','10001'],
  'B': ['11110','10001','10001','11110','10001','10001','11110'],
  'C': ['01110','10001','10000','10000','10000','10001','01110'],
  'D': ['11110','10001','10001','10001','10001','10001','11110'],
  'E': ['11111','10000','10000','11110','10000','10000','11111'],
  'F': ['11111','10000','10000','11110','10000','10000','10000'],
  'G': ['01110','10001','10000','10111','10001','10001','01110'],
  'H': ['10001','10001','10001','11111','10001','10001','10001'],
  'I': ['11111','00100','00100','00100','00100','00100','11111'],
  'J': ['01111','00010','00010','00010','00010','10010','01100'],
  'K': ['10001','10010','10100','11000','10100','10010','10001'],
  'L': ['10000','10000','10000','10000','10000','10000','11111'],
  'M': ['10001','11011','10101','10101','10001','10001','10001'],
  'N': ['10001','11001','10101','10011','10001','10001','10001'],
  'O': ['01110','10001','10001','10001','10001','10001','01110'],
  'P': ['11110','10001','10001','11110','10000','10000','10000'],
  'Q': ['01110','10001','10001','10001','10101','10010','01101'],
  'R': ['11110','10001','10001','11110','10100','10010','10001'],
  'S': ['01110','10001','10000','01110','00001','00001','11110'],
  'T': ['11111','00100','00100','00100','00100','00100','00100'],
  'U': ['10001','10001','10001','10001','10001','10001','01110'],
  'V': ['10001','10001','10001','10001','10001','01010','00100'],
  'W': ['10001','10001','10001','10101','10101','11011','10001'],
  'X': ['10001','10001','01010','00100','01010','10001','10001'],
  'Y': ['10001','10001','10001','01010','00100','00100','00100'],
  'Z': ['11111','00001','00010','00100','01000','10000','11111'],
  'a': ['00000','00000','01110','00001','01111','10001','01111'],
  'b': ['10000','10000','10110','11001','10001','10001','11110'],
  'c': ['00000','00000','01110','10001','10000','10001','01110'],
  'd': ['00001','00001','01110','10001','11111','10001','10001'],
  'e': ['00000','00000','01110','10001','11111','10000','01110'],
  'f': ['00110','01001','01000','01110','01000','01000','01000'],
  'g': ['00000','00000','01110','10001','01111','00001','01110'],
  'h': ['10000','10000','10110','11001','10001','10001','10001'],
  'i': ['00100','00000','01100','00100','00100','00100','01110'],
  'j': ['00010','00000','00110','00010','00010','10010','01100'],
  'k': ['10000','10000','10010','10100','11000','10100','10010'],
  'l': ['01100','00100','00100','00100','00100','00100','01110'],
  'm': ['00000','00000','10110','11011','10101','10001','10001'],
  'n': ['00000','00000','10110','11001','10001','10001','10001'],
  'o': ['00000','00000','01110','10001','10001','10001','01110'],
  'p': ['00000','00000','11110','10001','11110','10000','10000'],
  'q': ['00000','00000','01111','10010','10010','01111','00001'],
  'r': ['00000','00000','10110','11001','10000','10000','10000'],
  's': ['00000','00000','01110','10000','01110','00001','11110'],
  't': ['00100','00100','01110','00100','00100','00101','01100'],
  'u': ['00000','00000','10001','10001','10001','10011','01101'],
  'v': ['00000','00000','10001','10001','10001','01010','00100'],
  'w': ['00000','00000','10001','10101','10101','11011','10001'],
  'x': ['00000','00000','10001','01010','00100','01010','10001'],
  'y': ['00000','00000','10001','10001','10011','00010','01100'],
  'z': ['00000','00000','11111','00010','00100','01000','11111'],
  ' ': ['00000','00000','00000','00000','00000','00000','00000'],
  '.': ['00000','00000','00000','00000','00000','00100','00100'],
  ',': ['00000','00000','00000','00000','00000','00100','00110'],
  ':': ['00000','00100','00100','00000','00100','00100','00000'],
  '-': ['00000','00000','00000','01110','00000','00000','00000'],
  '/': ['00001','00010','00100','01000','10000','00000','00000'],
  "'": ['00100','00100','00000','00000','00000','00000','00000'],
  '?': ['01110','10001','00010','00100','00100','00000','00100'],
  '!': ['00100','00100','00100','00100','00100','00000','00100'],
  '(': ['00110','01000','01000','01000','01000','01000','00110'],
  ')': ['01100','00010','00010','00010','00010','00010','01100'],
  '[': ['01110','01000','01000','01000','01000','01000','01110'],
  ']': ['01110','00010','00010','00010','00010','00010','01110'],
  '"': ['01010','01010','00000','00000','00000','00000','00000'],
  '@': ['01110','10010','10110','11101','10000','10010','01110'],
  '#': ['00000','00100','00100','01110','01110','00100','00100'],
  '$': ['00100','01110','10100','01110','00101','01110','00100'],
  '%': ['10001','10010','00100','01000','01001','00011','10001'],
  '&': ['01110','10001','10101','01000','10101','10010','01101'],
  '*': ['00000','00100','10101','01110','10101','00100','00000'],
  '+': ['00000','00100','00100','01110','00100','00100','00000'],
  '=': ['00000','00000','01110','00000','01110','00000','00000'],
  '_': ['00000','00000','00000','00000','00000','00000','11111'],
};

// Simple PNG writer using only standard library
class PngWriter {
  private width: number;
  private height: number;
  private data: Uint8Array;
  private rowBytes: number;
  private font: Record<string, number[][]>;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.rowBytes = width * 4;
    this.data = new Uint8Array(height * this.rowBytes);
    // Fill with white background
    this.data.fill(255);
    // Build font once from module-level patterns
    this.font = this.buildFont();
  }

  private buildFont(): Record<string, number[][]> {
    const font: Record<string, number[][]> = {};
    for (const [char, rows] of Object.entries(FONT_PATTERNS)) {
      font[char] = rows.map(row => row.split('').map(c => c === '1' ? 1 : 0));
    }
    return font;
  }

  setPixel(x: number, y: number, r: number, g: number, b: number, a: number = 255) {
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) return;
    const idx = y * this.rowBytes + x * 4;
    this.data[idx] = r;
    this.data[idx + 1] = g;
    this.data[idx + 2] = b;
    this.data[idx + 3] = a;
  }

  fillRect(x: number, y: number, w: number, h: number, r: number, g: number, b: number, a: number = 255) {
    for (let dy = 0; dy < h; dy++) {
      for (let dx = 0; dx < w; dx++) {
        this.setPixel(x + dx, y + dy, r, g, b, a);
      }
    }
  }

  drawText(x: number, y: number, text: string, color: [number, number, number] = [0, 0, 0], fontSize: number = 16) {
    let cx = x;
    for (const char of text) {
      const glyph = this.font[char] || this.font['?'];
      if (!glyph) { cx += fontSize * 0.6; continue; }
      for (let gy = 0; gy < glyph.length; gy++) {
        const row = glyph[gy];
        for (let gx = 0; gx < row.length; gx++) {
          if (row[gx]) {
            const scale = fontSize / 7;
            for (let sy = 0; sy < scale; sy++) {
              for (let sx = 0; sx < scale; sx++) {
                this.setPixel(
                  Math.round(cx + gx * scale + sx),
                  Math.round(y + gy * scale + sy),
                  color[0], color[1], color[2]
                );
              }
            }
          }
        }
      }
      cx += fontSize * 0.65;
    }
  }

  drawTextWrapped(x: number, y: number, text: string, maxWidth: number, color: [number, number, number], fontSize: number = 13, lineHeight: number = 18): number {
    const words = text.split(' ');
    let line = '';
    let cy = y;
    for (const word of words) {
      const testLine = line + (line ? ' ' : '') + word;
      const textWidth = testLine.length * fontSize * 0.65;
      if (textWidth > maxWidth && line) {
        this.drawText(x, cy, line, color, fontSize);
        cy += lineHeight;
        line = word;
      } else {
        line = testLine;
      }
    }
    if (line) {
      this.drawText(x, cy, line, color, fontSize);
      cy += lineHeight;
    }
    return cy;
  }

  toBuffer(): Buffer {
    // PNG encoding
    const chunks: Buffer[] = [];

    // Signature
    chunks.push(Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]));

    // IHDR
    const ihdr = Buffer.alloc(13);
    ihdr.writeUInt32BE(this.width, 0);
    ihdr.writeUInt32BE(this.height, 4);
    ihdr[8] = 8; // bit depth
    ihdr[9] = 6; // color type: truecolor with alpha
    ihdr[10] = 0; // compression
    ihdr[11] = 0; // filter
    ihdr[12] = 0; // interlace
    chunks.push(this.makeChunk('IHDR', ihdr));

    // IDAT - compress image data with deflate
    const rawData = Buffer.alloc(this.height * (this.rowBytes + 1));
    for (let y = 0; y < this.height; y++) {
      rawData[y * (this.rowBytes + 1)] = 0; // filter type 0 (none)
      rawData.set(this.data.subarray(y * this.rowBytes, (y + 1) * this.rowBytes), y * (this.rowBytes + 1) + 1);
    }

    const compressed = deflateSync(rawData);
    chunks.push(this.makeChunk('IDAT', compressed));

    // IEND
    chunks.push(this.makeChunk('IEND', Buffer.alloc(0)));

    return Buffer.concat(chunks);
  }

  private makeChunk(type: string, data: Buffer): Buffer {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length, 0);
    const typeBuf = Buffer.from(type, 'ascii');
    const crc = this.crc32(Buffer.concat([typeBuf, data]));
    const crcBuf = Buffer.alloc(4);
    crcBuf.writeUInt32BE(crc, 0);
    return Buffer.concat([len, typeBuf, data, crcBuf]);
  }

  private crc32(buf: Buffer): number {
    let crc = 0xFFFFFFFF;
    const table = this.makeCrcTable();
    for (let i = 0; i < buf.length; i++) {
      crc = (crc >>> 8) ^ table[(crc ^ buf[i]) & 0xFF];
    }
    return (crc ^ 0xFFFFFFFF) >>> 0;
  }

  private makeCrcTable(): number[] {
    const table = new Array(256);
    for (let i = 0; i < 256; i++) {
      let c = i;
      for (let j = 0; j < 8; j++) {
        c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
      }
      table[i] = c;
    }
    return table;
  }

  // Draw a simple circle (for icons)
  drawCircle(cx: number, cy: number, radius: number, color: [number, number, number]) {
    for (let dy = -radius; dy <= radius; dy++) {
      for (let dx = -radius; dx <= radius; dx++) {
        if (dx * dx + dy * dy <= radius * radius) {
          this.setPixel(cx + dx, cy + dy, color[0], color[1], color[2]);
        }
      }
    }
  }

  // Draw a simple rectangle with border
  drawRect(x: number, y: number, w: number, h: number, color: [number, number, number], fill = false, fillColor?: [number, number, number]) {
    if (fill && fillColor) {
      this.fillRect(x, y, w, h, fillColor[0], fillColor[1], fillColor[2]);
    }
    // Top and bottom borders
    for (let dx = 0; dx < w; dx++) {
      this.setPixel(x + dx, y, color[0], color[1], color[2]);
      this.setPixel(x + dx, y + h - 1, color[0], color[1], color[2]);
    }
    // Left and right borders
    for (let dy = 0; dy < h; dy++) {
      this.setPixel(x, y + dy, color[0], color[1], color[2]);
      this.setPixel(x + w - 1, y + dy, color[0], color[1], color[2]);
    }
  }
}

// Generate the news image
function generateNewsImage(): Buffer {
  const width = 800;
  const height = 600;
  const png = new PngWriter(width, height);

  // Colors
  const WHITE = [255, 255, 255] as const;
  const BLACK = [0, 0, 0] as const;
  const DARK_BLUE = [15, 35, 75] as const;
  const MEDIUM_BLUE = [30, 70, 130] as const;
  const LIGHT_BLUE = [90, 150, 210] as const;
  const ACCENT_RED = [190, 40, 40] as const;
  const ACCENT_GREEN = [35, 150, 65] as const;
  const ACCENT_ORANGE = [220, 140, 30] as const;
  const ACCENT_PURPLE = [130, 60, 180] as const;
  const DARK_GRAY = [50, 50, 50] as const;
  const MEDIUM_GRAY = [100, 100, 100] as const;
  const LIGHT_GRAY = [235, 235, 235] as const;
  const VERY_LIGHT_GRAY = [248, 248, 248] as const;
  const CARD_BG = [250, 250, 252] as const;
  const BORDER_COLOR = [200, 205, 215] as const;

  // ===== HEADER BAR =====
  png.fillRect(0, 0, width, 110, ...DARK_BLUE);
  // Gradient accent line
  for (let x = 0; x < width; x++) {
    const ratio = x / width;
    const r = Math.round(15 + ratio * 25);
    const g = Math.round(35 + ratio * 45);
    const b = Math.round(75 + ratio * 55);
    png.setPixel(x, 109, r, g, b);
  }

  // Title
  png.drawText(40, 18, 'WORLD NEWS DAILY', WHITE, 34);
  png.drawText(40, 58, 'Thursday, 19 November 2026', [200, 220, 255], 18);

  // Date badge on right
  png.fillRect(width - 220, 15, 180, 45, ...ACCENT_RED);
  png.drawText(width - 205, 22, '19 NOV 2026', WHITE, 22);
  png.drawText(width - 205, 44, 'THURSDAY', WHITE, 13);

  // World icon
  png.drawCircle(width - 40, 37, 18, [100, 180, 255]);
  png.drawCircle(width - 40, 37, 12, DARK_BLUE);
  // Simple meridians
  for (let angle = 0; angle < 360; angle += 45) {
    const x = Math.round((width - 40) + 8 * Math.cos(angle * Math.PI / 180));
    const y = Math.round(37 + 8 * Math.sin(angle * Math.PI / 180));
    png.setPixel(x, y, 100, 180, 255);
  }

  // ===== SECTION DIVIDER =====
  png.fillRect(0, 110, width, 4, [60, 110, 180]);

  // ===== MAIN CONTENT AREA =====
  png.fillRect(0, 114, width, height - 114, ...VERY_LIGHT_GRAY);

  // Top horizontal divider
  png.fillRect(40, 134, width - 80, 2, ...LIGHT_BLUE);

  // ===== NEWS COLUMNS =====
  const colGap = 15;
  const colWidth = (width - 100 - 2 * colGap) / 3;
  const colStart = [50, 50 + colWidth + colGap, 50 + 2 * (colWidth + colGap)];
  const sectionTop = 150;
  const cardTop = 190;
  const cardHeight = 380;
  const cardBottom = cardTop + cardHeight;

  // Column headers with icons
  const colHeaders = [
    { title: 'WORLD & POLITICS', color: ACCENT_RED, icon: '🌐' },
    { title: 'BUSINESS & TECH', color: DARK_BLUE, icon: '💼' },
    { title: 'SCIENCE & SPORTS', color: ACCENT_GREEN, icon: '🔬' },
  ];

  const worldNews = [
    'UN Climate Summit Opens in Baku',
    'G20 Leaders Agree Trade Reform',
    'Middle East Ceasefire Talks Resume',
    'EU Migration Pact Takes Effect',
    'African Union Elects New Chair',
    'Pacific Forum Warns on Sea Rise',
  ];

  const bizTechNews = [
    'Fed Holds Rates Steady at 4.5%',
    'AI Chip Export Rules Updated',
    'Semiconductor Sales Surge 12%',
    'Major Euro Bank Merger Announced',
    'Crypto Framework Passes Senate',
    'Quantum Computing Milestone',
  ];

  const sciSportsNews = [
    'Artemis IV Launches to Moon',
    'Fusion Reactor Sets Record',
    'New Antibiotic Shows Promise',
    'World Cup Qualifiers Decided',
    'Tennis Finals: Historic Upset',
    'Marathon Record Falls in NYC',
  ];

  const allNews = [worldNews, bizTechNews, sciSportsNews];

  for (let col = 0; col < 3; col++) {
    const x = colStart[col];
    const header = colHeaders[col];

    // Card background
    png.fillRect(x, cardTop, colWidth, cardHeight, ...CARD_BG);
    // Card border
    png.drawRect(x, cardTop, colWidth, cardHeight, BORDER_COLOR);

    // Header background
    png.fillRect(x, cardTop, colWidth, 44, ...header.color);

    // Header text
    png.drawText(x + 14, cardTop + 10, header.title, WHITE, 15);

    // News items
    let y = cardTop + 58;
    for (let i = 0; i < allNews[col].length; i++) {
      const item = allNews[col][i];

      // Alternating row background
      if (i % 2 === 0) {
        png.fillRect(x + 2, y - 4, colWidth - 4, 28, ...VERY_LIGHT_GRAY);
      }

      // Bullet point
      png.fillRect(x + 14, y + 4, 8, 8, ...header.color);

      // Number
      png.drawText(x + 12, y - 1, String(i + 1), header.color, 11);

      // Text
      png.drawTextWrapped(x + 30, y, item, colWidth - 44, DARK_GRAY, 13, 18);

      y += 32;
    }

    // Bottom accent bar
    png.fillRect(x, cardBottom - 4, colWidth, 4, ...header.color);
  }

  // ===== BOTTOM BAR =====
  const bottomBarY = height - 45;
  png.fillRect(0, bottomBarY, width, 45, ...DARK_GRAY);
  png.drawText(40, bottomBarY + 12, 'make.fun  •  News Image Daily  •  Generated by AI Agent', [170, 170, 170], 11);
  png.drawText(width - 320, bottomBarY + 12, 'Summing up 19 November 2026', [170, 170, 170], 11);

  // ===== FOOTER =====
  png.fillRect(0, height - 5, width, 5, ...ACCENT_RED);

  return png.toBuffer();
}

// Main entry point
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
const imageBuffer = generateNewsImage();
writeFileSync(join(outputDir, 'entry.png'), imageBuffer);
console.log(`Generated entry.png (${imageBuffer.length} bytes) at ${join(outputDir, 'entry.png')}`);