let matrixContainer = document.querySelector("game-window")
const rows = 5
const columns = 5
const gameMatrix = []
const matrixItems = new Map()
const matrixBackgroundElements = []


class DivElement{
    constructor(rowInput = null, colInput = null, idInput = null) {
        this.imagePath = null
        this.row = rowInput;
        this.col = colInput;
        this.id = idInput;
}
}

class ActionElement extends DivElement{

}

class Player extends ActionElement {
    constructor(rowInput = null, colInput = null, idInput = null) {
        super(rowInput, colInput, idInput)
        this.imagePath = 'images/hero.png'
        this.alive = true
        this.score = 0

    }
}

class Zombie extends ActionElement{
    constructor(rowInput = null, colInput = null, idInput = null) {
        super(rowInput, colInput, idInput)
        this.imagePath = 'images/zombiecat.jpg'
    }
}

class Cat extends ActionElement{
    constructor(rowInput = null, colInput = null, idInput = null) {
        super(rowInput, colInput, idInput)
        this.imagePath = 'images/cat.jpg'

    }
}

class Forest extends DivElement {
    constructor(rowInput = null, colInput = null, idInput = null) {
        super(rowInput, colInput, idInput)
        this.randomNumber = getRandomInt(1, 5);
        this.imagePath = `images/forest${this.randomNumber}.jpg`;
    }
}
function fillMatrixbackgroundItems() {debugger
    for (let i = 0; i < 5; i++) {
        let row = []
        for (let j = 0; j < 5; j++) {
            let backgroundElement = new Forest(i,j,`${i}-${j}`)          
            row.push(backgroundElement)
        }
        matrixBackgroundElements.push(row)
    }
}
function getRandomInt(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1)) + min
}

function findEmptySpot(){
    debugger
    let placeFound = false;
    let newRow = getRandomInt(0, 5);
    let newCol = getRandomInt(0, 5);
    while (!placeFound) {
        let positionOccupied = false;
        for (let [key, item] of matrixItems.entries()) {
            if (item.row === newRow && item.col === newCol) {
                positionOccupied = true;
                newRow = getRandomInt(0, 5);
                newCol = getRandomInt(0, 5);
                break;
            }
        }
        if (!positionOccupied) {
            placeFound = true;
        }
    }
    return { row: newRow, col: newCol }
}

function createNewPlayer(){
    let newPlayerPosition = findEmptySpot()
    let newPlayer = new Player(newPlayerPosition.row, newPlayerPosition.col, `Player1`)
    matrixItems.set(`Player-1`, newPlayer)
    let placedPlayer = matrixItems.get(`Player-1`)
    if(placedPlayer)
    console.log(`${placedPlayer.id} placed successfully`)
}

function placeCats(){
    for(let i = 0; i<2; i++){
        let newCatPosition = findEmptySpot()
        let newCat = new Cat(newCatPosition.row, newCatPosition.col, `Cat-${i}`)
        matrixItems.set(`Cat-${i}`, newCat)
        let placedCat = matrixItems.get( `Cat-${i}`)
        if(placedCat){
            console.log(`${placedCat.id} placed successfully`)
        }
        else{
            console.log(`Failed to place Zomie-${i}`)
        }


    }
}

function placeZombies(){
    for(let i = 0; i<2; i++){
        let newZombiePosition = findEmptySpot()
        let newZombie = new Zombie(newZombiePosition.row, newZombiePosition.col, `Zombie-${i}`)     
        matrixItems.set(`Zombie-${i}`,newZombie)   
        if(matrixItems.has(`Zombie-${i}`)){
            let placedZombie = matrixItems.get(`Zombie-${i}`);
            if(placedZombie){
                console.log(`Zombie-${i} placed successfully.`);
            } else {
                console.log(`Failed to place Zombie-${i}.`);
            }
        }
    }
}

function fillMatrixItems(){
    placeZombies()
    placeCats()
    createNewPlayer()
    createDivMatrix()
}

