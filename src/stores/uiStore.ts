/**
 * @file uiStore.ts
 * @description 全局 UI 状态 Store，包括主题（深色 / 浅色）管理。
 */

import { defineStore } from 'pinia'
import { ref } from 'vue'

function getInitialTheme(): 'light' | 'dark' {
  if (typeof window !== 'undefined') {
    const stored = window.localStorage.getItem('theme')
    if (stored === 'light' || stored === 'dark') {
      return stored
    }
  }
  return 'light'
}

/**
 * @description UI Store，负责管理主题并同步到 documentElement.classList。
 */
export const useUIStore = defineStore('ui', () => {
  const theme = ref<'light' | 'dark'>(getInitialTheme())

  function applyTheme(t: 'light' | 'dark') {
    theme.value = t
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('theme', t)
      const root = window.document.documentElement
      root.classList.toggle('dark', t === 'dark')
    }
  }

  function toggleTheme() {
    const next = theme.value === 'light' ? 'dark' : 'light'
    applyTheme(next)
  }

  // 初始化时应用主题
  applyTheme(theme.value)

  return {
    theme,
    setTheme: applyTheme,
    toggleTheme,
  }
})
