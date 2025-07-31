import { Category, Tag } from './博客文章类型定义';

// 文章分类配置
export const categories: Category[] = [
  {
    id: 'frontend',
    name: '前端开发',
    description: 'React、Vue、JavaScript、CSS等前端技术',
    color: '#3b82f6'
  },
  {
    id: 'backend',
    name: '后端开发',
    description: 'Node.js、Python、数据库等后端技术',
    color: '#10b981'
  },
  {
    id: 'tools',
    name: '工具开发',
    description: '实用工具、脚本、自动化等',
    color: '#f59e0b'
  },
  {
    id: 'tutorial',
    name: '教程指南',
    description: '技术教程、学习笔记、经验分享',
    color: '#8b5cf6'
  },
  {
    id: 'thinking',
    name: '技术思考',
    description: '技术思考、架构设计、最佳实践',
    color: '#ef4444'
  }
];

// 文章标签配置
export const tags: Tag[] = [
  { id: 'react', name: 'React', color: '#61dafb' },
  { id: 'nextjs', name: 'Next.js', color: '#000000' },
  { id: 'typescript', name: 'TypeScript', color: '#3178c6' },
  { id: 'javascript', name: 'JavaScript', color: '#f7df1e' },
  { id: 'css', name: 'CSS', color: '#1572b6' },
  { id: 'tailwind', name: 'Tailwind CSS', color: '#06b6d4' },
  { id: 'nodejs', name: 'Node.js', color: '#339933' },
  { id: 'python', name: 'Python', color: '#3776ab' },
  { id: 'git', name: 'Git', color: '#f05032' },
  { id: 'vscode', name: 'VS Code', color: '#007acc' },
  { id: 'markdown', name: 'Markdown', color: '#000000' },
  { id: 'api', name: 'API', color: '#ff6b35' },
  { id: 'database', name: '数据库', color: '#336791' },
  { id: 'performance', name: '性能优化', color: '#ff4757' },
  { id: 'security', name: '安全', color: '#2ed573' }
];

/**
 * 获取所有分类
 */
export function getAllCategories(): Category[] {
  return categories;
}

/**
 * 获取所有标签
 */
export function getAllTags(): Tag[] {
  return tags;
}

/**
 * 根据分类ID获取分类信息
 * @param categoryId 分类ID
 * @returns 分类信息或undefined
 */
export function getCategoryById(categoryId: string): Category | undefined {
  return categories.find(cat => cat.id === categoryId);
}

/**
 * 根据标签ID获取标签信息
 * @param tagId 标签ID
 * @returns 标签信息或undefined
 */
export function getTagById(tagId: string): Tag | undefined {
  return tags.find(tag => tag.id === tagId);
}

/**
 * 获取多个标签信息
 * @param tagIds 标签ID数组
 * @returns 标签信息数组
 */
export function getTagsByIds(tagIds: string[]): Tag[] {
  return tagIds.map(id => getTagById(id)).filter(Boolean) as Tag[];
}