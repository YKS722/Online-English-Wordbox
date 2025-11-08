# 英语单词学习平台 - 全栈应用

一个类似 mevory.com 的完整英语单词学习平台，专为中国人设计，集成AI功能，提供智能化的学习体验。

## 核心功能

### 📚 词汇书系统
- 支持多种词汇书（IELTS、TOEFL、GRE、CET-4/6等）
- 管理员可以导入或上传词汇列表
- 用户可以标记单词为"已知"，排除在学习会话之外
- 个人词汇本跟踪进度和熟悉单词

### 🎓 学习模块
- **AI例句生成**：为每个单词自动生成3-5个例句
- **翻译练习**：用户选择一句例句，查看翻译，然后从中文翻译回英文
- **提示功能**：提供部分提示（短语结构或关键词）
- **句子创作**：用户必须使用目标单词创建新句子
- **AI反馈**：评估语法、词汇准确性和自然度，提供修正和改进建议

### 🔄 间隔重复复习系统
- 基于SuperMemo 2算法的间隔重复
- 每个单词有独立的复习间隔（基于成功率和上次练习时间）
- 未到复习时间的单词不会显示
- 智能调整复习频率

### 👤 用户管理
- 简单认证（邮箱/密码或Google登录）
- 个人词汇本跟踪进度和熟悉单词
- 学习统计和进度可视化

## 技术栈

### 前端
- **Next.js 14**: React框架，使用App Router
- **TypeScript**: 类型安全
- **Tailwind CSS**: 现代化UI样式
- **Framer Motion**: 动画效果
- **Lucide React**: 图标库
- **React Hot Toast**: 通知提示

### 后端
- **Next.js API Routes**: 服务端API
- **NextAuth.js**: 认证系统
- **MongoDB + Mongoose**: 数据库和ORM
- **bcryptjs**: 密码加密

### AI集成
- **OpenAI API**: GPT模型用于句子生成和反馈

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

复制 `env.example` 文件为 `.env.local`：

```bash
cp env.example .env.local
```

然后编辑 `.env.local` 文件，填入实际的环境变量值：

```env
# MongoDB连接字符串
MONGODB_URI=mongodb://localhost:27017/english-learning
# 或者使用MongoDB Atlas
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/english-learning

# NextAuth配置
# 开发环境: http://localhost:3000
# 生产环境: https://your-domain.vercel.app (替换为你的 Vercel 域名)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here
# 生成密钥: openssl rand -base64 32

# OpenAI API密钥（可选，用于AI功能）
OPENAI_API_KEY=your_openai_api_key_here

# Google OAuth（可选）
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

### 3. 初始化数据库

运行初始化脚本创建示例词汇书：

```bash
# 首先确保MongoDB正在运行
# 然后运行初始化脚本
npx ts-node scripts/init-books.ts
```

### 4. 运行开发服务器

```bash
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000) 查看应用。

### 5. 构建生产版本

```bash
npm run build
npm start
```

## 项目结构

```
.
├── app/                          # Next.js App Router
│   ├── api/                     # API路由
│   │   ├── auth/               # 认证相关
│   │   │   ├── [...nextauth]/  # NextAuth配置
│   │   │   └── register/       # 用户注册
│   │   ├── vocabulary-books/   # 词汇书API
│   │   ├── learning/           # 学习相关API
│   │   │   ├── start/          # 开始学习
│   │   │   ├── examples/       # 获取例句
│   │   │   ├── hint/           # 获取提示
│   │   │   ├── evaluate-sentence/ # 评估句子
│   │   │   ├── review/         # 提交复习
│   │   │   └── mark-known/     # 标记已知
│   │   └── dashboard/          # 仪表板统计
│   ├── auth/                   # 认证页面
│   │   ├── signin/            # 登录页面
│   │   └── signup/            # 注册页面
│   ├── dashboard/              # 仪表板
│   ├── books/                  # 词汇书列表
│   ├── learn/                  # 学习页面
│   ├── review/                 # 复习页面
│   ├── profile/                # 用户资料
│   ├── layout.tsx              # 根布局
│   ├── page.tsx                # 首页
│   └── globals.css             # 全局样式
├── components/                  # React组件
│   ├── WordCard.tsx           # 单词卡片
│   ├── WordList.tsx           # 单词列表
│   ├── ProgressBar.tsx        # 进度条
│   └── SearchBar.tsx          # 搜索栏
├── lib/                        # 工具函数
│   ├── mongodb.ts             # MongoDB连接
│   ├── auth.ts                # 认证工具
│   ├── ai-service.ts          # AI服务
│   └── spaced-repetition.ts   # 间隔重复算法
├── models/                     # 数据库模型
│   ├── User.ts                # 用户模型
│   ├── VocabularyBook.ts      # 词汇书模型
│   ├── Word.ts                # 单词模型
│   └── LearningRecord.ts      # 学习记录模型
├── types/                      # TypeScript类型
│   ├── index.ts               # 通用类型
│   └── next-auth.d.ts         # NextAuth类型
├── providers/                  # 上下文提供者
│   └── SessionProvider.tsx    # Session提供者
├── scripts/                    # 脚本
│   └── init-books.ts          # 初始化词汇书
└── README.md                   # 项目说明
```

