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
const displaySpeed = document.getElementById("speed-display")
const icon = document.querySelector(".fa-regular")
const modeBtn = document.getElementById("mode_icon")
let startId = 0
let squares = []
let currentSnake = [2,1,0]
let direction = 1
const width = 10
let appleIndex = 0
let score = 0
let bestScore = 0
let resultsArr = []
let speed = 0.9
let level1 = true
let level2 = false
let timerId = 0
let running = false
let storedResults
let targetScore = 10
let gameOver = false
let intervalTime
let snakeSquares = []
let wallOne = [53, 54, 55, 45]
let wallTwo = [69, 79, 89, 99]
let wallThree = [10, 20, 30]


function clearLS() {
    score = 0
    bestScore = 0
    localStorage.setItem("score", JSON.stringify(score))
    bestResDisplay.innerText = bestScore
}
    
function displayScore() {
    storedResults = JSON.parse(localStorage.getItem("score"))
    storedResults > bestScore ? bestScore=storedResults : bestScore
    bestResDisplay.innerText = bestScore 
}




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

function renderWalls() {
    
    wallOne.forEach(index => {
        squares[index].classList.add("wall")
    })
    wallTwo.forEach(index => {
        squares[index].classList.add("wall")
    })
    wallThree.forEach(index => squares[index].classList.add("wall"))
}


function startGame() {
    displaySpeed.textContent = 0
    intervalTime = 500
    gameOver = false    
    score=0
    bestResDisplay.innerText = 0
    clearLS()
    displayScore()
   
    document.removeEventListener('keyup', startGame)
    document.addEventListener('keyup', handleKeyMove)
    clearInterval(startId)
   
   gameField.scrollIntoView()
   gameField.focus()
   gameField.style.opacity = "1"
   popup.style.display = "none"
   
    currentSnake.forEach(index => squares[index].classList.remove('snake'))
    squares[appleIndex].classList.remove("apple")
    squares[currentSnake[0]].classList.remove("head-br")
  
    clearInterval(timerId)
    currentSnake = [2,1,0]
    scoreDisplay.textContent = `${targetScore}`
    direction = 1
  
    if(level2) {
        renderWalls()
    }
    currentSnake.forEach(index => squares[index].classList.add('snake'))
    squares[currentSnake[0]].classList.add("head-br")
    generateApple()
    squares[currentSnake[0]].style.transform = "rotate(-90deg)"
    timerId = setInterval(move, intervalTime)
    displaySpeed.textContent = Math.floor(intervalTime)

}

function mobileLayout() {
    if(window.innerWidth < 400) {

        infoDisplay.style.display = "none"
        buttonsDisplay.style.display = "grid"

        if(targetScore === 0 && level1) {
            infoDisplay.style.display = "grid"
            buttonsDisplay.style.display = "none"
        }else if(targetScore === 0 && level2) {
            infoDisplay.style.display = "grid"
            buttonsDisplay.style.display = "none"
        }else if(targetScore === 13 && level2){
            buttonsDisplay.style.display = "grid"
            infoDisplay.style.display = "none"
        }
    }else {
        infoDisplay.style.display = "grid"
        buttonsDisplay.style.display = "none"
    }
}

