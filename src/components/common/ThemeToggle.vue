<!--
  @file ThemeToggle.vue
  @description 主题切换按钮组件，支持深色 / 浅色模式切换。
-->
<script setup lang="ts">
import { useDarkMode } from '../../composables/useDarkMode'

const { isDark, toggleTheme } = useDarkMode()
</script>

<template>
  <button
    type="button"
    class="inline-flex h-8 items-center rounded-md border bg-background px-3 text-xs text-muted-foreground hover:bg-muted"
    @click="toggleTheme"
  >
    {{ isDark ? '深色' : '浅色' }}
  </button>
</template>
