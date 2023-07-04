import {getOrientation} from './utils/utils.js'
import ScratchModel from './modules/ScratchModel.js'
import ScratchView from './modules/ScratchView.js'
import ScratchController from './modules/ScratchController.js'

class Game {
  constructor() {
    this.game = null

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

    const model = new ScratchModel()

    const block1 = new ScratchView(this.game, model.data.sprite1)
    const block2 = new ScratchView(this.game, model.data.sprite2)
    const block3 = new ScratchView(this.game, model.data.sprite3)
    // this.scratch = new ScratchController({
    //   game: this.game,
    //   key: 'block2',
    //   minRemainingPercent: 50,
    //   sprites: [sprite1, sprite2, sprite3]
    // })
  }

  update = () => {
    // this.scratch.update()
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
    this.game.onResizeSignal.add((data) => console.log(data))
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


