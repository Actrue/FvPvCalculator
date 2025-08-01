import axios from 'axios';

// 定义OKX API返回的数据结构
interface OKXTickerData {
  instId: string;      // 产品ID
  last: string;        // 最新成交价
  lastSz: string;      // 最新成交数量
  askPx: string;       // 卖一价
  askSz: string;       // 卖一数量
  bidPx: string;       // 买一价
  bidSz: string;       // 买一数量
  open24h: string;     // 24小时开盘价
  high24h: string;     // 24小时最高价
  low24h: string;      // 24小时最低价
  volCcy24h: string;   // 24小时成交量，以币为单位
  vol24h: string;      // 24小时成交量，以张为单位
  ts: string;          // 数据产生时间，Unix时间戳的毫秒数格式
  sodUtc0: string;     // UTC 0 时开盘价
  sodUtc8: string;     // UTC+8 时开盘价
}

export async function 获取币种现价(instId: string): Promise<{states: boolean; message: string; data: OKXTickerData | null}> {
  try {
    const response = await axios.get('https://www.okx.com/api/v5/market/ticker', {
      params: { instId }
    });
    
    if (response.data.code === "0") {
      return {
        states: true,
        message: "获取成功",
        data: response.data.data[0]
      };
    } else {
      return {
        states: false,
        message: response.data.msg || "获取失败",
        data: null
      };
    }
  } catch (error) {
    return {
      states: false,
      message: error instanceof Error ? error.message : "请求异常",
      data: null
    };
  }
}