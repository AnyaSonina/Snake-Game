const grid = document.querySelector('.grid')
const startButton = document.getElementById('start')
const scoreDisplay = document.getElementById('score-display')
const gameField = document.getElementById("game-grid")
const bestResDisplay = document.getElementById("best")
const popup = document.getElementById("popup")
const levelDisplay = document.getElementById("level-display")
const infoDisplay = document.getElementById("info")
const buttonsDisplay = document.getElementById("buttons")
const keyBtns = document.querySelectorAll(".keys-container button")
let startId = 0
let squares = []
let currentSnake = [2,1,0]
let direction = 1
const width = 10
let appleIndex = 0
let bestScore = 0
let resultsArr = []
let intervalTime = 1000
let speed = 0.9
let levelOne = true
let level2 = false
let levelThree = false
let timerId = 0
let start = false
let storedResults
let targetScore = 2



function createGrid() {
    
    for (let i=0; i < width*width; i++) {
        const square = document.createElement('div')
        square.classList.add('square')
        grid.appendChild(square)
       squares.push(square)
    }    
    squares[currentSnake[0]].classList.add("head-br")
    squares[currentSnake[0]].style.transform = "rotate(-90deg)"
 }
createGrid()

currentSnake.forEach(index => {
    squares[index].classList.add('snake')
    squares[currentSnake[0]].classList.remove("snake")
})


function startGame() {
   
   document.removeEventListener('keyup', startGame)
    document.addEventListener('keyup', handleKeyMove)
    clearInterval(startId)
   
   gameField.scrollIntoView()
   gameField.focus()
   gameField.style.opacity = "1"
   document.getElementById("popup").style.display = "none"
   
    currentSnake.forEach(index => squares[index].classList.remove('snake'))

    squares[appleIndex].classList.remove("apple")

    squares[currentSnake[0]].classList.remove("head-br")
  
    clearInterval(timerId)
    currentSnake = [2,1,0]
    scoreDisplay.textContent = `${targetScore}`
    direction = 1
    level2 ? intervalTime = 600 : intervalTime = 1000
   
    generateApple()
    currentSnake.forEach(index => squares[index].classList.add('snake'))
    squares[currentSnake[0]].classList.add("head-br")
    squares[currentSnake[0]].style.transform = "rotate(-90deg)"
    timerId = setInterval(move, intervalTime)
  
}




function move() {
    
   gameField.focus({block:"center"})
   let tail

   function hitItself() {
       let snakeBody = [...currentSnake]
       let headSnake = snakeBody.shift()
       return snakeBody.some(tile => tile === headSnake)
   }
    
    if ((currentSnake[0] + width >= width*width && direction === width && levelOne) || 
        (currentSnake[0] % width === width-1 && direction === 1 && levelOne) || 
        (currentSnake[0] % width === 0 && direction === -1 && levelOne) || 
        (currentSnake[0] - width < 0 && direction === -width && levelOne) || 
        (hitItself())
    ) {    
        finishTheGame()
    }

   else {
       //Making walls permeable on level2
       function permeableWalls(newHeadval) {
        let oldHead = currentSnake[0]
        let newHead = newHeadval
        squares[oldHead].classList.remove("head-br")
        currentSnake.unshift(newHead)
        squares[newHead].classList.add("head-br")
        squares[newHead].classList.add("snake")
        tail = currentSnake.pop()
        squares[tail].classList.remove("snake")  
    }

    if(currentSnake[0] - width < 0 && direction === -width) {
        permeableWalls(width*width-(width-currentSnake[0]))
    }else if(currentSnake[0] + width >= width*width && direction === width) {
        permeableWalls(width - (width*width-currentSnake[0]))              
    }else if(currentSnake[0] % width === width-1 && direction === 1) {
        permeableWalls(currentSnake[0] - 9) 
    }else if(currentSnake[0] % width === 0 && direction === -1) {
        permeableWalls(currentSnake[0] + 9) 
    }else{
        tail = currentSnake.pop()
        squares[tail].classList.remove('snake')
        squares[currentSnake[0]].classList.remove("head-br")    
        currentSnake.unshift(currentSnake[0] + direction)
        squares[currentSnake[0]].classList.add("head-br")
        squares[currentSnake[0]].classList.add('snake') 
    }       
    
    if(direction === 1) {
        squares[currentSnake[0]].style.transform = "rotate(-90deg)"
    }else if(direction === -1) {
        squares[currentSnake[0]].style.transform = "rotate(90deg)"
    }else if(direction === -width) {
        squares[currentSnake[0]].style.transform = "rotate(180deg)"
    }

     
   squares.map(square => {
       if(!square.classList.contains("head-br")) 
        square.style.transform = "rotate(0)"  
   })

 
    if (squares[currentSnake[0]].classList.contains('apple')) {
       
        squares[currentSnake[0]].classList.remove('apple')
        squares[tail].classList.add('snake')
        currentSnake.push(tail)
        generateApple()
        targetScore--
        scoreDisplay.textContent = `${targetScore}`
        clearInterval(timerId)
        intervalTime = intervalTime * speed
        timerId = setInterval(move, intervalTime)
    }   
  
 
    levelTwo()
}
}

