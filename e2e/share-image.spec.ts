import { readFileSync } from 'node:fs'
import { expect, test } from '@playwright/test'

// PNG file signature — the first 8 bytes of any valid PNG.
const PNG_SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])

// Exercises the whole invitation-image pipeline in a real browser: the
// off-screen card is rendered to a PNG by html-to-image and handed to the
// browser download path. Asserting the bytes proves a valid, non-empty image.
test('shares a party invitation as a downloadable PNG', async ({ page }) => {
  await page.goto('/')

  await page.getByTestId('new-party').click()
  await page.getByLabel('Name').fill('E2E Bildfest')
  await page.getByTestId('submit').click()
  await expect(page.getByRole('heading', { name: 'E2E Bildfest' })).toBeVisible()

  const downloadPromise = page.waitForEvent('download')
  await page.getByTestId('share-image').click()
  const download = await downloadPromise

  expect(download.suggestedFilename()).toMatch(/\.png$/)

  const path = await download.path()
  const bytes = readFileSync(path)
  expect(bytes.byteLength).toBeGreaterThan(1000)
  expect(bytes.subarray(0, 8)).toEqual(PNG_SIGNATURE)
})
