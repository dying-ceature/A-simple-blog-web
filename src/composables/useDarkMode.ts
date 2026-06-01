/**
 * @file useDarkMode.ts
 * @description 深色模式组合式函数（共享单例），基于 VueUse useDark / useToggle 封装。
 * 使用 createSharedComposable 确保所有组件共享同一个 useDark 实例。
 */
import { computed } from 'vue'
import { useDark } from '@vueuse/core'
import { createSharedComposable } from '@vueuse/shared'

/**
 * @description 深色模式组合式函数（共享单例），返回当前主题与切换方法。
 * 所有调用者共享同一组响应式状态，一次切换全局生效。
 * 使用 VueUse useDark 管理 <html> 的 dark class 与 localStorage 持久化。
 * 注意：不能使用 useToggle(isDark)，VueUse v14 的 useToggle 会将 Ref 包裹在 shallowRef
 * 中，导致 toggle 的是 wrapper 而非原始 ref，主题切换实际不生效。
 */
export const useDarkMode = createSharedComposable(() => {
  const isDark = useDark({
    storageKey: 'theme',
    valueDark: 'dark',
    valueLight: 'light',
  })

  /**
   * 直接切换 isDark 的布尔值，触发 WritableComputedRef 的 setter，
   * 从而更新 useColorMode 的内部 store 与 localStorage。
   */
  function toggleTheme() {
    isDark.value = !isDark.value
  }

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
})
