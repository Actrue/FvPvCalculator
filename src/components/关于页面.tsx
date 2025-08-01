'use client';

// import Link from 'next/link';  // 移除未使用的导入

/**
 * 关于页面组件
 */
export default function AboutPage() {
  
  // 技能数据
  const skills = [
    { name: 'React', level: 90, color: '#61DAFB' },
    { name: 'Next.js', level: 85, color: '#000000' },
    { name: 'TypeScript', level: 88, color: '#3178C6' },
    { name: 'JavaScript', level: 92, color: '#F7DF1E' },
    { name: 'Node.js', level: 80, color: '#339933' },
    { name: 'CSS/Tailwind', level: 85, color: '#06B6D4' },
    { name: 'Git', level: 88, color: '#F05032' },
    { name: 'Docker', level: 75, color: '#2496ED' }
  ];
  
  // 工作经历数据
  const experiences = [
    {
      title: '高级前端开发工程师',
      company: '某科技公司',
      period: '2022 - 至今',
      description: '负责前端架构设计和团队技术方案制定，主导多个大型项目的前端开发工作。',
      technologies: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS']
    },
    {
      title: '前端开发工程师',
      company: '某互联网公司',
      period: '2020 - 2022',
      description: '参与多个 Web 应用的开发，负责用户界面设计和交互优化。',
      technologies: ['Vue.js', 'JavaScript', 'SCSS', 'Webpack']
    },
    {
      title: '初级前端开发工程师',
      company: '某创业公司',
      period: '2019 - 2020',
      description: '学习前端开发技术，参与公司产品的前端功能开发。',
      technologies: ['HTML', 'CSS', 'JavaScript', 'jQuery']
    }
  ];
  
  // 项目展示数据
  const projects = [
    {
      name: '任务管理应用',
      description: '一个功能完整的任务管理应用，支持项目管理、团队协作、进度跟踪等功能。',
      technologies: ['React', 'Node.js', 'MongoDB', 'Socket.io'],
      link: '#',
      github: '#'
    },
    {
      name: '数据可视化平台',
      description: '企业级数据可视化平台，提供丰富的图表组件和实时数据展示功能。',
      technologies: ['Vue.js', 'D3.js', 'ECharts', 'WebSocket'],
      link: '#',
      github: '#'
    }
  ];
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <div className="container mx-auto px-4 py-8">
        {/* 页面头部 */}
        <div className="bg-white/5 backdrop-blur-sm border border-gray-700 rounded-xl p-6 md:p-8 mb-8">
          {/* 页面标题 */}
          <div className="mb-6">
            <h1 className="text-3xl md:text-4xl font-bold text-white">关于我</h1>
          </div>
          
          {/* 个人介绍 */}
          <div className="flex flex-col md:flex-row md:items-center gap-8">
            {/* 头像 */}
            <div className="flex-shrink-0">
              <div className="w-32 h-32 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-4xl">
                  A
                </span>
              </div>
            </div>
            
            {/* 基本信息 */}
            <div className="flex-1">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Actrue
              </h1>
              <p className="text-xl text-gray-300 mb-4">
                前端开发工程师 · 开源爱好者
              </p>
              <p className="text-gray-400 leading-relaxed mb-6">
                热爱前端技术，专注于现代 Web 开发。喜欢探索新技术，分享开发经验，
                致力于构建优秀的用户体验和高质量的代码。
              </p>
              
              {/* 社交链接 */}
              <div className="flex space-x-4">
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors duration-200"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                  <span>GitHub</span>
                </a>
                
                <a
                  href="mailto:contact@example.com"
                  className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>联系我</span>
                </a>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 主要内容 */}
          <div className="lg:col-span-2 space-y-8">
            {/* 技能专长 */}
            <section className="bg-white/5 backdrop-blur-sm border border-gray-700 rounded-xl p-6 md:p-8">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <svg className="w-6 h-6 mr-3 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                技能专长
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {skills.map((skill) => (
                  <div key={skill.name} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-white font-medium">{skill.name}</span>
                      <span className="text-gray-400 text-sm">{skill.level}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full transition-all duration-1000 ease-out"
                        style={{ 
                          width: `${skill.level}%`,
                          backgroundColor: skill.color
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
            
            {/* 工作经历 */}
            <section className="bg-white/5 backdrop-blur-sm border border-gray-700 rounded-xl p-6 md:p-8">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <svg className="w-6 h-6 mr-3 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                </svg>
                工作经历
              </h2>
              
              <div className="space-y-6">
                {experiences.map((exp, index) => (
                  <div key={index} className="relative pl-8 border-l-2 border-gray-600 last:border-l-0">
                    <div className="absolute -left-2 top-0 w-4 h-4 bg-blue-500 rounded-full"></div>
                    <div className="pb-6">
                      <h3 className="text-xl font-semibold text-white mb-1">{exp.title}</h3>
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                        <span className="text-blue-400 font-medium">{exp.company}</span>
                        <span className="text-gray-400 text-sm">{exp.period}</span>
                      </div>
                      <p className="text-gray-300 mb-3 leading-relaxed">{exp.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {exp.technologies.map((tech) => (
                          <span key={tech} className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded-md">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
            
            {/* 项目展示 */}
            <section className="bg-white/5 backdrop-blur-sm border border-gray-700 rounded-xl p-6 md:p-8">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <svg className="w-6 h-6 mr-3 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                项目展示
              </h2>
              
              <div className="space-y-6">
                {projects.map((project, index) => (
                  <div key={index} className="bg-gray-800/50 border border-gray-600 rounded-lg p-6">
                    <h3 className="text-xl font-semibold text-white mb-2">{project.name}</h3>
                    <p className="text-gray-300 mb-4 leading-relaxed">{project.description}</p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.technologies.map((tech) => (
                        <span key={tech} className="px-2 py-1 bg-blue-600/20 text-blue-400 text-xs rounded-md border border-blue-600/30">
                          {tech}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex space-x-3">
                      <a 
                        href={project.link}
                        className="inline-flex items-center space-x-1 text-blue-400 hover:text-blue-300 transition-colors duration-200"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        <span>查看项目</span>
                      </a>
                      
                      <a 
                        href={project.github}
                        className="inline-flex items-center space-x-1 text-gray-400 hover:text-gray-300 transition-colors duration-200"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                        </svg>
                        <span>源码</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
          
            
          {/* 联系方式 */}
          <div className="bg-white/5 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              联系方式
            </h3>
            
            <div className="space-y-3">
              <a
                href="mailto:contact@example.com"
                className="flex items-center space-x-3 p-2 rounded-lg text-gray-300 hover:text-white hover:bg-gray-700/50 transition-all duration-200"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>邮箱联系</span>
              </a>
              
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-3 p-2 rounded-lg text-gray-300 hover:text-white hover:bg-gray-700/50 transition-all duration-200"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                <span>GitHub</span>
              </a>
            </div>
          </div>
             
          {/* 兴趣爱好 */}
          <div className="bg-white/5 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              兴趣爱好
            </h3>
            
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-gray-300">
                <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                <span>编程与技术研究</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-300">
                <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                <span>开源项目贡献</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-300">
                <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
                <span>技术文章写作</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-300">
                <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                <span>UI/UX 设计</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-300">
                <span className="w-2 h-2 bg-red-400 rounded-full"></span>
                <span>摄影与旅行</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}