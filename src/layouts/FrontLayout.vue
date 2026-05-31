<!--
  @file FrontLayout.vue
  @description 前台博客布局组件，包含站点头部导航与内容区域。
-->
<script setup lang="ts">
import ThemeToggle from '../components/common/ThemeToggle.vue'
</script>

<template>
  <div class="min-h-screen bg-background text-foreground">
    <header class="border-b bg-card/60 backdrop-blur">
      <div class="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <RouterLink to="/" class="flex items-center gap-2">
          <span class="text-lg font-semibold tracking-tight">
            Minimal Blog
          </span>
        </RouterLink>
        <nav class="flex items-center gap-4 text-sm">
          <RouterLink
            to="/"
            class="text-muted-foreground transition-colors hover:text-foreground"
          >
            博客
          </RouterLink>
          <RouterLink
            to="/admin/login"
            class="text-muted-foreground transition-colors hover:text-foreground"
          >
            后台管理
          </RouterLink>
          <ThemeToggle />
        </nav>
      </div>
    </header>

    <main class="mx-auto max-w-6xl px-4 py-6">
      <RouterView />
    </main>

    <footer class="border-t bg-card/60">
      <div class="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 text-xs text-muted-foreground">
        <span>© {{ new Date().getFullYear() }} Minimal Blog</span>
        <span>前台博客 + 后台管理示例</span>
      </div>
    </footer>
  </div>
</template>
