/**
 * @file blogStorage.ts
 * @description 使用 localStorage 模拟简单的博客后端服务，包括文章与分类的增删改查。
 */

export interface Category {
  id: string
  name: string
  slug: string
  createdAt: string
}

/**
 * @description 文章实体结构，包含发布状态：published（已发布）/ draft（草稿）。
 */
export interface Post {
  id: string
  title: string
  summary: string
  content: string
  categoryId: string
  tags: string[]
  author: string
  createdAt: string
  updatedAt: string
  status: 'published' | 'draft'
}

/**
 * @description 获取当前时间的 ISO 字符串。
 */
function nowISO(): string {
  return new Date().toISOString()
}

/**
 * @description 获取存储的文章列表，并对缺失状态的旧数据进行兼容处理。
 */
function getStoredPosts(): Post[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem('blog_posts')
    if (!raw) return []
    const parsed = JSON.parse(raw) as Array<Partial<Post>>
    // 兼容旧版本数据：没有 status 的一律视为已发布
    const normalized = parsed.map((p) => ({
      ...p,
      status:
        p.status === 'published' || p.status === 'draft'
          ? p.status
          : 'published',
    })) as Post[]
    return normalized
  } catch {
    return []
  }
}

/**
 * @description 持久化文章列表。
 */
function setStoredPosts(posts: Post[]) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem('blog_posts', JSON.stringify(posts))
  } catch (e) {
    console.error('[blogStorage] Failed to store posts:', e)
  }
}

/**
 * @description 获取存储的分类列表。
 */
function getStoredCategories(): Category[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem('blog_categories')
    if (!raw) return []
    return JSON.parse(raw) as Category[]
  } catch {
    return []
  }
}

/**
 * @description 持久化分类列表。
 */
function setStoredCategories(categories: Category[]) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem('blog_categories', JSON.stringify(categories))
  } catch (e) {
    console.error('[blogStorage] Failed to store categories:', e)
  }
}

/**
 * @description 初始化示例数据（仅在首次访问时执行），并确保存在"其他"分类。
 */
