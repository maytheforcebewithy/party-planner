import { expect, test } from '@playwright/test'

test('toggles a per-party reminder on the detail screen', async ({ page }) => {
  await page.goto('/')
  await page.getByTestId('new-party').click()
  await page.getByLabel('Name').fill('E2E Erinnerungsfest')
  await page.getByLabel('Datum').fill('2099-12-24')
  await page.getByTestId('submit').click()

  const toggle = page.getByTestId('reminder-toggle')
  await expect(toggle).toHaveAttribute('aria-pressed', 'false')

  await toggle.click()
  await expect(toggle).toHaveAttribute('aria-pressed', 'true')

  await toggle.click()
  await expect(toggle).toHaveAttribute('aria-pressed', 'false')
})
