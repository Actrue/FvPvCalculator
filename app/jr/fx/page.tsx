"use client";
import { useState, useEffect } from 'react';
import { 获取币种现价 } from './function';

type TradeRecord = {
  id: string;
  tradeType: 'long' | 'short';
  entryPrice: string;
  leverage: string;
  maxLossPercent: string;
  targetProfitPercent: string;
  targetPrice: string;
  stopLossPrice: number | null;
  takeProfitPrice: number | null;
  calculatedProfitPercent: number | null;
  createdAt: number;
};

export default function FXCalculator() {
  const [tradeType, setTradeType] = useState<'long' | 'short'>('long');
  const [entryPrice, setEntryPrice] = useState('');
  const [leverage, setLeverage] = useState('');
  const [maxLossPercent, setMaxLossPercent] = useState('');
  const [targetProfitPercent, setTargetProfitPercent] = useState('');
  const [targetPrice, setTargetPrice] = useState('');
  const [calculatedProfitPercent, setCalculatedProfitPercent] = useState<number | null>(null);
  const [stopLossPrice, setStopLossPrice] = useState<number | null>(null);
  const [takeProfitPrice, setTakeProfitPrice] = useState<number | null>(null);
  const [records, setRecords] = useState<TradeRecord[]>([]);
  const [editingRecord, setEditingRecord] = useState<TradeRecord | null>(null);
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  // 获取当前比特币价格
  const fetchCurrentPrice = async () => {
    setLoading(true);
    const result = await 获取币种现价('BTC-USD-SWAP');
    if (result.states && result.data) {
      setCurrentPrice(parseFloat(result.data.last));
    }
    setLoading(false);
  };

  // Load saved data from localStorage on component mount
  useEffect(() => {
    const savedData = localStorage.getItem('fxCalculatorData');
    const savedRecords = localStorage.getItem('fxCalculatorRecords');
    
    if (savedData) {
      const data = JSON.parse(savedData);
      setTradeType(data.tradeType || 'long');
      setEntryPrice(data.entryPrice || '');
      setLeverage(data.leverage || '');
      setMaxLossPercent(data.maxLossPercent || '');
      setTargetProfitPercent(data.targetProfitPercent || '');
      setTargetPrice(data.targetPrice || '');
    }
    
    if (savedRecords) {
      setRecords(JSON.parse(savedRecords));
    }
    fetchCurrentPrice();
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    const data = {
      tradeType,
      entryPrice,
      leverage,
      maxLossPercent,
      targetProfitPercent,
      targetPrice
    };
    localStorage.setItem('fxCalculatorData', JSON.stringify(data));
    localStorage.setItem('fxCalculatorRecords', JSON.stringify(records));
  }, [tradeType, entryPrice, leverage, maxLossPercent, targetProfitPercent, targetPrice, records]);
  
  // 计算当前收益率
  const calculateCurrentProfit = (entryPrice: string, currentPrice: number) => {
    const entry = parseFloat(entryPrice);
    return ((currentPrice - entry) / entry * 100).toFixed(2);
  };

  // 计算目标收益率
  const calculateTargetProfit = (entryPrice: string, targetPrice: string) => {
    const entry = parseFloat(entryPrice);
    const target = parseFloat(targetPrice);
    return ((target - entry) / entry * 100).toFixed(2);
  };

  const saveRecord = () => {
    if (!entryPrice || !leverage || !maxLossPercent || (!targetProfitPercent && !targetPrice)) return;
    
    const newRecord: TradeRecord = {
      id: Date.now().toString(),
      tradeType,
      entryPrice,
      leverage,
      maxLossPercent,
      targetProfitPercent,
      targetPrice,
      stopLossPrice,
      takeProfitPrice,
     
      currentProfitPercent: currentPrice ? parseFloat(calculateCurrentProfit(entryPrice, currentPrice)) : 0,
      createdAt: Date.now()
    };
    
    setRecords([...records, newRecord]);
  };
  
  const deleteRecord = (id: string) => {
    setRecords(records.filter(record => record.id !== id));
  };
  
  const editRecord = (record: TradeRecord) => {
    setEditingRecord(record);
    setTradeType(record.tradeType);
    setEntryPrice(record.entryPrice);
    setLeverage(record.leverage);
    setMaxLossPercent(record.maxLossPercent);
    setTargetProfitPercent(record.targetProfitPercent);
    setTargetPrice(record.targetPrice);
    setStopLossPrice(record.stopLossPrice);
    setTakeProfitPrice(record.takeProfitPrice);
    setCalculatedProfitPercent(record.calculatedProfitPercent);
  };
  
  const updateRecord = () => {
    if (!editingRecord) return;
    
    const updatedRecord = {
      ...editingRecord,
      tradeType,
      entryPrice,
      leverage,
      maxLossPercent,
      targetProfitPercent,
      targetPrice,
      stopLossPrice,
      takeProfitPrice,
      calculatedProfitPercent
    };
    
    setRecords(records.map(record => 
      record.id === editingRecord.id ? updatedRecord : record
    ));
    setEditingRecord(null);
  };

  const calculate = () => {
    const entry = parseFloat(entryPrice);
    const lev = parseFloat(leverage);
    const maxLoss = parseFloat(maxLossPercent);
    const targetProfit = parseFloat(targetProfitPercent);
    const target = parseFloat(targetPrice);

    if (isNaN(entry) || isNaN(lev) || isNaN(maxLoss)) return;

    // Calculate stop loss price
    const stopLoss = tradeType === 'long' 
      ? entry * (1 - maxLoss / 100 / lev)
      : entry * (1 + maxLoss / 100 / lev);
    setStopLossPrice(stopLoss);

    // Calculate take profit price
    if (!isNaN(targetProfit)) {
      const takeProfit = tradeType === 'long' 
        ? entry * (1 + targetProfit / 100 / lev)
        : entry * (1 - targetProfit / 100 / lev);
      setTakeProfitPrice(takeProfit);
      setCalculatedProfitPercent(null);
    } else if (!isNaN(target)) {
      const profitPercent = tradeType === 'long' 
        ? ((target - entry) / entry) * 100 * lev
        : ((entry - target) / entry) * 100 * lev;
      setCalculatedProfitPercent(profitPercent);
      setTakeProfitPrice(target);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">止损点/收益点计算器</h1>
      
      <div className="mb-4">
        <label className="block mb-2">交易类型</label>
        <div className="flex gap-4">
          <label className="flex items-center">
            <input 
              type="radio" 
              name="tradeType" 
              checked={tradeType === 'long'}
              onChange={() => setTradeType('long')}
              className="mr-2"
            />
            做多
          </label>
          <label className="flex items-center">
            <input 
              type="radio" 
              name="tradeType" 
              checked={tradeType === 'short'}
              onChange={() => setTradeType('short')}
              className="mr-2"
            />
            做空
          </label>
        </div>
      </div>

      <div className="mb-4">
        <label className="block mb-2">投入点价格</label>
        <input
          type="number"
          value={entryPrice}
          onChange={(e) => setEntryPrice(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="输入投入点价格"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2">杠杆倍数</label>
        <input
          type="number"
          value={leverage}
          onChange={(e) => setLeverage(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="输入杠杆倍数"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2">最大亏损比率 (%)</label>
        <input
          type="number"
          value={maxLossPercent}
          onChange={(e) => setMaxLossPercent(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="输入最大亏损比率"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2">目标收益率 (%)</label>
        <input
          type="number"
          value={targetProfitPercent}
          onChange={(e) => setTargetProfitPercent(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="输入目标收益率"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2">或目标价格</label>
        <input
          type="number"
          value={targetPrice}
          onChange={(e) => setTargetPrice(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="输入目标价格"
        />
      </div>

      <div className="flex gap-2">
        <button 
          onClick={calculate}
          className="flex-1 bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          计算
        </button>
        <button 
          onClick={editingRecord ? updateRecord : saveRecord}
          className="flex-1 bg-green-500 text-white p-2 rounded hover:bg-green-600"
        >
          {editingRecord ? '更新记录' : '保存记录'}
        </button>
        {editingRecord && (
          <button 
            onClick={() => setEditingRecord(null)}
            className="flex-1 bg-gray-500 text-white p-2 rounded hover:bg-gray-600"
          >
            取消编辑
          </button>
        )}
      </div>

      {(stopLossPrice !== null || takeProfitPrice !== null) && (
        <div className="mt-6 p-4 bg-gray-100 rounded">
          <h2 className="text-lg font-semibold mb-2">计算结果</h2>
          
          {stopLossPrice !== null && (
            <div className="mb-2">
              <span className="font-medium">止损点价格: </span>
              <span>{stopLossPrice.toFixed(4)}</span>
            </div>
          )}
          
          {takeProfitPrice !== null && (
            <div className="mb-2">
              <span className="font-medium">止盈点价格: </span>
              <span>{takeProfitPrice.toFixed(4)}</span>
            </div>
          )}
          
          {calculatedProfitPercent !== null && (
            <div>
              <span className="font-medium">目标收益率: </span>
              <span>{calculatedProfitPercent.toFixed(2)}%</span>
            </div>
          )}
        </div>
      )}
      
      {records.length > 0 && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2">历史记录</h2>
          <div className="space-y-2">
            {records.map(record => (
              <div key={record.id} className="p-3 border rounded bg-white">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">{record.tradeType === 'long' ? '做多' : '做空'} @ {record.entryPrice}</p>
                    <p className="text-sm text-gray-600">
                      {new Date(record.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => editRecord(record)}
                      className="px-2 py-1 bg-yellow-500 text-white text-xs rounded hover:bg-yellow-600"
                    >
                      编辑
                    </button>
                    <button 
                      onClick={() => deleteRecord(record.id)}
                      className="px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600"
                    >
                      删除
                    </button>
                  </div>
                </div>
                <div className="mt-2 text-sm">
                  <p>杠杆: {record.leverage}x | 最大亏损: {record.maxLossPercent}%</p>
                  <p>止损: {record.stopLossPrice?.toFixed(4) || '-'} | 止盈: {record.takeProfitPrice?.toFixed(4) || '-'}</p>
                  {record.calculatedProfitPercent && (
                    <>
                    <p>目标收益率: {record.targetProfitPercent}%</p>
                  <p>当前收益率: {currentPrice ? parseFloat(calculateCurrentProfit(record.entryPrice, currentPrice)).toFixed(2) : '--'}%</p>
                 </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}