const view = {
  renderBlocks () {
    let blocksHTML = ''

    for (let i = 1; i <= 9; i++){
      blocksHTML += `<div class="block" data-index="${i}"></div>`
    }

    document.querySelector('#game-area').innerHTML = blocksHTML
  },

  draw(element, shape) {
    const addedHTML = `<img src="${shape}.png" alt="${shape}">`

    element.innerHTML += addedHTML
  },

  renderEnding (gameResult) {
    const thisGameResult = gameResult
    const gameEnd = document.querySelector('#render-end')


    if (thisGameResult === '壞魚贏'){
      gameEnd.innerHTML += `
      <div id="game-end">
        <img src="fishwin.png" alt="">
        <div>
          <h3>喔不...卡片被壞魚搶走了！</h3>
          <button id="play-again">再玩一次</button>
        </div>
      </div>
        `

      document.querySelector('#play-again').addEventListener('click', ()=>{
        gameEnd.innerHTML = ''
        controller.resetGame()
      })
    } else if (thisGameResult === '小鳥贏'){
      gameEnd.innerHTML += `
      <div id="game-end">
        <img src="birdwin.png" alt="">
        <div>
          <h3>正義果然會勝利的！快去看看卡片吧！</h3>
          <button id="play-again">再玩一次</button>
          <button id="card-link"><a href="https://1drv.ms/u/s!ArT8WGnw20SBgc5H4x-33UWg-2XWSg?e=nnF2PQ">看卡片去！</a></button>
        </div>
      </div>
        `

      document.querySelector('#play-again').addEventListener('click', () => {
        gameEnd.innerHTML = ''
        controller.resetGame()
      })

    } else {
      gameEnd.innerHTML += `
      <div id="game-end">
        <img src="even.png" alt="">
        <div>
          <h3>嗚嗚！就差一點點...再挑戰一次吧！</h3>
          <button id="play-again">再玩一次</button>
        </div>
      </div>
        `

      document.querySelector('#play-again').addEventListener('click', () => {
        gameEnd.innerHTML = ''
        controller.resetGame()
      })
    }

  },
}

const model = {
  stepCount: 0,

  birdPosition: [],

  fishPosition: [],

  emptyPosition: [1, 2, 3, 4, 5, 6, 7, 8, 9],

  successGroups: [[1, 2, 3], [4, 5, 6], [7, 8, 9], [1, 4, 7], [2, 5, 8], [3, 6, 9], [1, 5, 9], [3, 5, 7]],
}

