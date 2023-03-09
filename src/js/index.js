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
        x: 100,
        y: 100,
      },
    }
    this.POS2 = {
      landscape: {
        x: 600,
        y: 200,
      },
      portrait: {
        x: 600,
        y: 600,
      },
    }
    this.POS3 = {
      landscape: {
        x: 800,
        y: 200,
      },
      portrait: {
        x: 600,
        y: 800,
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
    this.game.load.image('bg', './src/img/bg.png')
    this.game.load.image('bg2', './src/img/bg2.jpg')
    this.game.load.image('block1', './src/img/block1.png')
    this.game.load.image('block2', './src/img/block2.png')
    this.game.load.image('block3', './src/img/block3.png')
  }
  
  create = () => {
    this.game.factor = 1
    
    console.clear()
    this.coverSprite1 = this.game.make.sprite(0, 0, 'block1')
    this.coverSprite2 = this.game.make.sprite(0, 0, 'block2')
    this.coverSprite3 = this.game.make.sprite(0, 0, 'block3')

    // create bitmapData
    this.bitmapData = this.game.make.bitmapData(600, 600)
    this.bitmapData.addToWorld(0, 0)
    this.bitmapData.draw('bg2', 0, 0)
  
    // ------------------------------------------------------
    const getImageURL = (imgData, width, height) => {
      const newCanvas = document.createElement('canvas')
      const ctx = newCanvas.getContext('2d')
      newCanvas.width = width
      newCanvas.height = height
    
      ctx.putImageData(imgData, 0, 0)
      return newCanvas.toDataURL() //image URL
    }
  
    const createCopyImage = (x, y, width, height) => {
      const imageData = this.bitmapData.ctx.getImageData(x, y, this.bitmapData.width, this.bitmapData.width)
    
      const copyImage = new Image()
      copyImage.src = getImageURL(imageData, width, height)
    
      return new Promise(resolve => {
        copyImage.addEventListener('load', () => {
          resolve(copyImage)
        })
      })
    
    }
  
    createCopyImage(0, 0, 200, 200)
      .then((image) => {
        this.bitmapData.draw(this.coverSprite1, 0, 0)
        this.bitmapData.draw(image, 100, 100)
      })
    // ------------------------------------------------------

  
    
    // this.scratchBlock1 = new ScratchBlock({
    //   game: this.game,
    //   sprite: this.coverSprite1,
    //   minAlphaRatio: 0.01,
    //   bitmapData: this.bitmapData,
    //   spritePos: this.POS1
    // })

    // this.scratch2 = new ScratchBlock({
    //   game: this.game,
    //   sprite: this.coverSprite2,
    //   minAlphaRatio: 0.01,
    //   bitmapData: this.bitmapData,
    //   spritePos: this.POS2
    // })
    //
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
    this.scratchBlock1?.update()
    this.scratchBlock2?.update()
    this.scratchBlock3?.update()
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


