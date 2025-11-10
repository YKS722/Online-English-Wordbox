# 部署指南

本指南说明如何将项目部署到不同的平台。

## 前置要求

1. MongoDB 数据库（推荐使用 [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)）
2. GitHub 仓库
3. 部署平台账户（Railway、Render、Fly.io 等）

## 环境变量配置

### 必需的环境变量

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=your-secret-key-here
```

### 可选的环境变量

```env
OPENAI_API_KEY=your_openai_api_key
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

## 部署选项

### 1. Railway 部署（推荐）

**步骤：**

1. 访问 [Railway](https://railway.app) 并登录
2. 点击 "New Project"
3. 选择 "Deploy from GitHub repo"
4. 选择你的 GitHub 仓库
5. Railway 会自动检测 Next.js 项目
6. 在 Railway Dashboard 中添加环境变量：
   - 进入项目设置
   - 点击 "Variables" 标签
   - 添加所有必需的环境变量
7. Railway 会自动部署并提供一个 URL

**优势：**
- 自动检测 Next.js 项目
- 自动部署（每次推送代码）
- 免费层可用
- 简单的环境变量管理

### 2. Render 部署

**步骤：**

1. 访问 [Render](https://render.com) 并登录
2. 点击 "New +" → "Web Service"
3. 连接你的 GitHub 仓库
4. 配置设置：
   - **Name**: 你的项目名称
   - **Region**: 选择最近的区域
   - **Branch**: `main`
   - **Root Directory**: `./` (默认)
   - **Runtime**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
5. 在 "Environment" 部分添加环境变量
6. 点击 "Create Web Service"

**优势：**
- 免费层可用
- 自动部署
- 支持自定义域名
- SSL 证书自动配置

### 3. Fly.io 部署

**步骤：**

1. 安装 Fly CLI：
   ```bash
   curl -L https://fly.io/install.sh | sh
   ```

2. 登录 Fly.io：
   ```bash
   fly auth login
   ```

3. 初始化项目：
   ```bash
   fly launch
   ```
   按照提示配置项目

4. 设置环境变量：
   ```bash
   fly secrets set MONGODB_URI="your-mongodb-uri"
   fly secrets set NEXTAUTH_URL="https://your-app.fly.dev"
   fly secrets set NEXTAUTH_SECRET="your-secret"
   ```

5. 部署：
   ```bash
   fly deploy
   ```

**优势：**
- 全球边缘网络
- 快速部署
- 支持多区域部署
- 免费层可用

### 4. Docker 部署

**步骤：**

1. 构建 Docker 镜像：
   ```bash
   docker build -t your-app-name .
   ```

2. 运行容器：
   ```bash
   docker run -p 3000:3000 \
     -e MONGODB_URI="your-mongodb-uri" \
     -e NEXTAUTH_URL="https://your-domain.com" \
     -e NEXTAUTH_SECRET="your-secret" \
     your-app-name
   ```

3. 或使用 docker-compose：
   ```bash
   # 创建 .env.local 文件并设置环境变量
   docker-compose up -d
   ```

**优势：**
- 容器化部署
- 易于扩展
- 可以在任何支持 Docker 的平台上运行

### 5. 自托管服务器部署

**步骤：**

1. 在服务器上安装 Node.js 和 npm
2. 克隆仓库：
   ```bash
   git clone https://github.com/your-username/your-repo.git
   cd your-repo
   ```

3. 安装依赖：
   ```bash
   npm ci
   ```

4. 创建 `.env.local` 文件并设置环境变量

5. 构建项目：
   ```bash
   npm run build
   ```

6. 使用 PM2 启动应用：
   ```bash
   npm install -g pm2
   pm2 start npm --name "your-app" -- start
   pm2 save
   pm2 startup
   ```

7. 配置 Nginx 反向代理（可选）：
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

## GitHub Actions 配置

项目已配置 GitHub Actions 工作流：

### CI 工作流

- 自动在推送代码或创建 PR 时触发
- 运行 Linter 检查
- 构建项目确保没有错误

### 部署工作流

- 在推送到 `main` 分支时自动触发
- 构建生产版本

### 配置 GitHub Secrets

在 GitHub 仓库设置中添加 Secrets：
**Settings → Secrets and variables → Actions → New repository secret**

添加以下 Secrets：
- `MONGODB_URI`
- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`
- `OPENAI_API_KEY` (可选)
- `GOOGLE_CLIENT_ID` (可选)
- `GOOGLE_CLIENT_SECRET` (可选)

## MongoDB Atlas 配置

1. 访问 [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. 创建免费集群
3. 创建数据库用户
4. 配置 Network Access：
   - 允许所有 IP：`0.0.0.0/0`
   - 或添加特定 IP 地址
5. 获取连接字符串

## 验证部署

部署完成后，验证以下功能：

1. ✅ 访问应用 URL
2. ✅ 测试用户注册
3. ✅ 测试用户登录
4. ✅ 测试数据库连接（创建词汇书等）
5. ✅ 测试 AI 功能（如果配置了 OpenAI API Key）

## 故障排除

### 构建失败

- 检查环境变量是否正确设置
- 查看构建日志中的错误信息
- 确保所有依赖都已正确安装

### 数据库连接失败

- 检查 `MONGODB_URI` 是否正确
- 确认 MongoDB Atlas Network Access 配置正确
- 检查数据库用户权限

### NextAuth 认证失败

- 确认 `NEXTAUTH_SECRET` 已设置
- 确认 `NEXTAUTH_URL` 设置为正确的生产 URL
- 检查回调 URL 配置（Google OAuth 等）

### 环境变量未生效

- 确认环境变量已正确添加到部署平台
- 重新部署应用
- 检查环境变量名称拼写是否正确

## 相关文档

- [GitHub Actions 工作流说明](.github/workflows/README.md)
- [环境变量示例](env.example)
- [README](README.md)

