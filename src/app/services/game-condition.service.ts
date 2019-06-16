import { Injectable } from '@angular/core';
import { Subject, ReplaySubject, BehaviorSubject } from 'rxjs';
import { Piece, PiecePosition } from '../piece/piece/piece.component';

export type MoveActionType = 'up' | 'down' | 'left' | 'right' | 'none';
export type GameStatus = 'wait' | 'playing' | 'clear';

@Injectable({
  providedIn: 'root'
})
export class GameConditionService {

  readonly pieces$: Subject<Piece[]> = new ReplaySubject<Piece[]>(1);
  readonly oneSide$: Subject<number> = new ReplaySubject<number>(1);
  readonly status$: Subject<GameStatus> = new BehaviorSubject<GameStatus>('wait');


  constructor() { }

  gameStart(pieces: Piece[], side: number): void {
    this.pieces$.next(pieces);
    this.oneSide$.next(side);
    this.status$.next('playing');
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
