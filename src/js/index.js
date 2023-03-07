import Scratch from './Scratch.js'

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
        x: 400,
        y: 400,
      },
      portrait: {
        x: 0,
        y: 0,
      },
    }
    this.POS2 = {
      landscape: {
        x: 600,
        y: 400,
      },
      portrait: {
        x: 0,
        y: 200,
      },
    }
    this.POS3 = {
      landscape: {
        x: 600,
        y: 600,
      },
      portrait: {
        x: 0,
        y: 400,
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
    this.game.load.image('block0', './src/img/block0.png')
    this.game.load.image('block1', './src/img/block1.png')
    this.game.load.image('block2', './src/img/block2.png')
  }
  
  create = () => {
    this.game.factor = 1
    
    console.clear()
    this.game.add.image(0, 0, 'bg')
    this.coverSprite1 = this.game.make.sprite(null, null, 'block1')
    this.coverSprite2 = this.game.make.sprite(null, null, 'block2')
    this.coverSprite3 = this.game.make.sprite(null, null, 'block1')
    this.coverSprite4 = this.game.make.sprite(null, null, 'block2')
  
    // this.group = this.game.make.group()
    // this.group.add(this.coverSprite2)
    // this.bitmapData.drawGroup(this.group, this.coverSprite1)
    
    // create bitmapData
    this.bitmapData = this.game.make.bitmapData(1366, 1366)
    this.bitmapData.addToWorld(0, 0)
  
    this.scratch1 = new Scratch({
      game: this.game,
      sprite: this.coverSprite1,
      minAlphaRatio: 0.015,
      bitmapData: this.bitmapData,
      position: this.POS1
    })
    
    this.scratch2 = new Scratch({
      game: this.game,
      sprite: this.coverSprite2,
      minAlphaRatio: 0.015,
      bitmapData: this.bitmapData,
      position: this.POS2
    })
    
    this.scratch3 = new Scratch({
      game: this.game,
      sprite: this.coverSprite1,
      minAlphaRatio: 0.015,
      bitmapData: this.bitmapData,
      position: this.POS3
    })
  }
  
  update = () => {
    this.scratch1?.update()
    this.scratch2?.update()
    this.scratch3?.update()
    this.scratch4?.update()
  }
}

new Game().init()

