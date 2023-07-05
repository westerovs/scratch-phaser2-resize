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

    this.init()
  }

  init() {

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
  //   this.bitmapData.destroy()
  // }

  #pointerdown = () => {
    this.views.forEach(view => {
      this.currentSprite = view.checkPointerDown()

      if (this.currentSprite) {
        this.#drawBlend()
        this.#checkWin(view)
        view.showLog()
      }
    })
  }

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

  #checkWin = (view) => {
    // if (!this.minRemainingPercent) return

    // if (this.#getAlphaRatio() < this.valuePercentToWin) {
    //   console.warn(this.key, 'WIN & DESTROY')
    //   this.destroy()
    // }
  }

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

