import { Component } from '@angular/core';
import { MainComponent } from '../../main.component';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss'],
})
export class TopbarComponent {
  constructor(public app: MainComponent) {}
}
