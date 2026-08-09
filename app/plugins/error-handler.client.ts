import { logger } from '~/shared/logger'

/**
 * Last-resort net for promise rejections that escape a fire-and-forget handler
 * (e.g. an OS share/filesystem call the user cancels or that fails). Routes them
 * through the app logger instead of surfacing as "Uncaught (in promise)".
 */
export default defineNuxtPlugin(() => {
  window.addEventListener('unhandledrejection', (event) => {
    logger.error('Unhandled promise rejection', event.reason)
  })
})
