import { Component, ViewChild, AfterViewInit, ElementRef } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  @ViewChild('game') public element: ElementRef;
  title = 'fifteen-puzzle';

  get gameWidth() {
    return this.element.nativeElement.offsetWidth;
  }
}
