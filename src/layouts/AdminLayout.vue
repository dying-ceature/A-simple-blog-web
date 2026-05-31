<!--
  @file AdminLayout.vue
  @description 后台管理布局组件，包含侧边栏、顶部栏与内容区域，并在未登录时自动跳转登录页。
-->
<script setup lang="ts">
import { watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../stores/authStore'
import ThemeToggle from '../components/common/ThemeToggle.vue'

const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()

function handleLogout() {
  authStore.logout()
  router.replace('/admin/login')
}

watch(
  () => authStore.isAuthenticated,
  (val) => {
    if (!val) {
      router.replace({ path: '/admin/login', query: { from: route.fullPath } })
    }
  },
  { immediate: true },
)
</script>

<template>
  <div v-if="!authStore.isAuthenticated" />
  <div v-else class="flex min-h-screen bg-background text-foreground">
    <aside class="hidden w-60 border-r bg-card/80 p-4 text-sm md:block">
      <div class="mb-6 flex items-center justify-between">
        <span class="text-base font-semibold tracking-tight">
          博客后台
        </span>
      </div>
      <nav class="space-y-1">
        <RouterLink
          to="/admin"
          class="block rounded-md px-3 py-2 text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          仪表盘
        </RouterLink>
        <RouterLink
          to="/admin/posts"
          class="block rounded-md px-3 py-2 text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          文章管理
        </RouterLink>
        <RouterLink
          to="/admin/posts/new"
          class="block rounded-md px-3 py-2 text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          新建文章
        </RouterLink>
        <RouterLink
          to="/admin/categories"
          class="block rounded-md px-3 py-2 text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          分类管理
        </RouterLink>
      </nav>
    </aside>

    <div class="flex min-h-screen flex-1 flex-col">
      <header class="flex h-14 items-center justify-between border-b bg-card/60 px-4">
        <div class="flex items-center gap-2 text-xs text-muted-foreground">
          <span class="hidden sm:inline">后台管理中心</span>
        </div>
        <div class="flex items-center gap-3 text-xs">
          <RouterLink
            to="/"
            class="rounded-md border bg-background px-2 py-1 text-xs text-muted-foreground hover:bg-muted"
          >
            返回前台
          </RouterLink>
          <ThemeToggle />
          <span class="hidden items-center gap-1 sm:inline-flex">
            <span class="text-muted-foreground">当前用户：</span>
            <span class="font-medium">
              {{ authStore.user?.username ?? '管理员' }}
            </span>
          </span>
          <button
            type="button"
            class="rounded-md border bg-background px-2 py-1 text-xs text-muted-foreground hover:bg-muted"
            @click="handleLogout"
          >
            退出登录
          </button>
        </div>
      </header>

      <main class="flex-1 bg-background px-4 py-4">
        <RouterView />
      </main>
    </div>
  </div>
</template>
