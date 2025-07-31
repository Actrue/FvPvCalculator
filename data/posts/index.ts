import { BlogPost } from '../博客文章类型定义';
import { post as nextjsPost } from './Next.js入门指南';
import { post as reactHooksPost } from './React Hooks最佳实践';
import { post as typescriptPost } from './TypeScript进阶技巧';

// 所有博客文章数组
export const allPosts: BlogPost[] = [
  typescriptPost,
  reactHooksPost,
  nextjsPost
];

/**
 * 获取所有已发布的文章
 * @returns 已发布的文章数组
 */
export function getPublishedPosts(): BlogPost[] {
  return allPosts.filter(post => post.isPublished);
}

/**
 * 获取所有文章（包括未发布的）
 */
export function getAllPosts(): BlogPost[] {
  return allPosts;
}

/**
 * 根据ID获取文章
 * @param id 文章ID
 * @returns 文章对象或undefined
 */
export function getPostById(id: string): BlogPost | undefined {
  return allPosts.find(post => post.id === id);
}

/**
 * 根据分类获取文章
 * @param category 分类ID
 * @returns 该分类下的文章数组
 */
export function getPostsByCategory(category: string): BlogPost[] {
  return allPosts.filter(post => post.category === category && post.isPublished);
}

/**
 * 根据标签获取文章
 * @param tag 标签ID
 * @returns 包含该标签的文章数组
 */
export function getPostsByTag(tag: string): BlogPost[] {
  return allPosts.filter(post => 
    post.tags.includes(tag) && post.isPublished
  );
}

/**
 * 搜索文章
 * @param query 搜索关键词
 * @param category 分类筛选
 * @param tag 标签筛选
 * @returns 搜索结果
 */
export function searchPosts(
  query: string = '',
  category?: string,
  tag?: string
): BlogPost[] {
  let results = getPublishedPosts();

  // 分类筛选
  if (category) {
    results = results.filter(post => post.category === category);
  }

  // 标签筛选
  if (tag) {
    results = results.filter(post => post.tags.includes(tag));
  }

  // 关键词搜索
  if (query.trim()) {
    const searchTerm = query.toLowerCase();
    results = results.filter(post => 
      post.title.toLowerCase().includes(searchTerm) ||
      post.description.toLowerCase().includes(searchTerm) ||
      post.content.toLowerCase().includes(searchTerm) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    );
  }

  return results;
}

/**
 * 获取最新文章
 * @param limit 限制数量，默认5篇
 * @returns 最新文章数组
 */
export function getLatestPosts(limit: number = 5): BlogPost[] {
  return getPublishedPosts()
    .sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime())
    .slice(0, limit);
}

/**
 * 获取相关文章
 * @param postId 当前文章ID
 * @param limit 返回数量限制
 * @returns 相关文章列表
 */
export function getRelatedPosts(postId: string, limit: number = 3): BlogPost[] {
  const currentPost = getPostById(postId);
  if (!currentPost) return [];

  // 根据标签和分类找相关文章
  const relatedPosts = getPublishedPosts()
    .filter(post => post.id !== postId)
    .map(post => {
      let score = 0;
      
      // 相同分类加分
      if (post.category === currentPost.category) {
        score += 3;
      }
      
      // 相同标签加分
      const commonTags = post.tags.filter(tag => currentPost.tags.includes(tag));
      score += commonTags.length * 2;
      
      return { post, score };
    })
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(item => item.post);

  return relatedPosts;
}



/**
 * 获取所有使用的分类
 * @returns 分类ID数组
 */
export function getAllCategories(): string[] {
  const categories = new Set<string>();
  allPosts.forEach(post => {
    if (post.isPublished) {
      categories.add(post.category);
    }
  });
  return Array.from(categories);
}

/**
 * 获取所有使用的标签
 * @returns 标签ID数组
 */
export function getAllTags(): string[] {
  const tags = new Set<string>();
  allPosts.forEach(post => {
    if (post.isPublished) {
      post.tags.forEach(tag => tags.add(tag));
    }
  });
  return Array.from(tags);
}

/**
 * 获取文章统计信息
 * @returns 统计信息对象
 */
export function getPostStats() {
  const publishedPosts = getPublishedPosts();
  const totalReadTime = publishedPosts.reduce((total, post) => total + (post.readTime || 0), 0);
  
  return {
    totalPosts: publishedPosts.length,
    totalCategories: getAllCategories().length,
    totalTags: getAllTags().length,
    totalReadTime,
    averageReadTime: Math.round(totalReadTime / publishedPosts.length)
  };
}