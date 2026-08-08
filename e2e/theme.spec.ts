import { expect, test } from '@playwright/test'

test('theme toggle switches the scheme and remembers it', async ({ page }) => {
  await page.goto('/settings')

  const html = page.locator('html')

  await page.getByTestId('settings-theme-dark').click()
  await expect(html).toHaveAttribute('data-theme', 'dark')

  await page.getByTestId('settings-theme-light').click()
  await expect(html).toHaveAttribute('data-theme', 'light')

  // The choice survives a reload.
  await page.reload()
  await expect(html).toHaveAttribute('data-theme', 'light')
})
