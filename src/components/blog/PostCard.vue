<!--
  @file PostCard.vue
  @description 文章列表卡片组件。
-->
<script setup lang="ts">
import type { Post, Category } from '../../services/blogStorage'

defineProps<{
  post: Post
  category?: Category
}>()
</script>

<template>
  <article class="flex flex-col rounded-lg border bg-card/60 p-4 transition-shadow hover:shadow-md">
    <header class="mb-2 flex flex-wrap items-center justify-between gap-2">
      <RouterLink
        :to="`/posts/${post.id}`"
        class="text-base font-semibold hover:underline"
      >
        {{ post.title }}
      </RouterLink>
      <span class="rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">
        {{ category?.name ?? '未分类' }}
      </span>
    </header>
    <p class="line-clamp-2 text-xs text-muted-foreground">
      {{ post.summary }}
    </p>
    <footer class="mt-3 flex flex-wrap items-center justify-between gap-2 text-[11px] text-muted-foreground">
      <span>作者：{{ post.author }}</span>
      <span>
        发布于：{{ new Date(post.createdAt).toLocaleDateString('zh-CN') }}
      </span>
    </footer>
  </article>
</template>
