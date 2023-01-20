import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FetchType } from '@enums/fetch-type.enum';
import { map, Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { MenuCategory as MenuCategoryScreen, View as ViewScreen } from './menu.model';
import { MenuCategory } from '@models/menu-category.model';
import { View } from '@models/view.model';

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  private menuSource = new Subject<string>();
  private resetSource = new Subject();

  menuSource$ = this.menuSource.asObservable();
  resetSource$ = this.resetSource.asObservable();

  constructor(private http: HttpClient) {}

  public getMenuCategories(): Observable<MenuCategoryScreen[]> {
    return this.http
      .get<MenuCategory[]>(
        `${environment.backendUrl}/menu/list?fetchType=${FetchType.EAGER}`
      )
      .pipe(map((menuCategories=[])=>menuCategories.map((menuCategory)=>this.castMenuCategory(menuCategory))));
  }

  onMenuStateChange(key: string) {
    this.menuSource.next(key);
  }

  reset() {
    this.resetSource.next('');
  }

  private castMenuCategory({ id=-1, name="", order=-1, views=[] }: MenuCategory): MenuCategoryScreen {
    return {
      id: id,
      name,
      zOrder: order,
      views: views.map((view)=>this.castView(view)),
    };
  }

  private castView({ id=-1, name="", friendlyName="", route="", order=-1 }: View): ViewScreen {
    return {id: id, name, friendlyName, route, zOrder: order};
  }
}
