# Minimal Blog — Vue 3 全栈博客系统

基于 **Vue 3 + TypeScript + Vite** 构建的前后台一体化博客系统，支持 Markdown 编辑、分类管理、JWT 认证、深色模式、响应式布局。

[![Vue](https://img.shields.io/badge/Vue-3.5-4FC08D?logo=vuedotjs)](https://vuejs.org/)
[![Vite](https://img.shields.io/badge/Vite-6.2-646CFF?logo=vite)](https://vitejs.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Tests](https://img.shields.io/badge/tests-74%20passed-success)]()

---

## 功能概览

### 前台博客

| 功能 | 说明 |
|---|---|
| 文章列表 | 响应式卡片网格，分页展示已发布文章 |
| 分类筛选 | 按分类过滤，同步到 URL 查询参数（`?cat=xxx`） |
| 关键字搜索 | 按标题/内容模糊匹配，同步到 URL（`?q=xxx`） |
| 文章详情 | Markdown 渲染，显示作者/日期/分类/标签 |
| 深色模式 | 一键切换，localStorage 持久化 |

### 后台管理

| 功能 | 说明 |
|---|---|
| JWT 登录 | 模拟三段式 JWT Token（header.payload.signature），含签发/过期时间 |
| 路由守卫 | 未登录自动跳转登录页；401 自动清除登录态 |
| 仪表盘 | 文章总数、分类数量统计 |
| 文章管理 | 新建/编辑/删除，发布与草稿状态切换，表格搜索 |
| 分类管理 | 新增/编辑/删除，关联文章数量统计 |
| Markdown 编辑器 | 基于 CodeMirror 6 的 md-editor-v3，工具栏 + 实时预览 + 语法高亮 |

---

## 技术栈

| 类别 | 技术 | 说明 |
|---|---|---|
| 框架 | Vue 3.5 | Composition API + `<script setup>` |
| 语言 | TypeScript 5.7 | 严格模式 |
| 构建 | Vite 6 | 极速 HMR |
| 路由 | Vue Router 4 | Hash 模式 + 懒加载 + 路由守卫 |
| 状态管理 | Pinia 2 | 3 个 Store（auth / post / category） |
| UI | Tailwind CSS 3 | shadcn/ui 风格设计系统 |
| Markdown | md-editor-v3 | CodeMirror 6 内核，分屏编辑+预览 |
| HTTP | Axios | 请求/响应拦截器，自动 Token 注入 |
| 工具库 | VueUse | useDark + createSharedComposable 管理主题 |
| 测试 | Vitest 4 | 80 个单元测试，jsdom 环境 |
| 组件测试 | @vue/test-utils 2 | 2.4.x |

---

## 项目结构

```
vue3-blog/
├── index.html                     # 入口 HTML
├── package.json                   # 依赖与脚本
├── vite.config.ts                 # Vite 构建配置
├── vitest.config.ts               # Vitest 测试配置（jsdom + globals）
├── tailwind.config.js             # Tailwind + shadcn/ui 色彩系统
├── tsconfig.json                  # TypeScript 配置
│
├── src/
│   ├── main.ts                    # 应用入口（createApp → Pinia → Router）
│   ├── App.vue                    # 根组件（RouterView）
│   ├── style.css                  # 全局样式 + CSS 变量（light/dark 双主题）
│   ├── test-setup.ts              # 测试环境初始化（mock localStorage）
│   │
│   ├── router/
│   │   └── index.ts               # 路由配置（10 条懒加载路由 + beforeEach 守卫）
│   │
│   ├── stores/                    # Pinia 状态管理
│   │   ├── authStore.ts           #   认证（登录/登出/JWT 持久化）
│   │   ├── postStore.ts           #   文章 CRUD + 分页
│   │   └── categoryStore.ts       #   分类 CRUD
│   │
│   ├── services/
│   │   └── blogStorage.ts         # localStorage 数据模拟层（文章/分类增删改查）
│   │
│   ├── api/                       # Axios HTTP 层
│   │   ├── request.ts             #   实例 + 拦截器（Token 注入 / 401 跳转）
│   │   ├── blogApi.ts             #   博客业务 API（对齐 blogStorage 签名）
│   │   └── index.ts               #   统一导出
│   │
│   ├── lib/
│   │   ├── utils.ts               # cn() — Tailwind 类名合并
│   │   └── jwt.ts                 # 模拟 JWT（create / decode / isExpired）
│   │
│   ├── composables/
│   │   └── useDarkMode.ts         # 深色模式共享单例（VueUse useDark + createSharedComposable）
│   │
│   ├── components/
│   │   ├── common/
│   │   │   └── ThemeToggle.vue    #   主题切换按钮
│   │   └── blog/
│   │       ├── PostCard.vue       #   文章卡片
│   │       ├── SearchBar.vue      #   搜索输入框
│   │       ├── CategoryFilter.vue #   分类下拉筛选
│   │       ├── Pagination.vue     #   分页导航
│   │       ├── MarkdownEditor.vue #   Markdown 编辑器（md-editor-v3）
│   │       └── MarkdownViewer.vue #   Markdown 预览（md-editor-v3）
│   │
│   ├── layouts/
│   │   ├── FrontLayout.vue        # 前台布局（Header + RouterView + Footer）
│   │   └── AdminLayout.vue        # 后台布局（侧边栏 + 顶栏 + RouterView）
│   │
│   └── pages/
│       ├── front/
│       │   ├── HomePage.vue       # 首页（Hero + 搜索 + 分类 + 文章列表）
│       │   └── PostDetailPage.vue # 文章详情
│       ├── admin/
│       │   ├── LoginPage.vue      # 登录页
│       │   ├── DashboardPage.vue  # 仪表盘
│       │   ├── PostsManagePage.vue    # 文章管理列表
│       │   ├── PostEditPage.vue       # 新建/编辑文章
│       │   └── CategoriesManagePage.vue # 分类管理
│       └── NotFoundPage.vue       # 404 页面
```

---

## 数据流架构

```
┌──────────┐     ┌──────────────┐     ┌────────────────┐
│  Vue SFC  │────▶│  Pinia Store  │────▶│  blogStorage   │  ← 当前数据源
│  (Pages)  │     │  (状态管理)    │     │  (localStorage) │
└──────────┘     └──────────────┘     └────────────────┘
                                         │
                                         │  未来可切换为 ↓
                                         │
                                         ▼
                                  ┌────────────────┐
                                  │  blogApi       │  ← HTTP 层（已就绪）
                                  │  (Axios + JWT) │
                                  └────────────────┘
```

---

## 快速开始

### 环境要求

- **Node.js** ≥ 18
- **npm** ≥ 9

### 安装运行

```bash
# 1. 安装依赖
npm install

# 2. 启动开发服务器
npm run dev
# → http://localhost:5173

# 3. 构建生产版本
npm run build
# → dist/

# 4. 预览生产构建
npm run preview
```

### 体验账号

| 角色 | 用户名 | 密码 |
|---|---|---|
| 管理员 | `admin` | `123456` |
| 演示用户 | `demo` | `demo123` |

前台入口：`http://localhost:5173/`  
后台入口：`http://localhost:5173/#/admin/login`

---

## 测试

```bash
# 运行全部测试
npm test

# 监听模式（持续运行）
npm run test:watch
```

### 测试覆盖

| 测试文件 | 被测模块 | 测点数 |
|---|---|---|
| `utils.test.ts` | `cn()` 类名合并 | 7 |
| `blogStorage.test.ts` | localStorage CRUD 服务 | 24 |
| `authStore.test.ts` | 认证 Store + JWT | 13 |
| `postStore.test.ts` | 文章 Store | 12 |
| `categoryStore.test.ts` | 分类 Store | 8 |
| `blogApi.test.ts` | Axios API 函数 | 9 |

**总计：74 tests，6 个测试文件。**

---

## 主题系统

基于 CSS 变量实现，支持 **Light** / **Dark** 双主题。

```css
:root {
  --background: 0 0% 100%;     /* 白 */
  --foreground: 0 0% 3.9%;     /* 接近黑 */
  --primary: 0 0% 9%;
  ...
}

.dark {
  --background: 0 0% 3.9%;     /* 接近黑 */
  --foreground: 0 0% 98%;      /* 白 */
  --primary: 0 0% 98%;
  ...
}
```

切换逻辑由 `useDarkMode()` 共享单例驱动（基于 VueUse `useDark` + `createSharedComposable`），自动管理：
1. `<html>` 上的 `dark` / `light` class
2. `localStorage['theme']` 持久化
3. `md-editor-v3` 的 editor/preview 主题跟随
4. 所有组件共享同一响应式状态，一处切换全局生效

---

## 路由设计

| 路径 | 页面 | 懒加载 | 认证 |
|---|---|---|---|
| `/` | 首页（文章列表） | ✅ | — |
| `/posts/:id` | 文章详情 | ✅ | — |
| `/admin/login` | 后台登录 | ✅ | — |
| `/admin` | 仪表盘 | ✅ | 🔒 |
| `/admin/posts` | 文章管理 | ✅ | 🔒 |
| `/admin/posts/new` | 新建文章 | ✅ | 🔒 |
| `/admin/posts/:id` | 编辑文章 | ✅ | 🔒 |
| `/admin/categories` | 分类管理 | ✅ | 🔒 |
| `/*` | 404 | ✅ | — |

`beforeEach` 守卫：检测 `/admin/*` 路径 → 未登录跳转 `/admin/login?from=原路径`。

---

## JWT 认证流程

```
1. 用户输入 admin/123456
         │
2. authStore.login() 校验
         │
3. createMockJWT({ sub: 'admin' })
   生成: eyJhbGci... . eyJzdWIiOiJhZG1pbiI... . signature...
         │
4. 存入 localStorage['authToken']
         │
5. Axios 请求拦截器 → Authorization: Bearer <token>
         │
6. 响应拦截器 → 401 → 清除登录态 → 跳转登录页
```

Token 结构（模拟 JWT）：

```json
Header:  { "alg": "HS256", "typ": "JWT" }
Payload: { "sub": "admin", "iat": 1748720000, "exp": 1748806400 }
Signature: base64url("header.payload.mock-secret").substring(0,43)
```

---

## Axios HTTP 层

`src/api/request.ts` 封装了完整的拦截器链：

```
请求 → [附加 Bearer Token] → 服务端
响应 ← [解包 data]           ← 服务端
     ← [401 → 清除登录态]    ← 服务端
     ← [提取错误消息]         ← 服务端
```

`src/api/blogApi.ts` 提供 9 个 API 函数，签名与 `blogStorage.ts` 一一对应，后续切换数据源只需改 import 路径。

---

## 开发命令

```bash
npm run dev          # 启动开发服务器
npm run build        # 类型检查 + 生产构建
npm run preview      # 预览生产构建
npm test             # 运行单元测试（vitest run）
npm run test:watch   # 监听模式测试
```
