export default class ScratchBlock {
  constructor({
    game,
    sprite,
    minAlphaRatio = 0.5,
    bitmapData,
    spritePos,
  }) {
    this.game = game
    this.sprite = sprite
    this.bitmapData = bitmapData
    this.minAlphaRatio = minAlphaRatio
    this.disabled = false
    this.spritePos = spritePos
    
    this.prevPos = {
      x: this.sprite.x,
      y: this.sprite.y,
    }
    
    this.currentPos = {
      x: null,
      y: null,
    }
    this.init()
  }
  
  init() {
    this.drawBlock()
    
    this.#setPosition()
    window.addEventListener('resize', () => this.#setPosition())
    console.log('MAX_PIXELS:', this.#getAlphaRatio())
  }
  
  drawBlock = () => {
    this.bitmapData.draw(this.sprite)
  }
  
  update() {
    if (this.disabled) return
    if (this.game.input.activePointer.isDown) {
      console.log('down')
      
      this.#drawBlend()
      this.#checkWin()
    }
    
    if (this.game.input.activePointer.isUp) {
      if (this.#getAlphaRatio() > this.minAlphaRatio) {
        console.log('ВОССТАНОВЛЕНИЕ ТЕКСТУРЫ')

        this.bitmapData.copyRect(this.sprite,
          this.#setRectArea(0, 0),
          this.currentPos.x,
          this.currentPos.y,
        )
      }
    }
  }
  
  #drawBlend = () => {
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
  
  #getDifference = (direction) => {
    const clearX = (this.prevPos.x + this.sprite.width)
    const clearY = (this.prevPos.y + this.sprite.height)
    const factX = this.spritePos[direction].x
    const factY = this.spritePos[direction].y
    const differentX = clearX - factX
    const differentY = clearY - factY
    
    // console.log('clearX:', clearX, 'clearY:', clearY)
    // console.log('factY:', factX, 'factY:', factX)
    // console.log('differentX:', differentX, 'differentY:', differentY)
    
    return {
      clearX,
      clearY,
      factX,
      factY,
      differentX,
      differentY,
    }
  }
  
  #setRectArea = (x, y) => {
    return new Phaser.Rectangle(x, y, this.sprite.width, this.sprite.height)
  }
  
  #setPosition = () => {
    const width = this.sprite.width
    const height = this.sprite.height
    
    if (window.matchMedia('(orientation: portrait)').matches) {
      if (JSON.stringify(this.spritePos.portrait) === JSON.stringify(this.prevPos)) return
      
      this.bitmapData.copyRect(this.bitmapData,
        this.#setRectArea(this.prevPos.x, this.prevPos.y),
        this.spritePos.portrait.x,
        this.spritePos.portrait.y,
      )
      // different
      // const {clearX, clearY, factY, factX, differentX, differentY} = this.#getDifference('portrait')
      // if (clearX > factX) {
      //   this.bitmapData.clear(this.prevPos.x - differentX, this.prevPos.y, width, height)
      // }
      // if (clearY > factY) {
      //   this.bitmapData.clear(this.prevPos.x, this.prevPos.y - differentY, width, height)
      // }
      this.bitmapData.clear(this.prevPos.x, this.prevPos.y, width, height)
      
      this.prevPos = {x: this.spritePos.portrait.x, y: this.spritePos.portrait.y}
      this.currentPos = {x: this.prevPos.x, y: this.prevPos.y}
    }
    
    if (window.matchMedia('(orientation: landscape)').matches) {
      if (JSON.stringify(this.spritePos.landscape) === JSON.stringify(this.prevPos)) return
      
      this.bitmapData.copyRect(this.bitmapData,
        this.#setRectArea(this.prevPos.x, this.prevPos.y),
        this.spritePos.landscape.x,
        this.spritePos.landscape.y,
      )
      
      // different
      const {clearX, clearY, factY, factX, differentX, differentY} = this.#getDifference('landscape')
      
      // if (clearX > factX) {
      //   this.bitmapData.clear(this.prevPos.x - differentX, this.prevPos.y, width, height)
      // }
      // if (clearY > factY) {
      //   this.bitmapData.clear(this.prevPos.x, this.prevPos.y - differentY, width, height)
      // }
      this.bitmapData.clear(this.prevPos.x, this.prevPos.y, width, height)
      
      this.prevPos = {x: this.spritePos.landscape.x, y: this.spritePos.landscape.y}
      this.currentPos = {x: this.prevPos.x, y: this.prevPos.y}
    }
  }
  
  #clearRect = () => {
    this.bitmapData.context.clearRect(this.currentPos.x, this.currentPos.y, this.sprite.width, this.sprite.height)
  }
  
  #getAlphaRatio = () => {
    const {ctx} = this.bitmapData
    let alphaPixels = 0
    
    // const {data} = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height)
    const {data} = ctx.getImageData(
      this.currentPos.x, this.currentPos.y,
      this.sprite.width, this.sprite.height,
    )
    
    // чем выше число, тем быстрее происходит полная очистка
    const coefficientBrush = 4
    for (let i = 0; i < data.length; i += coefficientBrush) {
      if (data[i] > 0) alphaPixels++
    }
    
    return +(alphaPixels / (ctx.canvas.width * ctx.canvas.height)).toFixed(3)
  }
  
  #checkWin = () => {
    if (this.#getAlphaRatio() < this.minAlphaRatio) {
      console.warn('WIN')
      this.disabled = true
      this.#clearRect()
    }
  }
}
