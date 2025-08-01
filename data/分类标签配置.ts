// 文章分类配置
export const categories = [
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
export const tags = [
  { id: 'react', name: 'React', description: '用于构建用户界面的JavaScript库', color: '#61dafb' },
  { id: 'nextjs', name: 'Next.js', description: 'React服务端渲染框架', color: '#000000' },
  { id: 'typescript', name: 'TypeScript', description: 'JavaScript的超集，添加了静态类型', color: '#3178c6' },
  { id: 'javascript', name: 'JavaScript', description: 'Web开发的核心编程语言', color: '#f7df1e' },
  { id: 'css', name: 'CSS', description: '层叠样式表，用于网页样式设计', color: '#1572b6' },
  { id: 'tailwind', name: 'Tailwind CSS', description: '实用优先的CSS框架', color: '#06b6d4' },
  { id: 'nodejs', name: 'Node.js', description: '基于Chrome V8引擎的JavaScript运行环境', color: '#339933' },
  { id: 'python', name: 'Python', description: '高级编程语言，广泛用于Web开发、数据科学等领域', color: '#3776ab' },
  { id: 'git', name: 'Git', description: '分布式版本控制系统', color: '#f05032' },
  { id: 'vscode', name: 'VS Code', description: '微软开发的轻量级代码编辑器', color: '#007acc' },
  { id: 'markdown', name: 'Markdown', description: '轻量级标记语言', color: '#000000' },
  { id: 'api', name: 'API', description: '应用程序编程接口', color: '#ff6b35' },
  { id: 'database', name: '数据库', description: '用于存储和管理数据的系统', color: '#336791' },
  { id: 'performance', name: '性能优化', description: '提升应用性能的技术和实践', color: '#ff4757' },
  { id: 'security', name: '安全', description: '网络安全和数据保护', color: '#2ed573' }
];

/**
 * 获取所有分类
 */
export function getAllCategories() {
  return categories;
}

/**
 * 获取所有标签
 */
export function getAllTags() {
  return tags;
}

/**
 * 根据分类ID获取分类信息
 * @param categoryId 分类ID
 * @returns 分类信息或undefined
 */
export function getCategoryById(categoryId: string) {
  return categories.find(cat => cat.id === categoryId);
}

/**
 * 根据标签ID获取标签信息
 * @param tagId 标签ID
 * @returns 标签信息或undefined
 */
export function getTagById(tagId: string) {
  return tags.find(tag => tag.id === tagId);
}

/**
 * 获取多个标签信息
 * @param tagIds 标签ID数组
 * @returns 标签信息数组
 */
export function getTagsByIds(tagIds: string[]) {
  return tagIds.map(id => getTagById(id)).filter(Boolean);
}