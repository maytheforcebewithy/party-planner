import { expect, test } from '@playwright/test'

// Full local lifecycle in a single SPA session: the in-memory repository keeps
// data across client-side navigations, so create → detail → edit → delete flows
// without any backend.
test('creates, edits and deletes a party', async ({ page }) => {
  await page.goto('/')

  await page.getByTestId('new-party').click()
  await expect(page).toHaveURL(/\/parties\/create$/)

  await page.getByLabel('Name').fill('E2E Sommerfest')
  await page.getByTestId('submit').click()

  await expect(page.getByRole('heading', { name: 'E2E Sommerfest' })).toBeVisible()

  await page.getByTestId('edit').click()
  await page.getByLabel('Name').fill('E2E Herbstfest')
  await page.getByTestId('submit').click()

  await expect(page.getByRole('heading', { name: 'E2E Herbstfest' })).toBeVisible()

  await page.getByTestId('delete').click()
  await page.getByTestId('delete-confirm').click()

  await expect(page).toHaveURL(/\/$/)
  await expect(page.getByText('E2E Herbstfest')).toHaveCount(0)
})
