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
}

// Functions to create and place game elements
class MatrixElementsCreation {
  constructor() {}
  static fillMatrixbackgroundItems() {
    game.matrixBackgroundElements = HelperFunctions.createMatrix(rows, columns);
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
      position = HelperFunctions.findEmptySpot(game.matrixActionElements);
      game.matrixActionElements[position.row][position.col] = new Cat(
        `Cat-${i + 1}`
      );
      console.log(`Cat ${i + 1} created at ${position.row}, ${position.col}`);
    }
  }
  static fillZombies() {
    for (let i = 0; i < game.zombies; i++) {
      position = HelperFunctions.findEmptySpot(game.matrixActionElements);
      game.matrixActionElements[position.row][position.col] = new Zombie(
        `Zombie-${i + 1}`
      );
      console.log(
        `Zombie ${i + 1} created at ${position.row}, ${position.col}`
      );
    }
  }

  static refreshGameMatrix() {
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < columns; j++) {
        if (game.gameMatrix[i][j] instanceof ActionElement) {
          game.gameMatrix[i][j] = game.matrixActionElements[i][j];
        } else {
          game.gameMatrix[i][j] = game.matrixBackgroundElements[i][j];
        }
      }
    }
  }
}
// Collects all game logic functions
class Game {
  constructor() {
    if (Game.instance == null) {
      init();
      Gameboard.createDivMatrix();
      Gameboard.refreshGameWindow(tx);
      runGame();
    }
    Game.instance = this;
  }
  //Fills the game matrix with background elements then overwrites them with action elements if position holds one

  init() {
    this.rows = 5;
    this.columns = 5;
    this.cats = 2;
    this.zombies = 2;
    this.matrixActionElements =
      MatrixElementsCreation.createAllActionElements();
    this.matrixBackgroundElements =
      MatrixElementsCreation.fillMatrixbackgroundItems();
    this.gameMatrix = MatrixElementsCreation.refreshGameMatrix(
      this.matrixActionElements,
      this.matrixBackgroundElements
    );
    this.playerAlive = true;
  }

  runGame() {
    console.log("Starting new game");
    document.addEventListener("keydown", function (event) {
      handleKeyDown(event.key);
    });
    console.log(`New game started`);
  }

  handleKeyDown(pressedKey) {
    let hasMoved = false;
    this.movePlayer(pressedKey);
    moveZombies();
    moveCats();
    HelperFunctions.checkForCollision();
    Gameboard.refreshGameWindow();
  }

  movePlayer(direction) {
    let playerPosition = HelperFunctions.findPlayer();
    HelperFunctions.moveAtIndex(direction, playerPosition);
  }

  static moveZombies() {
    for (let i = 0; i < game.matrixActionElements.length; i++) {
      for (let j = 0; j < game.matrixActionElements[i].length; j++) {
        if (game.matrixActionElements[i][j] instanceof Zombie) {
          let zombie = game.matrixActionElements[i][j];
          while (!hasMoved) {
            let direction = numberToDirection();
            HelperFunctions.moveAtIndex(direction);
            if (!game.matrixActionElements[i][j] === zombie) {
              hasMoved = true;
            }
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

  static moveCats() {
    for (let i = 0; i < this.gameMatrix.length; i++) {
      for (let j = 0; j < this.gameMatrix[i].length; j++) {
        if (this.gameMatrix[i][j] instanceof Cat) {
          let hasMoved = false;
          while (!hasMoved) {
            let numberToDirection = new Map([
              [1, "N"],
              [2, "E"],
              [3, "W"],
              [4, "S"],
            ]);
            let direction = numberToDirection.get(
              HelperFunctions.getRandomInt(1, 4)
            );
          }
        }
      }
    }
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

  static findPlayer(matrix) {
    for (let i = 0; i < matrix.length; i++) {
      for (let j = 0; j < matrix[i].length; j++) {
        if (matrix[i][j] instanceof Player) {
          return { row: i, column: j };
        }
      }
    }
    return null;
  }

  static moveAtIndex(direction, indexes) {
    let newMatrix = null;
    if (indexes) {
      switch (direction) {
        case "N":
          newMatrix = HelperFunctions.moveNorth(matrix, indexes);

          break;
        case "E":
          newMatrix = HelperFunctions.moveEast(matrix, indexes);
          break;
        case "S":
          newMatrix = HelperFunctions.moveSouth(matrix, indexes);
          break;
        case "W":
          newMatrix = HelperFunctions.moveWest(matrix, indexes);
          break;
        default:
          console.log("Invalid entry!");
          break;
      }
    } else {
      console.log("Player not found!");
    }
    if (newMatrix) {
      return newMatrix;
    } else {
      console.log("Invalid move!");
      return null;
    }
  }

  static moveNorth(matrix, indexes) {
    if (indexes.row > 0) {
      let oldPosition = matrix[indexes.row][playerindexes.col];
      let newPosition = matrix[indexes.row - 1][playerindexes.col];
      matrix[indexes.row - 1][playerindexes.col] =
        matrix[indexes.row][playerindexes.col];
      matrix[indexes.row][playerindexes.col] = null;
      return matrix;
    } else {
      console.log("Invalid move!");
      return null;
    }
  }

  static moveEast(matrix, indexes) {
    if (indexes.col < matrix[0].length - 1) {
      let oldPosition = matrix[indexes.row][indexes.col];
      let newPosition = matrix[indexes.row][indexes.col + 1];
      matrix[indexes.row][indexes.col + 1] = oldPosition;
      matrix[indexes.row][indexes.col] = null;
    }
  }

  static moveSouth(matrix, indexes) {
    if (indexes.row < matrix.length - 1) {
      let oldPosition = matrix[indexes.row][indexes.col];
      let newPosition = matrix[indexes.row + 1][indexes.col];
      matrix[indexes.row + 1][indexes.col] = oldPosition;
      matrix[indexes.row][indexes.col] = null;
    }
  }

  static moveWest(matrix, indexes) {
    if (indexes.col > 0) {
      let oldPosition = matrix[indexes.row][indexes.col];
      let newPosition = matrix[indexes.row][indexes.col - 1];
      matrix[indexes.row][indexes.col - 1] = oldPosition;
      matrix[indexes.row][indexes.col] = null;
    }
  }
  static checkForCollision(matrix, indexes) {
    if (matrix[indexes.row][indexes.col] instanceof Zombie) {
      return true;
    } else {
      return false;
    }
  }
}

const game = new Game();
// const gameboard = new Gameboard();
// const helperFunctions = new HelperFunctions();
// const game = new Game();

// document.addEventListener('DOMContentLoaded', function()  {
// gameboard.matrixElements.fillMatrixbackgroundItems();
// gameboard.matrixElements.createAllActionElements();
// gameboard.createDivMatrix();
// game.refreshGameWindow();
