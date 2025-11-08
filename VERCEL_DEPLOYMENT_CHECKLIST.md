# Vercel 部署检查清单

本文档列出了部署到 Vercel 前需要检查的所有项目。

## ✅ 环境变量检查

### 必需的环境变量

在 Vercel Dashboard 的 Environment Variables 中设置以下变量：

1. **MONGODB_URI** (必需)
   - 格式: `mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority`
   - 如果没有设置，应用启动时会抛出错误并显示详细说明

2. **NEXTAUTH_SECRET** (必需)
   - 生成方式: `openssl rand -base64 32`
   - 或使用: https://generate-secret.vercel.app/32
   - 如果没有设置，NextAuth 路由会抛出错误

3. **NEXTAUTH_URL** (推荐)
   - 生产环境: `https://your-project.vercel.app`
   - 开发环境: `http://localhost:3000`
   - 如果没有设置，NextAuth 会尝试使用 `VERCEL_URL`（Vercel 自动设置）
   - 建议手动设置以确保一致性

### 可选的环境变量

- **OPENAI_API_KEY**: OpenAI API 密钥（用于 AI 功能）
- **GOOGLE_CLIENT_ID**: Google OAuth Client ID
- **GOOGLE_CLIENT_SECRET**: Google OAuth Client Secret

## ✅ 代码检查

### 1. MongoDB 连接

- [x] `lib/mongodb.ts` 已实现全局连接缓存
- [x] 所有需要数据库的 API 路由都调用了 `connectDB()`
- [x] 连接成功后会记录日志 "✅ Connected to MongoDB"

### 2. API 路由

- [x] 所有 API 路由使用相对路径 `/api/...`
- [x] 没有硬编码的 `http://localhost:3000` URL
- [x] 所有数据库操作前都调用了 `connectDB()`

### 3. NextAuth 配置

- [x] NextAuth 配置使用 `NEXTAUTH_SECRET` 环境变量
- [x] NextAuth 自动使用 `NEXTAUTH_URL` 或 `VERCEL_URL`
- [x] 启动时验证 `NEXTAUTH_SECRET` 是否存在

### 4. 环境变量验证

- [x] `lib/mongodb.ts` 在启动时检查 `MONGODB_URI`
- [x] `app/api/auth/[...nextauth]/route.ts` 在启动时检查 `NEXTAUTH_SECRET`
- [x] 所有错误消息都包含清晰的说明

## ✅ 部署步骤

1. **在 Vercel Dashboard 中设置环境变量**
   - 进入项目设置 → Environment Variables
   - 添加所有必需的环境变量
   - 确保为 Production、Preview 和 Development 环境都设置了变量

2. **配置 MongoDB Atlas**
   - 确保 Network Access 允许所有 IP (`0.0.0.0/0`) 或包含 Vercel 的 IP
   - 验证连接字符串格式正确

3. **部署项目**
   - 推送到 Git 仓库
   - Vercel 会自动检测并部署
   - 检查构建日志确认没有错误

4. **验证部署**
   - 访问部署 URL
   - 检查控制台日志，确认 "✅ Connected to MongoDB" 消息
   - 测试注册和登录功能
   - 测试数据库操作（创建词汇书、学习单词等）

## ✅ 故障排除

### MongoDB 连接失败

- 检查 `MONGODB_URI` 是否正确设置
- 确认 MongoDB Atlas Network Access 配置正确
- 检查连接字符串格式

### NextAuth 错误

- 检查 `NEXTAUTH_SECRET` 是否正确设置
- 确认 `NEXTAUTH_URL` 设置为正确的生产 URL
- 检查 Vercel 日志中的错误信息

### 环境变量未生效

- 环境变量更改后需要重新部署
- 确认环境变量设置在正确的环境（Production/Preview/Development）
- 检查变量名拼写是否正确

## 📝 文件清单

以下文件已更新以支持 Vercel 部署：

- `lib/mongodb.ts` - MongoDB 连接辅助函数，包含全局缓存和错误处理
- `app/api/auth/[...nextauth]/route.ts` - NextAuth 配置，包含环境变量验证
- `env.example` - 环境变量示例文件
- `vercel.json` - Vercel 配置文件
- `.gitignore` - 已包含 `.env*.local` 和 `.env`

## 🚀 快速部署命令

```bash
# 1. 确保所有更改已提交
git add .
git commit -m "Prepare for Vercel deployment"

# 2. 推送到远程仓库
git push

# 3. 在 Vercel Dashboard 中：
#    - 导入项目
#    - 设置环境变量
#    - 部署
```

## 📚 相关文档

- [Vercel 部署指南](./DEPLOYMENT.md)
- [环境变量说明](./env.example)
- [README](./README.md)