function createDivMatrix() {debugger
    let gameWindow = document.getElementById('game-window')

    for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 5; j++) {
            let itemDiv = document.createElement('div')
            itemDiv.className = 'matrix-item'
            itemDiv.id = `item-${i}${j}`
            gameWindow.appendChild(itemDiv)
        }
    }         
}

function refreshGameWindow(){
    matrixItems.forEach((value) =>{
    itemDiv = document.getElementById(`item-${value.row}${value.col}`)
    {
        itemdiv.style.backgroundImage = `url(value.imagePath)`
    }
})
}
function startNewGame() {
    // debugger
    console.log('Starting new game')

    fillMatrixItems()
    createDivMatrix()
}

function movePlayer(direction) {
    
    let playerIndexes = findPlayerIndexes();
    let currentPlayerRow = playerIndexes[0];
    let currentPlayerCol = playerIndexes[1];

    switch (direction) {
        case 'N':
           
            if (currentPlayerRow > 0) {
         
                let oldPosition = matrixItems[currentPlayerRow][currentPlayerCol];
                let newPosition = matrixItems[currentPlayerRow - 1][currentPlayerCol];
                matrixItems[currentPlayerRow][currentPlayerCol] = new Forest(); 
                matrixItems[currentPlayerRow - 1][currentPlayerCol] = new Player();

                let oldDiv = document.getElementById(`item-${currentPlayerRow}${currentPlayerCol}`);
                let newDiv = document.getElementById(`item-${currentPlayerRow - 1}${currentPlayerCol}`);
                oldDiv.style.backgroundImage = `url(${oldPosition.imagePath})`; 
                newDiv.style.backgroundImage = `url(${newPosition.imagePath})`; 
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
    
   debugger
   document.addEventListener('DOMContentLoaded', function() {
    fillMatrixbackgroundItems();
    fillMatrixItems();
    createDivMatrix();
    refreshGameWindow();
    console.log(matrixItems);
});



    // fillMatrixItems();
    // createDivMatrix();
    // console.log ("matrixItems")
    // console.log(matrixItems)

    // console.log(catPositions)
   
}
// let zombiePositions = moveZombies()
// let result = checkResult()
}

// function findPlayerIndexes() {
//     let playerIndexes = []
//     let playerFound = false
//     // debugger
//     for (let i = 0; i < matrixItems.length; i++) {
//         for (let j = 0; j < matrixItems[i].length; j++) {
//             if (matrixItems[i][j] instanceof Player) {
//                 playerIndexes.push(i)
//                 playerIndexes.push(j)
//                 playerFound = true
//                 break
//             }
//         }
//         if (playerFound) break
//     }
//     // debugger
//     return playerIndexes
// }

// function wipeOldGameWindow() {
//     matrixItems.length = 0
//     catPositions.length = 0

//     let gameWindow = document.getElementById('game-window')
//     while (gameWindow.firstChild) {
//         gameWindow.removeChild(gameWindow.firstChild);
//     }
// }

// function checkResult(newPosition) {
//     for (let i = 0; i < zombiePositions.length - 1; i++)
//         if (newposition[0] == zombiePositions[i][0] && newposition[1] == zombiePositions[i][1]) {
//             return 'You died!!'
//         }
// }


// function fillMatrixItems() {
//     let unshuffledItems = []
//     let placedItems = []
//     unshuffledItems.push(new Player, new Monster, new Monster, new Monster, new Cat, new Cat, new Cat,)
//     for (let i = 0; i < 18; i++) {
//         unshuffledItems.push(new Forest)
//     }
//     for (let i = 0; i < 5; i++) {
//         let row = []
//         for (let j = 0; j < 5; j++) {
//             let searchingItem = true
//             while (searchingItem) {
//                 let addItemIndex = getRandomInt(0, 24)
//                 if (!placedItems.includes(addItemIndex)) {
//                     row.push(unshuffledItems[addItemIndex])
//                     placedItems.push(addItemIndex)
//                     searchingItem = false
//                 }
//             }
//             if (row[j] instanceof Cat) {
//                 let position = [i, j]
//                 catPositions.push(position)
//             }
//         }
//         matrixItems.push(row)
//     }
// }
// const idCounter = 0