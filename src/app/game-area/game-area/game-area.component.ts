import { Component, OnInit, Input, OnChanges, SimpleChanges, QueryList, ViewChildren } from '@angular/core';
import { Piece, PieceComponent } from 'src/app/piece/piece/piece.component';
import { GameConditionService, pieceSort, isBlank, canMovingIndex } from 'src/app/services/game-condition.service';
import { CONFIG } from 'src/app/util/constants';

@Component({
  selector: 'app-game-area',
  templateUrl: './game-area.component.html',
  styleUrls: ['./game-area.component.css']
})
export class GameAreaComponent implements OnInit, OnChanges {
  @Input() gameWidth: number;
  @ViewChildren(PieceComponent) children: QueryList<PieceComponent>;
  displayStyle = this.displayStyle = this.buildDisplayStyle(this.gameWidth);

  pieces: Piece[];

  constructor(
    private gameCondition: GameConditionService,
  ) { }

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.gameWidth) {
      this.displayStyle = this.buildDisplayStyle(this.gameWidth);
    }
  }

  onStart() {
    this.gameStart(CONFIG.side);
  }

  pieceAction() {
    this.gameCondition.clearCheck(this.pieces);
  }

  private makePiece(side: number): Piece[] {
    const pieces = [];
    for (let i = 0; i < (side * side); i++) {
      pieces.push(this.onePiece(i, side));
    }
    pieces[pieces.length - 1].className = 'blank';
    return pieces;
  }

  // ありったけの夢を掻き集めたい
  private onePiece(no: number, side: number): Piece {
    const oneSize = (this.gameWidth / side);
    const y = (no >= side) ? Math.floor(no / side) : 0;
    const x = (no % side);
    const position = { x, y };
    const top = (oneSize * position.y);
    const left = (oneSize * position.x);
    return {
      id: no + 1,
      position,
      style: {
        top: `${top}px`,
        left: `${left}px`,
        width: `${oneSize}px`,
        height: `${oneSize}px`,
      },
      base: {
        oneSize,
      },
      className: 'piece',
    };
  }

  private buildDisplayStyle(gameWidth: number) {
    return {
      width: `${gameWidth}px`,
      height: `${gameWidth}px`,
    };
  }

  private gameStart(side: number): void {
    this.pieces = this.makePiece(side);
    this.gameCondition.gameStart(this.pieces, side);
    setTimeout(() => {
      this.shuffle();
      this.gameCondition.gamePlaying();
    }, 1);
  }

  private shuffle(): void {
    const children = this.children.toArray();
    const history: number[] = [];
    for (let idx = 0; idx < 50; idx++) {
      setTimeout(() => {
        const pieces = this.pieces.sort(pieceSort);
        const blankIdx = pieces.findIndex(isBlank);
        // 自然な感じになるように一つ前のポジションにならないようにさせる。
        const canMoving = canMovingIndex(blankIdx, CONFIG.side).filter((p) => p !== history[history.length - 2]);
        const pos = canMoving[this.random(canMoving.length)];
        history.push(pos);
        const tapPiece = pieces[pos];
        children.find((c) => c.piece.id === tapPiece.id).onTap();
      }, (CONFIG.slideTime + 10) * idx);
    }
  }

  private random(size: number): number {
    const min = 0;
    const max = size - 1;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
