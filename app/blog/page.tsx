import { Metadata } from 'next';
import { getLatestPosts, getPostStats, getAllCategories, getAllTags } from '../../data/posts';
import { getCategoryById, getTagsByIds } from '../../data/分类标签配置';
import { blogConfig, defaultSEO } from '../../data/博客配置';
import BlogHero from '../../src/components/博客首页Hero';
import BlogPostList from '../../src/components/博客文章列表';
import BlogSidebar from '../../src/components/博客侧边栏';

// 页面元数据
export const metadata: Metadata = {
  title: `${blogConfig.siteName} - 技术博客`,
  description: blogConfig.siteDescription,
  keywords: defaultSEO.keywords,
  openGraph: {
    title: `${blogConfig.siteName} - 技术博客`,
    description: blogConfig.siteDescription,
    type: 'website',
    url: '/blog',
    images: [
      {
        url: '/images/blog-og.jpg',
        width: 1200,
        height: 630,
        alt: blogConfig.siteName,
      },
    ],
  },
};

export default function BlogPage() {
  // 获取博客数据
  const latestPosts = getLatestPosts(6);
  const stats = getPostStats();
  const categories = getAllCategories();
  const tags = getAllTags();
  
  // 获取分类和标签的详细信息
  const categoryDetails = categories.map(id => getCategoryById(id)).filter(Boolean);
  const tagDetails = getTagsByIds(tags.slice(0, 15)); // 只显示前15个标签

  return (
    <div className="min-h-screen bg-white">
      {/* Hero区域 */}
      <BlogHero stats={stats} />
      
      {/* 主要内容区域 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* 文章列表 */}
          <div className="lg:col-span-3">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-black mb-2">
                最新文章
              </h2>
              <p className="text-gray-600">
                分享最新的技术文章和开发经验
              </p>
            </div>
            
            <BlogPostList posts={latestPosts} />
            
            {/* 查看更多按钮 */}
            <div className="mt-12 text-center">
              <button className="inline-flex items-center px-6 py-3 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition-all duration-200">
                查看所有文章
                <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
          
          {/* 侧边栏 */}
          <div className="lg:col-span-1">
            <BlogSidebar 
              categories={categoryDetails} 
              tags={tagDetails}
              stats={stats}
            />
          </div>
        </div>
      </div>
    </div>
  );
}