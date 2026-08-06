import { expect, test } from '@playwright/test'

test('home shows the party list with a way to add one', async ({ page }) => {
  await page.goto('/')

  await expect(page.getByTestId('new-party')).toBeVisible()
})
