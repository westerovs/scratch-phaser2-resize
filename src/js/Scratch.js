export default class Scratch {
  constructor({
    game,
    sprite,
    minAlphaRatio = 0.5,
    bitmapData,
  }) {
    this.game = game
    this.sprite = sprite
    this.bitmapData = bitmapData
    // this.bitmapData          = null
    this.game.factor    = 1
    
    this.minAlphaRatio = minAlphaRatio
    this.disabled = false
    
    this.init()
}
  
  init() {
    // this.bitmapData.draw(this.sprite)
    // this.bitmapData.update()
  }
  
  destroy() {
    this.sprite.alive = false
    this.bitmapData.destroy()
  }
  
  update() {
    if (this.disabled) return
    this.draw()
    this.#checkWin()
  }
  
  draw = () => {
    const cursorX = this.game.input.worldX / this.game.factor
    const cursorY = this.game.input.worldY / this.game.factor
    // const rgba  = this.bitmapData.getPixel(cursorX, cursorY)
  
    // if (rgba.a > 0) {
      this.bitmapData.blendDestinationOut()
      this.bitmapData.circle(cursorX, cursorY, 25, 'blue')
      this.bitmapData.blendReset()
      this.bitmapData.dirty = true
    // }
  }
  
  #clearCoverWrap = () => {
    this.bitmapData.context.clearRect(0, 0, this.sprite.width, this.sprite.height)
  }
  
  getAlphaRatio = () => {
    const {ctx} = this.bitmapData
    let alphaPixels = 0
    
    const {data} = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height)
    
    // чем выше число, тем быстрее происходит полная очистка
    const coefficientBrush = 4
    for (let i = 0; i < data.length; i += coefficientBrush) {
      if (data[i] > 0) alphaPixels++
    }
    
    return +(alphaPixels / (ctx.canvas.width * ctx.canvas.height)).toFixed(3)
  }
  
  #checkWin = () => {
    return
    const alphaRatio = this.getAlphaRatio()
    
    if (alphaRatio < this.minAlphaRatio) {
      this.disabled = true
      // this.#clearCoverWrap()
      this.destroy()
  
    }
  }
}
