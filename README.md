# Actrue - 综合性工具集合平台

这是一个基于Next.js的综合性工具集合平台，包含金融计算、生活实用和效率提升等多种实用工具。

## 项目截图

![首页界面](/public/window.svg)
*图1: Actrue平台首页界面*

![工具集合界面](/public/file.svg)
*图2: 工具集合界面*

## 主要功能

### 金融计算工具

1. **功能说明**
   - 现值计算器：计算资金当前价值，支持复利现值计算
   - 终值计算器：预测资金未来价值，支持复利终值计算
   - 复利计算器：计算复利增长效果，支持不同复利次数
   - 储蓄复利计算器：计算定期定额投资的复利增长效果，对比无复利情况
   - 利率计算器：根据现值和终值计算所需利率

2. **使用场景**
   - 个人理财规划
   - 投资收益计算
   - 金融教育学习

### 生活实用工具

1. **饮水量计算器**
   - 基于科学公式，计算个人每日最佳饮水量
   - 考虑性别、年龄、体重、身高和活动强度等因素
   - 提供个性化的饮水建议

2. **打卡助手**
   - 帮助养成良好日常习惯
   - 支持习惯打卡和进度追踪
   - 简单易用的界面设计

3. **Sing-Box配置生成器**
   - 在线生成Sing-Box服务器配置文件
   - 支持VLESS、Shadowsocks、Hysteria2等多种协议
   - 可导出JSON格式配置文件

### 效率提升工具

1. **脑图编辑器**
   - 创建和编辑思维导图
   - 支持导出图片和文本格式
   - 帮助组织思路和知识管理

2. **Base64订阅链接转换器**
   - 将Base64编码的订阅链接转换为Clash等代理工具可识别的节点URL
   - 支持多种代理协议
   - 支持从URL直接获取订阅内容

3. **网站地图查找工具**
   - 快速查找网站的网站地图(sitemap.xml)
   - 支持检查robots.txt文件中的Sitemap声明
   - 显示HTTP状态码便于判断文件是否存在

4. **时间工具**
   - 查看当前年份周数进度与时间分布
   - 直观展示时间流逝
   - 帮助时间管理和规划

## 部署指南

### 本地部署（开发环境）
1. 环境准备
   - 安装Node.js (建议版本18.x或更高)
   - 安装pnpm

2. 安装项目依赖
```bash
pnpm install
```

3. 启动开发服务器
```bash
pnpm dev
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
pnpm install -g wrangler && wrangler login && pnpm build && wrangler deploy
```

### 其他部署方式
您也可以使用Vercel平台一键部署Next.js应用:
[Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme)

更多部署选项请参考:
[Next.js部署文档](https://nextjs.org/docs/app/building-your-application/deploying)
