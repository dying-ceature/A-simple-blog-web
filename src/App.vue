<!--
  @file App.vue
  @description 顶层应用组件，包裹 RouterView 并捕获子组件错误，防止空白页面。
-->
<script setup lang="ts">
import { onErrorCaptured, ref } from 'vue'

const error = ref<Error | null>(null)

onErrorCaptured((err, _instance, _info) => {
  error.value = err as Error
  console.error('[App] Uncaught error captured:', err)
  return false // 阻止错误继续传播到全局处理器
})

function handleRetry() {
  window.location.reload()
}
</script>

<template>
  <div
    v-if="error"
    class="flex min-h-screen flex-col items-center justify-center gap-4 bg-background p-8 text-center"
  >
    <div class="rounded-full bg-destructive/10 p-3">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-6 w-6 text-destructive"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="2"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M12 9v2m0 4h.01M12 3l9.66 16.5H2.34L12 3z"
        />
      </svg>
    </div>
    <h1 class="text-xl font-semibold text-foreground">应用加载失败</h1>
    <p class="max-w-md text-sm text-muted-foreground">
      应用遇到了意外错误，请尝试刷新页面。如果问题持续出现，请清除浏览器数据后重试。
    </p>
    <p
      class="max-w-lg rounded-md border bg-muted p-3 text-xs text-muted-foreground break-all font-mono"
    >
      {{ error.message || '未知错误' }}
    </p>
    <button
      class="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground hover:bg-primary/90 transition-colors"
      @click="handleRetry"
    >
      刷新页面
    </button>
  </div>
  <RouterView v-else />
</template>
