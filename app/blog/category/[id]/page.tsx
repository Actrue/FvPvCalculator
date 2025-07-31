import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPostsByCategory, getPostStats } from '../../../../data/posts';
import { getCategoryById, getAllCategories } from '../../../../data/分类标签配置';
import { blogConfig } from '../../../../data/博客配置';
import BlogPostList from '../../../../src/components/博客文章列表';
import BlogSidebar from '../../../../src/components/博客侧边栏';
import CategoryHeader from '../../../../src/components/分类页面头部';

interface CategoryPageProps {
  params: Promise<{
    id: string;
  }>;
}

/**
 * 生成分类页面元数据
 */
export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { id } = await params;
  const category = getCategoryById(id);
  
  if (!category) {
    return {
      title: '分类未找到',
      description: '您访问的分类不存在。'
    };
  }

  const posts = getPostsByCategory(id);
  
  return {
    title: `${category.name} | ${blogConfig.title}`,
    description: `${category.description || `浏览 ${category.name} 分类下的所有文章`}，共 ${posts.length} 篇文章。`,
    keywords: [`${category.name}`, '博客', '文章', '技术分享'].join(', '),
    openGraph: {
      title: `${category.name} | ${blogConfig.title}`,
      description: `${category.description || `浏览 ${category.name} 分类下的所有文章`}，共 ${posts.length} 篇文章。`,
      type: 'website',
      siteName: blogConfig.title,
      locale: 'zh_CN'
    },
    twitter: {
      card: 'summary',
      title: `${category.name} | ${blogConfig.title}`,
      description: `${category.description || `浏览 ${category.name} 分类下的所有文章`}，共 ${posts.length} 篇文章。`,
      creator: blogConfig.twitter
    },
    alternates: {
      canonical: `${blogConfig.url}/blog/category/${category.id}`
    }
  };
}

/**
 * 分类页面
 */
export default async function CategoryPage({ params }: CategoryPageProps) {
  const { id } = await params;
  const category = getCategoryById(id);
  
  if (!category) {
    notFound();
  }
  
  // 获取该分类下的文章
  const posts = getPostsByCategory(id);
  
  // 获取统计数据
  const stats = getPostStats();
  
  // 获取所有分类（用于侧边栏）
  const allCategories = getAllCategories();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <div className="container mx-auto px-4 py-8">
        {/* 分类头部 */}
        <CategoryHeader category={category} postCount={posts.length} />
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mt-8">
          {/* 主内容区域 */}
          <div className="lg:col-span-3">
            {posts.length > 0 ? (
              <BlogPostList posts={posts} />
            ) : (
              <div className="bg-white/5 backdrop-blur-sm border border-gray-700 rounded-xl p-8 text-center">
                <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">暂无文章</h3>
                <p className="text-gray-400 mb-6">
                  {category.name} 分类下暂时还没有文章，敬请期待！
                </p>
                <a
                  href="/blog"
                  className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-105"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  <span>返回博客首页</span>
                </a>
              </div>
            )}
          </div>
          
          {/* 侧边栏 */}
          <div className="lg:col-span-1">
            <BlogSidebar 
              categories={allCategories}
              tags={[]}
              stats={stats}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * 生成静态路径（可选，用于静态生成）
 */
export function generateStaticParams() {
  const categories = getAllCategories();
  return categories.map((category) => ({
    id: category.id
  }));
}