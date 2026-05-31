<!--
  @file PostDetailPage.vue
  @description 前台文章详情页，展示完整内容与元信息。
-->
<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePostStore } from '../../stores/postStore'
import { useCategoryStore } from '../../stores/categoryStore'
import MarkdownViewer from '../../components/blog/MarkdownViewer.vue'

const route = useRoute()
const router = useRouter()
const postStore = usePostStore()
const categoryStore = useCategoryStore()

const id = computed(() => route.params.id as string | undefined)

const category = computed(() =>
  categoryStore.items.find((c) => c.id === postStore.currentPost?.categoryId),
)

onMounted(() => {
  const postId = id.value
  if (postId) {
    postStore.fetchById(postId)
  }
  categoryStore.fetchAll()
})
</script>

<template>
  <!-- 缺少 ID -->
  <div v-if="!id" class="text-sm text-red-500">
    缺少文章 ID。
  </div>

  <!-- 加载中 -->
  <div v-else-if="postStore.loading && !postStore.currentPost" class="text-sm text-muted-foreground">
    正在加载文章详情…
  </div>

  <!-- 错误 -->
  <div v-else-if="postStore.error" class="space-y-2 text-sm">
    <p class="text-red-500">加载失败：{{ postStore.error }}</p>
    <RouterLink to="/" class="text-xs text-primary underline underline-offset-2">
      返回首页
    </RouterLink>
  </div>

  <!-- 文章不存在或未发布 -->
  <div v-else-if="!postStore.currentPost || postStore.currentPost.status !== 'published'" class="space-y-2 text-sm">
    <p class="text-muted-foreground">文章不存在或已被删除。</p>
    <RouterLink to="/" class="text-xs text-primary underline underline-offset-2">
      返回首页
    </RouterLink>
  </div>

  <!-- 文章详情 -->
  <article v-else class="max-w-3xl space-y-4">
    <header class="space-y-2 border-b pb-3">
      <h1 class="text-xl font-semibold tracking-tight">
        {{ postStore.currentPost.title }}
      </h1>
      <div class="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
        <span>作者：{{ postStore.currentPost.author }}</span>
        <span>
          发布于：{{ new Date(postStore.currentPost.createdAt).toLocaleString('zh-CN') }}
        </span>
        <span v-if="category" class="rounded-full bg-muted px-2 py-0.5">
          分类：{{ category.name }}
        </span>
      </div>
      <div v-if="postStore.currentPost.tags.length > 0" class="flex flex-wrap gap-2 text-[11px] text-muted-foreground">
        <span
          v-for="tag in postStore.currentPost.tags"
          :key="tag"
          class="rounded-full border px-2 py-0.5"
        >
          #{{ tag }}
        </span>
      </div>
    </header>

    <section class="space-y-4 text-sm leading-relaxed">
      <MarkdownViewer :content="postStore.currentPost.content" />
    </section>

    <footer class="mt-6 border-t pt-3 text-xs text-muted-foreground">
      <button
        type="button"
        class="text-primary underline underline-offset-2"
        @click="router.back()"
      >
        ← 返回文章列表
      </button>
    </footer>
  </article>
</template>
