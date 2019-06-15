import { TestBed } from '@angular/core/testing';

import { GameConditionService, nextMove } from './game-condition.service';

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
