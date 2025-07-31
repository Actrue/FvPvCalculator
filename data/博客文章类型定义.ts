// 博客文章数据接口定义
export interface BlogPost {
  // 页面元数据
  title: string;           // 文章标题
  description: string;     // 页面描述（用于HTML head中的meta description）
  keywords: string[];      // 页面关键词（用于HTML head中的meta keywords）
  
  // 文章信息
  author: string;          // 作者
  publishDate: string;     // 发布日期 (YYYY-MM-DD格式)
  updateDate?: string;     // 更新日期 (YYYY-MM-DD格式)
  category: string;        // 文章分类
  tags: string[];          // 文章标签
  
  // 文章内容
  content: string;         // 文章正文（Markdown格式）
  
  // 可选字段
  coverImage?: string;     // 封面图片URL
  excerpt?: string;        // 文章摘要
  readTime?: number;       // 预估阅读时间（分钟）
  isPublished: boolean;    // 是否发布
  id: string;              // 文章唯一标识
}

// 博客配置接口
export interface BlogConfig {
  siteName: string;
  siteDescription: string;
  author: string;
  email: string;
  github?: string;
  twitter?: string;
  linkedin?: string;
}

// 分类接口
export interface Category {
  id: string;
  name: string;
  description: string;
  color: string;
}

// 标签接口
export interface Tag {
  id: string;
  name: string;
  color: string;
}

// 函数返回值统一格式
export interface ApiResponse<T = any> {
  state: boolean;    // 函数执行成功返回true，失败返回false
  message: string;   // 函数执行成功返回成功信息，失败返回失败信息
  data: T | null;    // 函数执行成功返回数据，失败返回null
}