/**
 * Read a picked image file and return a downscaled JPEG data URL. Keeping the
 * badge image small (max edge {@link maxSize}px) matters because it is stored
 * inline in the local party record. Browser-only (canvas/FileReader); the app
 * is a client-rendered SPA so this always runs on the device.
 */
export async function readImageAsDataUrl(file: File, maxSize = 512): Promise<string> {
  const original = await fileToDataUrl(file)
  const image = await loadImage(original)

  const scale = Math.min(1, maxSize / Math.max(image.width, image.height))
  const width = Math.max(1, Math.round(image.width * scale))
  const height = Math.max(1, Math.round(image.height * scale))

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const context = canvas.getContext('2d')
  if (!context) return original

  context.drawImage(image, 0, 0, width, height)
  return canvas.toDataURL('image/jpeg', 0.82)
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(reader.error ?? new Error('Could not read the file'))
    reader.readAsDataURL(file)
  })
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error('Could not decode the image'))
    image.src = src
  })
}
