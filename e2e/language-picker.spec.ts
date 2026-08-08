import { expect, test } from '@playwright/test'

// A fresh install: no language chosen yet, so drop the seeded choice.
test.use({ storageState: { cookies: [], origins: [] } })

test('first run shows the language picker and remembers the choice', async ({ page }) => {
  await page.goto('/')

  const picker = page.getByTestId('language-picker')
  await expect(picker).toBeVisible()
  // A fresh install renders English until the user picks.
  await expect(page.getByRole('heading', { name: 'Choose your language' })).toBeVisible()

  await page.getByTestId('language-option-de').click()

  // The picker is gone and the app is now German, on the party list.
  await expect(picker).toHaveCount(0)
  await expect(page.getByRole('link', { name: 'Einstellungen' })).toBeVisible()

  // The choice survives a reload — no picker on the next launch.
  await page.reload()
  await expect(page.getByTestId('language-picker')).toHaveCount(0)
  await expect(page.getByRole('link', { name: 'Einstellungen' })).toBeVisible()
})
