const getOrientation = () => {
  if (window.matchMedia('(orientation: portrait)').matches) {
    return 'portrait'
  }
  if (window.matchMedia('(orientation: landscape)').matches) {
    return 'landscape'
  }
}

export {
  getOrientation,
}
