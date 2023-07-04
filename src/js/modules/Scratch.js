export default class Scratch {
  constructor({
    game,
    atlas,
    minRemainingPercent = 0,
    callBack,
    sprites
  }) {
    this.game = game
    this.atlas = atlas
    this.minRemainingPercent = minRemainingPercent
    this.callBack = callBack
    this.sprites = sprites

    this.bitmapData = this.game.make.bitmapData(1366, 1366)
    // this.bitmapData.rect(0, 0, this.bitmapData.width, this.bitmapData.height, 'rgba(255, 0, 0, 0.5)')
    this.bitmapData.addToWorld(0, 0)

    this.currentSprite = null
    this.brush = this.game.make.image(0, 0, 'brush')

    this.isDestroyed = false
    this.valuePercentToWin = null

    this.init()
  }

  init() {
    this.createSprites()
    this.#initSignals()
  }

  createSprites = () => {
    this.sprites.forEach(sprite => this.#initializeSprite(sprite))
  }

  #initializeSprite = (sprite) => {
    this.#setPositionSprite(sprite)
    this.bitmapData.draw(sprite)
    sprite.inputEnabled = true
    sprite.input.priorityID = 0
    sprite.input.pixelPerfectOver = true
    sprite.input.pixelPerfectClick = true
    sprite.alpha = 0.2

    this.game.world.add(sprite)
    sprite.events.onInputOver.add(() => {
      console.log(sprite.key, 'over')
      // this.game.scratchSignal.dispatch(sprite.key, this)
    })

    // Пример: get AlphaRatio стула = 48.5, делим это на 100(%) и умножаем на нужное мин. число
    // this.valuePercentToWin = (this.#getAlphaRatio() / 100) * this.minRemainingPercent
    // this.#showLog()
  }

  update() {
    if (this.isDestroyed) return

    this.#pointerdown()
  }

  // recovery = () => {
  //   this.currentSprite.alpha = 1
  //   this.bitmapData.context.clearRect(this.currentSprite.x, this.currentSprite.y, this.currentSprite.width, this.currentSprite.height)
  //   this.bitmapData.draw(this.currentSprite, this.currentSprite.x, this.currentSprite.y)
  // }

  // destroy = () => {
  //   const cloneSprite = this.#createCloneSprite()
  //
  //   this.isDestroyed = true
  //   this.game.input.onUp.remove(this.#pointerUp)
  //   this.currentSprite.inputEnabled = false
  //   this.currentSprite.alpha = 0
  //   this.bitmapData.context.clearRect(this.currentSprite.x, this.currentSprite.y, this.currentSprite.width, this.currentSprite.height)
  //
  //   this.game.add.tween(cloneSprite)
  //     .to({alpha: 0}, 250, Phaser.Easing.Linear.None, true)
  // }

  #initSignals = () => {
    window.addEventListener('resize', () => this.#resize())
    // this.game.input.onUp.add(this.#pointerUp)
  }

  #pointerdown = () => {
    this.sprites.forEach(sprite => {

      if (sprite.input.pointerOver()) {
        if (this.game.input.activePointer.isDown) {
          console.log(sprite.key, 'is down')
          this.currentSprite = sprite

          sprite.alpha = 0

          this.#drawBlend()
          // this.#checkWin()
          // this.#showLog()
        }
      }
    })

  }

  // #pointerUp = () => {
  //   if (this.#getAlphaRatio() > this.minRemainingPercent) {
  //     this.recovery()
  //     this.#showLog()
  //   }
  // }

  #drawBlend = () => {
    const cursorX = this.game.input.worldX / this.game.factor
    const cursorY = this.game.input.worldY / this.game.factor

    this.bitmapData.blendDestinationOut()
    // this.bitmapData.circle(cursorX, cursorY, 50, 'blue')
    const offset = {
      x: this.brush.width / 2,
      y: this.brush.height / 2
    }
    this.bitmapData.draw(this.brush, cursorX - offset.x, cursorY - offset.y)

    this.bitmapData.blendReset()
    this.bitmapData.dirty = true
  }

  #getAlphaRatio = () => {
    const {ctx} = this.bitmapData
    const imageData = ctx.getImageData(this.currentSprite.x, this.currentSprite.y, this.currentSprite.width, this.currentSprite.height)
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

    return +((alphaPixels / (this.currentSprite.width * this.currentSprite.height)) * 100).toFixed(1)
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

  #createCopyImage = ({x, y, width, height}) => {
    const imageData = this.bitmapData.ctx.getImageData(x, y, width, height)

    const copyImage = new Image()
    copyImage.src = this.#getImageURL(imageData, width, height)

    return new Promise(resolve => {
      copyImage.addEventListener('load', () => resolve(copyImage))
    })
  }

  #drawCopyImage = async (sprite) => {
    const copyCropImage = await this.#createCopyImage(sprite)

    this.bitmapData.context.clearRect(sprite.x, sprite.y, sprite.width, sprite.height)
    this.#setPositionSprite(sprite)
    this.bitmapData.draw(copyCropImage, sprite.x, sprite.y)
  }

  #resize = async () => {
    this.sprites.forEach(sprite => this.#drawCopyImage(sprite))
  }

  #setPositionSprite = (sprite) => {
    if (window.matchMedia('(orientation: portrait)').matches) {
      console.log('portrait')
      sprite.position.set(sprite._pos.portrait.x, sprite._pos.portrait.y)
    }
    if (window.matchMedia('(orientation: landscape)').matches) {
      console.log('landscape')
      sprite.position.set(sprite._pos.landscape.x, sprite._pos.landscape.y)
    }
  }

  // #showLog = () => {
  //   console.log(`----------- ${this.key} ----------- `)
  //   console.log('getAlphaRatio:', this.#getAlphaRatio())
  //   console.log('valuePercentToWin: ', this.valuePercentToWin)
  //   console.log('minRemainingPercent: ', this.minRemainingPercent)
  //   console.log('')
  // }

  // нужно для плавного исчезания
  // #createCloneSprite = () => {
  //   const cloneBitmapData = this.game.add.bitmapData(this.bitmapData.width, this.bitmapData.height)
  //   cloneBitmapData.copy(this.bitmapData)
  //
  //   const cloneSprite = this.game.add.sprite(0, 0, cloneBitmapData)
  //   cloneSprite.width = this.currentSprite.width
  //   cloneSprite.height = this.currentSprite.height
  //   cloneSprite.scale.setTo(this.currentSprite.scale.x, this.currentSprite.scale.y)
  //
  //   return cloneSprite
  // }
}

