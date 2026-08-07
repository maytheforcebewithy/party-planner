import { describe, expect, it } from 'vitest'
import { ref } from 'vue'
import { useCollapsibleList } from '~/features/parties/composables/use-collapsible-list'

describe('useCollapsibleList', () => {
  it('stays a no-op while the list fits the limit', () => {
    const { collapsible, visible, hiddenCount } = useCollapsibleList([1, 2, 3], 4)

    expect(collapsible.value).toBe(false)
    expect(visible.value).toEqual([1, 2, 3])
    expect(hiddenCount.value).toBe(0)
  })

  it('truncates a long list and reveals the rest on toggle', () => {
    const { collapsible, visible, hiddenCount, expanded, toggle } = useCollapsibleList([1, 2, 3, 4, 5, 6], 4)

    expect(collapsible.value).toBe(true)
    expect(visible.value).toEqual([1, 2, 3, 4])
    expect(hiddenCount.value).toBe(2)

    toggle()

    expect(expanded.value).toBe(true)
    expect(visible.value).toEqual([1, 2, 3, 4, 5, 6])
    expect(hiddenCount.value).toBe(0)
  })

  it('tracks a reactive source', () => {
    const items = ref<number[]>([1, 2])
    const { collapsible } = useCollapsibleList(items, 4)

    expect(collapsible.value).toBe(false)
    items.value = [1, 2, 3, 4, 5]
    expect(collapsible.value).toBe(true)
  })
})
