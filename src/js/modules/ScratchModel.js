export default class ScratchModel {
  get data() {
    return {
      sprite1: {
        position: {
          landscape: {
            x: 0,
            y: 0,
          },
          portrait: {
            x: 200,
            y: 200,
          },
        },
        key: 'block1',
        valuePercentToWin: null,
        minRemainingPercent: 30,
      },
      sprite2: {
        position: {
          landscape: {
            x: 200,
            y: 400,
          },
          portrait: {
            x: 400,
            y: 400,
          },
        },
        key: 'block2',
        valuePercentToWin: null,
        minRemainingPercent: 40,
      },
      sprite3: {
        position: {
          landscape: {
            x: 800,
            y: 200,
          },
          portrait: {
            x: 600,
            y: 800,
          },
        },
        key: 'block3',
        valuePercentToWin: null,
        minRemainingPercent: 50,
      },
    }
  }
}
