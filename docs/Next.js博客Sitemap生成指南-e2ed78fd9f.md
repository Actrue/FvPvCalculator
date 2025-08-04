# Next.js博客Sitemap生成指南

## 推荐方案：next-sitemap

### 推荐理由
- **维护活跃**：2025年最新版本4.2.3，GitHub星标3.4k+
- **功能全面**：支持静态/动态路由、自动分块、多语言站点
- **配置简单**：零配置起步，同时支持深度自定义
- **SEO友好**：自动生成robots.txt，符合Google站点地图标准
- **兼容性强**：完美支持Next.js 13+ App Router和传统Pages Router

### 安装步骤

```bash
# 使用npm
npm install next-sitemap --save-dev

# 使用yarn
yarn add next-sitemap --dev
```

### 基础配置

1. 在项目根目录创建配置文件 `next-sitemap.config.js`：

```javascript
/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://your-blog-domain.com',
  generateRobotsTxt: true, // 自动生成robots.txt
  sitemapSize: 7000, // 大型站点自动分块
  changefreq: 'weekly', // 默认更新频率
  priority: 0.7, // 默认优先级
  
  // 排除不需要索引的页面
  exclude: [
    '/admin/*', 
    '/draft/*',
    '/api/*'
  ],
}
```

2. 在 `package.json` 中添加构建脚本：

```json
{
  "scripts": {
    "build": "next build",
    "postbuild": "next-sitemap"
  }
}
```

### 动态路由处理（博客文章）

对于使用动态路由的博客文章（如 `/posts/[slug]`），需要添加额外配置：

```javascript
// next-sitemap.config.js
module.exports = {
  // ...基础配置
  
  // 动态路由处理
  additionalPaths: async (config) => {
    const paths = []
    
    // 从API或文件系统获取所有博客文章slug
    const posts = await fetchAllBlogPosts(); // 需自定义实现
    
    posts.forEach(post => {
      paths.push({
        loc: `/posts/${post.slug}`,
        changefreq: 'weekly',
        priority: 0.8,
        lastmod: post.updatedAt
      })
    })
    
    return paths
  }
}
```

### 高级配置选项

```javascript
// next-sitemap.config.js
module.exports = {
  // ...基础配置
  
  // 自定义URL属性
  transform: async (config, path) => {
    // 为首页设置更高优先级
    if (path === '/') {
      return {
        loc: path,
        changefreq: 'daily',
        priority: 1.0,
        lastmod: new Date().toISOString()
      }
    }
    
    // 为标签页设置较低优先级
    if (path.startsWith('/tags/')) {
      return {
        loc: path,
        changefreq: 'monthly',
        priority: 0.5
      }
    }
    
    return {
      loc: path,
      changefreq: config.changefreq,
      priority: config.priority,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined
    }
  },
  
  // 多语言站点配置
  alternateRefs: [
    {
      href: 'https://your-blog-domain.com/en',
      hreflang: 'en'
    },
    {
      href: 'https://your-blog-domain.com/zh',
      hreflang: 'zh'
    }
  ]
}
```

### 自动化部署

1. **环境变量配置**：在 `.env.production` 中添加：
   ```
   SITE_URL=https://your-blog-domain.com
   ```

2. **构建与测试**：
   ```bash
   npm run build
   ```
   生成的文件将位于 `public/sitemap.xml` 和 `public/robots.txt`

3. **部署验证**：
   - 部署后访问 `https://your-blog-domain.com/sitemap.xml`
   - 使用 [Google Search Console](https://search.google.com/search-console) 提交站点地图

### 常见问题解决

1. **开发环境生成**：
   ```bash
   npx next-sitemap --config next-sitemap.config.js
   ```

2. **PNPM用户配置**：
   创建 `.npmrc` 文件：
   ```
   enable-pre-post-scripts=true
   ```

3. **大型站点分块**：
   默认超过5000URL自动分块，可通过`sitemapSize`调整

### 替代方案对比

| 方案 | 活跃度 | Next.js 13+支持 | 优点 | 缺点 |
|------|--------|----------------|------|------|
| **next-sitemap** | ★★★★★ | ✅ | 配置简单，功能全面 | 无明显缺点 |
| nextjs-sitemap-generator | ★☆☆☆☆ | ❌ | 基础功能可用 | 已废弃，不支持App Router |
| 手动生成 | ★★★☆☆ | ✅ | 完全自定义 | 需维护代码，无自动更新 |
| Next.js Metadata API | ★★★★☆ | ✅ | 官方原生支持 | 需手动编写动态路由逻辑 |

## 总结

对于2025年的Next.js博客项目，**next-sitemap** 是生成站点地图的最优选择。它提供了自动化的站点地图生成流程，同时支持灵活的自定义配置，能够完美适配博客类网站的SEO需求。通过简单的安装配置，即可实现站点地图的全自动管理，让搜索引擎更好地收录您的博客内容。