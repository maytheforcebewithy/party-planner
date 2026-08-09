import { expect, test } from '@playwright/test'

test('exports a party to the calendar as an .ics download', async ({ page }) => {
  await page.goto('/')
  await page.getByTestId('new-party').click()
  await page.getByLabel('Name').fill('E2E Kalenderfest')
  await page.getByLabel('Datum').fill('2026-12-24')
  await page.getByTestId('submit').click()
  await expect(page.getByRole('heading', { name: 'E2E Kalenderfest' })).toBeVisible()

  const downloadPromise = page.waitForEvent('download')
  await page.getByTestId('add-to-calendar').click()
  const download = await downloadPromise

  expect(download.suggestedFilename()).toMatch(/\.ics$/)
})
