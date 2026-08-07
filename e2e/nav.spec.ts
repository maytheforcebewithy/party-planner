import { expect, test } from '@playwright/test'

test('bottom tab bar navigates between sections', async ({ page }) => {
  await page.goto('/')

  await page.getByRole('link', { name: 'Einstellungen' }).click()
  await expect(page).toHaveURL(/\/settings$/)
  await expect(page.getByRole('heading', { name: 'Einstellungen' })).toBeVisible()

  await page.getByRole('link', { name: 'Import/Export' }).click()
  await expect(page).toHaveURL(/\/import-export$/)

  await page.getByRole('link', { name: 'Partys' }).click()
  await expect(page).toHaveURL(/\/$/)
})
