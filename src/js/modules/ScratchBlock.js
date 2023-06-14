export default class ScratchBlock {
  constructor({
    game,
    atlas,
    key,
    minRemainingPercent = 0,
    spritePos,
    callBack,
  }) {
    this.game = game
    this.atlas = atlas
    this.key = key
    this.minRemainingPercent = minRemainingPercent
    this.spritePos = spritePos
    this.callBack = callBack

    this.bitmapData = this.game.make.bitmapData(1366, 1366)
    this.bitmapData.addToWorld(0, 0)

    this.sprite = this.game.make.image(0, 0, key)
    this.brush = this.game.make.image(0, 0, 'brush')

    this.isDestroyed = false
    this.valuePercentToWin = null

    this.init()
  }

  init() {
    this.#initializeSprite()
    this.#initSignals()

    // Пример: getAlphaRatio стула = 48.5, делим это на 100(%) и умножаем на нужное мин. число
    this.valuePercentToWin = (this.#getAlphaRatio() / 100) * this.minRemainingPercent
    this.#showLog()
  }

  update() {
    if (this.isDestroyed) return

    this.#pointerdown()
  }

  recovery = () => {
    this.sprite.alpha = 1
    this.bitmapData.context.clearRect(this.sprite.x, this.sprite.y, this.sprite.width, this.sprite.height)
    this.bitmapData.draw(this.sprite, this.sprite.x, this.sprite.y)
  }

  destroy = () => {
    const cloneSprite = this.#createCloneSprite()

    this.isDestroyed = true
    this.game.input.onUp.remove(this.#pointerUp)
    this.sprite.inputEnabled = false
    this.sprite.alpha = 0
    this.bitmapData.context.clearRect(this.sprite.x, this.sprite.y, this.sprite.width, this.sprite.height)

    this.game.add.tween(cloneSprite)
      .to({alpha: 0}, 250, Phaser.Easing.Linear.None, true)
  }

  #initializeSprite = () => {
    this.#setPositionSprite()
    this.bitmapData.draw(this.sprite)
    this.sprite.inputEnabled = true
    this.sprite.input.priorityID = 0
    this.sprite.input.pixelPerfectOver = true
    this.sprite.input.pixelPerfectClick = true

    this.game.world.add(this.sprite)
    this.sprite.events.onInputOver.add(() => {
      this.game.scratchSignal.dispatch(this.sprite.key, this)
    })
  }

  #initSignals = () => {
    window.addEventListener('resize', () => this.#resize())
    this.game.input.onUp.add(this.#pointerUp)
  }

  #pointerdown = () => {
    if (this.sprite.input.pointerOver()) {
      if (this.game.input.activePointer.isDown) {
        this.sprite.alpha = 0

        this.#drawBlend()
        this.#checkWin()
        // this.#showLog()
      }
    }
  }

  #pointerUp = () => {
    if (this.#getAlphaRatio() > this.minRemainingPercent) {
      this.recovery()
      this.#showLog()
    }
  }

  #drawBlend = () => {
    const cursorX = this.game.input.worldX / this.game.factor
    const cursorY = this.game.input.worldY / this.game.factor

    this.bitmapData.blendDestinationOut()
    this.bitmapData.circle(cursorX, cursorY, 50, 'blue')
    // const offset = {
    //   x: this.brush.width / 2,
    //   y: this.brush.height / 2
    // }
    // this.bitmapData.draw(this.brush, cursorX - offset.x, cursorY - offset.y)

    this.bitmapData.blendReset()
    this.bitmapData.dirty = true
  }

  #getAlphaRatio = () => {
    const {ctx} = this.bitmapData
    const imageData = ctx.getImageData(this.sprite.x, this.sprite.y, this.sprite.width, this.sprite.height)
    const pixelData = imageData.data

    const alphaPixels = pixelData.reduce((count, value, index) => {
      // index 0(R), 1(G), 2(B) 3(A)
      // value > 0 проверяет, является ли значение альфа-канала пикселя больше 0.
      // Если значение больше 0, это означает, что пиксель непрозрачный.
      if (index % 4 === 3 && value > 0) {
        count++
      }
      return count
    }, 0)

    return +((alphaPixels / (this.sprite.width * this.sprite.height)) * 100).toFixed(1)
  }

  #checkWin = () => {
    // if (!this.minRemainingPercent) return

    if (this.#getAlphaRatio() < this.valuePercentToWin) {
      console.warn(this.key, 'WIN & DESTROY')
      this.destroy()
    }
  }

  #getImageURL = (imgData, width, height) => {
    const newCanvas = document.createElement('canvas')
    const ctx = newCanvas.getContext('2d')
    newCanvas.width = width
    newCanvas.height = height

    ctx.putImageData(imgData, 0, 0)
    return newCanvas.toDataURL() //image URL
  }

  #createCopyImage = (x, y, width, height) => {
    const imageData = this.bitmapData.ctx.getImageData(x, y, this.sprite.width, this.sprite.height)

    const copyImage = new Image()
    copyImage.src = this.#getImageURL(imageData, width, height)

    return new Promise(resolve => {
      copyImage.addEventListener('load', () => resolve(copyImage))
    })
  }

  #drawCopyImage = async () => {
    const copyCropImage = await this.#createCopyImage(
      this.sprite.x,
      this.sprite.y,
      this.sprite.width,
      this.sprite.height
    )

    this.bitmapData.context.clearRect(this.sprite.x, this.sprite.y, this.sprite.width, this.sprite.height)
    this.#setPositionSprite()
    this.bitmapData.draw(copyCropImage, this.sprite.x, this.sprite.y)
  }

  #resize = async () => {
    this.#drawCopyImage()
  }

  #setPositionSprite = () => {
    if (window.matchMedia('(orientation: portrait)').matches) {
      this.sprite.position.set(this.spritePos.portrait.x, this.spritePos.portrait.y)
    }
    if (window.matchMedia('(orientation: landscape)').matches) {
      this.sprite.position.set(this.spritePos.landscape.x, this.spritePos.landscape.y)
    }
  }

  #showLog = () => {
    console.log(`----------- ${this.key} ----------- `)
    console.log('getAlphaRatio:', this.#getAlphaRatio())
    console.log('valuePercentToWin: ', this.valuePercentToWin)
    console.log('minRemainingPercent: ', this.minRemainingPercent)
    console.log('')
  }

  // нужно для плавного исчезания
  #createCloneSprite = () => {
    const cloneBitmapData = this.game.add.bitmapData(this.bitmapData.width, this.bitmapData.height)
    cloneBitmapData.copy(this.bitmapData)

    const cloneSprite = this.game.add.sprite(0, 0, cloneBitmapData)
    cloneSprite.width = this.sprite.width
    cloneSprite.height = this.sprite.height
    cloneSprite.scale.setTo(this.sprite.scale.x, this.sprite.scale.y)

    return cloneSprite
  }
}

