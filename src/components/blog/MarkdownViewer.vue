<!--
  @file MarkdownViewer.vue
  @description Markdown 预览组件，基于 md-editor-v3 的 MdPreview 渲染内容。
-->
<script setup lang="ts">
import { computed } from 'vue'
import { MdPreview } from 'md-editor-v3'
import { useDarkMode } from '../../composables/useDarkMode'

const props = defineProps<{
  content: string
}>()

const { isDark } = useDarkMode()

const previewTheme = computed(() => (isDark.value ? 'dark' : 'light'))
</script>

<template>
  <MdPreview
    :model-value="props.content"
    :theme="previewTheme"
    language="zh-CN"
  />
</template>