export function initBlogDemoData() {
  if (typeof window === 'undefined') return

  const existingPosts = getStoredPosts()
  const existingCategories = getStoredCategories()

  // 初始化分类，保证一定存在"其他"分类
  if (existingCategories.length === 0) {
    const baseCategories: Category[] = [
      {
        id: '1',
        name: '前端开发',
        slug: 'frontend',
        createdAt: nowISO(),
      },
      {
        id: '2',
        name: '后端开发',
        slug: 'backend',
        createdAt: nowISO(),
      },
      {
        id: '3',
        name: '生活随笔',
        slug: 'life',
        createdAt: nowISO(),
      },
      {
        id: '4',
        name: '其他',
        slug: 'others',
        createdAt: nowISO(),
      },
    ]
    setStoredCategories(baseCategories)
  } else {
    const hasOthers = existingCategories.some(
      (c) => c.slug === 'others' || c.name === '其他',
    )
    if (!hasOthers) {
      const next: Category = {
        id: Date.now().toString(),
        name: '其他',
        slug: 'others',
        createdAt: nowISO(),
      }
      setStoredCategories([...existingCategories, next])
    }
  }

  // 初始化示例文章（仅在没有文章时执行）
  if (existingPosts.length === 0) {
    const demoPosts: Post[] = [
      {
        id: '1',
        title: '欢迎来到 Minimal Blog',
        summary: '这是一个基于 Vue 3 打造的前台 + 后台一体化博客示例。',
        content:
          '# 欢迎使用 Minimal Blog\n\n' +
          '这是一个**示例博客系统**，包含：\n\n' +
          '- 前台文章列表 / 详情\n' +
          '- 后台文章 / 分类管理\n' +
          '- 简单的 Markdown 编辑与预览\n\n' +
          '你可以使用 `admin / 123456` 登录后台进行体验。',
        categoryId: '1',
        tags: ['示例', '入门'],
        author: 'Admin',
        createdAt: nowISO(),
        updatedAt: nowISO(),
        status: 'published',
      },
      {
        id: '2',
        title: '使用 Tailwind 构建响应式布局',
        summary: '本文介绍如何使用 Tailwind CSS 构建现代响应式博客页面。',
        content:
          '# 使用 Tailwind 构建响应式布局\n\n' +
          '借助 Tailwind 的原子化类，可以轻松实现自适应布局：\n\n' +
          '```css\n' +
          'flex flex-col md:flex-row\n' +
          '```\n\n' +
          '更多内容可以在后台编辑器中自行尝试。',
        categoryId: '1',
        tags: ['响应式', 'CSS'],
        author: 'Admin',
        createdAt: nowISO(),
        updatedAt: nowISO(),
        status: 'published',
      },
      {
        id: '3',
        title: 'Vue 3 状态管理方案对比',
        summary: '对比 Pinia、Vuex 等常见状态管理方案的适用场景。',
        content:
          '# Vue 3 状态管理方案对比\n\n' +
          '常见方案包括 **Pinia**、**Vuex** 等。\n\n' +
          '- Pinia：Vue 3 官方推荐，更轻量\n' +
          '- Vuex 4：兼容 Vue 2 迁移\n\n' +
          '本示例项目选择了 `Pinia` 作为全局状态管理工具。',
        categoryId: '1',
        tags: ['Vue3', '状态管理'],
        author: 'Admin',
        createdAt: nowISO(),
        updatedAt: nowISO(),
        status: 'published',
      },
      {
        id: '4',
        title: '使用 Pinia 管理全局状态',
        summary: '介绍如何在项目中使用 Pinia 来管理文章、分类和登录状态。',
        content:
          '# 使用 Pinia 管理全局状态\n\n' +
          'Pinia 的核心是一个 `defineStore` 函数，用于创建 store：\n\n' +
          '```ts\n' +
          "export const useStore = defineStore('main', {\n" +
          '  state: () => ({ count: 0 }),\n' +
          '})\n' +
          '```\n\n' +
          '在本项目中，我们为文章、分类、认证分别创建了独立的 store。',
        categoryId: '1',
        tags: ['Pinia', '全局状态'],
        author: 'Admin',
        createdAt: nowISO(),
        updatedAt: nowISO(),
        status: 'published',
      },
      {
        id: '5',
        title: '路由与导航设计原则',
        summary: '聊聊在单页应用中设计清晰可维护的路由结构。',
        content:
          '# 路由与导航设计原则\n\n' +
          '良好的路由设计应当：\n\n' +
          '- 区分前台与后台前缀\n' +
          '- 为详情页保留唯一标识\n' +
          '- 提供兜底的 404 页面\n\n' +
          '本示例中，前台使用 `/` 与 `/posts/:id`，后台使用 `/admin` 作为前缀。',
        categoryId: '1',
        tags: ['路由', '架构'],
        author: 'Admin',
        createdAt: nowISO(),
        updatedAt: nowISO(),
        status: 'published',
      },
      {
        id: '6',
        title: 'Node.js API 设计入门',
        summary: '从 RESTful 思路出发设计一套简单的博客 API。',
        content:
          '# Node.js API 设计入门\n\n' +
          '设计博客 API 时，可以从资源出发：\n\n' +
          '- `/posts`\n' +
          '- `/categories`\n\n' +
          '配合合适的认证方案（如 JWT）即可支撑前后台分离的博客系统。',
        categoryId: '2',
        tags: ['Node.js', 'API'],
        author: 'Admin',
        createdAt: nowISO(),
        updatedAt: nowISO(),
        status: 'published',
      },
      {
        id: '7',
        title: '使用 localStorage 模拟后端',
        summary: '在没有真实后端的情况下如何快速搭建可交互的原型。',
        content:
          '# 使用 localStorage 模拟后端\n\n' +
          '在原型阶段，可以使用 `localStorage` 暂存数据：\n\n' +
          '- 定义统一的读写函数\n' +
          '- 通过延迟模拟网络请求\n\n' +
          '这样可以专注在前端交互与体验上。',
        categoryId: '2',
        tags: ['localStorage', '原型'],
        author: 'Admin',
        createdAt: nowISO(),
        updatedAt: nowISO(),
        status: 'published',
      },
      {
        id: '8',
        title: '后端错误处理最佳实践（草稿）',
        summary: '如何规范化处理服务端错误并反馈给前端（草稿示例）。',
        content:
          '# 后端错误处理最佳实践\n\n' +
          '统一的错误处理可以极大提升可维护性：\n\n' +
          '- 中间件集中捕获异常\n' +
          '- 约定统一的错误响应格式\n\n' +
          '本文仍在整理中，目前以草稿形式保存在后台。',
        categoryId: '2',
        tags: ['错误处理', '后端'],
        author: 'Admin',
        createdAt: nowISO(),
        updatedAt: nowISO(),
        status: 'draft',
      },
      {
        id: '9',
        title: '写给自己的 2024 年总结',
        summary: '记录这一年的收获与挑战。',
        content:
          '# 写给自己的 2024 年总结\n\n' +
          '这一年里：\n\n' +
          '- 完成了多个 side project\n' +
          '- 尝试写技术博客\n' +
          '- 更加重视身心健康\n\n' +
          '希望下一年继续保持输出与成长。',
        categoryId: '3',
        tags: ['总结', '年度'],
        author: 'Admin',
        createdAt: nowISO(),
        updatedAt: nowISO(),
        status: 'published',
      },
      {
        id: '10',
        title: '远程办公一年的感受',
        summary: '远程办公带来的自由与挑战并存。',
        content:
          '# 远程办公一年的感受\n\n' +
          '远程办公的优势：\n\n' +
          '- 时间更加灵活\n' +
          '- 可以自主规划深度工作\n\n' +
          '但也需要：\n\n' +
          '- 更强的自律\n' +
          '- 明确的沟通机制',
        categoryId: '3',
        tags: ['远程办公', '生活'],
        author: 'Admin',
        createdAt: nowISO(),
        updatedAt: nowISO(),
        status: 'published',
      },
      {
        id: '11',
        title: '提高写作效率的 5 个小技巧',
        summary: '从模版、工具与习惯三方面提升写作效率。',
        content:
          '# 提高写作效率的 5 个小技巧\n\n' +
          '1. 准备常用模版\n' +
          '2. 使用 Markdown 工具\n' +
          '3. 设定固定写作时间\n' +
          '4. 在输出前先列提纲\n' +
          '5. 持续复盘与改进',
        categoryId: '3',
        tags: ['写作', '效率'],
        author: 'Admin',
        createdAt: nowISO(),
        updatedAt: nowISO(),
        status: 'published',
      },
      {
        id: '12',
        title: 'Side Project 规划清单（草稿）',
        summary: '如何规划一个长期维护的 Side Project（草稿示例）。',
        content:
          '# Side Project 规划清单\n\n' +
          '在启动一个 side project 之前，可以先回答几个问题：\n\n' +
          '- 目标是什么？\n' +
          '- 谁会使用？\n' +
          '- 自己能投入多少时间？\n\n' +
          '本文仍处于草稿阶段，仅在后台可见。',
        categoryId: '3',
        tags: ['Side Project', '规划'],
        author: 'Admin',
        createdAt: nowISO(),
        updatedAt: nowISO(),
        status: 'draft',
      },
      {
        id: '13',
        title: '性能优化：从 Lighthouse 报告看问题',
        summary: '利用 Lighthouse 工具定位前端性能瓶颈。',
        content:
          '# 性能优化：从 Lighthouse 报告看问题\n\n' +
          'Lighthouse 会从多个维度给出评分：\n\n' +
          '- Performance\n' +
          '- Accessibility\n' +
          '- Best Practices\n\n' +
          '可以据此逐步优化核心指标。',
        categoryId: '1',
        tags: ['性能优化', 'Lighthouse'],
        author: 'Admin',
        createdAt: nowISO(),
        updatedAt: nowISO(),
        status: 'published',
      },
      {
        id: '14',
        title: '前后端接口协作范式',
        summary: '通过约定统一的接口规范，降低沟通成本。',
        content:
          '# 前后端接口协作范式\n\n' +
          '推荐的做法包括：\n\n' +
          '- 使用 OpenAPI / Swagger 描述接口\n' +
          '- 在 Mock 阶段就确定字段\n' +
          '- 通过自动化测试保障契约',
        categoryId: '2',
        tags: ['接口设计', '协作'],
        author: 'Admin',
        createdAt: nowISO(),
        updatedAt: nowISO(),
        status: 'published',
      },
      {
        id: '15',
        title: '技术博客排版与设计建议（草稿）',
        summary: '从阅读体验角度出发优化技术博客排版（草稿示例）。',
        content:
          '# 技术博客排版与设计建议\n\n' +
          '良好的排版可以显著提升阅读体验：\n\n' +
          '- 合理的行宽与行高\n' +
          '- 清晰的层级结构\n' +
          '- 高对比度的配色\n\n' +
          '本文作为草稿存在，仅供后台预览。',
        categoryId: '1',
        tags: ['设计', '排版'],
        author: 'Admin',
        createdAt: nowISO(),
        updatedAt: nowISO(),
        status: 'draft',
      },
    ]
    setStoredPosts(demoPosts)
  }
}

