import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Router, RoutesRecognized } from '@angular/router';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styles: [],
})
export class BreadcrumbComponent implements OnInit {
  items: MenuItem[] = [];

  constructor(private router: Router) {}

  ngOnInit() {
    this.router.events.forEach((event) => {
      if (event instanceof RoutesRecognized) {
        const routeRecognized: RoutesRecognized = event;
        const path: string[] = routeRecognized.url
          .split('/')
          .filter((r) => r !== '');
        this.items = path.map((route, i) => ({
          label: route.toUpperCase(),
        }));
      }
    });
  }
}
