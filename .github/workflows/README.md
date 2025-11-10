# GitHub Actions 工作流说明

本项目使用 GitHub Actions 进行持续集成和部署（CI/CD）。

## 工作流文件

### 1. `ci.yml` - 持续集成

**触发条件：**
- 推送到 `main` 或 `develop` 分支
- 创建 Pull Request 到 `main` 或 `develop` 分支

**功能：**
- 在多个 Node.js 版本（18.x, 20.x）上测试
- 运行 Linter 检查代码质量
- 构建项目确保没有构建错误
- 上传构建产物作为 Artifact

### 2. `deploy.yml` - 部署工作流

**触发条件：**
- 推送到 `main` 分支
- 手动触发（workflow_dispatch）

**功能：**
- 构建生产版本
- 准备部署到生产环境

## 配置 GitHub Secrets

在 GitHub 仓库设置中添加以下 Secrets（Settings → Secrets and variables → Actions → New repository secret）：

### 必需的环境变量

- `MONGODB_URI`: MongoDB 连接字符串
- `NEXTAUTH_SECRET`: NextAuth 密钥（使用 `openssl rand -base64 32` 生成）
- `NEXTAUTH_URL`: NextAuth 回调 URL（生产环境域名）

### 可选的环境变量

- `OPENAI_API_KEY`: OpenAI API 密钥（用于 AI 功能）
- `GOOGLE_CLIENT_ID`: Google OAuth Client ID
- `GOOGLE_CLIENT_SECRET`: Google OAuth Client Secret

## 部署选项

### 选项 1: 使用 Railway

1. 在 [Railway](https://railway.app) 创建项目
2. 连接 GitHub 仓库
3. Railway 会自动检测 Next.js 项目并部署
4. 在 Railway 中设置环境变量

### 选项 2: 使用 Render

1. 在 [Render](https://render.com) 创建 Web Service
2. 连接 GitHub 仓库
3. 设置构建命令：`npm install && npm run build`
4. 设置启动命令：`npm start`
5. 在 Render 中设置环境变量

### 选项 3: 使用 Fly.io

1. 安装 Fly CLI：`curl -L https://fly.io/install.sh | sh`
2. 登录：`fly auth login`
3. 初始化：`fly launch`
4. 部署：`fly deploy`
5. 在 Fly.io 中设置环境变量

### 选项 4: 使用自己的服务器

1. 在服务器上安装 Node.js 和 npm
2. 克隆仓库：`git clone <your-repo-url>`
3. 安装依赖：`npm ci`
4. 设置环境变量（创建 `.env.local` 文件）
5. 构建项目：`npm run build`
6. 启动服务：`npm start` 或使用 PM2：`pm2 start npm --name "app" -- start`

### 选项 5: 使用 Docker

1. 创建 `Dockerfile`（参见项目根目录）
2. 构建镜像：`docker build -t your-app .`
3. 运行容器：`docker run -p 3000:3000 --env-file .env.local your-app`

## 查看工作流状态

1. 在 GitHub 仓库中，点击 "Actions" 标签
2. 查看工作流运行状态和日志
3. 如果构建失败，查看错误日志并修复问题

## 故障排除

### 构建失败

- 检查环境变量是否在 GitHub Secrets 中正确设置
- 查看构建日志中的错误信息
- 确保所有依赖都已正确安装

### 部署失败

- 检查部署平台的环境变量配置
- 确保 MongoDB 连接字符串正确
- 检查 NEXTAUTH_URL 是否设置为正确的生产域名

### Linter 错误

- 运行 `npm run lint` 本地检查
- 修复所有 Linter 错误
- 提交并推送更改

