import type { Metadata } from 'next';
import UrlNormalizerClient from './UrlNormalizerClient';

export const metadata: Metadata = {
  title: 'URL规范化工具 | 中文域名转Punycode - Actrue工具集',
  description: '在线将包含中文字符的域名转换为规范的ASCII格式（Punycode），解决中文域名兼容性问题。输入\'饭太硬.tv\'即可自动转换为\'xn--fiq228c.tv\'',
  keywords: 'URL规范化,中文域名,Punycode转换,域名编码,国际化域名,IDN',
  openGraph: {
    title: 'URL规范化工具 | Actrue',
    description: '专业中文域名转Punycode工具',
    url: '/tool/url-normalizer',
    siteName: 'Actrue工具集',
  },
};

export default function Page() {
  return (
    <UrlNormalizerClient />
  );
}