function move() {
    mobileLayout()

   displaySpeed.textContent = Math.floor(intervalTime)
   gameField.focus({block:"center"})
   let tail
   let wall = false

   function hitItself() {
       let snakeBody = [...currentSnake]
       let headSnake = snakeBody.shift()
       popup.innerHTML = `<h2>Oops, you hit yourself! Try again!</h2>`
       popup.classList.add("warning")
       return snakeBody.some(tile => tile === headSnake)
   }

   function hitTheWall() {
    if ((currentSnake[0] + width >= width*width && direction === width && level1) || 
        (currentSnake[0] % width === width-1 && direction === 1 && level1) || 
        (currentSnake[0] % width === 0 && direction === -1 && level1) || 
        (currentSnake[0] - width < 0 && direction === -width && level1) ||
        (squares[currentSnake[0]].classList.contains("wall")))
         {
            wall = true
            squares[currentSnake[0]].classList.remove("wall")
            popup.innerHTML = `<h2>Oops, you hit the wall! Try again!</h2>`
            popup.classList.add("warning")
            console.log(popup)
    }
        return wall
   }
    
    if(hitTheWall() || hitItself()) {
       localStorage.setItem("score", JSON.stringify(score))
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

    if(currentSnake[0] - width < 0 && direction === -width ) {
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
        score++
        targetScore--
        scoreDisplay.textContent = `${targetScore}`
        clearInterval(timerId)
        intervalTime = intervalTime * speed
        timerId = setInterval(move, intervalTime)        
    }

    if(targetScore===0 && level1) {
       localStorage.setItem("score", JSON.stringify(score))
       displayScore()
       levelTwo()
      
    }else if(targetScore === 13 && level2){
        clearLS()
        displayScore()
    }else if(targetScore === 0 && level2){
        gameOver = true
        localStorage.setItem("score", JSON.stringify(score))
        finishTheGame()    
    }
}
}

// let restSquares = squares.filter(square => !snakeSquares.includes(square))

function generateApple() {
    
    do{
    let random = Math.floor(Math.random() * squares.length)
    currentSnake.every(snake => random !== snake) ?  appleIndex = random : random = Math.floor(Math.random() * squares.length)
  
    if(level2) {
     if(currentSnake.every(snake => random !== snake) && wallOne.every(wall => random !== wall) && wallTwo.every(wall => random !== wall) &&
    wallThree.every(wall => random !== wall)) {
        appleIndex = random
    }else {
        random = Math.floor(Math.random() * squares.length)
        appleIndex = random
    }   
    }

    }while(squares[appleIndex].classList.contains('snake'))
  

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
    running = false
    targetScore = level1 ? 10 : 13
    intervalTime = level1 ? 1000 : level2 ? 500 : 500 
    displaySpeed.textContent = 0

   displayScore()
   infoDisplay.style.display = "grid"
    buttonsDisplay.style.display = "none"
    gameField.style.opacity = "0.8"
    popup.style.display = "block"

    document.removeEventListener('keyup', handleKeyMove)
    document.addEventListener('keyup', startGame)
    
    if(gameOver) {
        displayScore()
        displaySpeed.textContent = 0
         popup.innerHTML = `<h2>Congratulations! The game is over!</h2>`
         document.removeEventListener('keyup', handleKeyMove)
         document.removeEventListener('keyup', startGame)
         level1= true
         level2 = false
         gameField.addEventListener("click",  levelOne)
        
    }
    return clearInterval(timerId)
}

/*For mobiles */

function handleButtonKeyMove(e) {
    running=true
    const { id } = e.currentTarget
    control(id)
  }

  keyBtns.forEach((keyBtn) => {
    keyBtn.addEventListener("mousedown", handleButtonKeyMove)
    keyBtn.addEventListener("touchstart", handleButtonKeyMove)
  })

gameField.addEventListener("click", () => {
    startGame()
    mobileLayout()
})

function levelTwo() {
    targetScore=13
    level2 = true
    level1 = false
    popup.innerHTML = `<h3>Congratulations! Follow to the Level 2!</h3>`
    popup.style.display = "block"
    levelDisplay.textContent = "2"
    clearInterval(timerId)
    startId = setInterval(startGame,2000)
}

function levelOne() {
    targetScore=10
    level2 = false
    level1 = true
    levelDisplay.textContent = "1"
    score = 0
    startGame()
}

document.addEventListener('keyup', startGame)


icon.classList.add("fa-moon")

modeBtn.addEventListener("click", () => {
  document.documentElement.classList.toggle("light")
  if(icon.classList.contains("fa-moon")) {
    icon.classList.replace("fa-moon", "fa-sun")
  }else {
    icon.classList.replace("fa-sun", "fa-moon")
  }
})



