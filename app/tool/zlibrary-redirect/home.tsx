import Link from 'next/link';

export default function ZLibraryRedirectHome() {
  const domains = [
    'https://z-lib.gd',
    'https://1lib.sk',
    'https://z-lib.fm',
    'https://z-lib.gl',
    'https://z-lib.fo',
    'https://z-library.sk',
    'https://zh.z-library.ec'
  ];

  return (
    <div className="container mx-auto p-4">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4">
          <nav className="flex justify-between items-center py-4">
            <Link href="/" className="text-xl font-bold text-blue-500">📚 Z-Library 重定向</Link>
            <ul className="flex gap-8 list-none">
              <li><Link href="/tool/zlibrary-redirect/detect" className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-black transition font-medium">↗️ 重定向至zlibrary</Link></li>
            </ul>
          </nav>
        </div>
      </header>
      
      <main className="py-16">
        <div className="container mx-auto px-4">
          <section className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Z-Library 智能重定向服务</h1>
            <p className="text-xl max-w-2xl mx-auto mb-8">自动检测可用的 Z-Library 域名，为您提供最快速、最稳定的访问体验。支持实时域名检测和智能缓存机制。</p>
            <div className="flex justify-center gap-4 flex-wrap">
              <Link href="/tool/zlibrary-redirect/detect" className="px-8 py-4 bg-gray-800 text-white rounded hover:bg-black transition font-bold text-lg">↗️ 重定向至zlibrary</Link>
            </div>
          </section>
          
          <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white p-6 rounded-lg border border-gray-200 transition hover:border-gray-800 hover:shadow-sm">
              <div className="w-15 h-15 bg-gray-100 rounded-lg flex items-center justify-center mb-4 text-2xl">↗️</div>
              <h3 className="text-xl font-bold mb-2">重定向至zlibrary</h3>
              <p className="text-gray-600">自动检测可用的Z-Library域名并重定向</p>
            </div>
            <div className="bg-white p-6 rounded-lg border border-gray-200 transition hover:border-gray-800 hover:shadow-sm">
              <div className="w-15 h-15 bg-gray-100 rounded-lg flex items-center justify-center mb-4 text-2xl">⚡</div>
              <h3 className="text-xl font-bold mb-2">自动跳转</h3>
              <p className="text-gray-600">检测到可用域名后自动跳转，无需手动选择。支持倒计时显示和立即跳转按钮。</p>
            </div>
            <div className="bg-white p-6 rounded-lg border border-gray-200 transition hover:border-gray-800 hover:shadow-sm">
              <div className="w-15 h-15 bg-gray-100 rounded-lg flex items-center justify-center mb-4 text-2xl">🛡️</div>
              <h3 className="text-xl font-bold mb-2">稳定可靠</h3>
              <p className="text-gray-600">基于 Cloudflare Workers 构建，全球边缘节点部署，提供99.9%的服务可用性和极低的延迟。</p>
            </div>
          </section>
          
          <section className="bg-white p-8 rounded-lg border border-gray-200 mb-8">
            <h2 className="text-3xl font-bold text-center mb-8">🌐 支持的域名列表</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {domains.map((domain, index) => (
                <div key={index} className="bg-gray-100 p-4 rounded border-l-4 border-l-gray-800 font-mono text-sm">
                  {domain}
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
      
      <footer className="text-center py-8 border-t border-gray-200">
        <div className="container mx-auto px-4">
          <p className="mb-2">&copy; 2024 Z-Library 重定向服务 | 基于 Cloudflare Workers 构建</p>
          <div className="flex items-center justify-center">
            <p>Created by Actrue</p>
            <a href="https://github.com/Actrue/zlibrary-Active-links-automatic-redirection" className="ml-2">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.49.5.09.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z" fill="currentColor"/>
              </svg>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}