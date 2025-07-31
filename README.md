# 金融计算工具

这是一个基于Next.js的金融计算工具集，包含多种实用的金融计算功能。

## 项目截图

![储蓄复利计算器截图](/public/window.svg)
*图1: 储蓄复利计算器界面*

![收益对比图表](/public/file.svg)
*图2: 名义收益与实际收益对比图表*

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

### Cloudflare一键部署

[![部署到Cloudflare](https://img.shields.io/badge/部署到-Cloudflare-blue?style=for-the-badge&logo=cloudflare)](https://dash.cloudflare.com/?to=/:account/workers-and-pages/new)

1. 点击上方按钮跳转到Cloudflare控制台
2. 选择"创建Worker"
3. 连接您的GitHub账户并选择此仓库
4. 系统将自动完成部署

或使用命令行快速部署:
```bash
npm install -g wrangler && wrangler login && npm run build && wrangler deploy
```

### 其他部署方式
您也可以使用Vercel平台一键部署Next.js应用:
[Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme)

更多部署选项请参考:
[Next.js部署文档](https://nextjs.org/docs/app/building-your-application/deploying)
