import { useState, useRef, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Mic, MicOff, RotateCcw } from 'lucide-react';

interface Stats {
  min: number;
  max: number;
  avg: number;
  samples: number;
}

const NOISE_LEVELS = [
  { max: 30, label: '极安静', color: 'text-green-600', bg: 'bg-green-500', desc: '如耳语、安静图书馆' },
  { max: 50, label: '安静', color: 'text-green-500', bg: 'bg-green-400', desc: '如安静办公室、轻声交谈' },
  { max: 60, label: '适中', color: 'text-yellow-500', bg: 'bg-yellow-400', desc: '如正常交谈' },
  { max: 70, label: '较响', color: 'text-orange-500', bg: 'bg-orange-400', desc: '如吸尘器、繁忙交通' },
  { max: 85, label: '嘈杂', color: 'text-orange-600', bg: 'bg-orange-500', desc: '如工厂噪音，长期暴露可能损伤听力' },
  { max: 100, label: '很吵', color: 'text-red-500', bg: 'bg-red-500', desc: '如电钻、摩托车，需要听力保护' },
  { max: Infinity, label: '危险', color: 'text-red-700', bg: 'bg-red-600', desc: '如摇滚音乐会、喷气引擎，可造成永久听力损伤' },
];

function getNoiseLevel(db: number) {
  return NOISE_LEVELS.find(l => db <= l.max) || NOISE_LEVELS[NOISE_LEVELS.length - 1];
}

