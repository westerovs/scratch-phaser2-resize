export default class ScratchView extends Phaser.Sprite {
  constructor(game, data) {
    super(game, 0, 0, data.key)
    console.log(data.key)

    this.game = game
    this.data = data
    this.sprite = this

    this.init()
  }

  init = () => {
    this.#setupInteractiveSprite()
    this.#setPositionSprite()
    this.#initSignals()
  }

  #setupInteractiveSprite = () => {
    // this.#setPositionSprite(this.sprite)
    // this.bitmapData.draw(this.sprite)
    this.sprite.inputEnabled = true
    this.sprite.input.priorityID = 0
    this.sprite.input.pixelPerfectOver = true
    this.sprite.input.pixelPerfectClick = true
    // this.sprite.alpha = 0.2

    this.game.add.existing(this.sprite)

    this.sprite.events.onInputOver.add(() => {
      console.log(this.sprite.key, 'over')
      // this.game.scratchSignal.dispatch(sprite.key, this)
    })
  }

  #initSignals = () => {
    this.game.onResizeSignal.add(this.#setPositionSprite)
  }

  #setPositionSprite = () => {
    if (window.matchMedia('(orientation: portrait)').matches) {
      const {x, y} = this.data.position.portrait
      this.sprite.position.set(x, y)
    }
    if (window.matchMedia('(orientation: landscape)').matches) {
      const {x, y} = this.data.position.landscape
      this.sprite.position.set(x, y)
    }
  }
}
