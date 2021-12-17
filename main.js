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
  }
}

const model = {
  stepCount: 0,

  birdPosition: [],

  fishPosition: [],

  emptyPosition: [1, 2, 3, 4, 5, 6, 7, 8, 9],

  successGroups: [[1, 2, 3], [4, 5, 6], [7, 8, 9], [1, 4, 7], [2, 5, 8], [3, 6, 9], [1, 5, 9], [3, 5, 7]],
}

const controller = {
 
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
        const nextPosition = controller.determineComputerNextStep()
        console.log('next step take', nextPosition)
        view.draw(document.querySelectorAll('.block')[nextPosition - 1], 'fish')
        model.fishPosition.push(nextPosition)
        model.emptyPosition.splice(model.emptyPosition.indexOf(nextPosition), 1)
        model.stepCount += 1
        

        // 判斷輸贏
        controller.twoPlayersModeDetermineWinner()

      })
    })
  },
  
  willWin (fakeEmptyPosition) {

    for (let i = 0; i < fakeEmptyPosition.length; i++){
      const fakeFishPosition = Array.from(model.fishPosition)
      fakeFishPosition.push(fakeEmptyPosition[i])
      console.log('position', fakeEmptyPosition[i])
      console.log('fakeFish', fakeFishPosition)

      const matchedGroup = model.successGroups.find((group) => {
        if (this.lineFormed(fakeFishPosition, group)) {
          console.log(this.lineFormed(fakeFishPosition, group))
        }
      })

      console.log(matchedGroup)

      if (matchedGroup !== 'undefined'){
        return fakeEmptyPosition[i]
      }

      return false

    }
    
  },

  willLose (fakeEmptyPosition) {
    for (position of fakeEmptyPosition){
      const fakeBirdPosition = Array.from(model.birdPosition)
      fakeBirdPosition.push(position)

      for (group of model.successGroups){
        if (this.lineFormed(fakeBirdPosition, group)){
          return 
        }
      }



    }





    // 不知道為什麼搞砸的code
    // console.log('fakeempty', fakeEmptyPosition.length)
    // for (let i = 0; i < fakeEmptyPosition.length; i++) {
    //   const fakeBirdPosition = Array.from(model.birdPosition)
    //   fakeBirdPosition.push(fakeEmptyPosition[i])
    //   console.log("this i", i)
    //   console.log('position', fakeEmptyPosition[i])
    //   console.log('fakebird', fakeBirdPosition)


    //   model.successGroups.find((group) => {
    //     this.lineFormed(fakeBirdPosition, group)
 
    //   })

    //   console.log(matchedGroup)

    //   if (matchedGroup !== 'undefined'){
    //     return fakeEmptyPosition[i]
    //   }
     
    //   return false
    // }

    // fakeEmptyPosition.forEach((position) => {
    //   const fakeBirdPosition = Array.from(model.birdPosition)
    //   fakeBirdPosition.push(position)
    //   console.log('position2', position)
    //   console.log('fakeBird', fakeBirdPosition)

    //   model.successGroups.find((group) => {
    //     if (this.lineFormed(fakeBirdPosition, group)) {
    //       console.log(this.lineFormed(fakeBirdPosition, group))
    //       return position
    //     }
    //   })
    // })

    // return 0
  },

  determineComputerNextStep () {
    const fakeEmptyPosition = Array.from(model.emptyPosition)
    
    this.willWin(fakeEmptyPosition)
    console.log('win', this.willWin(fakeEmptyPosition))
  
    this.willLose(fakeEmptyPosition)
    console.log('lose', this.willLose(fakeEmptyPosition))
    
    // 會贏
    
    
    // 會輸
    

    // 鄰近的
    // 中間
    // random
    
    const selectedIndex = Math.floor(Math.random()*fakeEmptyPosition.length)
    return fakeEmptyPosition[selectedIndex]
    

  },

  lineFormed (playerPosition, successGroup) {
    return successGroup.every((element) => {
      return playerPosition.includes(element)
    })
  },

  twoPlayersModeDetermineWinner () {

    model.successGroups.find((group)=> {
      
      if (this.lineFormed(model.fishPosition, group)){
        this.resetGame()
        this.startTwoPlayersMode()
        return alert('小魚獲勝')
      } else if (this.lineFormed(model.birdPosition, group)){
        this.resetGame()
        this.startTwoPlayersMode()
        return alert('小鳥獲勝')
      }

    })

    
    if(model.stepCount === 9){
      this.resetGame()
      this.startTwoPlayersMode()
      return alert('平手')
    } 
  },

  onePlayerModeDetermineWinner() {

    model.successGroups.find((group) => {

      if (this.lineFormed(model.fishPosition, group)) {
        this.resetGame()
        this.startTwoPlayersMode()
        return alert('小魚獲勝')
      } else if (this.lineFormed(model.birdPosition, group)) {
        this.resetGame()
        this.startTwoPlayersMode()
        return alert('小鳥獲勝')
      }

    })


    if (model.stepCount === 9) {
      this.resetGame()
      this.startTwoPlayersMode()
      return alert('平手')
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
controller.startOnePlayerMode()