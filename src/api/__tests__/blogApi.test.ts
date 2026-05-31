/**
 * @file blogApi.test.ts
 * @description 博客 API 函数测试 — 验证调用正确的 HTTP method 和 URL。
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock http module
const mockGet = vi.fn()
const mockPost = vi.fn()
const mockPatch = vi.fn()
const mockDelete = vi.fn()

vi.mock('../request', () => ({
  default: {
    get: (...args: any[]) => mockGet(...args),
    post: (...args: any[]) => mockPost(...args),
    patch: (...args: any[]) => mockPatch(...args),
    delete: (...args: any[]) => mockDelete(...args),
  },
}))

import {
  queryPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../blogApi'

beforeEach(() => {
  vi.clearAllMocks()
})

describe('blogApi — 文章', () => {
  it('queryPosts 应发起 GET /posts', async () => {
    mockGet.mockResolvedValue({ total: 0, items: [] })
    await queryPosts({ page: 1, pageSize: 6 })
    expect(mockGet).toHaveBeenCalledWith('/posts', { params: { page: 1, pageSize: 6 } })
  })

  it('getPostById 应发起 GET /posts/:id', async () => {
    mockGet.mockResolvedValue(null)
    await getPostById('123')
    expect(mockGet).toHaveBeenCalledWith('/posts/123')
  })

  it('createPost 应发起 POST /posts', async () => {
    const payload = { title: 'T', summary: 'S', content: 'C', categoryId: '1', tags: [], author: 'A', status: 'draft' as const }
    mockPost.mockResolvedValue({ ...payload, id: '1', createdAt: '', updatedAt: '' })
    await createPost(payload)
    expect(mockPost).toHaveBeenCalledWith('/posts', payload)
  })

  it('updatePost 应发起 PATCH /posts/:id', async () => {
    mockPatch.mockResolvedValue(null)
    await updatePost('1', { title: 'New' })
    expect(mockPatch).toHaveBeenCalledWith('/posts/1', { title: 'New' })
  })

  it('deletePost 应发起 DELETE /posts/:id', async () => {
    mockDelete.mockResolvedValue(true)
    await deletePost('1')
    expect(mockDelete).toHaveBeenCalledWith('/posts/1')
  })
})

describe('blogApi — 分类', () => {
  it('getCategories 应发起 GET /categories', async () => {
    mockGet.mockResolvedValue([])
    await getCategories()
    expect(mockGet).toHaveBeenCalledWith('/categories')
  })

  it('createCategory 应发起 POST /categories', async () => {
    mockPost.mockResolvedValue({ id: '1', name: 'N', slug: 'n', createdAt: '' })
    await createCategory({ name: 'N', slug: 'n' })
    expect(mockPost).toHaveBeenCalledWith('/categories', { name: 'N', slug: 'n' })
  })

  it('updateCategory 应发起 PATCH /categories/:id', async () => {
    mockPatch.mockResolvedValue(null)
    await updateCategory('1', { name: 'N' })
    expect(mockPatch).toHaveBeenCalledWith('/categories/1', { name: 'N' })
  })

  it('deleteCategory 应发起 DELETE /categories/:id', async () => {
    mockDelete.mockResolvedValue(true)
    await deleteCategory('1')
    expect(mockDelete).toHaveBeenCalledWith('/categories/1')
  })
})
