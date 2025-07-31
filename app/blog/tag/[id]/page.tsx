import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPostsByTag, getPostStats } from '../../../../data/posts';
import { getTagById, getAllTags } from '../../../../data/分类标签配置';
import { blogConfig } from '../../../../data/博客配置';
import BlogPostList from '../../../../src/components/博客文章列表';
import BlogSidebar from '../../../../src/components/博客侧边栏';
import TagHeader from '../../../../src/components/标签页面头部';

interface TagPageProps {
  params: Promise<{
    id: string;
  }>;
}

/**
 * 生成标签页面元数据
 */
export async function generateMetadata({ params }: TagPageProps): Promise<Metadata> {
  const { id } = await params;
  const tag = getTagById(id);
  
  if (!tag) {
    return {
      title: '标签未找到',
      description: '您访问的标签不存在。'
    };
  }

  const posts = getPostsByTag(id);
  
  return {
    title: `#${tag.name} | ${blogConfig.title}`,
    description: `${tag.description || `浏览 #${tag.name} 标签下的所有文章`}，共 ${posts.length} 篇文章。`,
    keywords: [`${tag.name}`, '标签', '博客', '文章', '技术分享'].join(', '),
    openGraph: {
      title: `#${tag.name} | ${blogConfig.title}`,
      description: `${tag.description || `浏览 #${tag.name} 标签下的所有文章`}，共 ${posts.length} 篇文章。`,
      type: 'website',
      siteName: blogConfig.title,
      locale: 'zh_CN'
    },
    twitter: {
      card: 'summary',
      title: `#${tag.name} | ${blogConfig.title}`,
      description: `${tag.description || `浏览 #${tag.name} 标签下的所有文章`}，共 ${posts.length} 篇文章。`,
      creator: blogConfig.twitter
    },
    alternates: {
      canonical: `${blogConfig.url}/blog/tag/${tag.id}`
    }
  };
}

/**
 * 标签页面
 */
export default async function TagPage({ params }: TagPageProps) {
  const { id } = await params;
  const tag = getTagById(id);
  
  if (!tag) {
    notFound();
  }
  
  // 获取该标签下的文章
  const posts = getPostsByTag(id);
  
  // 获取统计数据
  const stats = getPostStats();
  
  // 获取所有标签（用于侧边栏）
  const allTags = getAllTags();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <div className="container mx-auto px-4 py-8">
        {/* 标签头部 */}
        <TagHeader tag={tag} postCount={posts.length} />
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mt-8">
          {/* 主内容区域 */}
          <div className="lg:col-span-3">
            {posts.length > 0 ? (
              <BlogPostList posts={posts} />
            ) : (
              <div className="bg-white/5 backdrop-blur-sm border border-gray-700 rounded-xl p-8 text-center">
                <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">暂无文章</h3>
                <p className="text-gray-400 mb-6">
                  #{tag.name} 标签下暂时还没有文章，敬请期待！
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
              categories={[]}
              tags={allTags}
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
  const tags = getAllTags();
  return tags.map((tag) => ({
    id: tag.id
  }));
}