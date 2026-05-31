/**
 * @file blogApi.ts
 * @description 博客业务 API 函数，基于 Axios 实例封装，签名对齐 blogStorage.ts。
 * 后续 Stores 切换数据源时只需改 import 源即可。
 */
import http from './request'
import type { Post, Category } from '../services/blogStorage'

// ==================== 文章 API ====================

/**
 * @description 查询文章列表（分页 + 筛选）。
 */
export function queryPosts(params: {
  page: number
  pageSize: number
  keyword?: string
  categoryId?: string
  status?: 'published' | 'draft'
}): Promise<{ total: number; items: Post[] }> {
  return http.get('/posts', { params })
}

/**
 * @description 根据 ID 获取单篇文章。
 */
export function getPostById(id: string): Promise<Post | null> {
  return http.get(`/posts/${id}`)
}

/**
 * @description 创建新文章。
 */
export function createPost(
  payload: Omit<Post, 'id' | 'createdAt' | 'updatedAt'>,
): Promise<Post> {
  return http.post('/posts', payload)
}

/**
 * @description 更新文章。
 */
export function updatePost(
  id: string,
  payload: Partial<Omit<Post, 'id' | 'createdAt'>>,
): Promise<Post | null> {
  return http.patch(`/posts/${id}`, payload)
}

/**
 * @description 删除文章。
 */
export function deletePost(id: string): Promise<boolean> {
  return http.delete(`/posts/${id}`)
}

// ==================== 分类 API ====================

/**
 * @description 获取全部分类。
 */
export function getCategories(): Promise<Category[]> {
  return http.get('/categories')
}

/**
 * @description 创建分类。
 */
export function createCategory(
  payload: Omit<Category, 'id' | 'createdAt'>,
): Promise<Category> {
  return http.post('/categories', payload)
}

/**
 * @description 更新分类。
 */
export function updateCategory(
  id: string,
  payload: Partial<Omit<Category, 'id' | 'createdAt'>>,
): Promise<Category | null> {
  return http.patch(`/categories/${id}`, payload)
}

/**
 * @description 删除分类。
 */
export function deleteCategory(id: string): Promise<boolean> {
  return http.delete(`/categories/${id}`)
}
