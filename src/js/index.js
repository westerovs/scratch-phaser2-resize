import Scratch from './modules/Scratch.js'

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

    const sprite1 = this.game.make.image(0, 0, 'block1')
    sprite1._pos = this.Positions.pos1
    sprite1.key = 'block1'

    const sprite2 = this.game.make.image(0, 0, 'block2')
    sprite2._pos = this.Positions.pos2
    sprite2.key = 'block2'

    const sprite3 = this.game.make.image(0, 0, 'block3')
    sprite3._pos = this.Positions.pos3
    sprite3.key = 'block3'

    this.scratch = new Scratch({
      game: this.game,
      key: 'block2',
      minRemainingPercent: 50,
      sprites: [sprite1, sprite2, sprite3]
    })
  }

  update = () => {
    this.scratch.update()
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


