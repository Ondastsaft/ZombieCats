class DivElement {
  constructor(idInput = null) {
    this.id = idInput;
    this.imagePath = null;
  }
}
class ActionElement extends DivElement {}

class Player extends ActionElement {
  constructor(idInput = null) {
    super(idInput);
    this.imagePath = "/images/hero.png";
    this.alive = true;
    this.score = 0;
  }
}

class Zombie extends ActionElement {
  constructor(idInput = null) {
    super(idInput);
    this.imagePath = "/images/zombiecat.jpg";
  }
}

class Cat extends ActionElement {
  constructor(idInput = null) {
    super(idInput);
    this.imagePath = "/images/cat.jpg";
  }
}

class Forest extends DivElement {
  constructor(idInput = null) {
    super(idInput);
    this.randomNumber = HelperFunctions.getRandomInt(1, 5);
    this.imagePath = `/images/forest${this.randomNumber}.jpg`;
  }
}

//Functions to manipulate divs on the gameboard
class Gameboard {
  static refreshGameWindow() {
    for (let i = 0; i < game.rows; i++) {
      for (let j = 0; j < game.columns; j++) {
        let id = `item${i}-${j}`;
        let itemDiv = document.getElementById(id);
        if (itemDiv) {
          itemDiv.style.backgroundImage = `url(${game.gameMatrix[i][j].imagePath})`;
        } else {
          console.log(`Failed to find div for ${id}`);
        }
      }
    }
  }

  static createDivMatrix() {
    let gameWindow = document.getElementById("game-window");
    for (let i = 0; i < game.rows; i++) {
      for (let j = 0; j < game.columns; j++) {
        let itemDiv = document.createElement("div");
        itemDiv.className = "matrix-item";
        itemDiv.id = `item${i}-${j}`;
        gameWindow.appendChild(itemDiv);
      }
    }
  }

  static refreshGameMatrix() {
    for (let i = 0; i < game.rows; i++) {
      for (let j = 0; j < game.columns; j++) {
        if (game.matrixActionElements[i][j] !== null) {
          game.gameMatrix[i][j] = game.matrixActionElements[i][j];
        } else {
          game.gameMatrix[i][j] = game.matrixBackgroundElements[i][j];
        }
      }
    }
  }
}

// Functions to create and place game elements
class MatrixElementsCreation {
  constructor() {}
  static fillMatrixbackgroundItems() {
    game.matrixBackgroundElements = HelperFunctions.createMatrix(game.rows, game.columns);
    for (let i = 0; i < game.matrixBackgroundElements.length; i++) {
      for (let j = 0; j < game.matrixBackgroundElements[i].length; j++) {
        game.matrixBackgroundElements[i][j] = new Forest();
      }
    }
    console.log(`Matrix background items filled successfully`);
  }

  static createAllActionElements() {
    game.matrixActionElements = HelperFunctions.createMatrix(
      game.rows,
      game.columns
    );
    let position = HelperFunctions.findEmptySpot(game.matrixActionElements);
    game.matrixActionElements[position.row][position.col] = new Player(
      "Player"
    );
    console.log(`Player created at ${position.row}, ${position.col}`);
    this.fillCats();
    this.fillZombies();
  }

  static fillCats() {
    for (let i = 0; i < game.cats; i++) {
      let position = HelperFunctions.findEmptySpot(game.matrixActionElements);
      game.matrixActionElements[position.row][position.col] = new Cat(
        `Cat-${i + 1}`
      );
      console.log(`Cat ${i + 1} created at ${position.row}, ${position.col}`);
    }
  }
  static fillZombies() {
    for (let i = 0; i < game.zombies; i++) {
      let position = HelperFunctions.findEmptySpot(game.matrixActionElements);
      game.matrixActionElements[position.row][position.col] = new Zombie(
        `Zombie-${i + 1}`
      );
      console.log(
        `Zombie ${i + 1} created at ${position.row}, ${position.col}`
      );
    }
  }
}
// Collects all game logic functions
class Game {
  constructor() {
    if (Game.instance == null) {
      this.init();

    }
    Game.instance = this;
  }
  //Fills the game matrix with background elements then overwrites them with action elements if position holds one

  init() {
    this.rows = 5;
    this.columns = 5;
    this.cats = 2;
    this.zombies = 2;
    this.matrixActionElements = HelperFunctions.createMatrix()
    this.matrixBackgroundElements = HelperFunctions.createMatrix();
    this.gameMatrix = HelperFunctions.createMatrix();
  }

  runGame() {
    MatrixElementsCreation.createAllActionElements();
     MatrixElementsCreation.fillMatrixbackgroundItems();
     Gameboard.refreshGameMatrix();
    Gameboard.createDivMatrix();
    Gameboard.refreshGameWindow();
    this.playerAlive = true;
    console.log("Starting new game");
    document.addEventListener("keydown", function (event) {
      game.handleKeyDown(event.key.toUpperCase());
    });

    console.log(`New game started`);
  }

  handleKeyDown(pressedKey) {
    let hasMoved = game.movePlayer(pressedKey);
    if (hasMoved) {
    game.moveZombies();
    game.moveCats();
    // HelperFunctions.checkForCollision();
    Gameboard.refreshGameMatrix();
    Gameboard.refreshGameWindow();
    }
  }

