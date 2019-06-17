import { Injectable } from '@angular/core';
import { Subject, ReplaySubject, BehaviorSubject } from 'rxjs';
import { Piece, PiecePosition } from '../piece/piece/piece.component';

export type MoveActionType = 'up' | 'down' | 'left' | 'right' | 'none';
export type GameStatus = 'wait' | 'start' | 'playing' | 'clear';

@Injectable({
  providedIn: 'root'
})
export class GameConditionService {

  readonly pieces$: Subject<Piece[]> = new ReplaySubject<Piece[]>(1);
  readonly oneSide$: Subject<number> = new ReplaySubject<number>(1);
  readonly status$: Subject<GameStatus> = new BehaviorSubject<GameStatus>('wait');
  private status: GameStatus;

  constructor() {
    this.status$.subscribe((s) => this.status = s);
  }

  gameStart(pieces: Piece[], side: number): void {
    this.pieces$.next(pieces);
    this.oneSide$.next(side);
    this.status$.next('start');
  }

  gamePlaying(): void {
    this.status$.next('playing');
  }

  // 並び方はmakePieceに依存している
  clearCheck(pieces: Piece[]): void {
    if (this.status !== 'playing') { return; }
    let idx = 1;
    const isValid = pieces.sort(pieceSort).every((p) => p.id === idx++);
    if (isValid) {
      this.status$.next('clear');
      console.log('ゲームクリアー');
    }
  }
}

export function nextMove(piece: PiecePosition, blank: PiecePosition): MoveActionType {
  if (piece.x === blank.x && (piece.y + 1) === blank.y) {
    return 'up';
  } else if (piece.x === blank.x && (piece.y - 1) === blank.y) {
    return 'down';
  } else if ((piece.x + 1) === blank.x && piece.y === blank.y) {
    return 'right';
  } else if ((piece.x - 1) === blank.x && piece.y === blank.y) {
    return 'left';
  } else {
    return 'none';
  }
}

export function oppositeDirection(move: MoveActionType): MoveActionType {
  switch (move) {
    case 'up':
      return 'down';
    case 'down':
      return 'up';
    case 'left':
      return 'right';
    case 'right':
      return 'left';
  }
  return 'none';
}

export function pieceSort(a: Piece, b: Piece): number {
  const diff = a.position.y - b.position.y;
  return (diff === 0) ? (a.position.x - b.position.x) : diff;
}

export function canMovingIndex(index: number, side: number): number[] {
  // 上 左 右 下
  return [
    ((index - side) >= 0) ? index - side : undefined,
    ((index % side) !== 0) ? index - 1 : undefined,
    (((index + 1) % side) !== 0) ? index + 1 : undefined,
    ((index + side) <= (side * side) - 1) ? index + side : undefined,
  ].filter((val) => val !== undefined);
}

export function isBlank(piece: Piece): boolean {
  return piece.className === 'blank';
}
