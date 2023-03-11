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
          x: 200,
          y: 200,
        },
        portrait: {
          x: 300,
          y: 300,
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
    
    this.prevScratchName = null
    this.currentScratchName = null
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
  }
  
  create = () => {
    this.game.factor = 1
    this.game.add.image(0, 0, 'bg')
    
    this.scratchBlock1 = new ScratchBlock({
      game: this.game,
      key: 'block1',
      minAlphaRatio: 0.01,
      spritePos: this.Positions.pos1
    })
    this.scratchBlock2 = new ScratchBlock({
      game: this.game,
      key: 'block2',
      minAlphaRatio: 0.01,
      spritePos: this.Positions.pos2
    })
    this.scratchBlock3 = new ScratchBlock({
      game: this.game,
      key: 'block3',
      minAlphaRatio: 0.01,
      spritePos: this.Positions.pos3
    })
  }
  
  update = () => {
    this.scratchBlock1?.update()
    this.scratchBlock2?.update()
    this.scratchBlock3?.update()
  }
  
  // todo incorrect operation !
  initSignals = () => {
    this.game.scratchSignal = new Phaser.Signal()
    this.game.scratchSignal.add((name, scratch) => {
      
      this.prevScratchName = this.currentScratchName
      this.currentScratchName = {
        name,
        scratch,
      }
  
      // if (this.prevScratchName === null) return
      // console.log('prev: ', this.prevScratchName, '/ current: ', this.currentScratchName)
      // this.prevScratchName.scratch.recoveryBlock()
    })
  }
}

new Game().init()


