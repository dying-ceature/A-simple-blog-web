/**
 * @file authStore.ts
 * @description 认证 Store，负责管理登录状态、模拟 JWT Token 与本地持久化。
 */

import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface AuthUser {
  username: string
}

/**
 * @description 认证 Store 实现，使用 localStorage 模拟 JWT 持久化。
 */
export const useAuthStore = defineStore('auth', () => {
  const isAuthenticated = ref(false)
  const token = ref<string | null>(null)
  const user = ref<AuthUser | null>(null)

  async function login(username: string, password: string): Promise<boolean> {
    // 模拟请求：简单校验固定账号密码
    const valid =
      (username === 'admin' && password === '123456') ||
      (username === 'demo' && password === 'demo123')

    if (!valid) {
      return false
    }

    const fakeToken = 'mock-jwt-token-' + Date.now().toString()
    const authUser: AuthUser = { username }

    if (typeof window !== 'undefined') {
      window.localStorage.setItem('authToken', fakeToken)
      window.localStorage.setItem('authUser', JSON.stringify(authUser))
    }

    isAuthenticated.value = true
    token.value = fakeToken
    user.value = authUser

    return true
  }

  function logout() {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem('authToken')
      window.localStorage.removeItem('authUser')
    }
    isAuthenticated.value = false
    token.value = null
    user.value = null
  }

  function initFromStorage() {
    if (typeof window === 'undefined') return
    const storedToken = window.localStorage.getItem('authToken')
    const userRaw = window.localStorage.getItem('authUser')
    if (storedToken && userRaw) {
      try {
        const parsedUser = JSON.parse(userRaw) as AuthUser
        isAuthenticated.value = true
        token.value = storedToken
        user.value = parsedUser
      } catch {
        // 解析失败则清理
        window.localStorage.removeItem('authToken')
        window.localStorage.removeItem('authUser')
      }
    }
  }

  return {
    isAuthenticated,
    token,
    user,
    login,
    logout,
    initFromStorage,
  }
})
