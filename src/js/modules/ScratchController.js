export default class ScratchController {
  constructor({
    game,
    bitmapData,
    views,
  }) {
    this.game = game
    this.views = views

    this.currentSprite = null
    this.brush = this.game.make.image(0, 0, 'brush')

    this.bitmapData = bitmapData

    this.isDestroyed = false
    this.valuePercentToWin = null

    this.init()
  }

  init() {
    console.log('init controller')
    this.views.forEach(view => {
      // this.bitmapData.draw(view)
      // view.alpha = 0
    })
    this.#initSignals()

    // Пример: get AlphaRatio стула = 48.5, делим это на 100(%) и умножаем на нужное мин. число
    // this.valuePercentToWin = (this.#getAlphaRatio() / 100) * this.minRemainingPercent
    // this.#showLog()
  }

  update() {
    // if (this.isDestroyed) return
    //
    // this.#pointerdown()
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

    // window.addEventListener('resize', () => this.#resize())
    // this.game.input.onUp.add(this.#pointerUp)
  }

  #pointerdown = () => {
    this.views.forEach(sprite => {

      if (sprite.input.pointerOver()) {
        if (this.game.input.activePointer.isDown && sprite.input.checkPointerDown(this.game.input.activePointer)) {
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

