import {getOrientation, getImageURL} from '../utils/utils.js'

export default class ScratchView extends Phaser.Sprite {
  constructor(game, bitmapData, data) {
    super(game, 0, 0, data.key)

    this.game = game
    this.bitmapData = bitmapData
    this.data = data

    this.sprite = this
    this.sprite._data = data

    this.init()
  }

  init() {
    this.#initSignals()
    this.#setupSprite()
    this.#drawBitmapDataCopySprite()
  }

  update = () => {

  }

  checkPointerPress = () => {
    if (this.sprite.input.pointerOver()) {
      if (this.game.input.activePointer.isDown && this.sprite.input.checkPointerDown(this.game.input.activePointer)) {
        console.log(this.sprite.key, 'pointer is pressed')

        return this.sprite
      }
    }
  }

  #setupSprite = () => {
    this.#setPositionSprite(getOrientation())
    this.sprite.inputEnabled = true
    this.sprite.input.priorityID = 0
    this.sprite.input.pixelPerfectOver = true
    this.sprite.input.pixelPerfectClick = true
    this.game.add.existing(this.sprite)

    this.sprite.events.onInputOver.add(() => {
      console.log(this.sprite.key, 'is over')
      // this.game.scratchSignal.dispatch(this.sprite.key, this)
    })
  }

  // рисует копию изображения на канвасе, поверх основного спрайта, который в этот момент alpha = 0
  #drawBitmapDataCopySprite = () => {
    this.bitmapData.draw(this.sprite)
    this.sprite.alpha = 0.2
  }

  #initSignals = () => {
    this.game.onResizeSignal.add((orientation) => this.#resize(orientation))
  }

  /* при ресайзе обновить позицию спрайта
    создать на основе даты новое IMG
    дождаться его загрузки и создать из него canvas image
  */
  #resize = (orientation) => {
    this.#drawCopyImage(orientation)
  }

  // [1] вырезать участок канваса, где позиционируется спрайт и вернуть новое Image
  #captureSpriteImage = () => {
    const {x, y, width, height} = this.sprite
    const imageData = this.bitmapData.ctx.getImageData(x, y, width, height)

    const copyImage = new Image()
    // получает Data url из участка канваса, которое устанавливается как src для Image
    copyImage.src = getImageURL(imageData, width, height)

    return new Promise(resolve => {
      copyImage.addEventListener('load', () => resolve(copyImage))
    })
  }

  // [2] рисует новую копию спрайта на основе захваченной ранее и позиционирует её поверх спрайта
  #drawCopyImage = async (orientation) => {
    const copyCropImage = await this.#captureSpriteImage()

    this.bitmapData.context.clearRect(this.sprite.x, this.sprite.y, this.sprite.width, this.sprite.height)
    this.#setPositionSprite(orientation)
    this.bitmapData.draw(copyCropImage, this.sprite.x, this.sprite.y)
  }

  #setPositionSprite = (orientation) => {
    switch (orientation) {
      case 'portrait': {
        const {x, y} = this.data.position.portrait
        this.sprite.position.set(x, y)
        break
      }
      case 'landscape': {
        const {x, y} = this.data.position.landscape
        this.sprite.position.set(x, y)
        break
      }
    }
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
}
