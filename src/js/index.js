import ScratchBlock from './modules/ScratchBlock.js'

class Game {
  constructor() {
    this.game = null

    this.scratchBlock1 = null
    this.scratchBlock2 = null
    this.scratchBlock3 = null

    this.Positions = {
      pos1: {
        landscape: {
          x: 0,
          y: 0,
        },
        portrait: {
          x: 200,
          y: 200,
        },
      },
      pos2: {
        landscape: {
          x: 200,
          y: 400,
        },
        portrait: {
          x: 400,
          y: 400,
        },
      },
      pos3: {
        landscape: {
          x: 800,
          y: 200,
        },
        portrait: {
          x: 600,
          y: 800,
        },
      },
    }

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
    this.game.factor = 1
    this.game.add.image(0, 0, 'bg')

    this.#initSignals()
    // this.scratchBlock1 = new ScratchBlock({
    //   game: this.game,
    //   key: 'chair',
    //   minRemainingPercent: 20,
    //   spritePos: this.Positions.pos1
    // })
    this.scratchBlock2 = new ScratchBlock({
      game: this.game,
      key: 'block2',
      minRemainingPercent: 20,
      spritePos: this.Positions.pos2
    })
    // this.scratchBlock3 = new ScratchBlock({
    //   game: this.game,
    //   key: 'block3',
    //   minRemainingPercent: 20,
    //   spritePos: this.Positions.pos3
    // })
  }

  update = () => {
    this.scratchBlock1?.update()
    this.scratchBlock2?.update()
    this.scratchBlock3?.update()
  }

  #initSignals = () => {
    // init
    this.game.scratchSignal = new Phaser.Signal()
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