## 功能详解

### 学习流程

1. **选择词汇书**：用户从词汇书列表中选择要学习的词汇书
2. **开始学习**：系统根据间隔重复算法选择下一个要学习的单词
3. **选择例句**：AI生成3-5个例句，用户选择一句
4. **翻译练习**：用户看到英文句子，尝试翻译成中文
5. **获取提示**：用户可以获取部分提示（可选）
6. **查看翻译**：查看参考翻译
7. **创作句子**：用户使用目标单词创作新句子
8. **AI评估**：AI评估句子并提供反馈
9. **提交复习**：用户评价自己的表现（0-5分）
10. **更新间隔**：系统根据表现更新复习间隔

### 间隔重复算法

基于SuperMemo 2算法：
- 根据用户的表现（0-5分）调整复习间隔
- 成功回答后，间隔时间增加
- 失败后，间隔时间重置
- 易度因子（Ease Factor）根据表现动态调整

### AI功能

- **例句生成**：使用GPT-3.5生成自然、实用的例句
- **翻译提示**：提供部分提示，不直接给出答案
- **句子评估**：评估语法、词汇准确性和自然度
- **反馈建议**：提供具体的修正和改进建议

## 环境变量说明

| 变量名 | 必需 | 说明 |
|--------|------|------|
| `MONGODB_URI` | 是 | MongoDB连接字符串 |
| `NEXTAUTH_URL` | 是 | NextAuth回调URL |
| `NEXTAUTH_SECRET` | 是 | NextAuth密钥（用于加密） |
| `OPENAI_API_KEY` | 否 | OpenAI API密钥（用于AI功能） |
| `GOOGLE_CLIENT_ID` | 否 | Google OAuth客户端ID |
| `GOOGLE_CLIENT_SECRET` | 否 | Google OAuth客户端密钥 |

## 部署

### Vercel部署（推荐）

详细的部署指南请参阅 [DEPLOYMENT.md](./DEPLOYMENT.md)

快速步骤：
1. 将代码推送到 GitHub/GitLab/Bitbucket
2. 在 [Vercel Dashboard](https://vercel.com/dashboard) 中导入项目
3. 配置环境变量（在 Vercel Dashboard 的 Environment Variables 中设置）
4. 部署

#### 必需的环境变量

- `MONGODB_URI`: MongoDB 连接字符串
- `NEXTAUTH_URL`: NextAuth 回调 URL（生产环境使用你的 Vercel 域名）
- `NEXTAUTH_SECRET`: NextAuth 密钥（使用 `openssl rand -base64 32` 生成）

#### 可选的环境变量

- `OPENAI_API_KEY`: OpenAI API 密钥（用于 AI 功能）
- `GOOGLE_CLIENT_ID`: Google OAuth Client ID
- `GOOGLE_CLIENT_SECRET`: Google OAuth Client Secret

**注意**：在 Vercel 上，NextAuth 会自动检测 `VERCEL_URL`，但建议手动设置 `NEXTAUTH_URL` 以确保一致性。

### 数据库部署

- **MongoDB Atlas**：强烈推荐用于生产环境（免费层可用）
- **本地MongoDB**：仅用于开发环境

### 环境变量文件

项目包含 `env.example` 文件，列出了所有需要的环境变量。本地开发时：
1. 复制 `env.example` 为 `.env.local`
2. 填入实际的环境变量值

## 开发计划

- [ ] 移动端响应式优化
- [ ] 更多词汇书支持
- [ ] 学习目标设置
- [ ] 社交功能（分享学习进度）
- [ ] 单词发音（TTS API）
- [ ] 单词图片和记忆技巧
- [ ] 导出学习数据

## 许可证

MIT

## 贡献

欢迎提交Issue和Pull Request！
