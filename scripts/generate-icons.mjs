// Pure Node.js script to create valid PNG files for PWA
import fs from 'fs';
import zlib from 'zlib';

function createPng(width, height, r, g, b, a = 255) {
  const signature = Buffer.from([137, 80, 78, 70, 13, 10, 26, 10]);

  // IHDR
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData.writeUInt8(8, 8); // 8-bit
  ihdrData.writeUInt8(6, 9); // RGBA
  ihdrData.writeUInt8(0, 10);
  ihdrData.writeUInt8(0, 11);
  ihdrData.writeUInt8(0, 12);
  const ihdrChunk = makeChunk('IHDR', ihdrData);

  // Raw image data with scanline filter bytes
  const rowBytes = width * 4 + 1;
  const rawData = Buffer.alloc(rowBytes * height);

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowBytes;
    rawData[rowOffset] = 0; // Filter type 0 (None)
    for (let x = 0; x < width; x++) {
      const pixelOffset = rowOffset + 1 + x * 4;
      // Border / circle styling
      const dx = x - width / 2;
      const dy = y - height / 2;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const radius = width * 0.44;

      if (dist < radius) {
        // Gold/navy tactical badge
        if (dist > radius - 10) {
          rawData[pixelOffset] = 234;     // Gold R
          rawData[pixelOffset + 1] = 179; // Gold G
          rawData[pixelOffset + 2] = 8;   // Gold B
          rawData[pixelOffset + 3] = 255;
        } else {
          rawData[pixelOffset] = 15;      // Slate R
          rawData[pixelOffset + 1] = 23;  // Slate G
          rawData[pixelOffset + 2] = 42;  // Slate B
          rawData[pixelOffset + 3] = 255;
        }
      } else {
        rawData[pixelOffset] = 2;
        rawData[pixelOffset + 1] = 6;
        rawData[pixelOffset + 2] = 23;
        rawData[pixelOffset + 3] = 255;
      }
    }
  }

  const compressedData = zlib.deflateSync(rawData);
  const idatChunk = makeChunk('IDAT', compressedData);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

function makeChunk(type, data) {
  const len = data.length;
  const buf = Buffer.alloc(8 + len + 4);
  buf.writeUInt32BE(len, 0);
  buf.write(type, 4, 4, 'ascii');
  data.copy(buf, 8);

  const crc = crc32(buf.subarray(4, 8 + len));
  buf.writeInt32BE(crc, 8 + len);
  return buf;
}

// Standard CRC32
function crc32(buf) {
  let crc = -1;
  for (let i = 0; i < buf.length; i++) {
    let byte = buf[i];
    crc ^= byte;
    for (let j = 0; j < 8; j++) {
      crc = (crc >>> 1) ^ (-(crc & 1) & 0xedb88320);
    }
  }
  return crc ^ -1;
}

if (!fs.existsSync('public')) {
  fs.mkdirSync('public');
}

fs.writeFileSync('public/pwa-192x192.png', createPng(192, 192, 15, 23, 42));
fs.writeFileSync('public/pwa-512x512.png', createPng(512, 512, 15, 23, 42));
fs.writeFileSync('public/pwa-maskable-512x512.png', createPng(512, 512, 15, 23, 42));
fs.writeFileSync('public/apple-touch-icon.png', createPng(180, 180, 15, 23, 42));
console.log('Successfully generated PWA PNG assets in public/');
