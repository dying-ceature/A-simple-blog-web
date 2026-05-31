<!--
  @file PostEditPage.vue
  @description 后台文章新建 / 编辑页面，支持 Markdown 编辑与预览。
-->
<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { usePostStore } from '../../stores/postStore'
import { useCategoryStore } from '../../stores/categoryStore'
import MarkdownEditor from '../../components/blog/MarkdownEditor.vue'
import type { Post } from '../../services/blogStorage'

const route = useRoute()
const router = useRouter()
const postStore = usePostStore()
const categoryStore = useCategoryStore()

const id = computed(() => route.params.id as string | undefined)
const isEdit = computed(() => Boolean(id.value))

const form = reactive({
  title: '',
  summary: '',
  content: '',
  categoryId: '',
  tags: '',
  author: 'Admin',
  status: 'draft' as 'published' | 'draft',
})
const saving = ref(false)

onMounted(() => {
  categoryStore.fetchAll()
  if (isEdit.value && id.value) {
    postStore.fetchById(id.value)
  }
})

watch(
  () => postStore.currentPost,
  (post) => {
    if (isEdit.value && post && post.id === id.value) {
      form.title = post.title
      form.summary = post.summary
      form.content = post.content
      form.categoryId = post.categoryId
      form.tags = post.tags.join(', ')
      form.author = post.author
      form.status = post.status ?? 'draft'
    }
  },
)

function buildPayload(): Omit<Post, 'id' | 'createdAt' | 'updatedAt'> {
  const tags = form.tags
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean)
  return {
    title: form.title,
    summary: form.summary,
    content: form.content,
    categoryId: form.categoryId || (categoryStore.items[0]?.id ?? ''),
    tags,
    author: form.author || 'Admin',
    status: form.status,
  }
}

async function handleSubmit() {
  if (!form.title.trim()) return
  saving.value = true
  const payload = buildPayload()
  if (isEdit.value && id.value) {
    await postStore.update(id.value, payload)
  } else {
    await postStore.create(payload)
  }
  saving.value = false
  router.push('/admin/posts')
}
</script>

<template>
  <div class="space-y-4">
    <header class="flex flex-wrap items-center justify-between gap-3">
      <h1 class="text-base font-semibold tracking-tight">
        {{ isEdit ? '编辑文章' : '新建文章' }}
      </h1>
      <div class="flex gap-2 text-xs">
        <button
          type="button"
          class="rounded-md border bg-background px-3 py-1 text-muted-foreground hover:bg-muted"
          @click="router.push('/admin/posts')"
        >
          返回列表
        </button>
        <button
          type="button"
          :disabled="saving"
          class="rounded-md bg-primary px-3 py-1 text-xs font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
          @click="handleSubmit"
        >
          {{ saving ? '保存中…' : '保存' }}
        </button>
      </div>
    </header>

    <form class="space-y-3 text-sm" @submit.prevent="handleSubmit">
      <div class="grid gap-3 md:grid-cols-3">
        <div class="space-y-1">
          <label class="text-xs text-muted-foreground">标题</label>
          <input
            v-model="form.title"
            class="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
            placeholder="请输入文章标题"
          />
        </div>
        <div class="space-y-1">
          <label class="text-xs text-muted-foreground">分类</label>
          <select
            v-model="form.categoryId"
            class="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="">请选择分类</option>
            <option v-for="c in categoryStore.items" :key="c.id" :value="c.id">
              {{ c.name }}
            </option>
          </select>
        </div>
        <div class="space-y-1">
          <label class="text-xs text-muted-foreground">状态</label>
          <select
            v-model="form.status"
            class="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="draft">草稿（仅后台可见）</option>
            <option value="published">已发布（前台可见）</option>
          </select>
        </div>
      </div>

      <div class="space-y-1">
        <label class="text-xs text-muted-foreground">摘要</label>
        <textarea
          v-model="form.summary"
          class="h-20 w-full resize-y rounded-md border bg-background p-2 text-xs outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
          placeholder="用于列表展示的文章摘要…"
        />
      </div>

      <div class="grid gap-3 md:grid-cols-2">
        <div class="space-y-1">
          <label class="text-xs text-muted-foreground">标签（以英文逗号分隔）</label>
          <input
            v-model="form.tags"
            class="w-full rounded-md border bg-background px-3 py-2 text-xs outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
            placeholder="例如：Vue3, 前端, 随笔"
          />
        </div>
        <div class="space-y-1">
          <label class="text-xs text-muted-foreground">作者</label>
          <input
            v-model="form.author"
            class="w-full rounded-md border bg-background px-3 py-2 text-xs outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
            placeholder="作者名称"
          />
        </div>
      </div>

      <div class="space-y-1">
        <label class="text-xs text-muted-foreground">正文内容（Markdown）</label>
        <MarkdownEditor v-model="form.content" />
      </div>
    </form>
  </div>
</template>
