/**
 * @file uiStore.test.ts
 * @description UI Store 主题管理测试。
 */
import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useUIStore } from '../uiStore'

beforeEach(() => {
  setActivePinia(createPinia())
  window.localStorage.clear()
})

describe('uiStore', () => {
  describe('初始状态', () => {
    it('默认主题应为 light', () => {
      const store = useUIStore()
      expect(store.theme).toBe('light')
    })
  })

  describe('setTheme()', () => {
    it('应切换到 dark 主题', () => {
      const store = useUIStore()
      store.setTheme('dark')
      expect(store.theme).toBe('dark')
    })

    it('应在 <html> 上添加/移除 dark class', () => {
      const store = useUIStore()

      store.setTheme('dark')
      expect(document.documentElement.classList.contains('dark')).toBe(true)

      store.setTheme('light')
      expect(document.documentElement.classList.contains('dark')).toBe(false)
    })

    it('应持久化到 localStorage', () => {
      const store = useUIStore()
      store.setTheme('dark')
      expect(window.localStorage.getItem('theme')).toBe('dark')
    })
  })

  describe('toggleTheme()', () => {
    it('应从 light 切换到 dark', () => {
      const store = useUIStore()
      store.toggleTheme()
      expect(store.theme).toBe('dark')
    })

    it('应从 dark 切换回 light', () => {
      const store = useUIStore()
      store.setTheme('dark')
      store.toggleTheme()
      expect(store.theme).toBe('light')
    })
  })
})