const controller = {
  gameModeControl (gameMode) {
    const thisGameMode = gameMode
    if (thisGameMode === 'onePlayer'){
      controller.resetGame()
      controller.startOnePlayerMode()
    } else if (thisGameMode === 'twoPlayers'){
      controller.resetGame()
      controller.startTwoPlayersMode()
    }
  },
 
  startTwoPlayersMode () {
    
    const blocks = document.querySelectorAll('.block')

    blocks.forEach((block) => { block.addEventListener('click', function blockClicked (event) {
        const target = event.target
        const index = Number(target.dataset.index)
        
        if (!target.matches('.block')) return 

        model.stepCount += 1
      
        if (model.stepCount % 2 === 0){
          view.draw(target, 'fish')
          model.fishPosition.push(index)
          model.emptyPosition.splice(model.emptyPosition.indexOf(index), 1)
         } else {
           view.draw(target, 'bird')
           model.birdPosition.push(index)
           model.emptyPosition.splice(model.emptyPosition.indexOf(index), 1)
         }

        // 判斷輸贏
        controller.twoPlayersModeDetermineWinner()

      })
    })
    
  },

  startOnePlayerMode (){
    const blocks = document.querySelectorAll('.block')

    blocks.forEach((block) => {
      block.addEventListener('click', function blockClicked(event) {
        const target = event.target
        const index = Number(target.dataset.index)

        if (!target.matches('.block')) return
        
        // 人類
        view.draw(target, 'bird')
        model.birdPosition.push(index)
        model.emptyPosition.splice(model.emptyPosition.indexOf(index), 1)
        model.stepCount += 1
        
        // 電腦
        if(model.stepCount < 9){
          setTimeout(controller.computerPlay, 1000)
        }
        

        // 判斷輸贏
        setTimeout(controller.onePlayerModeDetermineWinner, 1000)
        // controller.onePlayerModeDetermineWinner()
  

      })
    })
  },

  computerPlay () {
    const nextPosition = controller.determineComputerNextStep()
    view.draw(document.querySelectorAll('.block')[nextPosition - 1], 'fish')
    model.fishPosition.push(nextPosition)
    model.emptyPosition.splice(model.emptyPosition.indexOf(nextPosition), 1)
    model.stepCount += 1
  },
  
  willWin (fakeEmptyPosition) {

    for (let i = 0; i < fakeEmptyPosition.length; i++){
      const fakeFishPosition = Array.from(model.fishPosition)
      fakeFishPosition.push(fakeEmptyPosition[i])
      
      if (this.lineFormed(fakeFishPosition)){
        return fakeEmptyPosition[i]
      }

    }
    
    return false
  },

  willLose (fakeEmptyPosition) {
    for (position of fakeEmptyPosition){
      const fakeBirdPosition = Array.from(model.birdPosition)
      fakeBirdPosition.push(position)

      if (this.lineFormed(fakeBirdPosition)){
          return position
        }
      }

    return false

  },

  determineComputerNextStep () {
    const fakeEmptyPosition = Array.from(model.emptyPosition)
    
    // 會贏
    if (this.willWin(fakeEmptyPosition)){
      return this.willWin(fakeEmptyPosition)
    }
  
    // 會輸
    if (this.willLose(fakeEmptyPosition)){
      return this.willLose(fakeEmptyPosition)
    }


    // 鄰近的
    

    // 中間
    if (model.emptyPosition.includes(5)){
      return 5
    }

    // random
    const selectedIndex = Math.floor(Math.random()*fakeEmptyPosition.length)
    return fakeEmptyPosition[selectedIndex]
  
  },

  lineFormed (playerPosition) {
    
    for (const group of model.successGroups){
      if ( group.every((element)=> playerPosition.includes(element))){
        return true
      }   
    }

    return false
  },

  twoPlayersModeDetermineWinner () {

    if (this.lineFormed(model.fishPosition)){
      this.resetGame()
      this.startTwoPlayersMode()
      return alert('壞魚獲勝')
    } else if (this.lineFormed(model.birdPosition)){
      this.resetGame()
      this.startTwoPlayersMode()
      return alert('小鳥獲勝')
    }
    
    if(model.stepCount === 9){
      this.resetGame()
      this.startTwoPlayersMode()
      return alert('平手!再try一局吧！')
    } 
  },

  onePlayerModeDetermineWinner() {

    if (controller.lineFormed(model.birdPosition)) {
      view.renderEnding('小鳥贏')
      return alert('小鳥獲勝！')
    } else if (controller.lineFormed(model.fishPosition)) {
      view.renderEnding('壞魚贏')
      return alert('壞魚獲勝')
    }
   

    if (model.stepCount === 9) {
      view.renderEnding('平手')
      return alert('哎呀...平手了...')
    }
  },

  resetGame (){
    model.stepCount = 0
    model.birdPosition = []
    model.fishPosition = []
    model.emptyPosition = [1, 2, 3, 4, 5, 6, 7, 8, 9]
    view.renderBlocks()
  },


}


view.renderBlocks()
const buttons = document.querySelector('.buttons')
const header = document.querySelector('.header')
buttons.addEventListener('click', (event) => {
  if (event.target.matches('#one-player-mode')){
    controller.gameModeControl('onePlayer')
    alert('單人遊戲開始，趕快點選框框，占地盤囉！')
  } 

  if (event.target.matches('#two-players-mode')){
    controller.gameModeControl('twoPlayers')
    alert('雙人遊戲開始，想當小鳥的人可以趕快開始選地盤囉！')
  }
})
