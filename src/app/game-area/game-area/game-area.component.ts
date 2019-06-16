import { Component, OnInit, Input, OnChanges, SimpleChanges, QueryList, ViewChildren } from '@angular/core';
import { Piece, PieceComponent } from 'src/app/piece/piece/piece.component';
import { GameConditionService } from 'src/app/services/game-condition.service';

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
    this.gameStart(4);
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
    }, 1);
  }

  private shuffle(): void {
    this.children.toArray()[this.children.length - 2].onTap();
    console.log(this.pieces);
    console.log(this.pieces.sort((a, b) => {
      const diff = a.position.y - b.position.y;
      return (diff === 0) ? (a.position.x - b.position.x) : diff;
    }));
  }
}
