# Honam DeFi Analyzer

AI-powered DeFi project analysis platform. Upload whitepapers, documentation, and code to get comprehensive risk analysis, highlights, and expert insights.

## Features

- 🚀 **AI-Powered Analysis**: Leverages Google Gemini AI for deep project analysis
- 📊 **Interactive Dashboard**: Visual charts and metrics for risk assessment
- 🔍 **Expert Insights**: Professional evaluation on key DeFi aspects
- 📈 **User Analytics**: Integrated Mixpanel for behavior tracking
- 🎨 **Cyber Design**: Modern black-green color scheme inspired by Hyperliquid

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, pnpm, or bun
- Google Gemini API key
- Mixpanel token (optional, for analytics)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd defi-analyzer
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Create a `.env.local` file in the root directory:
```env
GEMINI_API_KEY=your_gemini_api_key_here
NEXT_PUBLIC_MIXPANEL_TOKEN=your_mixpanel_token_here
```

4. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. **Upload Files**: Drag and drop or select files (PDF, TXT, MD, or code files like .sol, .js, .ts, .py)
2. **Analyze**: Click "Analyze Project" to start AI analysis
3. **Review Results**: View comprehensive dashboard with:
   - Risk assessment scores
   - Project highlights
   - Expert focus areas (Tokenomics, Security, Innovation, Team, Market Fit)
   - Interactive visualizations

## Project Structure

```
defi-analyzer/
├── app/
│   ├── api/
│   │   └── analyze/          # API route for project analysis
│   ├── components/
│   │   ├── FileUpload.tsx    # File upload component
│   │   ├── AnalysisDashboard.tsx  # Results visualization
│   │   └── MixpanelProvider.tsx   # Analytics provider
│   ├── lib/
│   │   └── mixpanel.ts       # Mixpanel integration
│   ├── layout.tsx            # Root layout
│   ├── page.tsx              # Main page
│   └── globals.css           # Global styles
└── ...
```

## Tech Stack

- **Framework**: Next.js 16
- **AI**: Google Gemini API
- **Analytics**: Mixpanel
- **Charts**: Recharts
- **Styling**: Tailwind CSS
- **Icons**: Lucide React

## API Keys

### Gemini API
Get your API key from [Google AI Studio](https://makersuite.google.com/app/apikey)

### Mixpanel
Get your token from [Mixpanel Dashboard](https://mixpanel.com/)

## Deployment to Vercel

### 方法一：通过 Vercel Dashboard（推荐）

1. **准备工作**
   - 确保代码已推送到 GitHub、GitLab 或 Bitbucket
   - 访问 [Vercel](https://vercel.com) 并登录（可使用 GitHub 账号）

2. **导入项目**
   - 点击 "Add New Project"
   - 选择你的代码仓库
   - Vercel 会自动检测 Next.js 项目

3. **配置项目**
   - **Framework Preset**: Next.js（自动检测）
   - **Root Directory**: 如果项目在子目录中，设置为 `defi-analyzer`
   - **Build Command**: `npm run build`（默认）
   - **Output Directory**: `.next`（默认）
   - **Install Command**: `npm install`（默认）

4. **设置环境变量**
   在 "Environment Variables" 部分添加：
   ```
   GEMINI_API_KEY=your_gemini_api_key_here
   NEXT_PUBLIC_MIXPANEL_TOKEN=your_mixpanel_token_here
   ```
   
   **重要**：确保选择正确的环境（Production, Preview, Development）

5. **部署**
   - 点击 "Deploy"
   - 等待构建完成（通常 1-3 分钟）
   - 部署成功后，Vercel 会提供一个 `.vercel.app` 域名

6. **自定义域名（可选）**
   - 在项目设置中找到 "Domains"
   - 添加你的自定义域名（如 `honamdefi.com`）
   - 按照提示配置 DNS 记录

### 方法二：使用 Vercel CLI

1. **安装 Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **登录 Vercel**
   ```bash
   vercel login
   ```

3. **在项目目录中部署**
   ```bash
   cd defi-analyzer
   vercel
   ```

4. **按照提示操作**
   - 选择项目范围
   - 链接到现有项目或创建新项目
   - 确认配置

5. **设置环境变量**
   ```bash
   vercel env add GEMINI_API_KEY
   vercel env add NEXT_PUBLIC_MIXPANEL_TOKEN
   ```
   
   或通过 Dashboard 设置（推荐）

6. **生产环境部署**
   ```bash
   vercel --prod
   ```

### 部署前检查清单

- [ ] 代码已推送到 Git 仓库
- [ ] 本地测试通过 (`npm run build` 成功)
- [ ] 已准备好 API 密钥：
  - [ ] Gemini API Key
  - [ ] Mixpanel Token（可选）
- [ ] `.env.local` 文件已在 `.gitignore` 中（确保不会被提交）

### 常见问题

**问题1：构建失败**
- 检查 Node.js 版本（需要 18+）
- 查看构建日志中的错误信息
- 确保所有依赖都已正确安装

**问题2：API 路由报错**
- 检查环境变量是否正确设置
- 确认环境变量名称大小写正确
- 检查 Vercel 函数执行超时设置（默认 10 秒，可能需要增加）

**问题3：环境变量未生效**
- 确保 `NEXT_PUBLIC_` 前缀用于客户端环境变量
- 重新部署项目以应用新的环境变量
- 检查环境变量作用域（Production/Preview/Development）

**问题4：文件上传大小限制**
- Vercel 免费版单个文件限制 4.5MB
- 如需更大限制，考虑升级到 Pro 计划
- 或实现文件分块上传

### 优化建议

1. **性能优化**
   - 启用 Vercel 的 Edge Functions（如适用）
   - 使用图片优化功能
   - 启用自动压缩

2. **监控和分析**
   - 使用 Vercel Analytics（内置）
   - 配置 Mixpanel 跟踪用户行为
   - 设置错误监控（如 Sentry）

3. **安全**
   - 定期轮换 API 密钥
   - 使用 Vercel 的环境变量加密
   - 启用 DDoS 保护

### 获取 API 密钥

**Gemini API Key**
1. 访问 [Google AI Studio](https://makersuite.google.com/app/apikey)
2. 登录 Google 账号
3. 点击 "Create API Key"
4. 选择项目或创建新项目
5. 复制 API 密钥

**Mixpanel Token**
1. 访问 [Mixpanel](https://mixpanel.com/)
2. 注册/登录账号
3. 创建新项目
4. 在项目设置中找到 "Project Token"
5. 复制 Token

## License

MIT
