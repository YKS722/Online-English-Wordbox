# Vercel 部署指南

本文档说明如何将此项目部署到 Vercel。

## 前置要求

1. 一个 Vercel 账户（免费账户即可）
2. 一个 MongoDB 数据库（推荐使用 MongoDB Atlas）
3. （可选）Google OAuth 凭据
4. （可选）OpenAI API Key

## 步骤 1: 准备 MongoDB 数据库

### 使用 MongoDB Atlas（推荐）

1. 访问 [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. 创建免费集群
3. 创建数据库用户
4. 在 Network Access 中添加 IP 地址（或允许所有 IP：`0.0.0.0/0`）
5. 获取连接字符串，格式如下：
   ```
   mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority
   ```

### 本地 MongoDB

如果使用本地 MongoDB，需要确保 Vercel 可以访问。不推荐用于生产环境。

## 步骤 2: 准备环境变量

创建 `.env.local` 文件（本地开发使用）或直接在 Vercel Dashboard 中设置环境变量。

### 必需的环境变量

```env
# MongoDB 连接字符串
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority

# NextAuth 配置
# 开发环境: http://localhost:3000
# 生产环境: https://your-domain.vercel.app
NEXTAUTH_URL=https://your-domain.vercel.app
NEXTAUTH_SECRET=your-random-secret-key-here
```

生成 `NEXTAUTH_SECRET`：
```bash
openssl rand -base64 32
```

### 可选的环境变量

```env
# Google OAuth（如果使用 Google 登录）
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# OpenAI API Key（如果使用 AI 功能）
OPENAI_API_KEY=your_openai_api_key
```

## 步骤 3: 部署到 Vercel

### 方法 1: 通过 Vercel Dashboard

1. 访问 [Vercel Dashboard](https://vercel.com/dashboard)
2. 点击 "Add New Project"
3. 导入你的 Git 仓库（GitHub、GitLab 或 Bitbucket）
4. 配置项目：
   - **Framework Preset**: Next.js（自动检测）
   - **Root Directory**: `./`（默认）
   - **Build Command**: `npm run build`（默认）
   - **Output Directory**: `.next`（默认）
   - **Install Command**: `npm install`（默认）

### 方法 2: 使用 Vercel CLI

1. 安装 Vercel CLI：
   ```bash
   npm i -g vercel
   ```

2. 登录 Vercel：
   ```bash
   vercel login
   ```

3. 部署项目：
   ```bash
   vercel
   ```

4. 生产环境部署：
   ```bash
   vercel --prod
   ```

## 步骤 4: 配置环境变量

在 Vercel Dashboard 中配置环境变量：

1. 进入项目设置
2. 点击 "Environment Variables"
3. 添加以下环境变量：

   | 变量名 | 值 | 环境 |
   |--------|-----|------|
   | `MONGODB_URI` | 你的 MongoDB 连接字符串 | Production, Preview, Development |
   | `NEXTAUTH_URL` | `https://your-project.vercel.app` | Production |
   | `NEXTAUTH_URL` | `http://localhost:3000` | Development |
   | `NEXTAUTH_SECRET` | 生成的随机字符串 | All |
   | `OPENAI_API_KEY` | （可选）你的 OpenAI API Key | All |
   | `GOOGLE_CLIENT_ID` | （可选）Google OAuth Client ID | All |
   | `GOOGLE_CLIENT_SECRET` | （可选）Google OAuth Client Secret | All |

4. 点击 "Save"
5. 重新部署项目以应用新的环境变量

### 重要提示

- **NEXTAUTH_URL**: 在 Vercel 上，NextAuth 会自动检测 `VERCEL_URL`，但你也可以手动设置 `NEXTAUTH_URL`。
- **MONGODB_URI**: 确保 MongoDB Atlas 的 Network Access 允许 Vercel 的 IP 地址访问。
- 环境变量更改后，需要重新部署项目才能生效。

## 步骤 5: 验证部署

1. 访问你的 Vercel 部署 URL（例如：`https://your-project.vercel.app`）
2. 检查控制台日志，确认 MongoDB 连接成功
3. 测试注册和登录功能
4. 测试数据库操作（创建词汇书、学习单词等）

## 故障排除

### MongoDB 连接失败

- 检查 `MONGODB_URI` 是否正确设置
- 确认 MongoDB Atlas Network Access 允许所有 IP 或包含 Vercel 的 IP
- 检查 MongoDB 用户权限
- 查看 Vercel 函数日志中的错误信息

### NextAuth 认证失败

- 确认 `NEXTAUTH_SECRET` 已设置
- 确认 `NEXTAUTH_URL` 正确设置为你的 Vercel 域名
- 检查回调 URL 是否正确配置（Google OAuth 等）

### 构建失败

- 检查 `package.json` 中的依赖是否正确
- 确认 Node.js 版本兼容（推荐 18.x 或更高）
- 查看构建日志中的具体错误信息

### 环境变量未生效

- 确认环境变量已正确添加到 Vercel Dashboard
- 确认选择了正确的环境（Production/Preview/Development）
- 重新部署项目

## 性能优化

### 数据库连接

项目已实现 MongoDB 连接池缓存，避免在服务器less环境中重复创建连接。

### 冷启动

- Vercel 的服务器less函数可能有冷启动延迟
- 可以通过 Vercel Pro 计划启用 Edge Functions 来减少延迟
- 考虑使用 MongoDB Atlas 的连接池功能

### 监控和日志

- 使用 Vercel Analytics 监控性能
- 查看 Vercel Dashboard 中的函数日志
- 考虑集成 Sentry 等错误监控服务

## 持续部署

项目已配置为自动部署：
- 推送到 `main` 分支 → 自动部署到 Production
- 创建 Pull Request → 自动部署到 Preview 环境

## 参考资料

- [Vercel 文档](https://vercel.com/docs)
- [Next.js 部署文档](https://nextjs.org/docs/deployment)
- [MongoDB Atlas 文档](https://docs.atlas.mongodb.com/)
- [NextAuth.js 文档](https://next-auth.js.org/)

