import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'
import type { Page } from '@playwright/test'

/**
 * Accessibility gate across the main screens, in BOTH themes. Colour-contrast is
 * now enforced: the brand green uses dark text on filled surfaces so it passes
 * WCAG AA.
 */
async function scan(page: Page): Promise<void> {
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice'])
    .analyze()
  expect(results.violations.map(violation => violation.id)).toEqual([])
}

for (const theme of ['dark', 'light'] as const) {
  test(`key screens have no accessibility violations (${theme})`, async ({ page }) => {
    await page.addInitScript(value => localStorage.setItem('party-planner.theme', value), theme)

    await page.goto('/', { waitUntil: 'load' })
    await page.getByTestId('seed-demo').waitFor()
    await scan(page)

    await page.getByTestId('seed-demo').click()
    await page.getByTestId('party-row').waitFor()
    await scan(page)

    await page.getByTestId('party-row').click()
    await page.getByTestId('share').waitFor()
    await scan(page)

    await page.getByTestId('back-link').click()
    await page.getByTestId('new-party').click()
    await page.getByTestId('submit').waitFor()
    await scan(page)

    await page.getByTestId('cancel').click()
    await page.getByRole('link', { name: 'Einstellungen' }).click()
    await page.getByTestId('delete-all').waitFor()
    await scan(page)

    await page.getByRole('link', { name: 'Import/Export' }).click()
    await page.getByTestId('export').waitFor()
    await scan(page)

    await page.getByRole('link', { name: 'Einladungen' }).click()
    await page.getByTestId('invite-import').waitFor()
    await scan(page)
  })
}
