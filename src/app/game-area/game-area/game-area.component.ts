import { Component, OnInit, Input } from '@angular/core';
import { Piece } from 'src/app/piece/piece/piece.component';
import { GameConditionService } from 'src/app/services/game-condition.service';

@Component({
  selector: 'app-game-area',
  templateUrl: './game-area.component.html',
  styleUrls: ['./game-area.component.css']
})
export class GameAreaComponent implements OnInit {
  @Input() gameWidth: number;

  pieces: Piece[];

  constructor(
    private gameCondition: GameConditionService,
  ) {
    this.gameCondition.oneSide$.subscribe((side) => {
      this.pieces = this.makePiece(side);
      this.gameCondition.setPieces(this.pieces);
    });
  }

  ngOnInit() {
    this.gameStart();
    // console.log(this.pieces);
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

  private gameStart(): void {
    this.gameCondition.setOneSide(4);
  }
}
