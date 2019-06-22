import * as Phaser from 'phaser';

const PIECE_WIDTH = 200;
const PIECE_HEIGHT = 200;

export class GameScene extends Phaser.Scene {

  sand: Phaser.Physics.Arcade.StaticGroup;
  info: Phaser.GameObjects.Text;
  shuffledIndexArray = [];
  piecesGroup: Phaser.GameObjects.Group;
  piecesAmount;

  constructor() {
    super({
      key: 'GameScene'
    });
  }

  init(/*params: any*/): void {
  }

  preload(): void {
    this.load.spritesheet('background',
      'https://raw.githubusercontent.com/photonstorm/phaser-examples/master/examples/assets/games/sliding-puzzle/bl.jpg',
      {
        frameWidth: PIECE_WIDTH,
        frameHeight: PIECE_HEIGHT,
      });
  }

  create(): void {
   this.prepareBoard();
  }

  update(time: number): void {
  }

  private prepareBoard(): void {
    let piecesIndex = 0;
    // game.world.width 調べる
    const BOARD_COLS = Math.floor(800 / PIECE_WIDTH);
    const BOARD_ROWS = Math.floor(600 / PIECE_HEIGHT);
    this.piecesAmount = BOARD_COLS * BOARD_ROWS;
    this.shuffledIndexArray = this.createShuffledIndexArray();
    this.piecesGroup = this.add.group();
    for (let i = 0; i < BOARD_ROWS; i++) {
      for (let j = 0; j < BOARD_COLS; j++) {
        let piece;
        if (this.shuffledIndexArray[piecesIndex]) {
            piece = this.piecesGroup.create(j * PIECE_WIDTH, i * PIECE_HEIGHT, 'background', this.shuffledIndexArray[piecesIndex]);
        } else { // initial position of black piece
            piece = this.piecesGroup.create(j * PIECE_WIDTH, i * PIECE_HEIGHT);
            piece.black = true;
        }
        piece.name = 'piece' + i.toString() + 'x' + j.toString();
        piece.currentIndex = piecesIndex;
        piece.destIndex = this.shuffledIndexArray[piecesIndex];
        piece.inputEnabled = true;
        piece.on('pointerdown', this.onSelectPiece(piece), this);
        piece.posX = j;
        piece.posY = i;
        piecesIndex++;
      }
    }
  }

  private createShuffledIndexArray() {
    const indexArray = [];
    for (let i = 0; i < this.piecesAmount; i++) {
      indexArray.push(i);
    }

    return this.shuffle(indexArray);

}

private onSelectPiece(piece): () => void {
  return () => {
    console.log('pointerdown');
    this.selectPiece(piece);
  };
}

private selectPiece(piece) {
  const blackPiece = this.canMove(piece);

  // if there is a black piece in neighborhood
  if (blackPiece) {
    this.movePiece(piece, blackPiece);
  }
}

private canMove(piece) {
  let foundBlackElem = false;

  this.piecesGroup.children.getArray().forEach((element: any) => {
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

private movePiece(piece, blackPiece) {
  const tmpPiece = {
      posX: piece.posX,
      posY: piece.posY,
      currentIndex: piece.currentIndex
  };

  const tween = this.add.tween(piece);
  tween.updateTo('x', blackPiece.posX * PIECE_WIDTH, true);
  tween.updateTo('y', blackPiece.posY * PIECE_HEIGHT, true);

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
  this.checkIfFinished();
}

private checkIfFinished() {
  let isFinished = true;

  this.piecesGroup.children.getArray().forEach((element: any) => {
    if (element.currentIndex !== element.destIndex) {
        isFinished = false;
        return;
    }
  });

  if (isFinished) {
    this.showFinishedText();
  }
}

private showFinishedText() {
  const style = { font: '40px Arial', fill: '#000', align: 'center' };

  // const text = this.add.text(game.world.centerX, game.world.centerY, 'Congratulations! \nYou made it!', style);
  // text.anchor.set(0.5);
}

private shuffle(array) {
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

}
