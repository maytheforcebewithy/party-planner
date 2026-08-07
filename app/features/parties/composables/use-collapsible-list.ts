/**
 * Collapses a long list to its first `limit` entries until the user expands it.
 * Keeps guest/shopping lists short on the detail screen with a "show all"
 * toggle, and stays a no-op while the list is short.
 */
export function useCollapsibleList<T>(items: MaybeRefOrGetter<readonly T[]>, limit = 4) {
  const expanded = ref(false)
  const all = computed(() => toValue(items))
  const collapsible = computed(() => all.value.length > limit)
  const visible = computed(() =>
    expanded.value || !collapsible.value ? all.value : all.value.slice(0, limit),
  )
  const hiddenCount = computed(() => all.value.length - visible.value.length)

  function toggle(): void {
    expanded.value = !expanded.value
  }

  return { expanded, collapsible, visible, hiddenCount, toggle }
}
