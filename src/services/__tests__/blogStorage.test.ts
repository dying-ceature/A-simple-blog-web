/**
 * @file blogStorage.test.ts
 * @description blogStorage localStorage CRUD 服务测试。
 */
import { describe, it, expect, beforeEach } from 'vitest'
import {
  initBlogDemoData,
  queryPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../blogStorage'
import type { Post, Category } from '../blogStorage'

beforeEach(() => {
  window.localStorage.clear()
})

// ==================== initBlogDemoData ====================

describe('initBlogDemoData()', () => {
  it('首次调用应初始化 4 个分类和 15 篇文章', () => {
    initBlogDemoData()

    const postsRaw = window.localStorage.getItem('blog_posts')
    const catRaw = window.localStorage.getItem('blog_categories')

    expect(postsRaw).toBeTruthy()
    expect(catRaw).toBeTruthy()

    const posts = JSON.parse(postsRaw!) as Post[]
    const cats = JSON.parse(catRaw!) as Category[]

    expect(cats).toHaveLength(4)
    expect(posts).toHaveLength(15)

    // 验证 "其他" 分类存在
    expect(cats.some((c) => c.slug === 'others')).toBe(true)
  })

  it('第二次调用不应重复创建数据', () => {
    initBlogDemoData()
    initBlogDemoData()

    const posts = JSON.parse(window.localStorage.getItem('blog_posts')!) as Post[]
    expect(posts).toHaveLength(15)
  })

  it('如果已有分类但没有"其他"，应补充"其他"分类', () => {
    // 手动设置只有 1 个分类
    const cats: Category[] = [{
      id: '1', name: '前端', slug: 'frontend', createdAt: new Date().toISOString(),
    }]
    window.localStorage.setItem('blog_categories', JSON.stringify(cats))

    initBlogDemoData()

    const parsed = JSON.parse(window.localStorage.getItem('blog_categories')!) as Category[]
    expect(parsed.some((c) => c.slug === 'others')).toBe(true)
  })
})

// ==================== queryPosts ====================

describe('queryPosts()', () => {
  beforeEach(() => {
    initBlogDemoData()
  })

  it('应返回分页数据', async () => {
    const result = await queryPosts({ page: 1, pageSize: 6 })
    expect(result.items).toHaveLength(6)
    expect(result.total).toBe(15)
  })

  it('应支持按关键字过滤（标题）', async () => {
    const result = await queryPosts({ page: 1, pageSize: 20, keyword: 'Pinia' })
    // demo 数据中有多篇文章标题含 Pinia
    expect(result.total).toBeGreaterThan(0)
    expect(result.items.some((p) => p.title.includes('Pinia'))).toBe(true)
  })

  it('应支持按关键字过滤（内容）', async () => {
    const result = await queryPosts({ page: 1, pageSize: 20, keyword: 'Tailwind' })
    expect(result.total).toBeGreaterThan(0)
  })

  it('应支持按分类过滤', async () => {
    const result = await queryPosts({ page: 1, pageSize: 20, categoryId: '2' })
    // 分类 2 = 后端开发
    result.items.forEach((p) => expect(p.categoryId).toBe('2'))
  })

  it('应支持按状态过滤', async () => {
    const published = await queryPosts({ page: 1, pageSize: 20, status: 'published' })
    const drafts = await queryPosts({ page: 1, pageSize: 20, status: 'draft' })
    expect(published.items.every((p) => p.status === 'published')).toBe(true)
    expect(drafts.items.every((p) => p.status === 'draft')).toBe(true)
    expect(published.total).toBe(12)
    expect(drafts.total).toBe(3)
  })

  it('应按创建时间降序排列', async () => {
    const result = await queryPosts({ page: 1, pageSize: 5 })
    for (let i = 1; i < result.items.length; i++) {
      expect(result.items[i - 1].createdAt >= result.items[i].createdAt).toBe(true)
    }
  })

  it('空关键字不应过滤', async () => {
    const result = await queryPosts({ page: 1, pageSize: 20, keyword: '   ' })
    expect(result.total).toBe(15)
  })

  it('第二页应返回正确数据', async () => {
    const page1 = await queryPosts({ page: 1, pageSize: 6 })
    const page2 = await queryPosts({ page: 2, pageSize: 6 })
    expect(page2.items).toHaveLength(6)
    // 验证分页不重复
    const ids = new Set(page1.items.map((p) => p.id))
    page2.items.forEach((p) => expect(ids.has(p.id)).toBe(false))
    expect(page2.total).toBe(15)
  })
})

// ==================== getPostById ====================

describe('getPostById()', () => {
  beforeEach(() => {
    initBlogDemoData()
  })

  it('应返回存在的文章', async () => {
    const post = await getPostById('1')
    expect(post).toBeTruthy()
    expect(post!.title).toBeTruthy()
  })

  it('不存在的 ID 应返回 null', async () => {
    const post = await getPostById('nonexistent')
    expect(post).toBeNull()
  })
})

// ==================== createPost / updatePost / deletePost ====================

describe('createPost()', () => {
  beforeEach(() => {
    initBlogDemoData()
  })

  it('应创建新文章并持久化', async () => {
    const post = await createPost({
      title: '新文章',
      summary: '摘要',
      content: '内容',
      categoryId: '1',
      tags: ['test'],
      author: 'Tester',
      status: 'draft',
    })

    expect(post.id).toBeTruthy()
    expect(post.title).toBe('新文章')
    expect(post.status).toBe('draft')

    const posts = JSON.parse(window.localStorage.getItem('blog_posts')!) as Post[]
    expect(posts.find((p) => p.id === post.id)).toBeTruthy()
  })

  it('不传 status 应默认为 draft', async () => {
    const post = await createPost({
      title: '默认状态',
      summary: 's',
      content: 'c',
      categoryId: '1',
      tags: [],
      author: 'A',
    })
    expect(post.status).toBe('draft')
  })
})

describe('updatePost()', () => {
  beforeEach(() => {
    initBlogDemoData()
  })

  it('应更新存在的文章', async () => {
    const original = await getPostById('1')
    // 稍等一下确保 updatedAt 不同
    await new Promise((r) => setTimeout(r, 5))
    const updated = await updatePost('1', { title: '更新后的标题' })
    expect(updated).toBeTruthy()
    expect(updated!.title).toBe('更新后的标题')
    // updatedAt 应比原始的 updatedAt 更新
    expect(new Date(updated!.updatedAt).getTime()).toBeGreaterThanOrEqual(
      new Date(original!.updatedAt).getTime(),
    )
  })

  it('不存在的 ID 应返回 null', async () => {
    const updated = await updatePost('nonexistent', { title: 'x' })
    expect(updated).toBeNull()
  })
})

describe('deletePost()', () => {
  beforeEach(() => {
    initBlogDemoData()
  })

  it('应删除文章', async () => {
    const ok = await deletePost('1')
    expect(ok).toBe(true)
    const post = await getPostById('1')
    expect(post).toBeNull()
  })

  it('删除不存在的 ID 也应返回 true（静默成功）', async () => {
    const ok = await deletePost('nonexistent')
    expect(ok).toBe(true)
  })
})

// ==================== 分类 CRUD ====================

describe('分类 CRUD', () => {
  beforeEach(() => {
    initBlogDemoData()
  })

  it('getCategories 应返回所有分类', async () => {
    const cats = await getCategories()
    expect(cats).toHaveLength(4)
  })

  it('createCategory 应创建新分类', async () => {
    const cat = await createCategory({ name: '新分类', slug: 'new-cat' })
    expect(cat.id).toBeTruthy()
    expect(cat.name).toBe('新分类')

    const all = await getCategories()
    expect(all).toHaveLength(5)
  })

  it('updateCategory 应更新分类', async () => {
    const updated = await updateCategory('1', { name: '改名' })
    expect(updated!.name).toBe('改名')
  })

  it('updateCategory 不存在的 ID 应返回 null', async () => {
    const updated = await updateCategory('nonexistent', { name: 'x' })
    expect(updated).toBeNull()
  })

  it('deleteCategory 应删除分类', async () => {
    const ok = await deleteCategory('1')
    expect(ok).toBe(true)
    const all = await getCategories()
    expect(all).toHaveLength(3)
  })
})
