/**
 * @file categoryStore.ts
 * @description 分类 Store，封装分类的增删改查逻辑。
 */

import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Category } from '../services/blogStorage'
import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from '../services/blogStorage'

/**
 * @description 分类 Store 实现。
 */
export const useCategoryStore = defineStore('category', () => {
  const items = ref<Category[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchAll() {
    loading.value = true
    error.value = null
    try {
      const list = await getCategories()
      items.value = list
    } catch (e) {
      error.value = (e as Error).message ?? '加载分类失败'
    } finally {
      loading.value = false
    }
  }

  async function create(
    payload: Omit<Category, 'id' | 'createdAt'>,
  ): Promise<Category> {
    const created = await createCategory(payload)
    items.value = [...items.value, created]
    return created
  }

  async function update(
    id: string,
    payload: Partial<Omit<Category, 'id' | 'createdAt'>>,
  ): Promise<Category | null> {
    const updated = await updateCategory(id, payload)
    if (!updated) return null
    items.value = items.value.map((c) => (c.id === id ? updated : c))
    return updated
  }

  async function remove(id: string): Promise<boolean> {
    const ok = await deleteCategory(id)
    if (!ok) return false
    items.value = items.value.filter((c) => c.id !== id)
    return true
  }

  return {
    items,
    loading,
    error,
    fetchAll,
    create,
    update,
    remove,
  }
})
