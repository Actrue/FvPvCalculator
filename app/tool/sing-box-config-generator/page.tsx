import type { Metadata } from 'next';
import SingBoxConfigGeneratorClient from './SingBoxConfigGeneratorClient';

export const metadata: Metadata = {
  title: 'Sing-Box 配置生成器 - Actrue Tools',
  description: '在线生成 Sing-Box 服务器配置文件，支持多种协议和加密方式，可导出JSON格式配置文件。',
  keywords: 'Sing-Box, 配置生成器, 代理工具, VLESS, Shadowsocks, Hysteria2, 服务器配置, 网络工具',
  openGraph: {
    title: 'Sing-Box 配置生成器 - Actrue Tools',
    description: '在线生成 Sing-Box 服务器配置文件，支持多种协议和加密方式，可导出JSON格式配置文件。',
    type: 'website',
  },
};

export default function SingBoxConfigGeneratorPage() {
  return <SingBoxConfigGeneratorClient />;
}