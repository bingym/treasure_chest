import type { FuncGroup } from '@/types';

export const toolData: FuncGroup[] = [
  {
    Name: 'Development',
    Data: [
      { Name: 'JSON Formatter', Path: '/tool/json-format', Description: 'Format, validate and view JSON data' },
      { Name: 'SQL Formatter', Path: '/tool/sql-format', Description: 'Format SQL queries with dialect support' },
      { Name: 'Timestamp', Path: '/tool/timestamp', Description: 'Convert between timestamps and datetime' },
      { Name: 'MD5', Path: '/tool/md5', Description: 'Generate MD5 hash with optional HMAC' },
      { Name: 'SHA256', Path: '/tool/sha256', Description: 'Generate SHA256 hash with optional HMAC' },
      { Name: 'Base64 Encode/Decode', Path: '/tool/base64', Description: 'Encode/decode text or files to Base64' },
      { Name: 'Unicode/Chinese', Path: '/tool/unicode-zh', Description: 'Convert between Unicode and Chinese' },
      { Name: 'Byte Calculator', Path: '/tool/byte-calc', Description: 'Convert between byte units (B/KB/MB/GB)' },
      { Name: 'UUID', Path: '/tool/uuid', Description: 'Generate UUID v4 in various formats' },
      { Name: 'URL Encode/Decode', Path: '/tool/url-encode-decode', Description: 'Encode/decode URL components' },
      { Name: 'Word Count', Path: '/tool/word-count', Description: 'Count words, chars, lines and paragraphs' },
      { Name: 'Byte Count', Path: '/tool/byte-count', Description: 'Calculate string byte size in UTF-8/16/32' },
    ],
  },
  {
    Name: 'Photography',
    Data: [
      { Name: 'EXIF Info', Path: '/tool/exif-info', Description: 'Extract EXIF metadata from images' },
      { Name: 'Image Compress', Path: '/tool/image-compress', Description: 'Compress images with quality control' },
    ],
  },
  {
    Name: 'Others',
    Data: [
      { Name: 'QR Code', Path: '/tool/qrcode', Description: 'Generate QR code from text or URL' },
      { Name: 'Random Password Generator', Path: '/tool/random-chars', Description: 'Generate random passwords and strings' },
      { Name: 'Text Diff', Path: '/tool/text-diff', Description: 'Compare two texts and highlight differences' },
      { Name: 'Core Values Encoder', Path: '/tool/core-values-encoder', Description: 'Encode/decode text with core socialist values' },
      { Name: 'Noise Meter', Path: '/tool/noise-meter', Description: 'Detect ambient noise level in decibels using microphone' },
    ],
  },
];
