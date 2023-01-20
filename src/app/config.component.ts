import { Component, OnInit } from '@angular/core';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';
import { MainComponent } from './main.component';

@Component({
  selector: 'app-config',
  template: `
    <a
      href="#"
      class="layout-config-button"
      (click)="onConfigButtonClick($event)"
    >
      <i class="pi pi-cog"></i>
    </a>
    <div
      class="layout-config"
      [ngClass]="{
        'layout-config-exit-done': !app.configDialogActive,
        'layout-config-enter-done': app.configDialogActive
      }"
      [@children]="
        app.configDialogActive ? 'visibleAnimated' : 'hiddenAnimated'
      "
    >
      <div class="layout-config-content">
        <a
          href="#"
          class="layout-config-close"
          (click)="onConfigCloseClick($event)"
        >
          <i class="pi pi-times"></i>
        </a>
        <p-tabView>
          <p-tabPanel header="TopBar">
            <div class="layout-config-subtitle">Size</div>
            <div class="p-grid">
              <div class="p-col p-col-fixed">
                <a
                  href="#"
                  class="layout-config-option layout-config-option-image layout-config-option-light p-shadow-1"
                  (click)="changeTopBarSize($event, 'large')"
                >
                  <img
                    src="assets/layout/images/configurator/topbar-large.png"
                    alt="sapphire"
                    style="width:100%"
                  />
                  <i class="pi pi-check" *ngIf="app.topbarSize === 'large'"></i>
                </a>
              </div>
              <div class="p-col p-col-fixed">
                <a
                  href="#"
                  class="layout-config-option layout-config-option-image layout-config-option-light p-shadow-1"
                  (click)="changeTopBarSize($event, 'medium')"
                >
                  <img
                    src="assets/layout/images/configurator/topbar-medium.png"
                    alt="sapphire"
                    style="width:100%"
                  />
                  <i
                    class="pi pi-check"
                    *ngIf="app.topbarSize === 'medium'"
                  ></i>
                </a>
              </div>
              <div class="p-col p-col-fixed">
                <a
                  href="#"
                  class="layout-config-option layout-config-option-image layout-config-option-light p-shadow-1"
                  (click)="changeTopBarSize($event, 'small')"
                >
                  <img
                    src="assets/layout/images/configurator/topbar-small.png"
                    alt="sapphire"
                    style="width:100%"
                  />
                  <i class="pi pi-check" *ngIf="app.topbarSize === 'small'"></i>
                </a>
              </div>
            </div>

            <div class="layout-config-subtitle">Themes</div>
            <div class="p-grid">
              <div class="p-col" *ngFor="let topbarTheme of topbarThemes">
                <a
                  href="#"
                  class="layout-config-option layout-config-option-image p-shadow-1"
                  (click)="app.changeTopbarTheme($event, topbarTheme.file)"
                >
                  <img
                    src="assets/layout/images/configurator/{{
                      topbarTheme.image
                    }}"
                    alt="{{ topbarTheme.name }}"
                  />
                  <i
                    class="pi pi-check"
                    *ngIf="
                      'layout-topbar-' + topbarTheme.file === app.topbarColor
                    "
                  ></i>
                </a>
              </div>
            </div>
          </p-tabPanel>
          <p-tabPanel header="Menu">
            <div class="layout-config-subtitle">Orientation</div>
            <div class="p-grid">
              <div class="p-col p-col-fixed">
                <a
                  href="#"
                  class="layout-config-option layout-config-option-image layout-config-option-light p-shadow-1"
                  (click)="app.changeMenuToHorizontal($event, true)"
                >
                  <img
                    src="assets/layout/images/configurator/horizontal.png"
                    alt="sapphire"
                    style="width:100%"
                  />
                  <i class="pi pi-check" *ngIf="app.horizontal"></i>
                </a>
              </div>
              <div class="p-col p-col-fixed">
                <a
                  href="#"
                  class="layout-config-option layout-config-option-image layout-config-option-light p-shadow-1"
                  (click)="app.changeMenuToHorizontal($event, false)"
                >
                  <img
                    src="assets/layout/images/configurator/vertical.png"
                    alt="sapphire"
                    style="width:100%"
                  />
                  <i class="pi pi-check" *ngIf="!app.horizontal"></i>
                </a>
              </div>
            </div>

            <div class="layout-config-subtitle">Theme</div>
            <div class="p-grid">
              <div class="p-col" *ngFor="let menuTheme of menuThemes">
                <a
                  href="#"
                  class="layout-config-option layout-config-option-image p-shadow-1"
                  [ngClass]="{
                    'layout-config-option-light': menuTheme.file === 'light'
                  }"
                  (click)="app.changeMenuTheme($event, menuTheme.file)"
                >
                  <img
                    src="assets/layout/images/configurator/{{
                      menuTheme.image
                    }}"
                    alt="{{ menuTheme.name }}"
                  />
                  <i
                    class="pi pi-check"
                    *ngIf="'layout-menu-' + menuTheme.file === app.menuColor"
                  ></i>
                </a>
              </div>
            </div>
          </p-tabPanel>
          <p-tabPanel header="Components">
            <div class="p-grid">
              <div class="p-col-12 p-md-4">
                <div class="layout-config-subtitle">Input Style</div>
                <div class="p-formgroup-inline">
                  <div class="p-field-radiobutton">
                    <p-radioButton
                      name="inputStyle"
                      value="outlined"
                      [(ngModel)]="app.inputStyle"
                      inputId="inputStyle1"
                    ></p-radioButton>
                    <label for="inputStyle1">Outlined</label>
                  </div>
                  <div class="p-field-radiobutton">
                    <p-radioButton
                      name="inputStyle"
                      value="filled"
                      [(ngModel)]="app.inputStyle"
                      inputId="inputStyle2"
                    ></p-radioButton>
                    <label for="inputStyle2">Filled</label>
                  </div>
                </div>
              </div>
              <div class="p-col-12 p-md-3">
                <div class="layout-config-subtitle">Ripple Effect</div>
                <p-inputSwitch
                  [ngModel]="app.ripple"
                  (onChange)="app.onRippleChange($event)"
                ></p-inputSwitch>
              </div>
              <div class="p-col-12 p-md-5">
                <div class="layout-config-subtitle">Theme Modes</div>
                <div class="p-formgroup-inline">
                  <div class="p-field-radiobutton">
                    <p-radioButton
                      name="compactMode"
                      [value]="true"
                      [(ngModel)]="app.compactMode"
                      inputId="compactMode1"
                      (onClick)="app.changeThemeStyle($event, true)"
                    ></p-radioButton>
                    <label for="compactMode1">Compact</label>
                  </div>
                  <div class="p-field-radiobutton">
                    <p-radioButton
                      name="compactMode"
                      [value]="false"
                      [(ngModel)]="app.compactMode"
                      inputId="compactMode2"
                      (onClick)="app.changeThemeStyle($event, false)"
                    ></p-radioButton>
                    <label for="compactMode2">Standart</label>
                  </div>
                </div>
              </div>
            </div>

            <div class="layout-config-subtitle">Component Themes</div>
            <div class="p-grid">
              <div class="p-col" *ngFor="let componentTheme of componentThemes">
                <a
                  href="#"
                  class="layout-config-option layout-config-option-image p-shadow-1"
                  (click)="
                    app.changeComponentTheme($event, componentTheme.file)
                  "
                >
                  <img
                    src="assets/layout/images/configurator/theme/{{
                      componentTheme.image
                    }}"
                    alt="{{ componentTheme.name }}"
                  />
                  <i
                    class="pi pi-check"
                    *ngIf="componentTheme.file === app.themeColor"
                  ></i>
                </a>
              </div>
            </div>
          </p-tabPanel>
          <p-tabPanel header="Primary Color">
            <p>
              Primary Color defines the highlight color of active menus. Note
              that this setting is only utilized in <b>light</b> and
              <b>light</b>menu modes as other menu themes have their own color
              to highlight the active menus.
            </p>
            <div class="p-grid p-primary-colors-grid">
              <div class="p-col" *ngFor="let primaryColor of primaryColors">
                <a
                  href="#"
                  class="layout-config-option p-shadow-1"
                  [ngStyle]="{ background: primaryColor.color }"
                  (click)="app.changePrimaryColor($event, primaryColor.file)"
                >
                  <i
                    class="pi pi-check"
                    *ngIf="primaryColor.file === app.layoutColor"
                  ></i>
                </a>
              </div>
            </div>
          </p-tabPanel>
        </p-tabView>
      </div>
    </div>
  `,
  styles: [],
})
export class ConfigComponent implements OnInit {
  topbarThemes: any;

