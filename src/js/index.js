import {getOrientation} from './utils/utils.js'
import ScratchModel from './modules/ScratchModel.js'
import ScratchView from './modules/ScratchView.js'
import ScratchController from './modules/ScratchController.js'

class Game {
  constructor() {
    this.game = null
    this.scratchController = null

    this.currentScratchData = null
    this.prevScratchData = null
  }

  init() {
    this.game = new Phaser.Game(
      1366,
      1366,
      Phaser.CANVAS,
      null,
      {
        preload: this.preload,
        create: this.create,
        update: this.update,
      })
  }

  preload = () => {
    this.game.load.image('bg', './src/img/bg.png')
    this.game.load.image('brush', './src/img/brush.png')
    this.game.load.image('block1', './src/img/block1.png')
    this.game.load.image('block2', './src/img/block2.png')
    this.game.load.image('block3', './src/img/block3.png')
    this.game.load.image('chair', './src/img/chair.png')
  }

  create = () => {
    this.game.add.image(0, 0, 'bg')
    this.#initSignals()

    const bitmapData = this.game.make.bitmapData(1366, 1366)
    // this.bitmapData.rect(0, 0, this.bitmapData.width, this.bitmapData.height, 'rgba(255, 0, 0, 0.5)')
    bitmapData.addToWorld(0, 0)

    const model = new ScratchModel()

    const view1 = new ScratchView(this.game, bitmapData, model.data.sprite1)
    const view2 = new ScratchView(this.game, bitmapData, model.data.sprite2)
    const view3 = new ScratchView(this.game, bitmapData, model.data.sprite3)

    this.scratchController = new ScratchController({
      game: this.game,
      bitmapData: bitmapData,
      views: [view1, view2, view3]
    })
  }

  update = () => {
    this.scratchController.update()
  }

  #initSignals = () => {
    window.addEventListener('resize', () => {
      const isLandscape = getOrientation()
      this.game.onResizeSignal.dispatch(isLandscape)
    })
    // init
    this.game.scratchSignal = new Phaser.Signal()
    this.game.onResizeSignal = new Phaser.Signal()
    // add
    this.game.scratchSignal.add(this.#prevElementAction)
  }

  #prevElementAction = (name, scratch) => {
    const data = {name, scratch,}

    // если требуется восстановление предыдущего, если он не удален,
    // а стирать начали новый
    if (this.prevScratchData) {
      // this.prevScratchData.scratch.recovery()
    }

    this.currentScratchData = data
    this.prevScratchData = this.currentScratchData
  }
}

new Game().init()


