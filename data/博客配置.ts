import { BlogConfig } from './博客文章类型定义';

// 博客基础配置信息
export const blogConfig: BlogConfig = {
  siteName: "Actrue工具箱博客",
  siteDescription: "分享技术文章、工具开发和编程经验的个人博客",
  author: "Daifuku",
  email: "contact@example.com",
  github: "https://github.com/username",
  twitter: "https://twitter.com/username",
  linkedin: "https://linkedin.com/in/username"
};

// 网站SEO默认配置
export const defaultSEO = {
  title: blogConfig.siteName,
  description: blogConfig.siteDescription,
  keywords: ["技术博客", "前端开发", "React", "Next.js", "TypeScript", "工具开发"],
  author: blogConfig.author,
  openGraph: {
    type: 'website',
    locale: 'zh_CN',
    url: 'https://your-domain.com',
    siteName: blogConfig.siteName,
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: blogConfig.siteName,
      },
    ],
  },
  twitter: {
    handle: '@username',
    site: '@username',
    cardType: 'summary_large_image',
  },
};