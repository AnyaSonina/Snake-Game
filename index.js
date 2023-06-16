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
let squares = []
let currentSnake = [2,1,0]
let direction = 1
const width = 10
let appleIndex = 0
let score = 0
let bestScore = 0
let resultsArr = []
let intervalTime = 1000
let speed = 0.9
let levelOne = true
let level2 = false
let levelThree = false
let timerId = 0
let storedResults



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
    
    if(levelOne) {
        speed = 0.9
    }else if(level2){
        speed = 0.8
    }else{
        speed = 0.7
    }

   gameField.scrollIntoView()
   gameField.focus()
   gameField.style.opacity = "1"
   document.getElementById("popup").style.display = "none"
   
    currentSnake.forEach(index => squares[index].classList.remove('snake'))

    squares[appleIndex].classList.remove("apple")

    squares[currentSnake[0]].classList.remove("head-br")
  
    clearInterval(timerId)
    currentSnake = [2,1,0]
    score = 0
    scoreDisplay.textContent = `${score}/14`
    direction = 1
    intervalTime = 1000
    generateApple()
    currentSnake.forEach(index => squares[index].classList.add('snake'))
    squares[currentSnake[0]].classList.add("head-br")
    squares[currentSnake[0]].style.transform = "rotate(-90deg)"
    timerId = setInterval(move, intervalTime)
}


function move() {
   gameField.focus({block:"center"})
    if (
        (currentSnake[0] + width >= width*width && direction === width) || 
        (currentSnake[0] % width === width-1 && direction === 1) || 
        (currentSnake[0] % width === 0 && direction === -1) || 
        (currentSnake[0] - width < 0 && direction === -width) ||
        squares[currentSnake[0] + direction].classList.contains('snake')
    ) {    
        infoDisplay.style.display = "grid"
        buttonsDisplay.style.display = "none"
        gameField.style.opacity = "0.8"
        document.getElementById("popup").style.display = "block"
        resultsArr.unshift(score)
        localStorage.setItem("score", JSON.stringify(resultsArr))
        storedResults = JSON.parse(localStorage.getItem("score"))
        storedResults[0] > bestScore ? bestScore=storedResults[0] : bestScore
        bestResDisplay.innerText = bestScore
        return clearInterval(timerId)
    }

    const tail = currentSnake.pop()
    squares[tail].classList.remove('snake')
    squares[currentSnake[0]].classList.remove("head-br")
    
    currentSnake.unshift(currentSnake[0] + direction)
    squares[currentSnake[0]].classList.add("head-br")
    
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
        scoreDisplay.textContent = `${score}/14`
        clearInterval(timerId)
        intervalTime = intervalTime * speed
        timerId = setInterval(move, intervalTime)
    }   
    squares[currentSnake[0]].classList.add('snake') 

}

function generateApple() {
    do {
    appleIndex = Math.floor(Math.random() * squares.length)
    } while (squares[appleIndex].classList.contains('snake'))
    squares[appleIndex].classList.add('apple')
} 

function control(moveDirection) {
    if (moveDirection === "ArrowRight") {
        direction = 1;
      }
      if (moveDirection === "ArrowLeft") {
        direction = -1;
      }
      if (moveDirection === "ArrowUp") {
        direction = -width;
      }
      if (moveDirection === "ArrowDown") {
        direction = width;
      }
}

function handleKeyMove(e) {
    if (!["ArrowRight", "ArrowLeft", "ArrowUp", "ArrowDown"].includes(e.key))
    return
    control(e.key)
}

document.addEventListener('keyup', handleKeyMove)

/*For mobiles */

function handleButtonKeyMove(e) {
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
    if(score === 1) {
        levelOne = false
        level2 = true
        clearInterval(timerId)
        popup.innerHTML = `<h2>Congratulations! Follow to the next level</h2>`
        popup.style.display = "block"
        setInterval(startGame,2000)
    }
}


//create levels with a different starting speed
//the last level will have the fastest speed but the walls will be permeable
//depending on the best result, restart the game from the suitable level
//change the design of "game-info section" name at the top and different features around
//get rid of stat button (just notify the user to click on the field)
/*Displaying keys-container on smaller screens on the start of the game */