/**
 * @description 查询文章列表，可按关键字、分类与状态过滤并分页。
 */
export async function queryPosts(params: {
  page: number
  pageSize: number
  keyword?: string
  categoryId?: string
  status?: 'published' | 'draft'
}): Promise<{ total: number; items: Post[] }> {
  const all = getStoredPosts()
  const { page, pageSize, keyword, categoryId, status } = params

  let filtered = all

  if (keyword && keyword.trim()) {
    const kw = keyword.trim().toLowerCase()
    filtered = filtered.filter(
      (post) =>
        post.title.toLowerCase().includes(kw) ||
        post.content.toLowerCase().includes(kw),
    )
  }

  if (categoryId) {
    filtered = filtered.filter((post) => post.categoryId === categoryId)
  }

  if (status) {
    filtered = filtered.filter((post) => post.status === status)
  }

  const total = filtered.length
  const start = (page - 1) * pageSize
  const end = start + pageSize
  const items = filtered
    .slice()
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
    .slice(start, end)

  return new Promise((resolve) => {
    window.setTimeout(() => resolve({ total, items }), 200)
  })
}

/**
 * @description 根据 ID 获取单篇文章。
 */
export async function getPostById(id: string): Promise<Post | null> {
  const all = getStoredPosts()
  const found = all.find((p) => p.id === id) ?? null
  return new Promise((resolve) => {
    window.setTimeout(() => resolve(found), 150)
  })
}