export const NoiseMeter = () => {
  const [isListening, setIsListening] = useState(false);
  const [currentDb, setCurrentDb] = useState(0);
  const [stats, setStats] = useState<Stats>({ min: Infinity, max: -Infinity, avg: 0, samples: 0 });
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<number[]>([]);

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animFrameRef = useRef<number>(0);
  const totalDbRef = useRef(0);

  const stop = useCallback(() => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = 0;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    analyserRef.current = null;
    setIsListening(false);
  }, []);

  const start = useCallback(async () => {
    setError(null);

    if (!window.isSecureContext) {
      setError('麦克风功能需要 HTTPS 安全环境，请使用 HTTPS 访问本页面');
      return;
    }

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setError('当前浏览器不支持麦克风访问（navigator.mediaDevices 不可用），请尝试使用最新版 Chrome / Safari / Firefox 并通过 HTTPS 访问');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) {
        setError('当前浏览器不支持 Web Audio API');
        return;
      }
      const audioContext = new AudioCtx();
      audioContextRef.current = audioContext;

      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 2048;
      analyser.smoothingTimeConstant = 0.3;
      source.connect(analyser);
      analyserRef.current = analyser;

      setIsListening(true);
      setStats({ min: Infinity, max: -Infinity, avg: 0, samples: 0 });
      setHistory([]);
      totalDbRef.current = 0;

      const dataArray = new Float32Array(analyser.fftSize);

      const measure = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getFloatTimeDomainData(dataArray);

        let sumSquares = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sumSquares += dataArray[i] * dataArray[i];
        }
        const rms = Math.sqrt(sumSquares / dataArray.length);
        const db = rms > 0 ? Math.max(0, 20 * Math.log10(rms) + 94) : 0;
        const dbRounded = Math.round(db * 10) / 10;

        setCurrentDb(dbRounded);
        setStats(prev => {
          const newSamples = prev.samples + 1;
          totalDbRef.current += dbRounded;
          return {
            min: Math.min(prev.min === Infinity ? dbRounded : prev.min, dbRounded),
            max: Math.max(prev.max === -Infinity ? dbRounded : prev.max, dbRounded),
            avg: Math.round((totalDbRef.current / newSamples) * 10) / 10,
            samples: newSamples,
          };
        });
        setHistory(prev => {
          const next = [...prev, dbRounded];
          return next.length > 100 ? next.slice(-100) : next;
        });

        animFrameRef.current = requestAnimationFrame(measure);
      };

      animFrameRef.current = requestAnimationFrame(measure);
    } catch (e) {
      if (e instanceof DOMException && e.name === 'NotAllowedError') {
        setError('麦克风权限被拒绝，请在浏览器设置中允许访问麦克风');
      } else if (e instanceof DOMException && e.name === 'NotFoundError') {
        setError('未检测到麦克风设备');
      } else {
        setError('无法访问麦克风: ' + (e instanceof Error ? e.message : String(e)));
      }
    }
  }, []);

  const reset = useCallback(() => {
    setStats({ min: Infinity, max: -Infinity, avg: 0, samples: 0 });
    setHistory([]);
    totalDbRef.current = 0;
  }, []);

  useEffect(() => {
    return () => { stop(); };
  }, [stop]);

  const noiseLevel = getNoiseLevel(currentDb);
  const meterPercent = Math.min(100, (currentDb / 120) * 100);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Noise Meter</h1>
      <p className="text-gray-600">使用麦克风实时检测环境噪音分贝值</p>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Controls */}
      <div className="flex gap-3">
        {!isListening ? (
          <Button onClick={start} variant="primary" className="flex items-center gap-2">
            <Mic className="w-4 h-4" />
            开始检测
          </Button>
        ) : (
          <Button onClick={stop} variant="outline" className="flex items-center gap-2">
            <MicOff className="w-4 h-4" />
            停止检测
          </Button>
        )}
        {isListening && (
          <Button onClick={reset} variant="outline" className="flex items-center gap-2">
            <RotateCcw className="w-4 h-4" />
            重置统计
          </Button>
        )}
      </div>

      {/* Main Display */}
      <div className="p-8 bg-white rounded-xl border border-gray-200 shadow-sm text-center">
        <div className="text-7xl font-bold tabular-nums mb-2">
          {isListening ? currentDb.toFixed(1) : '--'}
        </div>
        <div className="text-2xl text-gray-500 mb-4">dB</div>

        {isListening && (
          <div className={`text-lg font-medium ${noiseLevel.color}`}>
            {noiseLevel.label} — {noiseLevel.desc}
          </div>
        )}

        {/* Meter bar */}
        <div className="mt-6 mx-auto max-w-md">
          <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-150 ${noiseLevel.bg}`}
              style={{ width: `${isListening ? meterPercent : 0}%` }}
            />
          </div>
          <div className="flex justify-between mt-1 text-xs text-gray-400">
            <span>0 dB</span>
            <span>30</span>
            <span>60</span>
            <span>90</span>
            <span>120 dB</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      {isListening && stats.samples > 0 && (
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 bg-white rounded-lg border border-gray-200 text-center">
            <div className="text-sm text-gray-500 mb-1">最小值</div>
            <div className="text-2xl font-semibold tabular-nums">
              {stats.min === Infinity ? '--' : stats.min.toFixed(1)}
            </div>
            <div className="text-xs text-gray-400">dB</div>
          </div>
          <div className="p-4 bg-white rounded-lg border border-gray-200 text-center">
            <div className="text-sm text-gray-500 mb-1">平均值</div>
            <div className="text-2xl font-semibold tabular-nums">{stats.avg.toFixed(1)}</div>
            <div className="text-xs text-gray-400">dB</div>
          </div>
          <div className="p-4 bg-white rounded-lg border border-gray-200 text-center">
            <div className="text-sm text-gray-500 mb-1">最大值</div>
            <div className="text-2xl font-semibold tabular-nums">
              {stats.max === -Infinity ? '--' : stats.max.toFixed(1)}
            </div>
            <div className="text-xs text-gray-400">dB</div>
          </div>
        </div>
      )}

      {/* Waveform History */}
      {isListening && history.length > 1 && (
        <div className="p-4 bg-white rounded-lg border border-gray-200">
          <div className="text-sm font-medium text-gray-700 mb-3">实时波形</div>
          <div className="h-24 flex items-end gap-px">
            {history.map((db, i) => (
              <div
                key={i}
                className={`flex-1 min-w-[2px] rounded-t transition-all duration-75 ${getNoiseLevel(db).bg}`}
                style={{ height: `${Math.max(2, (db / 120) * 100)}%` }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Reference Table */}
      <div className="p-4 bg-white rounded-lg border border-gray-200">
        <div className="text-sm font-medium text-gray-700 mb-3">噪音等级参考</div>
        <div className="space-y-2">
          {NOISE_LEVELS.map((level, i) => (
            <div key={i} className="flex items-center gap-3 text-sm">
              <div className={`w-3 h-3 rounded-full ${level.bg}`} />
              <span className="font-medium w-16">{level.label}</span>
              <span className="text-gray-500">
                {i === 0 ? '0' : NOISE_LEVELS[i - 1].max}–{level.max === Infinity ? '120+' : level.max} dB
              </span>
              <span className="text-gray-400 hidden sm:inline">| {level.desc}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
