import { expect, test } from '@playwright/test'

test('renders the start view', async ({ page }) => {
  await page.goto('/')

  await expect(page.getByText('Party Planner')).toBeVisible()
  await expect(page.getByText('App setup successful')).toBeVisible()
})
