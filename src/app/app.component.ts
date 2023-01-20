import { Component } from '@angular/core';
import { NavigationEnd, NavigationStart, NavigationError,NavigationCancel, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {
  isLoader!: boolean;

  constructor(private router: Router) {}

  ngOnInit() {
    this.routerEvents();
  }

  routerEvents() {
    this.router.events.subscribe((event) => {
      switch (true) {
        case event instanceof NavigationStart: {
          this.isLoader = true;
          break;
        }
        case event instanceof NavigationCancel:
        case event instanceof NavigationEnd: {
          this.isLoader = false;
          break;
        }
      }
    });
  }
}
