<!--
  @file DashboardPage.vue
  @description 后台仪表盘首页，展示文章 / 分类数量与简要说明。
-->
<script setup lang="ts">
import { onMounted } from 'vue'
import { usePostStore } from '../../stores/postStore'
import { useCategoryStore } from '../../stores/categoryStore'

const postStore = usePostStore()
const categoryStore = useCategoryStore()

onMounted(() => {
  postStore.fetchList()
  categoryStore.fetchAll()
})
</script>

<template>
  <div class="space-y-4">
    <h1 class="text-base font-semibold tracking-tight">
      仪表盘
    </h1>
    <div class="grid gap-4 sm:grid-cols-3">
      <div class="rounded-lg border bg-card/60 p-4 text-sm">
        <div class="text-xs text-muted-foreground">
          文章总数
        </div>
        <div class="mt-2 text-2xl font-semibold">
          {{ postStore.total }}
        </div>
      </div>
      <div class="rounded-lg border bg-card/60 p-4 text-sm">
        <div class="text-xs text-muted-foreground">
          分类数量
        </div>
        <div class="mt-2 text-2xl font-semibold">
          {{ categoryStore.items.length }}
        </div>
      </div>
      <div class="rounded-lg border bg-card/60 p-4 text-xs text-muted-foreground">
        <div class="font-medium text-foreground">
          使用说明
        </div>
        <ul class="mt-1 list-disc space-y-1 pl-4">
          <li>左侧菜单进入文章 / 分类管理。</li>
          <li>支持 Markdown 编辑与实时预览。</li>
          <li>前台首页自动展示最新内容。</li>
        </ul>
      </div>
    </div>
  </div>
</template>
