import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();
    
    // 验证URL格式
    if (!url || typeof url !== 'string') {
      return NextResponse.json(
        { error: '请提供有效的URL' },
        { status: 400 }
      );
    }

    // 验证是否为HTTP/HTTPS URL
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      return NextResponse.json(
        { error: 'URL必须以http://或https://开头' },
        { status: 400 }
      );
    }

    // 获取URL内容
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      },
      // 设置超时时间
      signal: AbortSignal.timeout(10000) // 10秒超时
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `获取URL内容失败: ${response.status} ${response.statusText}` },
        { status: 400 }
      );
    }

    const content = await response.text();
    
    // 检查内容是否为Base64格式
    let base64Content = content.trim();
    
    // 如果内容看起来已经是Base64编码，直接返回
    // 否则，将内容编码为Base64
    try {
      // 尝试解码，如果成功说明是Base64
      atob(base64Content);
    } catch {
      // 如果解码失败，说明不是Base64，需要编码
      base64Content = btoa(content);
    }

    return NextResponse.json({
      success: true,
      base64Content,
      originalLength: content.length
    });

  } catch (error) {
    console.error('API Error:', error);
    
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        return NextResponse.json(
          { error: '请求超时，请检查URL是否可访问' },
          { status: 408 }
        );
      }
      
      return NextResponse.json(
        { error: `请求失败: ${error.message}` },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: '服务器内部错误' },
      { status: 500 }
    );
  }
}

// 处理OPTIONS请求（CORS预检）
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}