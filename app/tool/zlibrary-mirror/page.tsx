export const generateMetadata = () => ({
  title: 'ZLibrary 镜像站 | ACTrue Tool',
  description: '提供国内可访问的 ZLibrary 镜像网站地址，解决学术资源访问问题',
  keywords: ['zlibrary', '镜像站', '电子书', '学术资源', 'actrue.fun'],
  alternates: {
    canonical: '/tool/zlibrary-mirror'
  }
});

export default function ZLibraryMirrorPage() {
  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <h1 className="text-2xl font-bold mb-6">ZLibrary 镜像站访问指南</h1>
      <p className="mb-4">由于网络限制，ZLibrary 官方站点可能无法直接访问。以下是国内可稳定访问的镜像站点：</p>
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <a 
          href="https://actrue.fun" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline break-all"
        >
          https://actrue.fun
        </a>
      </div>
      <p className="text-sm text-gray-500">* 点击链接将在新标签页打开，请确保网络环境合规使用</p>
    </div>
  );
}