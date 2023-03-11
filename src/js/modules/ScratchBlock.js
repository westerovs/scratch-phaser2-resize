export default class ScratchBlock {
  constructor({
    game,
    key,
    minAlphaRatio = 0.5,
    spritePos,
  }) {
    this.game = game
    this.key = key
    this.minAlphaRatio = minAlphaRatio
    this.disabled = false
  
    this.sprite = this.game.make.image(0, 0, key)
    this.spritePos = spritePos
    
    this.bitmapData = null
    
    this.init()
  }
  
  init() {
    this.bitmapData = this.game.make.bitmapData(1000, 1000)
    this.bitmapData.addToWorld(0, 0)
    // this.bitmapData.fill(0, 0, 0, 0.2)
    
    this.#createBlock()
    window.addEventListener('resize', () => this.#resize())
    console.log('MAX_PIXELS:', this.#getAlphaRatio())
  }
  
  #createBlock = () => {
    if (window.matchMedia('(orientation: portrait)').matches) {
      this.sprite.position.set(this.spritePos.portrait.x, this.spritePos.portrait.y)
    }
  
    if (window.matchMedia('(orientation: landscape)').matches) {
      this.sprite.position.set(this.spritePos.landscape.x, this.spritePos.landscape.y)
    }
    
    this.bitmapData.draw(this.sprite)
  
    this.sprite.alpha = 0
    this.sprite.inputEnabled = true
    this.sprite.events.onInputOver.add(() => {
      this.game.scratchSignal.dispatch(this.sprite.key, this)
    })
  }
  
  update() {
    if (this.disabled) return
    if (this.game.input.activePointer.isDown) {
      this.sprite.alpha = 0
      
      this.#drawBlend()
      this.#checkWin()
    }
    
    if (this.game.input.activePointer.isUp) {
      if (this.#getAlphaRatio() > this.minAlphaRatio) {
        this.sprite.alpha = 1
        
        this.bitmapData.draw(this.sprite, this.sprite.x, this.sprite.y)
      }
    }
  }
  
  recoveryBlock = () => {
    this.sprite.alpha = 1
    this.bitmapData.draw(this.sprite, this.sprite.x, this.sprite.y)
  }
  
  #drawBlend = () => {
    const cursorX = this.game.input.worldX / this.game.factor
    const cursorY = this.game.input.worldY / this.game.factor
    // const rgba  = this.bitmapData.getPixel(cursorX, cursorY)

    // if (rgba.a > 0) {
    this.bitmapData.blendDestinationOut()
    this.bitmapData.circle(cursorX, cursorY, 25, 'blue')
    // this.bitmapData.draw('brush', this.superX - 80, this.superY - 50)
    this.bitmapData.blendReset()
    this.bitmapData.dirty = true
    // }
  }
  
  #getAlphaRatio = () => {
    const {ctx} = this.bitmapData
    let alphaPixels = 0

    const {data} = ctx.getImageData(
      this.sprite.x, this.sprite.y,
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
      this.destroy()
    }
  }
  
  destroy = () => {
    this.disabled = true
    this.sprite.inputEnabled = false
    this.bitmapData.context.clearRect(this.sprite.x, this.sprite.y, this.sprite.width, this.sprite.height)
  }
  
  getImageURL = (imgData, width, height) => {
    const newCanvas = document.createElement('canvas')
    const ctx = newCanvas.getContext('2d')
    newCanvas.width = width
    newCanvas.height = height
    
    ctx.putImageData(imgData, 0, 0)
    return newCanvas.toDataURL() //image URL
  }
  
  createCopyImage = (x, y, width, height) => {
    const imageData = this.bitmapData.ctx.getImageData(x, y, this.sprite.width, this.sprite.height)
    
    const copyImage = new Image()
    copyImage.src = this.getImageURL(imageData, width, height)
  
    return new Promise(resolve => {
      copyImage.addEventListener('load', () => resolve(copyImage))
    })
  }
  
  #resize = () => {
    this.createCopyImage(this.sprite.x, this.sprite.y, this.sprite.width, this.sprite.height)
      .then((copyCropImage) => {
        this.bitmapData.context.clearRect(this.sprite.x, this.sprite.y, this.sprite.width, this.sprite.height)

        if (window.matchMedia('(orientation: portrait)').matches) {
          this.sprite.position.set(this.spritePos.portrait.x, this.spritePos.portrait.y)
        }
        if (window.matchMedia('(orientation: landscape)').matches) {
          this.sprite.position.set(this.spritePos.landscape.x, this.spritePos.landscape.y)
        }
        
        this.bitmapData.draw(copyCropImage, this.sprite.x, this.sprite.y)
      })
  }
}
