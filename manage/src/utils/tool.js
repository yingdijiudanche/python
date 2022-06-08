export function getBothUrls(imgUrl) {
  let previewSrc, originalSrc
  if (/\/original\//.test(imgUrl)) {
    previewSrc = originalSrc = imgUrl
  } else {
    previewSrc = imgUrl
    originalSrc = imgUrl.replace(/thumbnail/, 'original')
  }
  return [previewSrc, originalSrc]
}
