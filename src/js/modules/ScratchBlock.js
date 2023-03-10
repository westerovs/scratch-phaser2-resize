const createRect = (game, x = 0, y = 0, w, h, color = 0x00FFA9) => {
  const dot = game.make.graphics(0, 0)
  dot.beginFill(color)
  dot.fillAlpha = 0.5
  dot.drawRect(x, y, w, h)
  dot.endFill()
  
  game.world.addChild(dot)
  
  return dot
}

/*
  // this.rect = createRect(this.game, this.sprite.x - 5, this.sprite.y - 5, this.sprite.width + 10, this.sprite.height + 10)
  // this.rect.inputEnabled = true
  // this.rect.events.onInputOver.add(() => console.warn('OVER'))
  
  // this.resize()
  // window.addEventListener('resize', () => this.resize())
* */

let COPY_IMAGE = null

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
    
    // this.copyCropImage = null
    this.init()
  }
  
  init() {
    this.drawBlock()
    window.addEventListener('resize', () => this.#resize())
    console.log('MAX_PIXELS:', this.#getAlphaRatio())
  }
  
  drawBlock = () => {
    if (window.matchMedia('(orientation: portrait)').matches) {
      this.sprite.position.set(this.spritePos.portrait.x, this.spritePos.portrait.y)
    }
  
    if (window.matchMedia('(orientation: landscape)').matches) {
      this.sprite.position.set(this.spritePos.landscape.x, this.spritePos.landscape.y)
    }
    
    this.bitmapData.draw(this.sprite)
  }
  
  update() {
    if (this.disabled) return
    if (this.game.input.activePointer.isDown) {

      this.#drawBlend()
      // this.#checkWin()
    }
    
    // if (this.game.input.activePointer.isUp) {
    //   if (this.#getAlphaRatio() > this.minAlphaRatio) {
    //     console.log('ВОССТАНОВЛЕНИЕ ТЕКСТУРЫ')
    //
    //     this.bitmapData.copyRect(this.sprite,
    //       this.#setRectArea(0, 0),
    //       this.currentPos.x,
    //       this.currentPos.y,
    //     )
    //   }
    // }
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
      this.disabled = true
      this.bitmapData.clear()
      // this.#clearRect()
    }
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
    const imageData = this.bitmapData.ctx.getImageData(x, y, this.bitmapData.width, this.bitmapData.width)
    
    const copyImage = new Image()
    copyImage.src = this.getImageURL(imageData, width, height)
    
    return new Promise(resolve => {
      copyImage.addEventListener('load', () => {
        resolve(copyImage)
      })
    })
  }
  
  #resize = () => {
    this.createCopyImage(this.sprite.x, this.sprite.y, this.sprite.width, this.sprite.height)
      .then((copyCropImage) => {
        this.bitmapData.context.clearRect(this.sprite.x, this.sprite.y, this.sprite.width, this.sprite.height)

        if (window.matchMedia('(orientation: portrait)').matches) {
          console.log('--- portrait --- ')
          this.sprite.position.set(this.spritePos.portrait.x, this.spritePos.portrait.y)
        }
        if (window.matchMedia('(orientation: landscape)').matches) {
          console.log('--- landscape --- ')
          this.sprite.position.set(this.spritePos.landscape.x, this.spritePos.landscape.y)
        }
        
        this.bitmapData.draw(copyCropImage, this.sprite.x, this.sprite.y)
      })
  }
}
