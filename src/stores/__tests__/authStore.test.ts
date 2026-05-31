/**
 * @file authStore.test.ts
 * @description 认证 Store 测试。
 */
import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '../authStore'

beforeEach(() => {
  setActivePinia(createPinia())
  window.localStorage.clear()
})

describe('authStore', () => {
  describe('初始状态', () => {
    it('应处于未认证状态', () => {
      const store = useAuthStore()
      expect(store.isAuthenticated).toBe(false)
      expect(store.token).toBeNull()
      expect(store.user).toBeNull()
    })
  })

  describe('login()', () => {
    it('正确的 admin 凭证应登录成功', async () => {
      const store = useAuthStore()
      const ok = await store.login('admin', '123456')
      expect(ok).toBe(true)
      expect(store.isAuthenticated).toBe(true)
      expect(store.token).toContain('mock-jwt-token-')
      expect(store.user?.username).toBe('admin')
    })

    it('正确的 demo 凭证应登录成功', async () => {
      const store = useAuthStore()
      const ok = await store.login('demo', 'demo123')
      expect(ok).toBe(true)
      expect(store.user?.username).toBe('demo')
    })

    it('错误密码应登录失败', async () => {
      const store = useAuthStore()
      const ok = await store.login('admin', 'wrong')
      expect(ok).toBe(false)
      expect(store.isAuthenticated).toBe(false)
    })

    it('不存在用户应登录失败', async () => {
      const store = useAuthStore()
      const ok = await store.login('unknown', '123456')
      expect(ok).toBe(false)
    })

    it('登录成功应持久化 token 到 localStorage', async () => {
      const store = useAuthStore()
      await store.login('admin', '123456')
      expect(window.localStorage.getItem('authToken')).toBeTruthy()
      expect(window.localStorage.getItem('authUser')).toBeTruthy()
    })
  })

  describe('logout()', () => {
    it('应清除所有认证状态', async () => {
      const store = useAuthStore()
      await store.login('admin', '123456')
      store.logout()

      expect(store.isAuthenticated).toBe(false)
      expect(store.token).toBeNull()
      expect(store.user).toBeNull()
    })

    it('应清除 localStorage 中的凭证', async () => {
      const store = useAuthStore()
      await store.login('admin', '123456')
      store.logout()

      expect(window.localStorage.getItem('authToken')).toBeNull()
      expect(window.localStorage.getItem('authUser')).toBeNull()
    })
  })

  describe('initFromStorage()', () => {
    it('应从 localStorage 恢复登录态', async () => {
      // 模拟先登录保存
      const store1 = useAuthStore()
      await store1.login('admin', '123456')

      // 新建 store 实例模拟页面刷新
      setActivePinia(createPinia())
      const store2 = useAuthStore()
      store2.initFromStorage()

      expect(store2.isAuthenticated).toBe(true)
      expect(store2.user?.username).toBe('admin')
    })

    it('localStorage 无数据时应保持未认证', () => {
      const store = useAuthStore()
      store.initFromStorage()
      expect(store.isAuthenticated).toBe(false)
    })

    it('损坏的 JSON 应被清理', () => {
      window.localStorage.setItem('authToken', 'some-token')
      window.localStorage.setItem('authUser', 'not-valid-json{{{')

      const store = useAuthStore()
      store.initFromStorage()

      // 应清理损坏数据
      expect(store.isAuthenticated).toBe(false)
      expect(window.localStorage.getItem('authToken')).toBeNull()
    })
  })
})
