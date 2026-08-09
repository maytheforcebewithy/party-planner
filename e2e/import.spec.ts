import { expect, test } from '@playwright/test'

const FIXTURE = 'e2e/support/party-export.json'

test('imports parties from a backup file and shows them', async ({ page }) => {
  await page.goto('/import-export')

  await page.getByTestId('import-input').setInputFiles(FIXTURE)

  // "1 Partys importiert"
  await expect(page.getByTestId('ie-notice')).toContainText('1')

  // The imported party is in the (in-memory) store; reach the list via client-side nav.
  await page.getByRole('link', { name: 'Partys' }).click()
  await expect(page.getByText('E2E Imported Party')).toBeVisible()
})
