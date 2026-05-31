/**
 * @file useDarkMode.ts
 * @description 组合式函数，用于封装深浅色主题切换逻辑，模仿 VueUse 中 useDark 的行为。
 */

import { computed } from 'vue'
import { useUIStore } from '../stores/uiStore'

/**
 * @description 深色模式组合式函数，返回当前主题与切换方法。
 */
export function useDarkMode() {
  const uiStore = useUIStore()

  return {
    theme: computed(() => uiStore.theme),
    setTheme: uiStore.setTheme,
    toggleTheme: uiStore.toggleTheme,
    isDark: computed(() => uiStore.theme === 'dark'),
  }
}
