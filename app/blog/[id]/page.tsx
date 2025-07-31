import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPostById, getRelatedPosts } from '../../../data/posts';
import { generateBlogPostJsonLd } from '../../../src/utils/博客工具函数';
import BlogPostDetail from '../../../src/components/博客文章详情';
import RelatedPosts from '../../../src/components/相关文章';
import { blogConfig } from '../../../data/博客配置';

interface BlogPostPageProps {
  params: Promise<{
    id: string;
  }>;
}

/**
 * 生成文章页面元数据
 */
export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { id } = await params;
  const post = getPostById(id);
  
  if (!post) {
    return {
      title: '文章未找到',
      description: '您访问的文章不存在或已被删除。'
    };
  }

  const jsonLd = generateBlogPostJsonLd(post);
  
  return {
    title: `${post.title} | ${blogConfig.title}`,
    description: post.description,
    keywords: post.keywords.join(', '),
    authors: [{ name: post.author }],
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: [post.author],
      images: post.coverImage ? [{
        url: post.coverImage,
        width: 1200,
        height: 630,
        alt: post.title
      }] : [],
      siteName: blogConfig.title,
      locale: 'zh_CN'
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      images: post.coverImage ? [post.coverImage] : [],
      creator: blogConfig.twitter
    },
    alternates: {
      canonical: `${blogConfig.url}/blog/${post.id}`
    },
    other: {
      'article:published_time': post.publishedAt,
      'article:modified_time': post.updatedAt,
      'article:author': post.author,
      'article:section': post.category,
      'article:tag': post.tags.join(', ')
    },
    // 添加 JSON-LD 结构化数据
    ...(jsonLd && {
      other: {
        ...jsonLd,
        'article:published_time': post.publishedAt,
        'article:modified_time': post.updatedAt,
        'article:author': post.author,
        'article:section': post.category,
        'article:tag': post.tags.join(', ')
      }
    })
  };
}

/**
 * 博客文章详情页面
 */
export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { id } = await params;
  const post = getPostById(id);
  
  if (!post) {
    notFound();
  }
  
  // 获取相关文章
  const relatedPosts = getRelatedPosts(id, 3);
  
  // 生成 JSON-LD 结构化数据
  const jsonLd = generateBlogPostJsonLd(post);
  
  return (
    <>
      {/* JSON-LD 结构化数据 */}
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd)
          }}
        />
      )}
      
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* 文章详情 */}
            <BlogPostDetail post={post} />
            
            {/* 相关文章 */}
            {relatedPosts.length > 0 && (
              <div className="mt-12">
                <RelatedPosts posts={relatedPosts} />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

/**
 * 生成静态路径（可选，用于静态生成）
 */
export function generateStaticParams() {
  // 这里可以返回所有文章的 ID 用于静态生成
  // 目前返回空数组，使用动态生成
  return [];
}