function generateApple() {
    do {
    appleIndex = Math.floor(Math.random() * squares.length)
    } while (squares[appleIndex].classList.contains('snake'))
    squares[appleIndex].classList.add('apple')
} 

function control(moveDirection) {
    if (moveDirection === "ArrowRight") {
        direction = 1
      }
      if (moveDirection === "ArrowLeft") {
        direction = -1
      }
      if (moveDirection === "ArrowUp") {
        direction = -width
      }
      if (moveDirection === "ArrowDown") {
        direction = width
      }
}

function handleKeyMove(e) {
    if (!["ArrowRight", "ArrowLeft", "ArrowUp", "ArrowDown"].includes(e.key))
    return
    control(e.key)
}



function finishTheGame() {
    infoDisplay.style.display = "grid"
    buttonsDisplay.style.display = "none"
    gameField.style.opacity = "0.8"
    document.getElementById("popup").style.display = "block"
    resultsArr.unshift(score)
    localStorage.setItem("score", JSON.stringify(resultsArr))
    storedResults = JSON.parse(localStorage.getItem("score"))
    storedResults[0] > bestScore ? bestScore=storedResults[0] : bestScore
    bestResDisplay.innerText = bestScore
    document.removeEventListener('keyup', handleKeyMove)
    document.addEventListener('keyup', startGame)
    return clearInterval(timerId)
}

/*For mobiles */

function handleButtonKeyMove(e) {
    start=true
    const { id } = e.currentTarget
    control(id)
  }

  keyBtns.forEach((keyBtn) => {
    keyBtn.addEventListener("mousedown", handleButtonKeyMove)
    keyBtn.addEventListener("touchstart", handleButtonKeyMove)
  })

gameField.addEventListener("click", () => {
    startGame()
    if(window.screen.width < 406) {
        infoDisplay.style.display = "none"
        buttonsDisplay.style.display = "grid"
    }
})

function levelTwo() {
    if(targetScore === 0 && levelOne) {
        targetScore=2
        levelOne = false
        level2 = true
        popup.innerHTML = `<h2>Congratulations! Follow to the Level 2!</h2>`
        popup.style.display = "block"
        levelDisplay.textContent = "2"
        clearInterval(timerId)
        startId = setInterval(startGame,2000)
    }
}
document.addEventListener('keyup', startGame)


//depending on the best result, restart the game from the suitable level
//notify the user how he can start the game

/*create level3 with obstacles
renevew the level info on different levels
center the popup div
apply the "cange the mode" feature
create root colors and create the different styles of the game
Make the buttons appear on a key stroke
*/
