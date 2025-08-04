/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://actrue.sereniblue.com',
  generateRobotsTxt: true,
  sitemapSize: 7000,
  changefreq: 'weekly',
  priority: 0.7,
  
  // 排除不需要索引的页面
  exclude: [
    '/admin/*',
    '/draft/*',
    '/api/*'
  ],
  
  // 工具型网站的特殊配置
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
    
    // 为工具页面设置较高优先级
    if (path.startsWith('/tool/')) {
      return {
        loc: path,
        changefreq: 'weekly',
        priority: 0.8
      }
    }
    
    // 为其他页面使用默认配置
    return {
      loc: path,
      changefreq: config.changefreq,
      priority: config.priority,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined
    }
  }
}