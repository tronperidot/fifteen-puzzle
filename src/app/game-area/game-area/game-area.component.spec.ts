import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GameAreaComponent } from './game-area.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('GameAreaComponent', () => {
  let component: GameAreaComponent;
  let fixture: ComponentFixture<GameAreaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
      declarations: [ GameAreaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GameAreaComponent);
    component = fixture.componentInstance;
    component.gameWidth = 600;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
