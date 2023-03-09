import ScratchBlock from './modules/ScratchBlock.js'

class Game {
  constructor() {
    this.game = null
    
    this.scratch1 = null
    this.scratch2 = null
    this.scratch3 = null
    this.scratch4 = null
    
    this.group = null
  
    this.POS1 = {
      landscape: {
        x: 200,
        y: 200,
      },
      portrait: {
        x: 400,
        y: 400,
      },
    }
    this.POS2 = {
      landscape: {
        x: 0,
        y: 400,
      },
      portrait: {
        x: 600,
        y: 400,
      },
    }
    this.POS3 = {
      landscape: {
        x: 0,
        y: 600,
      },
      portrait: {
        x: 600,
        y: 600,
      },
    }
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
    this.game.load.image('bg', './src/img/bg.jpg')
    this.game.load.image('block1', './src/img/block1.png')
    this.game.load.image('block2', './src/img/block2.png')
    this.game.load.image('block3', './src/img/block3.png')
  }
  
  create = () => {
    this.game.factor = 1
    
    console.clear()
    this.game.add.image(0, 0, 'bg')
    this.coverSprite1 = this.game.make.sprite(0, 0, 'block1')
    this.coverSprite2 = this.game.make.sprite(0, 0, 'block2')
    this.coverSprite3 = this.game.make.sprite(0, 0, 'block3')
  
    // this.group = this.game.make.group()
    // this.group.add(this.coverSprite2)
    // this.bitmapData.drawGroup(this.group, this.coverSprite1)
    
    // create bitmapData
    this.bitmapData = this.game.make.bitmapData(1366, 1366)
    this.bitmapData.addToWorld(0, 0)

    this.scratch1 = new ScratchBlock({
      game: this.game,
      sprite: this.coverSprite1,
      minAlphaRatio: 0.01,
      bitmapData: this.bitmapData,
      spritePos: this.POS1
    })
    
    // this.scratch2 = new ScratchBlock({
    //   game: this.game,
    //   sprite: this.coverSprite2,
    //   minAlphaRatio: 0.01,
    //   bitmapData: this.bitmapData,
    //   spritePos: this.POS2
    // })
    
    // this.scratch3 = new ScratchBlock({
    //   game: this.game,
    //   sprite: this.coverSprite3,
    //   minAlphaRatio: 0.01,
    //   bitmapData: this.bitmapData,
    //   spritePos: this.POS3
    // })

    this.setPosition()
    window.addEventListener('resize', () => this.setPosition())
  }
  
  update = () => {
    this.scratch1?.update()
    this.scratch2?.update()
    this.scratch3?.update()
  }
  
  setPosition = () => {
    if (window.matchMedia('(orientation: portrait)').matches) {
      console.log('--- portrait --- ')
    }
    if (window.matchMedia('(orientation: landscape)').matches) {
      console.log('--- landscape --- ')
    }
  }
}

new Game().init()


