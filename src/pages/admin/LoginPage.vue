<!--
  @file LoginPage.vue
  @description 后台登录页面，使用账号密码登录并设置模拟 JWT。
-->
<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../../stores/authStore'

const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()

const username = ref('admin')
const password = ref('123456')
const loading = ref(false)
const errorMsg = ref<string | null>(null)

async function handleSubmit(e: Event) {
  e.preventDefault()
  loading.value = true
  errorMsg.value = null
  const ok = await authStore.login(username.value, password.value)
  loading.value = false
  if (!ok) {
    errorMsg.value = '账号或密码错误，请重试。'
    return
  }
  const redirectTo = (route.query.from as string) || '/admin'
  router.replace(redirectTo)
}
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-background px-4">
    <div class="w-full max-w-sm rounded-xl border bg-card/60 p-6 shadow-sm">
      <h1 class="mb-1 text-lg font-semibold tracking-tight">
        后台登录
      </h1>
      <p class="mb-4 text-xs text-muted-foreground">
        体验账号：<span class="font-mono">admin / 123456</span>
      </p>
      <form class="space-y-3 text-sm" @submit="handleSubmit">
        <div class="space-y-1">
          <label class="text-xs text-muted-foreground">
            用户名
          </label>
          <input
            v-model="username"
            autocomplete="username"
            class="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
        <div class="space-y-1">
          <label class="text-xs text-muted-foreground">
            密码
          </label>
          <input
            v-model="password"
            type="password"
            autocomplete="current-password"
            class="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
        <p v-if="errorMsg" class="text-xs text-red-500">{{ errorMsg }}</p>
        <button
          type="submit"
          :disabled="loading"
          class="mt-1 flex w-full items-center justify-center rounded-md bg-primary py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
        >
          {{ loading ? '登录中…' : '登录' }}
        </button>
      </form>
    </div>
  </div>
</template>
