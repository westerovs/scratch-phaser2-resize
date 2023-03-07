import Scratch from './Scratch.js'

class Game {
  constructor() {
    this.game = null
    
    this.scratch1 = null
    this.scratch2 = null
    this.scratch3 = null
    this.scratch4 = null
    
    this.group = null
    this.POS = {
      landscape: {
        x: 200,
        y: 200,
      },
      portrait: {
        x: 0,
        y: 0,
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
    console.clear()
    this.game.add.image(0, 0, 'bg')
    this.coverSprite1 = this.game.make.sprite(0, 0, 'block1')
    this.coverSprite2 = this.game.make.sprite(0, 0, 'block2')
    this.coverSprite3 = this.game.make.sprite(0, 300, 'block1')
    this.coverSprite4 = this.game.make.sprite(0, 300, 'block2')
  
    this.group = this.game.make.group()
    this.group.add(this.coverSprite2)
    
    // create bitmapData
    this.bitmapData = this.game.make.bitmapData(1366, 1366)
    this.bitmapData.addToWorld(0, 0)
    // this.bitmapData.fill(3, 111, 111, 0.3)
  
    // draw
    // this.bitmapData.drawGroup(this.group, this.coverSprite1)
    this.bitmapData.draw(this.coverSprite1)
    
    this.scratch1 = new Scratch({
      game: this.game,
      sprite: this.coverSprite1,
      minAlphaRatio: 0.015,
      bitmapData: this.bitmapData,
    })
    
    this.setPosition()
    window.addEventListener('resize', () => this.setPosition())
  }
  
  update = () => {
    if (this.game.input.activePointer.isDown) {
      this.scratch1?.draw()
      this.scratch2?.draw()
      this.scratch3?.draw()
      this.scratch4?.draw()
    }
    
    this.scratch1?.update()
    this.scratch2?.update()
    this.scratch3?.update()
    this.scratch4?.update()
  }
  
  getPosition = () => {
    let position = null
    if (window.matchMedia('(orientation: portrait)').matches) position = 'portrait'
    if (window.matchMedia('(orientation: landscape)').matches) position = 'landscape'
    
    return position
  }
  
  setPosition = () => {
    const width = this.coverSprite1.width
    const height = this.coverSprite1.height
    
    const rect = (x, y) => new Phaser.Rectangle(x, y, width, height)

    if (window.matchMedia('(orientation: portrait)').matches) {
      console.log('--- portrait --- ')
        this.bitmapData.copyRect(this.bitmapData, rect(width, height), this.POS.portrait.x, this.POS.portrait.y)
        this.bitmapData.clear(width, height, this.coverSprite1.width, this.coverSprite1.height)
    }
    if (window.matchMedia('(orientation: landscape)').matches) {
      console.log('--- landscape --- ')
        this.bitmapData.copyRect(this.bitmapData, rect(0, 0), this.POS.landscape.x, this.POS.landscape.y)
        this.bitmapData.clear(0, 0, this.coverSprite1.width, this.coverSprite1.height)

    }
  }
}

new Game().init()


