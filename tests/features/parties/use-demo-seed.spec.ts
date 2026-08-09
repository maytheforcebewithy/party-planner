import { describe, expect, it } from 'vitest'
import { defineComponent } from 'vue'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { useDemoSeed } from '~/features/parties/composables/use-demo-seed'
import { usePartiesStore } from '~/features/parties/stores/parties-store'

async function make(): Promise<{
  seedDemo: ReturnType<typeof useDemoSeed>['seedDemo']
  store: ReturnType<typeof usePartiesStore>
}> {
  let api: { seedDemo: ReturnType<typeof useDemoSeed>['seedDemo'], store: ReturnType<typeof usePartiesStore> } | undefined
  await mountSuspended(defineComponent({
    setup() {
      api = { seedDemo: useDemoSeed().seedDemo, store: usePartiesStore() }
      return () => null
    },
  }))
  if (!api) throw new Error('composable did not initialise')
  return api
}

describe('useDemoSeed', () => {
  it('seeds an own party plus a received invitation and returns the own party', async () => {
    const { seedDemo, store } = await make()
    await store.clearAll()

    const party = await seedDemo()

    expect(party.received).toBe(false)
    expect(store.findById(party.id)).toBeTruthy()
    expect(store.partyCount).toBe(2)
    expect(store.parties.filter(entry => entry.received)).toHaveLength(1)
    expect(store.parties.filter(entry => !entry.received)).toHaveLength(1)
  })
})
