import { expect, test } from '@playwright/test'

async function createParty(page: import('@playwright/test').Page, name: string, date: string) {
  await page.getByTestId('new-party').click()
  await page.waitForURL(/\/parties\/create$/)
  await page.getByLabel('Name').fill(name)
  await page.locator('input[type="date"]').fill(date)
  await page.getByTestId('submit').click()
  await page.getByTestId('edit').waitFor()
  await page.getByTestId('back-link').click()
  await page.getByTestId('new-party').waitFor()
}

// Far-past / far-future dates so the split holds regardless of the real clock.
test('splits parties into upcoming and past tabs', async ({ page }) => {
  await page.goto('/')
  await createParty(page, 'Zukunftsfest', '2099-12-31')
  await createParty(page, 'Retro Party', '2000-01-01')

  await expect(page.getByText('Zukunftsfest')).toBeVisible()
  await expect(page.getByText('Retro Party')).toHaveCount(0)

  await page.getByRole('button', { name: 'Vergangene' }).click()

  await expect(page.getByText('Retro Party')).toBeVisible()
  await expect(page.getByText('Zukunftsfest')).toHaveCount(0)
})
