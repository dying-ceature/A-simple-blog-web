/**
 * @file utils.test.ts
 * @description cn() 工具函数测试。
 */
import { describe, it, expect } from 'vitest'
import { cn } from '../utils'

describe('cn()', () => {
  it('应该合并普通字符串类名', () => {
    expect(cn('text-sm', 'font-bold')).toBe('text-sm font-bold')
  })

  it('空调用应该返回空字符串', () => {
    expect(cn()).toBe('')
  })

  it('应该过滤掉 falsy 值', () => {
    expect(cn('text-sm', false, null, undefined, '', 0)).toBe('text-sm')
  })

  it('应该处理 Tailwind 冲突合并', () => {
    // px-2 和 px-4 冲突，twMerge 应保留后者
    const result = cn('px-2', 'px-4')
    expect(result).toBe('px-4')
  })

  it('应该处理条件对象', () => {
    const result = cn('text-sm', {
      'bg-red-500': true,
      'hidden': false,
    })
    expect(result).toBe('text-sm bg-red-500')
  })

  it('应该处理数组中嵌套的对象', () => {
    const result = cn(['text-sm', { 'font-bold': true }])
    expect(result).toBe('text-sm font-bold')
  })

  it('全部 falsy 应返回空字符串', () => {
    expect(cn(null, undefined, false)).toBe('')
  })
})
