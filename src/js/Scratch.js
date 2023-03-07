export default class Scratch {
  constructor({
    game,
    sprite,
    minAlphaRatio = 0.5,
    bitmapData,
    position
  }) {
    this.game = game
    this.sprite = sprite
    this.bitmapData = bitmapData
    
    this.minAlphaRatio = minAlphaRatio
    this.disabled = false
    this.position = position
  
    this.slepok = null
    
    this.prevPos = {
      x: this.sprite.x,
      y: this.sprite.y,
    }
    this.init()
}
  
  init() {
    this.bitmapData.draw(this.sprite)
  
    this.setPosition()
    window.addEventListener('resize', () => this.setPosition())
  }
  
  destroy() {
    this.sprite.alive = false
    this.bitmapData.destroy()
  }
  
  update() {
    if (this.disabled) return
    if (this.game.input.activePointer.isDown) {
      this.draw()
      // this.#checkWin()
    }
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
    const alphaRatio = this.getAlphaRatio()
    if (alphaRatio < this.minAlphaRatio) {
      this.disabled = true
      this.#clearCoverWrap()
      this.destroy()
    }
  }
  
  setPosition = () => {
    // console.clear()
    const width = this.sprite.width
    const height = this.sprite.height
    const setRectArea = (x, y) => new Phaser.Rectangle(x, y, width, height)
    // console.warn('prevPos:', this.prevPos)
    // console.warn('landscape:', this.position.landscape)
    
    
    if (window.matchMedia('(orientation: portrait)').matches) {
      // если совпадает точка отсчёта, то копировать не нужно
      if (JSON.stringify(this.position.portrait) === JSON.stringify(this.prevPos)) return
  
      this.bitmapData.copyRect(this.bitmapData,
        setRectArea(this.prevPos.x, this.prevPos.y),
        this.position.portrait.x,
        this.position.portrait.y,
      )
      
      // differentX
      const clearX = (this.prevPos.x + width)
      const factX = this.position.portrait.x
      const differentX = clearX - factX
      // differentY
      const clearY = (this.prevPos.y + height)
      const factY = this.position.portrait.y
      const differentY = clearY - factY
      
      console.log('clearX', clearX)
      console.log('factX', factX)
      console.log('differentX', differentX)
      console.log('differentY', differentY)
  
      if (clearX > factX) {
        this.bitmapData.clear(this.prevPos.x - differentX, this.prevPos.y, width, height)
      }
      if (clearY > factY) {
        this.bitmapData.clear(this.prevPos.x, this.prevPos.y - differentY, width, height)
      }
      else { }
      
      
      this.prevPos = {
        x: this.position.portrait.x,
        y: this.position.portrait.y,
      }
      // console.warn('NextPrevPos:', this.prevPos)
    }
    
    
    if (window.matchMedia('(orientation: landscape)').matches) {
      // если совпадает точка отсчёта, то копировать не нужно
      if (JSON.stringify(this.position.landscape) === JSON.stringify(this.prevPos)) return
      
      this.bitmapData.copyRect(this.bitmapData,
        setRectArea(this.prevPos.x, this.prevPos.y),
        this.position.landscape.x,
        this.position.landscape.y,
      )
      
      this.bitmapData.clear(this.prevPos.x, this.prevPos.y, width, height)
      this.prevPos = {
        x: this.position.landscape.x,
        y: this.position.landscape.y,
      }
      // console.warn('NextPrevPos:', this.prevPos)
    }
  }
  
}
