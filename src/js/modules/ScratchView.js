import {getOrientation} from '../utils/utils.js'

export default class ScratchView extends Phaser.Sprite {
  constructor(game, data) {
    super(game, 0, 0, data.key)

    this.game = game
    this.data = data
    this.sprite = this

    this.init()
  }

  init = () => {
    this.#setupSprite()
    this.#initSignals()
  }

  #setupSprite = () => {
    this.#setPositionSprite(getOrientation())
    // this.bitmapData.draw(this.sprite)
    this.sprite.inputEnabled = true
    this.sprite.input.priorityID = 0
    this.sprite.input.pixelPerfectOver = true
    this.sprite.input.pixelPerfectClick = true

    this.game.add.existing(this.sprite)

    this.sprite.events.onInputOver.add(() => {
      console.log(this.sprite.key, 'over')
      // this.game.scratchSignal.dispatch(sprite.key, this)
    })
  }

  #initSignals = () => {
    this.game.onResizeSignal.add((data) => this.#setPositionSprite(data))
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
}