  movePlayer(direction) {
    let playerPosition = HelperFunctions.findPlayer();
    let hasMoved = HelperFunctions.moveAtIndex(direction, playerPosition);
    return hasMoved;
  }

  moveZombies() {
    for (let i = 0; i < game.matrixActionElements.length; i++) {
      for (let j = 0; j < game.matrixActionElements[i].length; j++) {
        if (game.matrixActionElements[i][j] instanceof Zombie) {
          let hasMoved = false;
          while (!hasMoved) {
            let direction = Game.numberToDirection();
            hasMoved = HelperFunctions.moveAtIndex(direction,{row: i, column: j});
          }
        }
      }
    }
  }

  moveCats() {
    for (let i = 0; i < game.gameMatrix.length; i++) {
      for (let j = 0; j < game.gameMatrix[i].length; j++) {
        if (game.gameMatrix[i][j] instanceof Cat) {
          let cat = game.gameMatrix[i][j];
          let hasMoved = false;
          while (!hasMoved) {
            let direction = Game.numberToDirection();
              hasMoved = HelperFunctions.moveAtIndex(direction, {row: i, column: j});
       
          }
        }
      }
    }
  }

  static numberToDirection() {
    let numberToDirection = new Map([
      [1, "N"],
      [2, "E"],
      [3, "W"],
      [4, "S"],
    ]);
    let direction = numberToDirection.get(HelperFunctions.getRandomInt(1, 4));
    return direction;
  }
}

class HelperFunctions {
  static createMatrix() {
    let matrix = [];
    for (let i = 0; i < rows; i++) {
      let rowArray = [];
      for (let j = 0; j < columns; j++) {
        rowArray.push(null);
      }
      matrix.push(rowArray);
    }
    return matrix;
  }

  static getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  static findEmptySpot(matrix) {
    let placeFound = false;
    let newRow, newCol;
    while (!placeFound) {
      newRow = HelperFunctions.getRandomInt(0, matrix.length - 1);
      newCol = HelperFunctions.getRandomInt(0, matrix[0].length - 1);
      if (!(matrix[newRow][newCol] instanceof ActionElement)) {
        placeFound = true;
      }
    }
    return { row: newRow, col: newCol };
  }

  static findPlayer() {
    for (let i = 0; i < game.gameMatrix.length; i++) {
      for (let j = 0; j < game.gameMatrix[i].length; j++) {
        if (game.gameMatrix[i][j] instanceof Player) {
          return { row: i, column: j };
        }
      }
    }
    return null;
  }

  static moveAtIndex(direction, indexes) {
    let elementToMove = game.gameMatrix[indexes.row][indexes.column];
    if (indexes) {
      switch (direction) {
        case "N":
          HelperFunctions.moveNorth(indexes);
          break;
        case "E":
          HelperFunctions.moveEast(indexes);
          break;
        case "S":
          HelperFunctions.moveSouth(indexes);
          break;
        case "W":
          HelperFunctions.moveWest(indexes);
          break;
        default:
          console.log("Invalid entry!");
          break;
      }
    } else {
      console.log(`${elementToMove.id} not found!`);
    }
    if (game.gameMatrix[indexes.row][indexes.col] !== elementToMove) {
      console.log(`${elementToMove.id} moved ${direction} successfully!`);
      return true;

    } else {
      console.log("Invalid move!");
      return false;
    }
  }

  static moveNorth(indexes) {
    if (indexes.row > 0) {
      game.matrixActionElements[indexes.row - 1][indexes.column] =
        game.matrixActionElements[indexes.row][indexes.column];
      game.matrixActionElements[indexes.row][indexes.column] = null;
    } else {
      console.log("Invalid move!");
      return null;
    }
  }
  
  static moveWest(indexes) {
    if (indexes.column > 0) {
      game.matrixActionElements[indexes.row][indexes.column - 1] =
        game.matrixActionElements[indexes.row][indexes.column];
      game.matrixActionElements[indexes.row][indexes.column] = null;
    } else {
      console.log("Invalid move!");
      return null;
    }
  }
  
  static moveEast(indexes) {
    if (indexes.column < game.matrixActionElements[0].length - 1) {
      game.matrixActionElements[indexes.row][indexes.column + 1] =
        game.matrixActionElements[indexes.row][indexes.column];
      game.matrixActionElements[indexes.row][indexes.column] = null;
    } else {
      console.log("Invalid move!");
      return null;
    }
  }
  
  static moveSouth(indexes) {
    if (indexes.row < game.matrixActionElements.length - 1) {
      game.matrixActionElements[indexes.row + 1][indexes.column] =
        game.matrixActionElements[indexes.row][indexes.column];
      game.matrixActionElements[indexes.row][indexes.column] = null;
    } else {
      console.log("Invalid move!");
      return null;
    }
  }

  static checkForCollision(indexes) {
    if (matrix[indexes.row][indexes.column] instanceof Zombie) {
      return true;
    } else {
      return false;
    }
  }
}
function startNewGame(){
  game.runGame();
}
const rows = 5;
const columns = 5;  
const game = new Game();


// const gameboard = new Gameboard();
// const helperFunctions = new HelperFunctions();
// const game = new Game();

// document.addEventListener('DOMContentLoaded', function()  {
// gameboard.matrixElements.fillMatrixbackgroundItems();
// gameboard.matrixElements.createAllActionElements();
// gameboard.createDivMatrix();
// game.refreshGameWindow();
