const grid = document.querySelector('.grid')
const startButton = document.getElementById('start')
const scoreDisplay = document.getElementById('score-display')
const gameField = document.getElementById("game-grid")
const bestResDisplay = document.getElementById("best")
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
let timerId = 0




function createGrid() {
    //create 100 of these elements with a for loop
    for (let i=0; i < width*width; i++) {
     //create element
    const square = document.createElement('div')
    //add styling to the element
    square.classList.add('square')
    //put the element into our grid
    grid.appendChild(square)
    //push it into a new squares array    
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

let storedResults
function startGame() {
   gameField.scrollIntoView()
   gameField.focus()
   gameField.style.opacity = "1"
   document.getElementById("popup").style.display = "none"
    //remove the snake
    currentSnake.forEach(index => squares[index].classList.remove('snake'))
    //remove the apple
    squares[appleIndex].classList.remove("apple")
     //remove the head
    squares[currentSnake[0]].classList.remove("head-br")
  
    clearInterval(timerId)
    currentSnake = [2,1,0]
    score = 0
    //re add new score to browser
    scoreDisplay.textContent = score
    direction = 1
    intervalTime = 1000
    generateApple()
    //readd the class of snake to our new currentSnake
    currentSnake.forEach(index => squares[index].classList.add('snake'))
    squares[currentSnake[0]].classList.add("head-br")
    squares[currentSnake[0]].style.transform = "rotate(-90deg)"
   

   
    timerId = setInterval(move, intervalTime)
}


function move() {
   gameField.focus({block:"center"})
    if (
        (currentSnake[0] + width >= width*width && direction === width) || //if snake has hit bottom
        (currentSnake[0] % width === width-1 && direction === 1) || //if snake has hit right wall
        (currentSnake[0] % width === 0 && direction === -1) || //if snake has hit left wall
        (currentSnake[0] - width < 0 && direction === -width) || //if snake has hit top
        squares[currentSnake[0] + direction].classList.contains('snake')
    ) {    
        gameField.style.opacity = "0.8"
        document.getElementById("popup").style.display = "block"
        resultsArr.unshift(score)
        localStorage.setItem("score", JSON.stringify(resultsArr))
        storedResults = JSON.parse(localStorage.getItem("score"))
        storedResults[0] > bestScore ? bestScore=storedResults[0] : bestScore
        bestResDisplay.innerText = bestScore
        return clearInterval(timerId)
    }
    

   
    //remove last element from our currentSnake array
    const tail = currentSnake.pop()
      
    //remove styling from last element
    squares[tail].classList.remove('snake')
    squares[currentSnake[0]].classList.remove("head-br")
    
    //add square in direction we are heading
    currentSnake.unshift(currentSnake[0] + direction)
    squares[currentSnake[0]].classList.add("head-br")
    
    //change the direction of the "head" when the snake is moving
        if(direction === 1) {
            squares[currentSnake[0]].style.transform = "rotate(-90deg)"
        }else if(direction === -1) {
            squares[currentSnake[0]].style.transform = "rotate(90deg)"
        }else if(direction === -width) {
            squares[currentSnake[0]].style.transform = "rotate(180deg)"
        }

    //rotate only the head     
        squares.map(square => {
            if(!square.classList.contains("head-br")) 
             square.style.transform = "rotate(0)"  
        })

      
   //add styling so we can see it
    
    //deal with snake head gets apple
    if (squares[currentSnake[0]].classList.contains('apple')) {
        //remove the class of apple
        squares[currentSnake[0]].classList.remove('apple')
        //grow our snake by adding class of snake to it
        squares[tail].classList.add('snake')
        //grow our snake array
        currentSnake.push(tail)
        //generate new apple
        generateApple()
        //add one to the score
        score++
        //display our score
        scoreDisplay.textContent = score
        //speed up our snake
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

// 39 is right arrow
// 38 is for the up arrow
// 37 is for the left arrow
// 40 is for the down arrow

function control(e) {
    if (e.keyCode === 39) {
       direction = 1
    } else if (e.keyCode === 38) {
       direction = -width
      
    } else if (e.keyCode === 37) {
       direction = -1
    } else if (e.keyCode === 40) {
       direction = +width
    }
}
document.addEventListener('keyup', control)
// startButton.addEventListener('click', startGame)

gameField.addEventListener("click", () => {

    startGame()
})

//storing best result




//store the best result in a local storage
//create levels with a different starting speed
//the last level will have the fastest speed but the walls will be permeable
//depending on the best result, restart the game from the suitable level
//change the design of "game-info section" name at the top and different features around
//get rid of stat button (just notify the user to click on the field)

