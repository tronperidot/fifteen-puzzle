import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { PieceComponent } from './piece/piece/piece.component';
import { GameAreaComponent } from './game-area/game-area/game-area.component';

@NgModule({
  declarations: [
    AppComponent,
    PieceComponent,
    GameAreaComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
