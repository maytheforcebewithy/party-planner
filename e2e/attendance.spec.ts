import { expect, test } from '@playwright/test'

test('replies to a received invitation with an attendance', async ({ page }) => {
  await page.goto('/invitations')

  // The invitations tab imports a file as received invitations.
  await page.getByTestId('invite-import').setInputFiles('e2e/support/party-export.json')

  const invitation = page.getByText('E2E Imported Party')
  await expect(invitation).toBeVisible()
  await invitation.click()

  await expect(page.getByTestId('attendance')).toBeVisible()
  await page.getByTestId('attendance-yes').click()
  await expect(page.getByTestId('attendance-yes')).toHaveAttribute('aria-pressed', 'true')
})
