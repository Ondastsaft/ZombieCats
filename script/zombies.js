let matrixContainer = document.querySelector("game-window")
const rows = 5
const columns = 5
const gameMatrix = []
const catPositions = []
const matrixItems = []
const matrixBackgroundElements = []

class Player {
    constructor() {
        this.imagePath = 'images/hero.png'
        this.alive = true;
        this.score = 0;
    }
}

class Monster {
    constructor() {
        this.imagePath = 'images/zombiecat.jpg'
    }
}

class Cat {
    constructor() {
        this.imagePath = 'images/cat.jpg'
    }
}

class Forest {
    constructor() {
        this.randomNumber = getRandomInt(1, 5);
        this.imagePath = `images/forest${this.randomNumber}.jpg`;
    }
}


function fillMatrixItems() {
    let unshuffledItems = []
    let placedItems = []
    unshuffledItems.push(new Player, new Monster, new Monster, new Monster, new Cat, new Cat, new Cat,)
    for (let i = 0; i < 18; i++) {
        unshuffledItems.push(new Forest)
    }
    for (let i = 0; i < 5; i++) {
        let row = []
        for (let j = 0; j < 5; j++) {
            let searchingItem = true
            while (searchingItem) {
                let addItemIndex = getRandomInt(0, 24)
                if (!placedItems.includes(addItemIndex)) {
                    row.push(unshuffledItems[addItemIndex])
                    placedItems.push(addItemIndex)
                    searchingItem = false
                }
            }
            if (row[j] instanceof Cat) {
                let position = [i, j]
                catPositions.push(position)
            }
        }
        matrixItems.push(row)
    }
}

function createDivMatrix() {
    let gameWindow = document.getElementById('game-window')

    for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 5; j++) {
            let itemDiv = document.createElement('div')
            itemDiv.className = 'matrix-item'
            itemDiv.id = `item-${i}${j}`
            itemDiv.style.backgroundImage = `url(${matrixItems[i][j].imagePath})`
            gameWindow.appendChild(itemDiv)
        }
    }
}

function startNewGame() {
    // debugger
    console.log('Starting new game')
    wipeOldGameWindow()
    fillMatrixItems()
    createDivMatrix()
}

function movePlayer(direction) {
    
    let playerIndexes = findPlayerIndexes()
    let tempPlayer = document.getElementById(`item-${playerIndexes[0]}${playerIndexes[1]}`)
    let oldPosition 
    debugger
    switch (direction) {
        case 'N':
            if (playerIndexes[0] > 0) {
                debugger
                oldPosition = document.getElementById(`item-${playerIndexes[0]}${playerIndexes[1]}`)
                let background = new Forest()
                oldPosition.style.backgroundImage = background.imagePath
                matrixItems[playerIndexes[0]][playerIndexes[1]] = background           
                newPosition = document.getElementById(`item-${playerIndexes[0] - 1}${playerIndexes[1]}`)
                newPosition = tempPlayer
                newPosition.style.backgroundImage = `url(${tempPlayer.imagePath})`
            }
            break;
        case 'E':
            if (playerIndexes[1] < matrixItems[0].length - 1) {
                matrixItems[playerIndexes[0]][playerIndexes[1]] = new Forest()
                matrixItems[playerIndexes[0]][playerIndexes[1] + 1] = tempPlayer
            }
            break;
        case 'S':
            if (playerIndexes[0] < matrixItems.length - 1) {
                matrixItems[playerIndexes[0]][playerIndexes[1]] = new Forest()
                matrixItems[playerIndexes[0] + 1][playerIndexes[1]] = tempPlayer
            }
            break;
        case 'W':
            if (playerIndexes[1] > 0) {
                matrixItems[playerIndexes[0]][playerIndexes[1]] = new Forest()
                matrixItems[playerIndexes[0]][playerIndexes[1] - 1] = tempPlayer
            }
            break;
        default:
            console.log("Invalid direction!")
            break;
    }

    // let zombiePositions = moveZombies()
    // let result = checkResult()
}

function findPlayerIndexes() {
    let playerIndexes = []
    let playerFound = false
    // debugger
    for (let i = 0; i < matrixItems.length; i++) {
        for (let j = 0; j < matrixItems[i].length; j++) {
            if (matrixItems[i][j] instanceof Player) {
                playerIndexes.push(i)
                playerIndexes.push(j)
                playerFound = true
                break
            }
        }
        if (playerFound) break
    }
    // debugger
    return playerIndexes
}

function wipeOldGameWindow() {
    matrixItems.length = 0
    catPositions.length = 0

    let gameWindow = document.getElementById('game-window')
    while (gameWindow.firstChild) {
        gameWindow.removeChild(gameWindow.firstChild);
    }
}

function checkResult(newPosition) {
    for (let i = 0; i < zombiePositions.length - 1; i++)
        if (newposition[0] == zombiePositions[i][0] && newposition[1] == zombiePositions[i][1]) {
            return 'You died!!'
        }
}

function getRandomInt(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1)) + min
}

function moveZombies() {

}


window.onload = function () {
    document.addEventListener('keydown', function (event) {
        switch (event.key.toUpperCase()) {
            case 'N':
                movePlayer('N');
                break;
            case 'E':
                movePlayer('E');
                break;
            case 'S':
                movePlayer('S');
                break;
            case 'W':
                movePlayer('W');
                break;
            default:
                break
        }
    })
    
    fillMatrixItems();
    createDivMatrix();
    
    console.log(matrixItems)
    console.log(catPositions)
   
}