const getOrientation = () => {
  if (window.matchMedia('(orientation: portrait)').matches) {
    return 'portrait'
  }
  if (window.matchMedia('(orientation: landscape)').matches) {
    return 'landscape'
  }
}

const getImageURL = (imgData, width, height) => {
  const newCanvas = document.createElement('canvas')
  const ctx = newCanvas.getContext('2d')
  newCanvas.width = width
  newCanvas.height = height

  ctx.putImageData(imgData, 0, 0)
  return newCanvas.toDataURL() //image URL
}

export {
  getOrientation,
  getImageURL,
}
