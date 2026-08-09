import { expect, test } from '@playwright/test'

test('creates a received invitation by pasting a message', async ({ page }) => {
  await page.goto('/invitations/paste')

  await page.getByTestId('paste-input').fill('Sommerfest am 20.08.2026 um 18:00 im Stadtpark. Komm vorbei!')
  await page.getByTestId('paste-parse').click()

  // The parsed draft opens the review form; ensure a name and save it.
  await page.getByLabel('Name').fill('E2E Eingefügte Party')
  await page.getByTestId('submit').click()

  // Saving opens the new invitation's detail page.
  await expect(page).toHaveURL(/\/parties\//)
  await expect(page.getByRole('heading', { name: 'E2E Eingefügte Party' })).toBeVisible()
})
