import { useMemo, useState } from 'react';
import { BatteryCharging, Car, Copy, Download, Shuffle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { toast } from '@/lib/toast';

type PlateType = 'blue' | 'green';

const PROVINCES = [
  '京', '津', '沪', '渝', '冀', '豫', '云', '辽', '黑', '湘', '皖', '鲁', '新', '苏', '浙', '赣',
  '鄂', '桂', '甘', '晋', '蒙', '陕', '吉', '闽', '贵', '粤', '青', '藏', '川', '宁', '琼',
];
const LETTERS = 'ABCDEFGHJKLMNPQRSTUVWXYZ'.split('');
const SERIAL_CHARS = '0123456789ABCDEFGHJKLMNPQRSTUVWXYZ';

const PLATE_CONFIG = {
  blue: {
    label: '燃油车',
    icon: Car,
    serialLength: 5,
    background: '/license-plate/blue/plate.png',
    folder: 'blue',
    positions: [3.02, 15.7, 34.29, 46.97, 59.65, 72.32, 85],
  },
  green: {
    label: '新能源车',
    icon: BatteryCharging,
    serialLength: 6,
    background: '/license-plate/green/plate.jpg',
    folder: 'green',
    positions: [3.25, 13.99, 32.73, 43.47, 54.21, 64.95, 75.69, 86.43],
  },
} as const;

function assetPath(type: PlateType, char: string) {
  return `/license-plate/${PLATE_CONFIG[type].folder}/${char}.png`;
}

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });
}

export const LicensePlate = () => {
  const [plateType, setPlateType] = useState<PlateType>('blue');
  const [province, setProvince] = useState('陕');
  const [city, setCity] = useState('A');
  const [serial, setSerial] = useState('12345');

  const config = PLATE_CONFIG[plateType];
  const plateChars = useMemo(
    () => [province, city, ...serial.padEnd(config.serialLength, '0').split('')],
    [city, config.serialLength, province, serial],
  );
  const plateText = `${province}${city}${serial}`;

  const changeType = (nextType: PlateType) => {
    setPlateType(nextType);
    setSerial(current => {
      const length = PLATE_CONFIG[nextType].serialLength;
      return current.slice(0, length).padEnd(length, '0');
    });
  };

  const changeSerial = (value: string) => {
    const cleaned = value
      .toUpperCase()
      .replace(/[^0-9A-Z]/g, '')
      .replace(/[IO]/g, '')
      .slice(0, config.serialLength);
    setSerial(cleaned);
  };

  const randomize = () => {
    const nextProvince = PROVINCES[Math.floor(Math.random() * PROVINCES.length)];
    const nextCity = LETTERS[Math.floor(Math.random() * LETTERS.length)];
    const nextSerial = Array.from(
      { length: config.serialLength },
      () => SERIAL_CHARS[Math.floor(Math.random() * SERIAL_CHARS.length)],
    ).join('');
    setProvince(nextProvince);
    setCity(nextCity);
    setSerial(nextSerial);
  };

  const copyPlate = async () => {
    await navigator.clipboard.writeText(plateText);
    toast.success('Plate number copied');
  };

  const downloadPlate = async () => {
    try {
      const [background, ...glyphs] = await Promise.all([
        loadImage(config.background),
        ...plateChars.map(char => loadImage(assetPath(plateType, char))),
      ]);
      const canvas = document.createElement('canvas');
      canvas.width = background.naturalWidth;
      canvas.height = background.naturalHeight;
      const context = canvas.getContext('2d');
      if (!context) throw new Error('Canvas is unavailable');

      context.drawImage(background, 0, 0);
      const glyphHeight = canvas.height * 0.72165;
      const top = canvas.height * 0.1392;
      glyphs.forEach((glyph, index) => {
        const glyphWidth = glyphHeight * (glyph.naturalWidth / glyph.naturalHeight);
        context.drawImage(
          glyph,
          canvas.width * (config.positions[index] / 100),
          top,
          glyphWidth,
          glyphHeight,
        );
      });

      const link = document.createElement('a');
      link.download = `${plateText}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      toast.success('Plate image downloaded');
    } catch (error) {
      console.error(error);
      toast.error('Failed to render plate image');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-bold">车牌模拟器</h1>
        <Button variant="outline" onClick={randomize} className="flex items-center gap-2">
          <Shuffle className="h-4 w-4" />
          随机生成
        </Button>
      </div>

      <div className="flex w-full gap-1 rounded-lg border border-gray-200 bg-gray-100 p-1 sm:w-fit">
        {(Object.keys(PLATE_CONFIG) as PlateType[]).map(type => {
          const Icon = PLATE_CONFIG[type].icon;
          const active = plateType === type;
          return (
            <button
              key={type}
              type="button"
              onClick={() => changeType(type)}
              className={`flex flex-1 items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors sm:flex-none ${
                active ? 'bg-white text-gray-950 shadow-sm' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <Icon className="h-4 w-4" />
              {PLATE_CONFIG[type].label}
            </button>
          );
        })}
      </div>

      <section className="border-y border-gray-200 bg-gray-50 px-3 py-8 sm:px-8 sm:py-12">
        <div className="mx-auto w-full max-w-[800px]">
          <div
            className="relative overflow-hidden shadow-[0_14px_35px_rgba(15,23,42,0.22)]"
            style={{ aspectRatio: plateType === 'blue' ? '1584 / 507' : '1742 / 507' }}
          >
            <img src={config.background} alt="" className="absolute inset-0 h-full w-full" />
            {plateChars.map((char, index) => (
              <img
                key={`${index}-${char}`}
                src={assetPath(plateType, char)}
                alt={char}
                className="absolute z-10 h-[72.165%] w-auto max-w-none"
                style={{ left: `${config.positions[index]}%`, top: '13.92%' }}
              />
            ))}
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-[140px_140px_minmax(220px,1fr)]">
        <label className="space-y-2">
          <span className="block text-sm font-medium text-gray-700">省份</span>
          <select
            value={province}
            onChange={event => setProvince(event.target.value)}
            className="h-10 w-full rounded-md border border-gray-300 bg-white px-3 text-sm outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
          >
            {PROVINCES.map(item => <option key={item}>{item}</option>)}
          </select>
        </label>

        <label className="space-y-2">
          <span className="block text-sm font-medium text-gray-700">发牌机关</span>
          <select
            value={city}
            onChange={event => setCity(event.target.value)}
            className="h-10 w-full rounded-md border border-gray-300 bg-white px-3 text-sm outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
          >
            {LETTERS.map(item => <option key={item}>{item}</option>)}
          </select>
        </label>

        <label className="space-y-2">
          <span className="block text-sm font-medium text-gray-700">序号</span>
          <Input
            value={serial}
            onChange={event => changeSerial(event.target.value)}
            maxLength={config.serialLength}
            placeholder={plateType === 'blue' ? '12345' : 'D12345'}
            className="font-mono uppercase"
          />
        </label>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button variant="outline" onClick={copyPlate} className="flex items-center gap-2" disabled={serial.length !== config.serialLength}>
          <Copy className="h-4 w-4" />
          复制车牌号
        </Button>
        <Button variant="primary" onClick={downloadPlate} className="flex items-center gap-2" disabled={serial.length !== config.serialLength}>
          <Download className="h-4 w-4" />
          下载 PNG
        </Button>
      </div>
    </div>
  );
};
