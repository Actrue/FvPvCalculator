import type { Metadata } from 'next';
import Base64ConverterClient from './Base64ConverterClient';

export const metadata: Metadata = {
  title: 'Base64订阅链接转换器 - Actrue Tools',
  description: '将Base64编码的订阅链接转换为Clash等代理工具可识别的节点URL格式，支持多种代理协议。',
  keywords: 'Base64, 订阅链接, Clash, 代理工具, VMess, VLess, Shadowsocks, 节点转换, 网络工具',
  openGraph: {
    title: 'Base64订阅链接转换器 - Actrue Tools',
    description: '将Base64编码的订阅链接转换为Clash等代理工具可识别的节点URL格式，支持多种代理协议。',
    type: 'website',
  },
};

export default function Base64ConverterPage() {
  return <Base64ConverterClient />;
}