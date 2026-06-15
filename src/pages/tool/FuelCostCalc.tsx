import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/Input';
import { Fuel, DollarSign, TrendingDown, TrendingUp, Gauge, Car, BatteryCharging } from 'lucide-react';

type FuelType = 'gasoline' | 'electric';

const FUEL_LABELS: Record<FuelType, { unit: string; name: string; consumptionLabel: string; priceLabel: string }> = {
  gasoline: {
    unit: 'L',
    name: '汽油/柴油',
    consumptionLabel: '百公里油耗 (L/100km)',
    priceLabel: '每升油价格 (元/L)',
  },
  electric: {
    unit: 'kWh',
    name: '电耗',
    consumptionLabel: '百公里电耗 (kWh/100km)',
    priceLabel: '每度电价格 (元/kWh)',
  },
};

export const FuelCostCalc = () => {
  const [fuelType, setFuelType] = useState<FuelType>('gasoline');
  const [gasValues, setGasValues] = useState({ consumption: '10', price: '8' });
  const [elecValues, setElecValues] = useState({ consumption: '15', price: '1' });

  const values = fuelType === 'gasoline' ? gasValues : elecValues;
  const setValues = fuelType === 'gasoline' ? setGasValues : setElecValues;

  const result = useMemo(() => {
    const c = parseFloat(values.consumption);
    const p = parseFloat(values.price);
    if (isNaN(c) || isNaN(p) || c <= 0 || p <= 0) return null;
    const costPer100km = c * p;
    const costPerKm = costPer100km / 100;
    return { costPer100km, costPerKm };
  }, [values]);

  const labels = FUEL_LABELS[fuelType];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">汽车能耗计算</h1>
      </div>

      {/* Fuel type selector */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setFuelType('gasoline')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
            fuelType === 'gasoline'
              ? 'border-gray-900 bg-gray-900 text-white shadow-sm'
              : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:text-gray-900'
          }`}
        >
          <Car className="w-4 h-4" />
          燃油
        </button>
        <button
          onClick={() => setFuelType('electric')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
            fuelType === 'electric'
              ? 'border-gray-900 bg-gray-900 text-white shadow-sm'
              : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:text-gray-900'
          }`}
        >
          <BatteryCharging className="w-4 h-4" />
          电动
        </button>
      </div>

      {/* Input form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Consumption input */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            {labels.consumptionLabel}
          </label>
          <div className="relative">
            <Input
              type="number"
              step="0.01"
              min="0"
              value={values.consumption}
              onChange={e => setValues(prev => ({ ...prev, consumption: e.target.value }))}
              className="pl-3 pr-12 [-moz-appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              placeholder="例如: 8"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400 pointer-events-none">
              {labels.unit}/100km
            </div>
          </div>
          <p className="text-xs text-gray-400">
            输入车辆每100公里消耗的燃料量
          </p>
        </div>

        {/* Price input */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            {labels.priceLabel}
          </label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400 pointer-events-none">
              ¥
            </div>
            <Input
              type="number"
              step="0.01"
              min="0"
              value={values.price}
              onChange={e => setValues(prev => ({ ...prev, price: e.target.value }))}
              className="pl-7 pr-12 [-moz-appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              placeholder="例如: 8"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400 pointer-events-none">
              /{labels.unit}
            </div>
          </div>
          <p className="text-xs text-gray-400">
            输入每{fuelType === 'gasoline' ? '升' : '度'}{fuelType === 'gasoline' ? '油' : '电'}的价格
          </p>
        </div>
      </div>

      {/* Result */}
      {result !== null && (
        <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
          {/* Per km cost - hero */}
          <div className="p-6 bg-gradient-to-br from-gray-50 to-white border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">每公里成本</p>
                <p className="text-4xl font-bold text-gray-900 tracking-tight">
                  ¥{result.costPerKm.toFixed(3)}
                </p>
                <p className="text-sm text-gray-400">约 {result.costPerKm.toFixed(2)} 元/公里</p>
              </div>
              <div className="w-14 h-14 rounded-full bg-gray-900 flex items-center justify-center">
                <DollarSign className="w-7 h-7 text-white" />
              </div>
            </div>
          </div>

          {/* Detail breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-gray-100">
            <div className="p-4">
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                <Gauge className="w-4 h-4" />
                百公里消耗
              </div>
              <p className="text-lg font-semibold text-gray-900">
                {parseFloat(values.consumption).toFixed(1)} {labels.unit}
              </p>
            </div>
            <div className="p-4">
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                <Fuel className="w-4 h-4" />
                百公里花费
              </div>
              <p className="text-lg font-semibold text-gray-900">
                ¥{result.costPer100km.toFixed(2)}
              </p>
            </div>
            <div className="p-4">
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                {result.costPerKm >= 1
                  ? <TrendingUp className="w-4 h-4 text-orange-500" />
                  : <TrendingDown className="w-4 h-4 text-green-500" />
                }
                成本评估
              </div>
              <p className={`text-lg font-semibold ${
                result.costPerKm >= 1 ? 'text-orange-600' : result.costPerKm >= 0.5 ? 'text-amber-600' : 'text-green-600'
              }`}>
                {result.costPerKm >= 1 ? '偏高' : result.costPerKm >= 0.5 ? '中等' : '较低'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Reference */}
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
        <p className="text-xs font-medium text-gray-500 mb-2">💡 参考说明</p>
        <ul className="text-xs text-gray-500 space-y-1">
          <li>• 公式：每公里成本 = (百公里消耗 × 单价) / 100</li>
          <li>• 燃油车参考：一般家用车百公里油耗在 6-10L 之间</li>
          <li>• 电动车参考：一般家用车百公里电耗在 12-20kWh 之间</li>
          <li>• 成本评估标准：&lt;0.5元/km = 较低，0.5~1元/km = 中等，&gt;1元/km = 偏高</li>
        </ul>
      </div>
    </div>
  );
};