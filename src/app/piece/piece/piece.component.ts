import { Component, OnInit, Input } from '@angular/core';
import { GameConditionService, nextMove } from 'src/app/services/game-condition.service';

const DIVIDE = 1;

export interface PiecePosition {
  x: number;
  y: number;
}
export interface Piece {
  id: number;
  position: PiecePosition;
  style: {
    top: string, // TODO: SafeStyle
    left: string,
    width: string,
    height: string,
  };
  base: {
    oneSize: number;
  };
  className: string;
}

@Component({
  selector: 'app-piece',
  templateUrl: './piece.component.html',
  styleUrls: ['./piece.component.css']
})
export class PieceComponent implements OnInit {
  @Input() piece: Piece;
  private blank: Piece;

  constructor(
    gameCondition: GameConditionService,
  ) {
    gameCondition.pieces$.subscribe((pieces) => {
      this.blank = pieces.find((p) => this.isBlank(p));
    });
  }

  ngOnInit() {
  }

  onTap() {
    if (this.isBlank(this.piece)) { return; }
    const move = nextMove(this.piece.position, this.blank.position);
    switch (move) {
      case 'up':
        this.moveUp();
        break;
      case 'down':
        this.moveDown();
        break;
      case 'left':
        this.moveLeft();
        break;
      case 'right':
        this.moveRight();
        break;
    }
  }

  private moveLeft() {
    const { base } = this.piece;
    const oneSize = base.oneSize / DIVIDE;
    this.piece.position.x--;
    this.blank.position.x++;
    const left: number = parseInt(this.piece.style.left.replace('px', ''), 10);
    for (let val = 1; val <= DIVIDE; val++) {
      setTimeout(() => {
        const pos = left + (val * oneSize * -1);
        this.piece.style.left = `${pos}px`;
      }, 10 * val);
    }
  }

  private moveRight() {
    const { base } = this.piece;
    const oneSize = base.oneSize / DIVIDE;
    this.piece.position.x++;
    this.blank.position.x--;
    const left: number = parseInt(this.piece.style.left.replace('px', ''), 10);
    for (let val = 1; val <= DIVIDE; val++) {
      setTimeout(() => {
        const pos = left + (val * oneSize);
        this.piece.style.left = `${pos}px`;
      }, 10 * val);
    }
  }

  private moveUp() {
    const { base } = this.piece;
    const oneSize = base.oneSize / DIVIDE;
    this.piece.position.y++;
    this.blank.position.y--;
    const top: number = parseInt(this.piece.style.top.replace('px', ''), 10);
    for (let val = 1; val <= DIVIDE; val++) {
      setTimeout(() => {
        const pos = top + (val * oneSize);
        this.piece.style.top = `${pos}px`;
      }, 10 * val);
    }
  }

  private moveDown() {
    const { base } = this.piece;
    const oneSize = base.oneSize / DIVIDE;
    this.piece.position.y--;
    this.blank.position.y++;
    const top: number = parseInt(this.piece.style.top.replace('px', ''), 10);
    for (let val = 1; val <= DIVIDE; val++) {
      setTimeout(() => {
        const pos = top + (val * oneSize * -1);
        this.piece.style.top = `${pos}px`;
      }, 10 * val);
    }
  }

  private isBlank(piece: Piece): boolean {
    return piece.className === 'blank';
  }
}
