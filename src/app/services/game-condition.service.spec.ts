import { TestBed } from '@angular/core/testing';

import { GameConditionService, nextMove, canMovingIndex } from './game-condition.service';

describe('GameConditionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GameConditionService = TestBed.get(GameConditionService);
    expect(service).toBeTruthy();
  });
});

describe('nextMove', () => {
  expect(nextMove({ x: 0, y: 1 }, { x: 1, y: 1 })).toBe('right');
  expect(nextMove({ x: 1, y: 0 }, { x: 1, y: 1 })).toBe('up');
  expect(nextMove({ x: 1, y: 1 }, { x: 0, y: 1 })).toBe('left');
  expect(nextMove({ x: 1, y: 1 }, { x: 1, y: 0 })).toBe('down');
  expect(nextMove({ x: 1, y: 1 }, { x: 1, y: 1 })).toBe('none');
  expect(nextMove({ x: 1, y: 1 }, { x: 3, y: 3 })).toBe('none');
});

// [ 0,  1,  2,  3]
// [ 4,  5,  6,  7]
// [ 8,  9, 10, 11]
// [12, 13, 14, 15]
describe('canMovingIndex', () => {
  expect(canMovingIndex(0, 4)).toEqual([1, 4]);
  expect(canMovingIndex(6, 4)).toEqual([2, 5, 7, 10]);
  expect(canMovingIndex(15, 4)).toEqual([11, 14]);
});
