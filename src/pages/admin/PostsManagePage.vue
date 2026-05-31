<!--
  @file PostsManagePage.vue
  @description 后台文章管理列表页，可查看、搜索、跳转编辑与删除文章。
-->
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { usePostStore } from '../../stores/postStore'
import { useCategoryStore } from '../../stores/categoryStore'
import type { Post } from '../../services/blogStorage'
import SearchBar from '../../components/blog/SearchBar.vue'

const postStore = usePostStore()
const categoryStore = useCategoryStore()
const router = useRouter()

const confirmingId = ref<string | null>(null)
const keyword = ref('')

const ADMIN_PAGE_SIZE = 999

const categoryMap = computed(() => {
  const map = new Map<string, string>()
  categoryStore.items.forEach((c) => map.set(c.id, c.name))
  return map
})

onMounted(() => {
  postStore.fetchList({ page: 1, pageSize: ADMIN_PAGE_SIZE })
  categoryStore.fetchAll()
})

async function handleDelete(id: string) {
  const ok = await postStore.remove(id)
  if (ok) {
    postStore.fetchList({ page: 1, pageSize: ADMIN_PAGE_SIZE })
  }
  confirmingId.value = null
}

async function handleToggleStatus(post: Post) {
  const nextStatus = post.status === 'published' ? 'draft' : 'published'
  await postStore.update(post.id, { status: nextStatus })
  await postStore.fetchList({ page: postStore.page, pageSize: ADMIN_PAGE_SIZE })
}

function handleSearch() {
  postStore.fetchList({
    page: 1,
    pageSize: ADMIN_PAGE_SIZE,
    keyword: keyword.value || undefined,
  })
}
</script>

<template>
  <div class="space-y-4">
    <header class="flex flex-wrap items-center justify-between gap-3">
      <h1 class="text-base font-semibold tracking-tight">
        文章管理
      </h1>
      <button
        type="button"
        class="rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90"
        @click="router.push('/admin/posts/new')"
      >
        新建文章
      </button>
    </header>

    <!-- 搜索区域 -->
    <section class="rounded-lg border bg-card/60 p-3 text-sm">
      <SearchBar v-model="keyword" @search="handleSearch" />
      <p class="mt-1 text-[11px] text-muted-foreground">
        支持按标题或正文内容关键字模糊搜索全部文章（含草稿）。
      </p>
    </section>

    <p v-if="postStore.loading" class="text-xs text-muted-foreground">加载中…</p>
    <p v-if="postStore.error" class="text-xs text-red-500">加载失败：{{ postStore.error }}</p>

    <div class="overflow-x-auto rounded-lg border bg-card/60 text-xs">
      <table class="min-w-full border-collapse">
        <thead class="bg-muted/60 text-[11px] uppercase text-muted-foreground">
          <tr>
            <th class="px-2 py-2 text-left font-medium">标题</th>
            <th class="px-2 py-2 text-left font-medium">分类</th>
            <th class="px-2 py-2 text-left font-medium">作者</th>
            <th class="px-2 py-2 text-left font-medium">发布日期</th>
            <th class="px-2 py-2 text-left font-medium">状态</th>
            <th class="px-2 py-2 text-right font-medium">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="post in postStore.items"
            :key="post.id"
            class="border-t text-xs hover:bg-muted/40"
          >
            <td class="px-2 py-2">
              <a
                :href="`#/posts/${post.id}`"
                target="_blank"
                rel="noreferrer"
                class="font-medium text-primary hover:underline"
              >
                {{ post.title }}
              </a>
            </td>
            <td class="px-2 py-2">
              {{ categoryMap.get(post.categoryId) ?? '未分类' }}
            </td>
            <td class="px-2 py-2">{{ post.author }}</td>
            <td class="px-2 py-2">
              {{ new Date(post.createdAt).toLocaleDateString('zh-CN') }}
            </td>
            <td class="px-2 py-2">
              <span
                :class="[
                  'inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium',
                  post.status === 'published'
                    ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300'
                    : 'bg-muted text-muted-foreground',
                ]"
              >
                {{ post.status === 'published' ? '已发布' : '草稿' }}
              </span>
            </td>
            <td class="px-2 py-2 text-right">
              <div class="inline-flex gap-1">
                <button
                  type="button"
                  class="rounded border px-1 py-0.5 text-[11px] text-emerald-600 hover:bg-emerald-500/10 dark:text-emerald-300"
                  @click="handleToggleStatus(post)"
                >
                  {{ post.status === 'published' ? '设为草稿' : '发布' }}
                </button>
                <button
                  type="button"
                  class="rounded border px-1 py-0.5 text-[11px] text-muted-foreground hover:bg-muted"
                  @click="router.push(`/admin/posts/${post.id}`)"
                >
                  编辑
                </button>
                <button
                  type="button"
                  class="rounded border px-1 py-0.5 text-[11px] text-red-500 hover:bg-red-500/10"
                  @click="confirmingId = post.id"
                >
                  删除
                </button>
              </div>
            </td>
          </tr>
          <tr v-if="postStore.items.length === 0">
            <td colspan="6" class="px-2 py-4 text-center text-xs text-muted-foreground">
              暂无文章。
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <p class="text-xs text-muted-foreground">
      共 {{ postStore.total }} 篇文章。
    </p>

    <!-- 删除确认对话框 -->
    <Teleport to="body">
      <div
        v-if="confirmingId"
        class="fixed inset-0 z-20 flex items-center justify-center bg-black/40 px-4"
        @click.self="confirmingId = null"
      >
        <div class="w-full max-w-xs rounded-lg border bg-card p-4 text-xs">
          <p class="mb-3 text-sm font-medium">
            确认删除该文章吗？
          </p>
          <p class="mb-4 text-muted-foreground">
            删除后不可恢复，请谨慎操作。
          </p>
          <div class="flex justify-end gap-2">
            <button
              type="button"
              class="rounded-md border bg-background px-3 py-1 text-xs text-muted-foreground hover:bg-muted"
              @click="confirmingId = null"
            >
              取消
            </button>
            <button
              type="button"
              class="rounded-md bg-red-500 px-3 py-1 text-xs font-medium text-white hover:bg-red-600"
              @click="handleDelete(confirmingId)"
            >
              确认删除
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>
