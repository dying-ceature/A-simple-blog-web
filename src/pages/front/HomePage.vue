<!--
  @file HomePage.vue
  @description 前台首页，展示文章列表、分类筛选与搜索，支持分页；搜索关键字与分类筛选同步到 URL 查询参数。
-->
<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePostStore } from '../../stores/postStore'
import { useCategoryStore } from '../../stores/categoryStore'
import { initBlogDemoData } from '../../services/blogStorage'
import SearchBar from '../../components/blog/SearchBar.vue'
import CategoryFilter from '../../components/blog/CategoryFilter.vue'
import Pagination from '../../components/blog/Pagination.vue'
import PostCard from '../../components/blog/PostCard.vue'

const route = useRoute()
const router = useRouter()
const postStore = usePostStore()
const categoryStore = useCategoryStore()

const keyword = ref('')
const categoryId = ref('')

const currentCategoryMap = computed(() => {
  const map = new Map<string, (typeof categoryStore.items)[number]>()
  categoryStore.items.forEach((c) => map.set(c.id, c))
  return map
})

function parseQueryParams() {
  const q = (route.query.q as string) ?? ''
  const cat = (route.query.cat as string) ?? ''
  keyword.value = q
  categoryId.value = cat
  postStore.fetchList({
    page: 1,
    keyword: q || undefined,
    categoryId: cat || undefined,
    status: 'published',
  })
}

function updateSearchParams(next: { keyword?: string; categoryId?: string }) {
  const query: Record<string, string> = { ...route.query } as Record<string, string>

  if (next.keyword !== undefined) {
    if (next.keyword) {
      query.q = next.keyword
    } else {
      delete query.q
    }
  }

  if (next.categoryId !== undefined) {
    if (next.categoryId) {
      query.cat = next.categoryId
    } else {
      delete query.cat
    }
  }

  router.push({ path: route.path, query })
}

function handleSearch() {
  updateSearchParams({ keyword: keyword.value, categoryId: categoryId.value })
}

function handlePageChange(nextPage: number) {
  postStore.fetchList({
    page: nextPage,
    keyword: keyword.value || undefined,
    categoryId: categoryId.value || undefined,
    status: 'published',
  })
}

onMounted(() => {
  try {
    initBlogDemoData()
  } catch (e) {
    console.error('[HomePage] Failed to initialize demo data:', e)
  }
  categoryStore.fetchAll()
})

watch(() => route.query, parseQueryParams, { immediate: true })
</script>

<template>
  <div class="space-y-6">
    <!-- Hero 区域 -->
    <section class="grid gap-6 md:grid-cols-[1.6fr,1fr]">
      <div class="space-y-4">
        <h1 class="text-2xl font-semibold tracking-tight">
          极简现代博客系统
        </h1>
        <p class="text-sm text-muted-foreground">
          前台阅读 + 后台管理一体化示例。支持 Markdown
          编辑、分类与关键字搜索，响应式布局与深浅主题切换。
        </p>
        <div class="flex gap-3 text-xs text-muted-foreground">
          <div class="flex flex-col">
            <span class="font-medium text-foreground">账号</span>
            <span>admin / 123456</span>
          </div>
          <div class="flex flex-col">
            <span class="font-medium text-foreground">体验地址</span>
            <span>右上角「后台管理」链接</span>
          </div>
        </div>
      </div>
      <div class="overflow-hidden rounded-xl border bg-card/60">
        <img
          src="https://pub-cdn.sider.ai/u/U0W8H110G15/web-coder/6a1bf4e9614ae89139d19958/resource/d3aee6a4-de38-45fd-bad9-af7852032632.jpg"
          alt="blog hero"
          class="h-40 w-full object-cover"
        />
      </div>
    </section>

    <!-- 筛选 & 搜索 -->
    <section class="flex flex-col gap-3 rounded-xl border bg-card/60 p-4">
      <div class="flex flex-col gap-3 md:flex-row md:items-center">
        <div class="flex-1">
          <SearchBar v-model="keyword" @search="handleSearch" />
        </div>
        <div class="flex w-full items-center gap-2 text-xs md:w-auto">
          <span class="whitespace-nowrap text-muted-foreground">
            分类
          </span>
          <CategoryFilter
            v-model="categoryId"
            :categories="categoryStore.items"
          />
        </div>
      </div>
      <p v-if="postStore.loading || categoryStore.loading" class="text-xs text-muted-foreground">
        加载中…
      </p>
      <p v-if="postStore.error" class="text-xs text-red-500">
        加载失败：{{ postStore.error }}
      </p>
    </section>

    <!-- 文章列表 -->
    <section class="space-y-3">
      <div class="flex items-center justify-between text-xs text-muted-foreground">
        <span>共 {{ postStore.total }} 篇文章</span>
      </div>
      <div v-if="postStore.items.length === 0" class="rounded-lg border bg-card/60 p-6 text-center text-xs text-muted-foreground">
        暂无文章，您可以在后台新建一篇。
      </div>
      <div v-else class="grid gap-4 md:grid-cols-2">
        <PostCard
          v-for="post in postStore.items"
          :key="post.id"
          :post="post"
          :category="currentCategoryMap.get(post.categoryId)"
        />
      </div>
      <Pagination
        :page="postStore.page"
        :page-size="postStore.pageSize"
        :total="postStore.total"
        @change="handlePageChange"
      />
    </section>
  </div>
</template>
