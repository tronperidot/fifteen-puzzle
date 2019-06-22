
const config: Phaser.Types.Core.GameConfig = {
  width: 600,
  height: 600,
  type: Phaser.AUTO,
  parent: 'content',
  scene: { preload: this.preload, create: this.create },
};
export const game = new Phaser.Game(config);

const PIECE_WIDTH = 200;
const PIECE_HEIGHT = 200;
let BOARD_COLS;
let BOARD_ROWS;

let piecesGroup;
let piecesAmount;
let shuffledIndexArray = [];

function preload() {
    this.load.spritesheet('background',
      'https://raw.githubusercontent.com/photonstorm/phaser-examples/master/examples/assets/games/sliding-puzzle/bl.jpg',
      PIECE_WIDTH, PIECE_HEIGHT);
}

function create() {
    prepareBoard();
}

function prepareBoard() {
  let piecesIndex = 0;

  BOARD_COLS = Math.floor(game.world.width / PIECE_WIDTH);
  BOARD_ROWS = Math.floor(game.world.height / PIECE_HEIGHT);

  piecesAmount = BOARD_COLS * BOARD_ROWS;

  shuffledIndexArray = createShuffledIndexArray();

  piecesGroup = game.scene.add.group();

  for (let i = 0; i < BOARD_ROWS; i++) {
    for (let j = 0; j < BOARD_COLS; j++) {
      let piece;
      if (shuffledIndexArray[piecesIndex]) {
          piece = piecesGroup.create(j * PIECE_WIDTH, i * PIECE_HEIGHT, 'background', shuffledIndexArray[piecesIndex]);
      } else { // initial position of black piece
          piece = piecesGroup.create(j * PIECE_WIDTH, i * PIECE_HEIGHT);
          piece.black = true;
      }
      piece.name = 'piece' + i.toString() + 'x' + j.toString();
      piece.currentIndex = piecesIndex;
      piece.destIndex = shuffledIndexArray[piecesIndex];
      piece.inputEnabled = true;
      piece.events.onInputDown.add(selectPiece, this);
      piece.posX = j;
      piece.posY = i;
      piecesIndex++;
    }
  }

}

function selectPiece(piece) {
  const blackPiece = canMove(piece);

  // if there is a black piece in neighborhood
  if (blackPiece) {
      movePiece(piece, blackPiece);
  }
}

function canMove(piece) {
  let foundBlackElem = false;

  piecesGroup.children.forEach((element) => {
    if (element.posX === (piece.posX - 1) && element.posY === piece.posY && element.black ||
        element.posX === (piece.posX + 1) && element.posY === piece.posY && element.black ||
        element.posY === (piece.posY - 1) && element.posX === piece.posX && element.black ||
        element.posY === (piece.posY + 1) && element.posX === piece.posX && element.black) {
        foundBlackElem = element;
        return;
    }
  });

  return foundBlackElem;
}

function movePiece(piece, blackPiece) {
  const tmpPiece = {
      posX: piece.posX,
      posY: piece.posY,
      currentIndex: piece.currentIndex
  };

  game.scene.add
    .tween(piece).to({x: blackPiece.posX * PIECE_WIDTH, y: blackPiece.posY * PIECE_HEIGHT}, 300, Phaser.Easing.Linear.None, true);

  // change places of piece and blackPiece
  piece.posX = blackPiece.posX;
  piece.posY = blackPiece.posY;
  piece.currentIndex = blackPiece.currentIndex;
  piece.name = 'piece' + piece.posX.toString() + 'x' + piece.posY.toString();

  // piece is the new black
  blackPiece.posX = tmpPiece.posX;
  blackPiece.posY = tmpPiece.posY;
  blackPiece.currentIndex = tmpPiece.currentIndex;
  blackPiece.name = 'piece' + blackPiece.posX.toString() + 'x' + blackPiece.posY.toString();

  // after every move check if puzzle is completed
  checkIfFinished();
}

function checkIfFinished() {
  let isFinished = true;

  piecesGroup.children.forEach((element) => {
    if (element.currentIndex !== element.destIndex) {
        isFinished = false;
        return;
    }
  });

  if (isFinished) {
    showFinishedText();
  }
}

function showFinishedText() {
    const style = { font: '40px Arial', fill: '#000', align: 'center' };

    const text = game.scene.add.text(game.world.centerX, game.world.centerY, 'Congratulations! \nYou made it!', style);

    text.anchor.set(0.5);

}

function createShuffledIndexArray() {
    const indexArray = [];
    for (let i = 0; i < piecesAmount; i++) {
      indexArray.push(i);
    }

    return shuffle(indexArray);

}

function shuffle(array) {
  let counter = array.length;
  let temp;
  let index;

  while (counter > 0) {
      index = Math.floor(Math.random() * counter);
      counter--;
      temp = array[counter];
      array[counter] = array[index];
      array[index] = temp;
  }

  return array;
}
