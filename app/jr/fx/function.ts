import axios from 'axios';

export async function 获取币种现价(instId: string): Promise<{states: boolean; message: string; data: any}> {
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