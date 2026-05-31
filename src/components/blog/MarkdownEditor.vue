<!--
  @file MarkdownEditor.vue
  @description Markdown 编辑组件，基于 md-editor-v3 提供编辑与实时预览。
-->
<script setup lang="ts">
import { computed } from 'vue'
import { MdEditor } from 'md-editor-v3'
import { useDarkMode } from '../../composables/useDarkMode'

const props = defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const { isDark } = useDarkMode()

const editorTheme = computed(() => (isDark.value ? 'dark' : 'light'))
</script>

<template>
  <MdEditor
    :model-value="props.modelValue"
    :theme="editorTheme"
    :preview-theme="editorTheme"
    language="zh-CN"
    :toolbars="[
      'bold',
      'italic',
      'strikeThrough',
      'title',
      '-',
      'unorderedList',
      'orderedList',
      'task',
      'codeRow',
      'code',
      'link',
      'image',
      'table',
      '-',
      'revoke',
      'next',
      'save',
      '=',
      'preview',
      'fullscreen',
      'pageFullscreen',
    ]"
    style="height: 500px"
    @on-change="(v: string) => emit('update:modelValue', v)"
    @on-save="(v: string) => emit('update:modelValue', v)"
  />
</template>
