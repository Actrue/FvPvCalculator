import { BlogPost } from '../博客文章类型定义';

export const post: BlogPost = {
  id: 'nextjs-getting-started',
  title: "Next.js入门指南",
  description: "详细介绍Next.js框架的基础概念、安装配置和核心功能，适合初学者快速上手",
  keywords: ["Next.js", "React", "前端框架", "SSR", "教程"],
  
  author: "Daifuku",
  publishDate: "2024-01-15",
  category: "frontend",
  tags: ["nextjs", "react", "typescript"],
  
  content: `# Next.js入门指南

## 什么是Next.js

Next.js是一个基于React的全栈框架，它提供了许多开箱即用的功能，让开发者能够快速构建现代化的Web应用程序。

### 主要特性

- **服务端渲染(SSR)**: 提升SEO和首屏加载速度
- **静态站点生成(SSG)**: 预渲染页面，提供极佳性能
- **API路由**: 内置API开发能力
- **自动代码分割**: 优化包大小和加载性能
- **热重载**: 开发时实时更新

## 安装和配置

### 创建新项目

\`\`\`bash
npx create-next-app@latest my-app
cd my-app
npm run dev
\`\`\`

### 项目结构

\`\`\`
my-app/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── public/
├── next.config.js
└── package.json
\`\`\`

## 核心功能

### 1. 页面路由

Next.js使用基于文件系统的路由。在\`app\`目录下创建文件夹和\`page.tsx\`文件即可创建路由。

\`\`\`typescript
// app/about/page.tsx
export default function About() {
  return (
    <div>
      <h1>关于我们</h1>
      <p>这是关于页面</p>
    </div>
  );
}
\`\`\`

### 2. 服务端渲染(SSR)

\`\`\`typescript
// 服务端获取数据
export default async function Page() {
  const data = await fetch('https://api.example.com/data');
  const posts = await data.json();
  
  return (
    <div>
      {posts.map(post => (
        <div key={post.id}>{post.title}</div>
      ))}
    </div>
  );
}
\`\`\`

### 3. API路由

\`\`\`typescript
// app/api/hello/route.ts
export async function GET() {
  return Response.json({ message: 'Hello World' });
}
\`\`\`

## 部署

### Vercel部署

1. 将代码推送到GitHub
2. 在Vercel中导入项目
3. 自动部署完成

### 其他平台

- **Netlify**: 支持静态导出
- **AWS**: 使用Serverless框架
- **Docker**: 容器化部署

## 最佳实践

1. **使用TypeScript**: 提供类型安全
2. **优化图片**: 使用Next.js Image组件
3. **代码分割**: 合理使用动态导入
4. **SEO优化**: 使用next-seo库
5. **性能监控**: 集成分析工具

## 总结

Next.js是一个功能强大的React框架，它简化了现代Web应用的开发流程。通过本指南，你应该已经掌握了Next.js的基础知识，可以开始构建自己的应用了。

继续学习更多高级功能，如中间件、国际化、性能优化等，将帮助你构建更加专业的应用程序。`,
  
  coverImage: "/images/nextjs-cover.jpg",
  excerpt: "学习Next.js框架的完整指南，从安装到部署",
  readTime: 8,
  isPublished: true
};