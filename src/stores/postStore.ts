/**
 * @file postStore.ts
 * @description 文章 Store，封装文章列表、详情与增删改操作。
 */

import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Post } from '../services/blogStorage'
import {
  createPost,
  deletePost,
  getPostById,
  queryPosts,
  updatePost,
} from '../services/blogStorage'

/**
 * @description 文章 Store，实现前台与后台复用的数据逻辑。
 */
export const usePostStore = defineStore('post', () => {
  const items = ref<Post[]>([])
  const total = ref(0)
  const page = ref(1)
  const pageSize = ref(6)
  const loading = ref(false)
  const currentPost = ref<Post | null>(null)
  const error = ref<string | null>(null)

  /**
   * @description 获取文章列表，可按页码、关键字、分类与状态过滤；支持自定义 pageSize 覆盖默认值。
   */
  async function fetchList(params?: {
    page?: number
    pageSize?: number
    keyword?: string
    categoryId?: string
    status?: 'published' | 'draft'
  }) {
    loading.value = true
    error.value = null
    try {
      const result = await queryPosts({
        page: params?.page ?? page.value,
        pageSize: params?.pageSize ?? pageSize.value,
        keyword: params?.keyword,
        categoryId: params?.categoryId,
        status: params?.status,
      })
      items.value = result.items
      total.value = result.total
      page.value = params?.page ?? page.value
    } catch (e) {
      error.value = (e as Error).message ?? '加载文章列表失败'
    } finally {
      loading.value = false
    }
  }

  /**
   * @description 根据 ID 加载单篇文章详情。
   */
  async function fetchById(id: string) {
    loading.value = true
    error.value = null
    try {
      const post = await getPostById(id)
      currentPost.value = post
    } catch (e) {
      error.value = (e as Error).message ?? '加载文章详情失败'
    } finally {
      loading.value = false
    }
  }

  /**
   * @description 创建新文章。
   */
  async function create(
    payload: Omit<Post, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Post> {
    const created = await createPost(payload)
    items.value = [created, ...items.value]
    total.value = total.value + 1
    return created
  }

  /**
   * @description 更新文章。
   */
  async function update(
    id: string,
    payload: Partial<Omit<Post, 'id' | 'createdAt'>>,
  ): Promise<Post | null> {
    const updated = await updatePost(id, payload)
    if (!updated) return null
    items.value = items.value.map((p) => (p.id === id ? updated : p))
    currentPost.value = updated
    return updated
  }

  /**
   * @description 删除文章。
   */
  async function remove(id: string): Promise<boolean> {
    const ok = await deletePost(id)
    if (!ok) return false
    items.value = items.value.filter((p) => p.id !== id)
    total.value = Math.max(0, total.value - 1)
    return true
  }

  return {
    items,
    total,
    page,
    pageSize,
    loading,
    currentPost,
    error,
    fetchList,
    fetchById,
    create,
    update,
    remove,
  }
})
