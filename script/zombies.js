const matrixContainer = document.querySelector("game-window")
const rows = 5
const columns = 5
let gameMatrix = []
const catPostions = []
const matrixItems = []

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

function findPlayerIndexes() {
    let playerIndexes
    for (let i = 0; i < gameMatrix.length; i++) {
        for (let j = 0; j < gameMatrix[i].length; j++) {
            if (gameMatrix[i][j] instanceof Player) {
                playerIndexes = [i, j]
                break
            }
        }
        if (playerIndexes) break
    }
    return playerIndexes
}
function moveZombies() {

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
                catPostions.push(position)
            }
        }
        matrixItems.push(row)
    }
}

function movePlayer(direction) {
    let playerIndexes = findPlayerIndexes()
    let tempPlayer = gameMatrix[playerIndexes[0]][playerIndexes[1]]

    switch (direction) {
        case 'N':
            if (playerIndexes[0] > 0) {
                gameMatrix[playerIndexes[0]][playerIndexes[1]] = new Forest()
                gameMatrix[playerIndexes[0] - 1][playerIndexes[1]] = tempPlayer
            }
            break;
        case 'E':
            if (playerIndexes[1] < gameMatrix[0].length - 1) {
                gameMatrix[playerIndexes[0]][playerIndexes[1]] = new Forest()
                gameMatrix[playerIndexes[0]][playerIndexes[1] + 1] = tempPlayer
            }
            break;
        case 'S':
            if (playerIndexes[0] < gameMatrix.length - 1) {
                gameMatrix[playerIndexes[0]][playerIndexes[1]] = new Forest()
                gameMatrix[playerIndexes[0] + 1][playerIndexes[1]] = tempPlayer
            }
            break;
        case 'W':
            if (playerIndexes[1] > 0) {
                gameMatrix[playerIndexes[0]][playerIndexes[1]] = new Forest()
                gameMatrix[playerIndexes[0]][playerIndexes[1] - 1] = tempPlayer
            }
            break;
        default:
            console.log("Invalid direction!")
            break;
    }

    let zombiePositions = moveZombies()
    let result = checkResult()
}



function startNewGame() {
    console.log('Starting new game')
    fillMatrixItems()
    console.log(gameMatrix)
    displayMatrix()
}

function createDivMatrix() {
    let gameWindow = document.getElementById('game-window')

    for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 5; j++) {
            let itemDiv = document.createElement('div')
            itemDiv.className = 'matrix-item'
            itemDiv.id = `item-[${i}][${j}]`
            itemDiv.style.backgroundImage = `url(${matrixItems[i][j].imagePath})`
            gameWindow.appendChild(itemDiv)
        }

    }
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
    console.log('matrixItems')
    console.log(matrixItems)
}