  menuThemes: any;

  primaryColors: any;

  componentThemes: any;

  constructor(public app: MainComponent) {}

  ngOnInit() {
    this.topbarThemes = [
      { name: 'Blue', file: 'blue', image: 'blue.svg' },
      { name: 'Ash', file: 'ash', image: 'ash.svg' },
      { name: 'Kashmir', file: 'kashmir', image: 'kashmir.svg' },
      { name: 'Orange', file: 'orange', image: 'orange.svg' },
      { name: 'Midnight', file: 'midnight', image: 'midnight.svg' },
      { name: 'Sunset', file: 'sunset', image: 'sunset.svg' },
      { name: 'Marley', file: 'marley', image: 'marley.svg' },
      { name: 'Harvey', file: 'harvey', image: 'harvey.svg' },
      { name: 'Vanusa', file: 'vanusa', image: 'vanusa.svg' },
      { name: 'Skyline', file: 'skyline', image: 'skyline.svg' },
      { name: 'Royal', file: 'royal', image: 'royal.svg' },
      { name: 'Disco', file: 'disco', image: 'disco.svg' },
      { name: 'Sky', file: 'sky', image: 'sky.svg' },
      { name: 'Rose', file: 'rose', image: 'rose.svg' },
      { name: 'Revolt', file: 'revolt', image: 'revolt.svg' },
      { name: 'Forest', file: 'forest', image: 'forest.svg' },
      { name: 'Night', file: 'night', image: 'night.svg' },
      { name: 'Apricot', file: 'apricot', image: 'apricot.svg' },
      { name: 'Faraway', file: 'faraway', image: 'faraway.svg' },
      { name: 'Grape', file: 'grape', image: 'grape.svg' },
      { name: 'River', file: 'river', image: 'river.svg' },
      { name: 'Dock', file: 'dock', image: 'dock.svg' },
      { name: 'Material One', file: 'materialone', image: 'materialone.png' },
      { name: 'Material Two', file: 'materialtwo', image: 'materialtwo.png' },
      { name: 'Polygons', file: 'polygons', image: 'polygons.png' },
      {
        name: 'Connections One',
        file: 'connectionsone',
        image: 'connectionsone.png',
      },
      {
        name: 'Connections Two',
        file: 'connectionstwo',
        image: 'connectionstwo.png',
      },
      { name: 'Road', file: 'road', image: 'road.png' },
      { name: 'Reflection', file: 'reflection', image: 'reflection.png' },
      { name: 'Waves', file: 'waves', image: 'waves.png' },
      { name: 'Sandiego', file: 'sandiego', image: 'sandiego.png' },
      { name: 'Architecture', file: 'architecture', image: 'architecture.png' },
      { name: 'Snow', file: 'snow', image: 'snow.png' },
      { name: 'Palm', file: 'palm', image: 'palm.png' },
      { name: 'Fluid', file: 'fluid', image: 'fluid.png' },
      { name: 'Balloon', file: 'balloon', image: 'balloon.png' },
      { name: 'Downtown', file: 'downtown', image: 'downtown.png' },
      { name: 'Perfection', file: 'perfection', image: 'perfection.png' },
      { name: 'Northern', file: 'northern', image: 'northern.png' },
      { name: 'Highline', file: 'highline', image: 'highline.png' },
      { name: 'Mural', file: 'mural', image: 'mural.png' },
      { name: 'Aeriel', file: 'aeriel', image: 'aeriel.png' },
      { name: 'Wing', file: 'wing', image: 'wing.png' },
      { name: 'Skyscraper', file: 'skyscraper', image: 'skyscraper.png' },
      { name: 'Wall', file: 'wall', image: 'wall.png' },
      { name: 'Dawn', file: 'dawn', image: 'dawn.png' },
      { name: 'Lille', file: 'lille', image: 'lille.png' },
      { name: 'Condo', file: 'condo', image: 'condo.png' },
      { name: 'Waterfall', file: 'waterfall', image: 'waterfall.png' },
      { name: 'Coffee', file: 'coffee', image: 'coffee.png' },
      { name: 'Mountain', file: 'mountain', image: 'mountain.png' },
      { name: 'Lights', file: 'lights', image: 'lights.png' },
      { name: 'Desert', file: 'desert', image: 'desert.png' },
      { name: 'Beach', file: 'beach', image: 'beach.png' },
      { name: 'Classic', file: 'classic', image: 'classic.png' },
      { name: 'Hazy', file: 'hazy', image: 'hazy.png' },
      { name: 'Exposure', file: 'exposure', image: 'exposure.png' },
      { name: 'Norge', file: 'norge', image: 'norge.png' },
      { name: 'Island', file: 'island', image: 'island.png' },
      { name: 'Station', file: 'station', image: 'station.png' },
      { name: 'Fruity', file: 'fruity', image: 'fruity.png' },
      { name: 'Tropical', file: 'tropical', image: 'tropical.png' },
      { name: 'Beyoglu', file: 'beyoglu', image: 'beyoglu.png' },
      { name: 'Timelapse', file: 'timelapse', image: 'timelapse.png' },
      { name: 'Crystal', file: 'crystal', image: 'crystal.png' },
      { name: 'Aquarelle', file: 'aquarelle', image: 'aquarelle.png' },
      { name: 'Canvas', file: 'canvas', image: 'canvas.png' },
      { name: 'Olympic', file: 'olympic', image: 'olympic.png' },
      { name: 'Circuit', file: 'circuit', image: 'circuit.png' },
      { name: 'Flamingo', file: 'flamingo', image: 'flamingo.png' },
      { name: 'Flight', file: 'flight', image: 'flight.png' },
      { name: 'Tractor', file: 'tractor', image: 'tractor.png' },
      { name: 'Volcano', file: 'volcano', image: 'volcano.png' },
      { name: 'Pine', file: 'pine', image: 'pine.png' },
      { name: 'Emptiness', file: 'emptiness', image: 'emptiness.png' },
      { name: 'Splash', file: 'splash', image: 'splash.png' },
      { name: 'Urban', file: 'urban', image: 'urban.png' },
      { name: 'Bloom', file: 'bloom', image: 'bloom.png' },
      { name: 'Tinfoil', file: 'tinfoil', image: 'tinfoil.png' },
      { name: 'Hallway', file: 'hallway', image: 'hallway.png' },
      { name: 'Seagull', file: 'seagull', image: 'seagull.png' },
      { name: 'City', file: 'city', image: 'city.png' },
      { name: 'Jet', file: 'jet', image: 'jet.png' },
      { name: 'Louisville', file: 'louisville', image: 'louisville.png' },
      { name: 'Spray', file: 'spray', image: 'spray.png' },
      { name: 'Symmetry', file: 'symmetry', image: 'symmetry.png' },
      { name: 'Destination', file: 'destination', image: 'destination.png' },
    ];

    this.menuThemes = [
      { name: 'Light', file: 'light', image: 'light.svg' },
      { name: 'Dark', file: 'dark', image: 'dark.svg' },
      { name: 'Blue', file: 'blue', image: 'blue.svg' },
      { name: 'Ash', file: 'ash', image: 'ash.svg' },
      { name: 'Kashmir', file: 'kashmir', image: 'kashmir.svg' },
      { name: 'Orange', file: 'orange', image: 'orange.svg' },
      { name: 'Midnight', file: 'midnight', image: 'midnight.svg' },
      { name: 'Sunset', file: 'sunset', image: 'sunset.svg' },
      { name: 'Marley', file: 'marley', image: 'marley.svg' },
      { name: 'Harvey', file: 'harvey', image: 'harvey.svg' },
      { name: 'Vanusa', file: 'vanusa', image: 'vanusa.svg' },
      { name: 'Skyline', file: 'skyline', image: 'skyline.svg' },
      { name: 'Royal', file: 'royal', image: 'royal.svg' },
      { name: 'Disco', file: 'disco', image: 'disco.svg' },
      { name: 'Sky', file: 'sky', image: 'sky.svg' },
      { name: 'Rose', file: 'rose', image: 'rose.svg' },
      { name: 'Revolt', file: 'revolt', image: 'revolt.svg' },
      { name: 'Forest', file: 'forest', image: 'forest.svg' },
      { name: 'Night', file: 'night', image: 'night.svg' },
      { name: 'Apricot', file: 'apricot', image: 'apricot.svg' },
      { name: 'Faraway', file: 'faraway', image: 'faraway.svg' },
      { name: 'Grape', file: 'grape', image: 'grape.svg' },
      { name: 'River', file: 'river', image: 'river.svg' },
      { name: 'Dock', file: 'dock', image: 'dock.svg' },
      { name: 'Material One', file: 'materialone', image: 'materialone.png' },
      { name: 'Material Two', file: 'materialtwo', image: 'materialtwo.png' },
      { name: 'Polygons', file: 'polygons', image: 'polygons.png' },
      {
        name: 'Connections One',
        file: 'connectionsone',
        image: 'connectionsone.png',
      },
      {
        name: 'Connections Two',
        file: 'connectionstwo',
        image: 'connectionstwo.png',
      },
      { name: 'Road', file: 'road', image: 'road.png' },
      { name: 'Reflection', file: 'reflection', image: 'reflection.png' },
      { name: 'Waves', file: 'waves', image: 'waves.png' },
      { name: 'Sandiego', file: 'sandiego', image: 'sandiego.png' },
      { name: 'Architecture', file: 'architecture', image: 'architecture.png' },
      { name: 'Snow', file: 'snow', image: 'snow.png' },
      { name: 'Palm', file: 'palm', image: 'palm.png' },
      { name: 'Fluid', file: 'fluid', image: 'fluid.png' },
      { name: 'Balloon', file: 'balloon', image: 'balloon.png' },
      { name: 'Downtown', file: 'downtown', image: 'downtown.png' },
      { name: 'Perfection', file: 'perfection', image: 'perfection.png' },
      { name: 'Northern', file: 'northern', image: 'northern.png' },
      { name: 'Highline', file: 'highline', image: 'highline.png' },
      { name: 'Mural', file: 'mural', image: 'mural.png' },
      { name: 'Aeriel', file: 'aeriel', image: 'aeriel.png' },
      { name: 'Wing', file: 'wing', image: 'wing.png' },
      { name: 'Skyscraper', file: 'skyscraper', image: 'skyscraper.png' },
      { name: 'Wall', file: 'wall', image: 'wall.png' },
      { name: 'Dawn', file: 'dawn', image: 'dawn.png' },
      { name: 'Lille', file: 'lille', image: 'lille.png' },
      { name: 'Condo', file: 'condo', image: 'condo.png' },
      { name: 'Waterfall', file: 'waterfall', image: 'waterfall.png' },
      { name: 'Coffee', file: 'coffee', image: 'coffee.png' },
      { name: 'Mountain', file: 'mountain', image: 'mountain.png' },
      { name: 'Lights', file: 'lights', image: 'lights.png' },
      { name: 'Desert', file: 'desert', image: 'desert.png' },
      { name: 'Beach', file: 'beach', image: 'beach.png' },
      { name: 'Classic', file: 'classic', image: 'classic.png' },
      { name: 'Hazy', file: 'hazy', image: 'hazy.png' },
      { name: 'Exposure', file: 'exposure', image: 'exposure.png' },
      { name: 'Norge', file: 'norge', image: 'norge.png' },
      { name: 'Island', file: 'island', image: 'island.png' },
      { name: 'Station', file: 'station', image: 'station.png' },
      { name: 'Fruity', file: 'fruity', image: 'fruity.png' },
      { name: 'Tropical', file: 'tropical', image: 'tropical.png' },
      { name: 'Beyoglu', file: 'beyoglu', image: 'beyoglu.png' },
      { name: 'Timelapse', file: 'timelapse', image: 'timelapse.png' },
      { name: 'Crystal', file: 'crystal', image: 'crystal.png' },
      { name: 'Aquarelle', file: 'aquarelle', image: 'aquarelle.png' },
      { name: 'Canvas', file: 'canvas', image: 'canvas.png' },
      { name: 'Olympic', file: 'olympic', image: 'olympic.png' },
      { name: 'Circuit', file: 'circuit', image: 'circuit.png' },
      { name: 'Flamingo', file: 'flamingo', image: 'flamingo.png' },
      { name: 'Flight', file: 'flight', image: 'flight.png' },
      { name: 'Tractor', file: 'tractor', image: 'tractor.png' },
      { name: 'Volcano', file: 'volcano', image: 'volcano.png' },
      { name: 'Pine', file: 'pine', image: 'pine.png' },
      { name: 'Emptiness', file: 'emptiness', image: 'emptiness.png' },
      { name: 'Splash', file: 'splash', image: 'splash.png' },
      { name: 'Urban', file: 'urban', image: 'urban.png' },
      { name: 'Bloom', file: 'bloom', image: 'bloom.png' },
      { name: 'Tinfoil', file: 'tinfoil', image: 'tinfoil.png' },
      { name: 'Hallway', file: 'hallway', image: 'hallway.png' },
      { name: 'Seagull', file: 'seagull', image: 'seagull.png' },
      { name: 'City', file: 'city', image: 'city.png' },
      { name: 'Jet', file: 'jet', image: 'jet.png' },
      { name: 'Louisville', file: 'louisville', image: 'louisville.png' },
      { name: 'Spray', file: 'spray', image: 'spray.png' },
      { name: 'Symmetry', file: 'symmetry', image: 'symmetry.png' },
      { name: 'Destination', file: 'destination', image: 'destination.png' },
    ];

    this.primaryColors = [
      { name: 'Amber', file: 'amber', color: '#FFC107' },
      { name: 'Blue', file: 'blue', color: '#457fca' },
      { name: 'BlueGray', file: 'bluegray', color: '#607D8B' },
      { name: 'Brown', file: 'brown', color: '#795548' },
      { name: 'Cyan', file: 'cyan', color: '#00ACC1' },
      { name: 'DeepOrange', file: 'deeporange', color: '#FF5722' },
      { name: 'DeepPurple', file: 'deeppurple', color: '#673AB7' },
      { name: 'Gray', file: 'gray', color: '#757575' },
      { name: 'Green', file: 'green', color: '#4CAF50' },
      { name: 'Indigo', file: 'indigo', color: '#3F51B5' },
      { name: 'LightBlue', file: 'lightblue', color: '#03A9F4' },
      { name: 'LightGreen', file: 'lightgreen', color: '#8BC34A' },
      { name: 'Lime', file: 'lime', color: '#C0CA33' },
      { name: 'Orange', file: 'orange', color: '#FF9800' },
      { name: 'Pink', file: 'pink', color: '#E91E63' },
      { name: 'Purple', file: 'purple', color: '#9C27B0' },
      { name: 'Teal', file: 'teal', color: '#009688' },
      { name: 'Yellow', file: 'yellow', color: '#FDD835' },
    ];

    this.componentThemes = [
      { name: 'Amber', file: 'amber', image: 'amber.svg' },
      { name: 'Blue', file: 'blue', image: 'blue.svg' },
      { name: 'Bluegray', file: 'bluegray', image: 'bluegray.svg' },
      { name: 'Brown', file: 'brown', image: 'brown.svg' },
      { name: 'Cyan', file: 'cyan', image: 'cyan.svg' },
      { name: 'Deep Orange', file: 'deeporange', image: 'deeporange.svg' },
      { name: 'Deep Purple', file: 'deeppurple', image: 'deeppurple.svg' },
      { name: 'Gray', file: 'gray', image: 'gray.svg' },
      { name: 'Green', file: 'green', image: 'green.svg' },
      { name: 'Indigo', file: 'indigo', image: 'indigo.svg' },
      { name: 'Light Blue', file: 'lightblue', image: 'lightblue.svg' },
      { name: 'Light Green', file: 'lightgreen', image: 'lightgreen.svg' },
      { name: 'Lime', file: 'lime', image: 'lime.svg' },
      { name: 'Orange', file: 'orange', image: 'orange.svg' },
      { name: 'Pink', file: 'pink', image: 'pink.svg' },
      { name: 'Purple', file: 'purple', image: 'purple.svg' },
      { name: 'Teal', file: 'teal', image: 'teal.svg' },
      { name: 'Yellow', file: 'yellow', image: 'yellow.svg' },
    ];
  }

  changeTopBarSize(event:any, size:any) {
    this.app.topbarSize = size;
    event.preventDefault();
  }

  onConfigButtonClick(event:any) {
    this.app.configDialogActive = true;
    event.preventDefault();
  }

  onConfigCloseClick(event:any) {
    this.app.configDialogActive = false;
    event.preventDefault();
  }
}
