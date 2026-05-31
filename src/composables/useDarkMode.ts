/**
 * @file useDarkMode.ts
 * @description 深色模式组合式函数，基于 VueUse useDark / useToggle 封装。
 */
import { computed } from 'vue'
import { useDark, useToggle } from '@vueuse/core'

/**
 * @description 深色模式组合式函数，返回当前主题与切换方法。
 * 使用 VueUse useDark 管理 <html> 的 dark class 与 localStorage 持久化。
 */
export function useDarkMode() {
  const isDark = useDark({
    storageKey: 'theme',
    valueDark: 'dark',
    valueLight: 'light',
  })

  const toggleTheme = useToggle(isDark)

  const theme = computed(() => (isDark.value ? 'dark' : 'light'))

  function setTheme(t: 'light' | 'dark') {
    isDark.value = t === 'dark'
  }

  return {
    theme,
    setTheme,
    toggleTheme,
    isDark,
  }
}
