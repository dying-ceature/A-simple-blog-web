<!--
  @file CategoriesManagePage.vue
  @description 后台分类管理页面，支持分类的增删改，并统计每类文章数量。
-->
<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useCategoryStore } from '../../stores/categoryStore'
import { usePostStore } from '../../stores/postStore'

const categoryStore = useCategoryStore()
const postStore = usePostStore()

const editingId = ref<string | null>(null)
const form = reactive({ name: '', slug: '' })

const categoryCountMap = computed(() => {
  const map = new Map<string, number>()
  postStore.items.forEach((post) => {
    const current = map.get(post.categoryId) ?? 0
    map.set(post.categoryId, current + 1)
  })
  return map
})

onMounted(() => {
  categoryStore.fetchAll()
  postStore.fetchList({ page: 1, pageSize: 999 })
})

function resetForm() {
  editingId.value = null
  form.name = ''
  form.slug = ''
}

async function handleSubmit(e: Event) {
  e.preventDefault()
  if (!form.name.trim()) return
  if (editingId.value) {
    await categoryStore.update(editingId.value, { name: form.name, slug: form.slug || form.name })
  } else {
    await categoryStore.create({ name: form.name, slug: form.slug || form.name })
  }
  resetForm()
}

function handleEdit(id: string) {
  const cat = categoryStore.items.find((c) => c.id === id)
  if (!cat) return
  editingId.value = id
  form.name = cat.name
  form.slug = cat.slug
}

async function handleDelete(id: string) {
  await categoryStore.remove(id)
}
</script>

<template>
  <div class="space-y-4">
    <h1 class="text-base font-semibold tracking-tight">
      分类管理
    </h1>

    <form
      class="space-y-3 rounded-lg border bg-card/60 p-4 text-sm"
      @submit="handleSubmit"
    >
      <div class="grid gap-3 md:grid-cols-2">
        <div class="space-y-1">
          <label class="text-xs text-muted-foreground">分类名称</label>
          <input
            v-model="form.name"
            class="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
            placeholder="例如：前端开发"
          />
        </div>
        <div class="space-y-1">
          <label class="text-xs text-muted-foreground">标识（slug）</label>
          <input
            v-model="form.slug"
            class="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
            placeholder="例如：frontend"
          />
        </div>
      </div>
      <div class="flex gap-2 text-xs">
        <button
          type="submit"
          class="rounded-md bg-primary px-3 py-1.5 font-medium text-primary-foreground hover:bg-primary/90"
        >
          {{ editingId ? '保存修改' : '新增分类' }}
        </button>
        <button
          v-if="editingId"
          type="button"
          class="rounded-md border bg-background px-3 py-1.5 text-muted-foreground hover:bg-muted"
          @click="resetForm"
        >
          取消编辑
        </button>
      </div>
    </form>

    <p v-if="categoryStore.loading" class="text-xs text-muted-foreground">加载中…</p>
    <p v-if="categoryStore.error" class="text-xs text-red-500">加载失败：{{ categoryStore.error }}</p>

    <div class="overflow-x-auto rounded-lg border bg-card/60 text-xs">
      <table class="min-w-full border-collapse">
        <thead class="bg-muted/60 text-[11px] uppercase text-muted-foreground">
          <tr>
            <th class="px-2 py-2 text-left font-medium">名称</th>
            <th class="px-2 py-2 text-left font-medium">标识</th>
            <th class="px-2 py-2 text-left font-medium">文章数量</th>
            <th class="px-2 py-2 text-left font-medium">创建时间</th>
            <th class="px-2 py-2 text-right font-medium">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="c in categoryStore.items"
            :key="c.id"
            class="border-t hover:bg-muted/40"
          >
            <td class="px-2 py-2">{{ c.name }}</td>
            <td class="px-2 py-2 font-mono text-[11px]">{{ c.slug }}</td>
            <td class="px-2 py-2">{{ categoryCountMap.get(c.id) ?? 0 }}</td>
            <td class="px-2 py-2">
              {{ new Date(c.createdAt).toLocaleDateString('zh-CN') }}
            </td>
            <td class="px-2 py-2 text-right">
              <div class="inline-flex gap-1">
                <button
                  type="button"
                  class="rounded border px-2 py-0.5 text-[11px] text-muted-foreground hover:bg-muted"
                  @click="handleEdit(c.id)"
                >
                  编辑
                </button>
                <button
                  type="button"
                  class="rounded border px-2 py-0.5 text-[11px] text-red-500 hover:bg-red-500/10"
                  @click="handleDelete(c.id)"
                >
                  删除
                </button>
              </div>
            </td>
          </tr>
          <tr v-if="categoryStore.items.length === 0">
            <td colspan="5" class="px-2 py-4 text-center text-xs text-muted-foreground">
              暂无分类。
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
