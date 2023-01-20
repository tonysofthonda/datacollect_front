import { Component, OnInit } from '@angular/core';
import { MainComponent } from '../../main.component';
import { MenuService } from './menu.service';
import { MenuItem } from 'primeng/api';
import { MenuItemComponent } from '../menu-item/menu-item.component';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
})
export class MenuComponent implements OnInit {
  model: MenuItem[] = [];

  constructor(public app: MainComponent, private menuService: MenuService) {}

  ngOnInit() {
    if(!localStorage.getItem('menu')) {
        this.menuService.getMenuCategories().subscribe((menuCategories)=>{
        menuCategories.forEach(({ name, views, zOrder }) => {
          const menuItem: MenuItem = {
            label: name,
            tabindex: zOrder.toString(),
            items: views.map(
              ({ friendlyName, route, zOrder: zOrderView }): MenuItem => {
                return {
                  label: friendlyName,
                  routerLink: route,
                  tabindex: zOrderView.toString(),
                };
              }
            ),
          };
          this.model.push(menuItem);
          localStorage.setItem('menu', JSON.stringify(this.model));
          

        });
      });
    } else {
      const menu = localStorage.getItem('menu');
      const model: MenuItem[] = ((menu !== null) ? JSON.parse(menu) : this.model);

      model.forEach(element => {
        this.model.push(element);
      });
    }
  }
}
