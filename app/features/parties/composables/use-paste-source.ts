/**
 * Shared `useState` key for handing clipboard text from the invitations tab to
 * the paste screen. The tab reads the clipboard on tap (the required user
 * gesture) and the paste screen consumes it on mount.
 */
export const pasteSourceKey = 'paste-source'
