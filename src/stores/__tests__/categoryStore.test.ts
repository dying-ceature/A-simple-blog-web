/**
 * @file categoryStore.test.ts
 * @description 分类 Store 测试。
 */
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useCategoryStore } from '../categoryStore'

vi.mock('../../services/blogStorage', () => ({
  getCategories: vi.fn(),
  createCategory: vi.fn(),
  updateCategory: vi.fn(),
  deleteCategory: vi.fn(),
}))

import {
  getCategories,
  createCategory as createCatService,
  updateCategory as updateCatService,
  deleteCategory as deleteCatService,
} from '../../services/blogStorage'
import type { Category } from '../../services/blogStorage'

function mockCat(overrides = {}): Category {
  return {
    id: '1',
    name: '前端开发',
    slug: 'frontend',
    createdAt: '2024-01-01T00:00:00.000Z',
    ...overrides,
  }
}

beforeEach(() => {
  setActivePinia(createPinia())
  vi.clearAllMocks()
})

describe('categoryStore', () => {
  describe('初始状态', () => {
    it('应具有空列表', () => {
      const store = useCategoryStore()
      expect(store.items).toEqual([])
      expect(store.loading).toBe(false)
      expect(store.error).toBeNull()
    })
  })

  describe('fetchAll()', () => {
    it('应获取分类列表', async () => {
      const cats = [mockCat(), mockCat({ id: '2', name: '后端' })]
      vi.mocked(getCategories).mockResolvedValue(cats)

      const store = useCategoryStore()
      await store.fetchAll()

      expect(store.items).toHaveLength(2)
      expect(store.loading).toBe(false)
    })

    it('获取失败应设置 error', async () => {
      vi.mocked(getCategories).mockRejectedValue(new Error('加载失败'))

      const store = useCategoryStore()
      await store.fetchAll()

      expect(store.error).toBe('加载失败')
      expect(store.loading).toBe(false)
    })
  })

  describe('create()', () => {
    it('应创建分类并添加到列表', async () => {
      const newCat = mockCat({ id: 'new', name: '新分类' })
      vi.mocked(createCatService).mockResolvedValue(newCat)

      const store = useCategoryStore()
      const result = await store.create({ name: '新分类', slug: 'new-cat' })

      expect(result).toEqual(newCat)
      expect(store.items).toHaveLength(1)
    })
  })

  describe('update()', () => {
    it('应更新分类', async () => {
      const updated = mockCat({ name: '改名' })
      vi.mocked(updateCatService).mockResolvedValue(updated)

      const store = useCategoryStore()
      store.items = [mockCat({ name: '原始' })]

      const result = await store.update('1', { name: '改名' })
      expect(result!.name).toBe('改名')
      expect(store.items[0].name).toBe('改名')
    })

    it('不存在的 ID 应返回 null', async () => {
      vi.mocked(updateCatService).mockResolvedValue(null)

      const store = useCategoryStore()
      const result = await store.update('nonexistent', { name: 'x' })
      expect(result).toBeNull()
    })
  })

  describe('remove()', () => {
    it('应删除分类', async () => {
      vi.mocked(deleteCatService).mockResolvedValue(true)

      const store = useCategoryStore()
      store.items = [mockCat()]

      const ok = await store.remove('1')
      expect(ok).toBe(true)
      expect(store.items).toHaveLength(0)
    })

    it('删除失败应返回 false', async () => {
      vi.mocked(deleteCatService).mockResolvedValue(false)

      const store = useCategoryStore()
      const ok = await store.remove('1')
      expect(ok).toBe(false)
    })
  })
})
