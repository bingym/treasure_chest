import { Suspense, lazy, type ReactNode } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AppLayout } from './components/Layout';
import { PageSkeleton } from './components/PageSkeleton';
import './App.css';

const Lazy = ({ children }: { children: ReactNode }) => (
  <Suspense fallback={<PageSkeleton />}>{children}</Suspense>
);

const Home = lazy(() => import('./pages/Home').then(m => ({ default: m.Home })));
const About = lazy(() => import('./pages/About').then(m => ({ default: m.About })));
const ToolIndex = lazy(() => import('./pages/tool/ToolIndex').then(m => ({ default: m.ToolIndex })));
const ReferenceIndex = lazy(() => import('./pages/reference/ReferenceIndex').then(m => ({ default: m.ReferenceIndex })));

const JSONFormat = lazy(() => import('./pages/tool/JSONFormat').then(m => ({ default: m.JSONFormat })));
const Base64 = lazy(() => import('./pages/tool/Base64').then(m => ({ default: m.Base64 })));
const Timestamp = lazy(() => import('./pages/tool/Timestamp').then(m => ({ default: m.Timestamp })));
const UUID = lazy(() => import('./pages/tool/UUID').then(m => ({ default: m.UUID })));
const Md5 = lazy(() => import('./pages/tool/Md5').then(m => ({ default: m.Md5 })));
const Sha256 = lazy(() => import('./pages/tool/Sha256').then(m => ({ default: m.Sha256 })));
const UrlEncodeDecode = lazy(() => import('./pages/tool/UrlEncodeDecode').then(m => ({ default: m.UrlEncodeDecode })));
const WordCount = lazy(() => import('./pages/tool/WordCount').then(m => ({ default: m.WordCount })));
const SqlFormat = lazy(() => import('./pages/tool/SqlFormat').then(m => ({ default: m.SqlFormat })));
const UnicodeZh = lazy(() => import('./pages/tool/UnicodeZh').then(m => ({ default: m.UnicodeZh })));
const ByteCalc = lazy(() => import('./pages/tool/ByteCalc').then(m => ({ default: m.ByteCalc })));
const TextDiff = lazy(() => import('./pages/tool/TextDiff').then(m => ({ default: m.TextDiff })));
const ByteCount = lazy(() => import('./pages/tool/ByteCount').then(m => ({ default: m.ByteCount })));
const ExifInfo = lazy(() => import('./pages/tool/ExifInfo').then(m => ({ default: m.ExifInfo })));
const ImageCompress = lazy(() => import('./pages/tool/ImageCompress').then(m => ({ default: m.ImageCompress })));
const Qrcode = lazy(() => import('./pages/tool/Qrcode').then(m => ({ default: m.Qrcode })));
const RandomChars = lazy(() => import('./pages/tool/RandomChars').then(m => ({ default: m.RandomChars })));
const CoreValuesEncoder = lazy(() => import('./pages/tool/CoreValuesEncoder').then(m => ({ default: m.CoreValuesEncoder })));
const NoiseMeter = lazy(() => import('./pages/tool/NoiseMeter').then(m => ({ default: m.NoiseMeter })));

const HttpCode = lazy(() => import('./pages/reference/HttpCode').then(m => ({ default: m.HttpCode })));
const AsciiTable = lazy(() => import('./pages/reference/AsciiTable').then(m => ({ default: m.AsciiTable })));
const TimeFormatPlaceholder = lazy(() => import('./pages/reference/TimeFormatPlaceholder').then(m => ({ default: m.TimeFormatPlaceholder })));
const HtmlMark = lazy(() => import('./pages/reference/HtmlMark').then(m => ({ default: m.HtmlMark })));
const Source = lazy(() => import('./pages/reference/Source').then(m => ({ default: m.Source })));

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Lazy><Home /></Lazy>} />
          <Route path="about" element={<Lazy><About /></Lazy>} />

          <Route path="tool" element={<Lazy><ToolIndex /></Lazy>} />
          <Route path="tool/json-format" element={<Lazy><JSONFormat /></Lazy>} />
          <Route path="tool/sql-format" element={<Lazy><SqlFormat /></Lazy>} />
          <Route path="tool/timestamp" element={<Lazy><Timestamp /></Lazy>} />
          <Route path="tool/md5" element={<Lazy><Md5 /></Lazy>} />
          <Route path="tool/sha256" element={<Lazy><Sha256 /></Lazy>} />
          <Route path="tool/base64" element={<Lazy><Base64 /></Lazy>} />
          <Route path="tool/unicode-zh" element={<Lazy><UnicodeZh /></Lazy>} />
          <Route path="tool/byte-calc" element={<Lazy><ByteCalc /></Lazy>} />
          <Route path="tool/uuid" element={<Lazy><UUID /></Lazy>} />
          <Route path="tool/url-encode-decode" element={<Lazy><UrlEncodeDecode /></Lazy>} />
          <Route path="tool/text-diff" element={<Lazy><TextDiff /></Lazy>} />
          <Route path="tool/word-count" element={<Lazy><WordCount /></Lazy>} />
          <Route path="tool/byte-count" element={<Lazy><ByteCount /></Lazy>} />
          <Route path="tool/exif-info" element={<Lazy><ExifInfo /></Lazy>} />
          <Route path="tool/image-compress" element={<Lazy><ImageCompress /></Lazy>} />
          <Route path="tool/qrcode" element={<Lazy><Qrcode /></Lazy>} />
          <Route path="tool/random-chars" element={<Lazy><RandomChars /></Lazy>} />
          <Route path="tool/core-values-encoder" element={<Lazy><CoreValuesEncoder /></Lazy>} />
          <Route path="tool/noise-meter" element={<Lazy><NoiseMeter /></Lazy>} />

          <Route path="reference" element={<Lazy><ReferenceIndex /></Lazy>} />
          <Route path="reference/http-code" element={<Lazy><HttpCode /></Lazy>} />
          <Route path="reference/ascii-table" element={<Lazy><AsciiTable /></Lazy>} />
          <Route path="reference/time-format-placeholder" element={<Lazy><TimeFormatPlaceholder /></Lazy>} />
          <Route path="reference/http-mark" element={<Lazy><HtmlMark /></Lazy>} />
          <Route path="reference/source" element={<Lazy><Source /></Lazy>} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