/**
 * @description 创建新文章。
 */
export async function createPost(
  payload: Omit<Post, 'id' | 'createdAt' | 'updatedAt'>,
): Promise<Post> {
  const all = getStoredPosts()
  const newPost: Post = {
    ...payload,
    status: payload.status ?? 'draft',
    id: Date.now().toString(),
    createdAt: nowISO(),
    updatedAt: nowISO(),
  }
  all.push(newPost)
  setStoredPosts(all)
  return new Promise((resolve) => {
    window.setTimeout(() => resolve(newPost), 150)
  })
}

/**
 * @description 更新文章。
 */
export async function updatePost(
  id: string,
  payload: Partial<Omit<Post, 'id' | 'createdAt'>>,
): Promise<Post | null> {
  const all = getStoredPosts()
  const index = all.findIndex((p) => p.id === id)
  if (index === -1) {
    return new Promise((resolve) => resolve(null))
  }
  const updated: Post = {
    ...all[index],
    ...payload,
    updatedAt: nowISO(),
  }
  all[index] = updated
  setStoredPosts(all)
  return new Promise((resolve) => {
    window.setTimeout(() => resolve(updated), 150)
  })
}

/**
 * @description 删除文章。
 */
export async function deletePost(id: string): Promise<boolean> {
  const all = getStoredPosts()
  const next = all.filter((p) => p.id !== id)
  setStoredPosts(next)
  return new Promise((resolve) => {
    window.setTimeout(() => resolve(true), 120)
  })
}

/**
 * @description 获取全部分类。
 */
export async function getCategories(): Promise<Category[]> {
  const all = getStoredCategories()
  return new Promise((resolve) => {
    window.setTimeout(() => resolve(all), 120)
  })
}

/**
 * @description 创建分类。
 */
export async function createCategory(
  payload: Omit<Category, 'id' | 'createdAt'>,
): Promise<Category> {
  const all = getStoredCategories()
  const next: Category = {
    ...payload,
    id: Date.now().toString(),
    createdAt: nowISO(),
  }
  all.push(next)
  setStoredCategories(all)
  return new Promise((resolve) => {
    window.setTimeout(() => resolve(next), 120)
  })
}

/**
 * @description 更新分类。
 */
export async function updateCategory(
  id: string,
  payload: Partial<Omit<Category, 'id' | 'createdAt'>>,
): Promise<Category | null> {
  const all = getStoredCategories()
  const index = all.findIndex((c) => c.id === id)
  if (index === -1) return new Promise((resolve) => resolve(null))
  const updated: Category = {
    ...all[index],
    ...payload,
  }
  all[index] = updated
  setStoredCategories(all)
  return new Promise((resolve) => {
    window.setTimeout(() => resolve(updated), 120)
  })
}

/**
 * @description 删除分类。
 */
export async function deleteCategory(id: string): Promise<boolean> {
  const all = getStoredCategories()
  const next = all.filter((c) => c.id !== id)
  setStoredCategories(next)
  return new Promise((resolve) => {
    window.setTimeout(() => resolve(true), 120)
  })
}
