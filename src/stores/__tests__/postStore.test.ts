/**
 * @file postStore.test.ts
 * @description 文章 Store 测试。
 */
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { usePostStore } from '../postStore'

// Mock blogStorage
vi.mock('../../services/blogStorage', () => ({
  queryPosts: vi.fn(),
  getPostById: vi.fn(),
  createPost: vi.fn(),
  updatePost: vi.fn(),
  deletePost: vi.fn(),
}))

import {
  queryPosts,
  getPostById,
  createPost as createPostService,
  updatePost as updatePostService,
  deletePost as deletePostService,
} from '../../services/blogStorage'

function mockPost(overrides = {}) {
  return {
    id: '1',
    title: 'Test Post',
    summary: 'Summary',
    content: 'Content',
    categoryId: '1',
    tags: ['test'],
    author: 'Tester',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
    status: 'published' as const,
    ...overrides,
  }
}

beforeEach(() => {
  setActivePinia(createPinia())
  vi.clearAllMocks()
})

describe('postStore', () => {
  describe('初始状态', () => {
    it('应具有正确的默认值', () => {
      const store = usePostStore()
      expect(store.items).toEqual([])
      expect(store.total).toBe(0)
      expect(store.page).toBe(1)
      expect(store.pageSize).toBe(6)
      expect(store.loading).toBe(false)
      expect(store.currentPost).toBeNull()
      expect(store.error).toBeNull()
    })
  })

  describe('fetchList()', () => {
    it('应获取文章列表并更新状态', async () => {
      const mockItems = [mockPost(), mockPost({ id: '2' })]
      vi.mocked(queryPosts).mockResolvedValue({ total: 2, items: mockItems })

      const store = usePostStore()
      await store.fetchList({ page: 1 })

      expect(store.items).toHaveLength(2)
      expect(store.total).toBe(2)
      expect(store.loading).toBe(false)
    })

    it('应设置 loading 状态', async () => {
      vi.mocked(queryPosts).mockResolvedValue({ total: 0, items: [] })

      const store = usePostStore()
      const promise = store.fetchList()
      expect(store.loading).toBe(true)
      await promise
      expect(store.loading).toBe(false)
    })

    it('获取失败应设置 error', async () => {
      vi.mocked(queryPosts).mockRejectedValue(new Error('网络错误'))

      const store = usePostStore()
      await store.fetchList()

      expect(store.error).toBe('网络错误')
      expect(store.loading).toBe(false)
    })

    it('错误对象无 message 属性应使用默认错误消息', async () => {
      vi.mocked(queryPosts).mockRejectedValue('string error')

      const store = usePostStore()
      await store.fetchList()

      expect(store.error).toBeTruthy()
    })
  })

  describe('fetchById()', () => {
    it('应获取文章详情', async () => {
      const post = mockPost()
      vi.mocked(getPostById).mockResolvedValue(post)

      const store = usePostStore()
      await store.fetchById('1')

      expect(store.currentPost).toEqual(post)
      expect(store.loading).toBe(false)
    })

    it('文章不存在时 currentPost 应为 null', async () => {
      vi.mocked(getPostById).mockResolvedValue(null)

      const store = usePostStore()
      await store.fetchById('nonexistent')

      expect(store.currentPost).toBeNull()
    })
  })

  describe('create()', () => {
    it('应创建文章并添加到列表头部', async () => {
      const newPost = mockPost({ id: 'new', title: 'New' })
      vi.mocked(createPostService).mockResolvedValue(newPost)

      const store = usePostStore()
      store.items = [mockPost({ id: 'old' })]
      store.total = 1

      const result = await store.create({
        title: 'New', summary: 'S', content: 'C',
        categoryId: '1', tags: [], author: 'A', status: 'draft',
      })

      expect(result).toEqual(newPost)
      expect(store.items[0].id).toBe('new')
      expect(store.total).toBe(2)
    })
  })

  describe('update()', () => {
    it('应更新文章', async () => {
      const updated = mockPost({ id: '1', title: 'Updated' })
      vi.mocked(updatePostService).mockResolvedValue(updated)

      const store = usePostStore()
      store.items = [mockPost({ id: '1', title: 'Old' })]

      const result = await store.update('1', { title: 'Updated' })
      expect(result!.title).toBe('Updated')
      expect(store.items[0].title).toBe('Updated')
    })

    it('不存在的 ID 应返回 null', async () => {
      vi.mocked(updatePostService).mockResolvedValue(null)

      const store = usePostStore()
      const result = await store.update('nonexistent', { title: 'x' })
      expect(result).toBeNull()
    })
  })

  describe('remove()', () => {
    it('应删除文章', async () => {
      vi.mocked(deletePostService).mockResolvedValue(true)

      const store = usePostStore()
      store.items = [mockPost({ id: '1' })]
      store.total = 1

      const ok = await store.remove('1')
      expect(ok).toBe(true)
      expect(store.items).toHaveLength(0)
      expect(store.total).toBe(0)
    })

    it('删除失败应返回 false', async () => {
      vi.mocked(deletePostService).mockResolvedValue(false)

      const store = usePostStore()
      const ok = await store.remove('1')
      expect(ok).toBe(false)
    })

    it('total 不应为负数', async () => {
      vi.mocked(deletePostService).mockResolvedValue(true)

      const store = usePostStore()
      store.total = 0 // 异常状态

      await store.remove('1')
      expect(store.total).toBe(0) // Math.max(0, -1) = 0
    })
  })
})
