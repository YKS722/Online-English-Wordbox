# 快速启动指南

## 前置要求

- Node.js 18+ 
- MongoDB（本地或MongoDB Atlas）
- OpenAI API密钥（可选，用于AI功能）

## 安装步骤

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

复制 `.env.local.example` 为 `.env.local` 并填写：

```bash
cp .env.local.example .env.local
```

编辑 `.env.local`：

```env
MONGODB_URI=mongodb://localhost:27017/english-learning
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-random-secret-key-here
OPENAI_API_KEY=your_openai_api_key_here
```

### 3. 启动MongoDB

如果使用本地MongoDB：

```bash
# macOS (使用Homebrew)
# 首先添加MongoDB的Homebrew软件源
brew tap mongodb/brew

# 安装MongoDB Community版本
brew install mongodb-community

# 启动MongoDB服务
brew services start mongodb-community

# 或使用Docker
docker run -d -p 27017:27017 --name mongodb mongo
```

### 4. 初始化数据库

运行初始化脚本创建示例词汇书：

```bash
npx tsx scripts/init-books.ts
```

### 5. 启动开发服务器

```bash
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000) 查看应用。

## 使用流程

### 1. 注册/登录

- 访问首页，点击"注册"创建新账户
- 或使用Google登录（如果已配置）

### 2. 选择词汇书

- 登录后进入仪表板
- 点击"选择词汇书"
- 选择一个词汇书（如IELTS核心词汇）

### 3. 开始学习

- 点击"开始学习"
- 系统会显示一个单词
- 选择一句例句
- 尝试翻译成中文
- 查看参考翻译
- 使用该单词创作一个新句子
- AI会评估你的句子
- 评价自己的表现（0-5分）

### 4. 复习单词

- 在仪表板点击"复习单词"
- 系统会根据间隔重复算法显示需要复习的单词
- 评价自己的表现

### 5. 查看进度

- 在仪表板查看学习统计
- 查看各词汇书的学习进度

## 故障排除

### MongoDB连接失败

- 确保MongoDB正在运行
- 检查MONGODB_URI是否正确
- 如果使用MongoDB Atlas，确保IP地址已添加到白名单

### NextAuth错误

- 确保NEXTAUTH_SECRET已设置
- 确保NEXTAUTH_URL与当前URL匹配

### AI功能不工作

- 检查OPENAI_API_KEY是否正确
- 如果没有API密钥，应用仍可使用，但会使用模拟数据

### 类型错误

- 运行 `npm install` 确保所有依赖已安装
- 某些TypeScript类型错误可能在运行时不会出现问题

## 下一步

- 添加更多词汇书
- 自定义学习设置
- 设置学习目标
- 查看详细的学习统计

## 获取帮助

如有问题，请查看：
- [README.md](./README.md) - 完整文档
- [项目Issues](https://github.com/your-repo/issues) - 报告问题

