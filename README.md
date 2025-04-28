# 金融计算工具

这是一个基于Next.js的金融计算工具集，包含多种实用的金融计算功能。

## 主要功能

### 储蓄复利计算器

1. **功能说明**
   - 计算在给定初始本金、每月定投金额和年增长率下，达到目标金额所需的年数
   - 同时计算无复利情况下的总投入金额
   - 显示复利收益放大比率
   - 提供名义收益和实际收益(扣除通胀)的图表展示

2. **计算方法**
   - 复利计算采用按月复利方式
   - 计算公式：`最终金额 = 初始本金 × (1 + 月利率)^(年数×12) + 每月定投 × [(1 + 月利率)^(年数×12) - 1] / 月利率`
   - 实际收益计算会扣除通货膨胀影响

3. **使用说明**
   - 输入每月定投金额、年增长率、通胀率、初始本金和目标金额
   - 点击"计算所需年数"按钮获取结果
   - 可调整"显示年份"查看不同时间段的收益变化

## 部署指南

### 本地部署（开发环境）
1. 环境准备
   - 安装Node.js (建议版本18.x或更高)
   - 安装npm或yarn

2. 安装项目依赖
```bash
npm install
# 或使用yarn
# yarn install
```

3. 启动开发服务器
```bash
npm run dev
# 或使用yarn
# yarn dev
```

4. 访问应用
   开发服务器启动后，在浏览器中打开 http://localhost:3000 即可访问应用

### Cloudflare部署
1. 安装Wrangler CLI工具
```bash
npm install -g wrangler
```

2. 登录Cloudflare账户
```bash
wrangler login
```

3. 配置环境变量
   在项目根目录创建`.env`文件，添加必要的环境变量

4. 构建项目
```bash
npm run build
```

5. 部署到Cloudflare
```bash
wrangler deploy
```

6. 自定义域名(可选)
   在Cloudflare控制面板中为您的Worker配置自定义域名

### 其他部署方式
您也可以使用Vercel平台一键部署Next.js应用:
[Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme)

更多部署选项请参考:
[Next.js部署文档](https://nextjs.org/docs/app/building-your-application/deploying)
