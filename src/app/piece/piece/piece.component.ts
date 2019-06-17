import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { GameConditionService, nextMove, isBlank } from 'src/app/services/game-condition.service';
import { CONFIG } from 'src/app/util/constants';

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
    oneSize: number; // TODO: gameCondition
  };
  className: string;
}

interface Moving {
  position: 'top' | 'left';
  vector: -1 | 1;
}

@Component({
  selector: 'app-piece',
  templateUrl: './piece.component.html',
  styleUrls: ['./piece.component.css']
})
export class PieceComponent implements OnInit {
  @Input() piece: Piece;
  @Output() action = new EventEmitter<string>();

  private blank: Piece;

  constructor(
    gameCondition: GameConditionService,
  ) {
    gameCondition.pieces$.subscribe((pieces) => {
      this.blank = pieces.find((p) => isBlank(p));
    });
  }

  ngOnInit() {
  }

  onTap() {
    if (isBlank(this.piece)) { return; }
    const move = nextMove(this.piece.position, this.blank.position);
    switch (move) {
      case 'none':
        return;
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
    this.action.emit('onTap');
  }

  private moveLeft() {
    this.piece.position.x--;
    this.blank.position.x++;
    const moving = { position: 'left', vector: -1 } as Moving;
    this.slide(moving, CONFIG.slideTime);
  }

  private moveRight() {
    this.piece.position.x++;
    this.blank.position.x--;
    const moving = { position: 'left', vector: 1 } as Moving;
    this.slide(moving, CONFIG.slideTime);
  }

  private moveUp() {
    this.piece.position.y++;
    this.blank.position.y--;
    const moving = { position: 'top', vector: 1 } as Moving;
    this.slide(moving, CONFIG.slideTime);
  }

  private moveDown() {
    this.piece.position.y--;
    this.blank.position.y++;
    const moving = { position: 'top', vector: -1 } as Moving;
    this.slide(moving, CONFIG.slideTime);
  }

  private slide(moving: Moving, slideTime: number) {
    const frame = 10;
    const divide  = slideTime / frame;
    const { base } = this.piece;
    const oneSize = base.oneSize / divide;
    const basePos: number = parseInt(this.piece.style[moving.position].replace('px', ''), 10);
    for (let val = 1; val <= divide; val++) {
      setTimeout(() => {
        const pos = basePos + (val * oneSize * moving.vector);
        this.piece.style[moving.position] = `${pos}px`;
      }, frame * val);
    }
  }

  isBlank(piece: Piece): boolean {
    return isBlank(piece);
  }
}
