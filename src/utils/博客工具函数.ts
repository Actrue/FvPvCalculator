import { marked } from 'marked';
import { BlogPost, ApiResponse } from '../../data/博客文章类型定义';
import { blogConfig } from '../../data/博客配置';

/**
 * 渲染 Markdown 内容为 HTML
 */
export function renderMarkdown(content: string): string {
  return marked(content);
}

/**
 * 将Markdown内容转换为HTML
 * @param markdown Markdown字符串
 * @returns 转换后的HTML字符串
 */
export function markdownToHtml(markdown: string): string {
  try {
    // 配置marked选项
    marked.setOptions({
      breaks: true,
      gfm: true,
    });
    
    return marked(markdown);
  } catch (error) {
    console.error('Markdown转换失败:', error);
    return markdown;
  }
}

/**
 * 从Markdown内容中提取标题列表（目录）
 * @param markdown Markdown字符串
 * @returns 标题列表
 */
export function extractHeadings(markdown: string): Array<{
  id: string;
  text: string;
  level: number;
}> {
  const headings: Array<{ id: string; text: string; level: number }> = [];
  const lines = markdown.split('\n');
  
  lines.forEach(line => {
    const match = line.match(/^(#{1,6})\s+(.+)$/);
    if (match) {
      const level = match[1].length;
      const text = match[2].trim();
      const id = text
        .toLowerCase()
        .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-')
        .replace(/^-+|-+$/g, '');
      
      headings.push({ id, text, level });
    }
  });
  
  return headings;
}

/**
 * 计算文章阅读时间（基于中文字符数）
 * @param content 文章内容
 * @returns 预估阅读时间（分钟）
 */
export function calculateReadTime(content: string): number {
  // 移除Markdown标记
  const plainText = content
    .replace(/```[\s\S]*?```/g, '') // 移除代码块
    .replace(/`[^`]+`/g, '') // 移除行内代码
    .replace(/#{1,6}\s+/g, '') // 移除标题标记
    .replace(/\*\*([^*]+)\*\*/g, '$1') // 移除粗体标记
    .replace(/\*([^*]+)\*/g, '$1') // 移除斜体标记
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // 移除链接标记
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '') // 移除图片
    .replace(/\n+/g, ' ') // 替换换行为空格
    .trim();
  
  // 中文阅读速度约为300-400字/分钟，这里取350字/分钟
  const wordsPerMinute = 350;
  const wordCount = plainText.length;
  
  return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
}

/**
 * 生成文章摘要
 * @param content Markdown内容
 * @param maxLength 最大长度，默认150字符
 * @returns 文章摘要
 */
export function generateExcerpt(content: string, maxLength: number = 150): string {
  // 移除Markdown标记，获取纯文本
  const plainText = content
    .replace(/```[\s\S]*?```/g, '') // 移除代码块
    .replace(/`[^`]+`/g, '') // 移除行内代码
    .replace(/#{1,6}\s+/g, '') // 移除标题标记
    .replace(/\*\*([^*]+)\*\*/g, '$1') // 移除粗体标记
    .replace(/\*([^*]+)\*/g, '$1') // 移除斜体标记
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // 移除链接标记
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '') // 移除图片
    .replace(/\n+/g, ' ') // 替换换行为空格
    .trim();
  
  if (plainText.length <= maxLength) {
    return plainText;
  }
  
  // 在最大长度附近找到合适的截断点（避免截断单词）
  let truncated = plainText.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  
  if (lastSpace > maxLength * 0.8) {
    truncated = truncated.substring(0, lastSpace);
  }
  
  return truncated + '...';
}

/**
 * 格式化日期
 * @param dateString 日期字符串 (YYYY-MM-DD)
 * @returns 格式化后的日期字符串
 */
export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (error) {
    console.error('日期格式化失败:', error);
    return dateString;
  }
}

/**
 * 生成SEO友好的URL slug
 * @param title 文章标题
 * @returns URL slug
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 50); // 限制长度
}

/**
 * 生成文章的JSON-LD结构化数据
 * @param post 博客文章
 * @param siteUrl 网站URL
 * @returns JSON-LD对象
 */
export function generateArticleJsonLd(post: BlogPost, siteUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    author: {
      '@type': 'Person',
      name: post.author
    },
    datePublished: post.publishDate,
    dateModified: post.updateDate || post.publishDate,
    keywords: post.keywords.join(', '),
    articleSection: post.category,
    wordCount: post.content.length,
    timeRequired: `PT${post.readTime || calculateReadTime(post.content)}M`,
    image: post.coverImage ? `${siteUrl}${post.coverImage}` : undefined,
    url: `${siteUrl}/blog/${post.id}`,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${siteUrl}/blog/${post.id}`
    }
  };
}

/**
 * 验证博客文章数据
 * @param post 博客文章对象
 * @returns 验证结果
 */
export function validateBlogPost(post: any): ApiResponse<BlogPost> {
  try {
    // 必填字段检查
    const requiredFields = ['id', 'title', 'description', 'author', 'publishDate', 'category', 'content'];
    
    for (const field of requiredFields) {
      if (!post[field]) {
        return {
          state: false,
          message: `缺少必填字段: ${field}`,
          data: null
        };
      }
    }
    
    // 数据类型检查
    if (typeof post.title !== 'string' || post.title.length === 0) {
      return {
        state: false,
        message: '标题必须是非空字符串',
        data: null
      };
    }
    
    if (!Array.isArray(post.keywords)) {
      return {
        state: false,
        message: '关键词必须是数组',
        data: null
      };
    }
    
    if (!Array.isArray(post.tags)) {
      return {
        state: false,
        message: '标签必须是数组',
        data: null
      };
    }
    
    // 日期格式检查
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(post.publishDate)) {
      return {
        state: false,
        message: '发布日期格式必须为YYYY-MM-DD',
        data: null
      };
    }
    
    return {
      state: true,
      message: '文章数据验证通过',
      data: post as BlogPost
    };
  } catch (error) {
    return {
      state: false,
      message: `验证过程中发生错误: ${error}`,
      data: null
    };
  }
}

/**
 * 搜索高亮处理
 * @param text 原始文本
 * @param query 搜索关键词
 * @returns 高亮处理后的HTML
 */
export function highlightSearchQuery(text: string, query: string): string {
  if (!query.trim()) return text;
  
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  return text.replace(regex, '<mark class="bg-yellow-200 px-1 rounded">$1</mark>');
}

/**
 * 获取文章阅读进度
 * @param scrollTop 当前滚动位置
 * @param scrollHeight 总滚动高度
 * @param clientHeight 可视区域高度
 * @returns 阅读进度百分比 (0-100)
 */
export function getReadingProgress(
  scrollTop: number,
  scrollHeight: number,
  clientHeight: number
): number {
  const totalScrollableHeight = scrollHeight - clientHeight;
  if (totalScrollableHeight <= 0) return 100;
  
  const progress = (scrollTop / totalScrollableHeight) * 100;
  return Math.min(100, Math.max(0, progress));
}