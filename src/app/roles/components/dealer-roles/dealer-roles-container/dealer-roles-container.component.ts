import { AfterContentChecked, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Position } from '@models/position.model';

@Component({
  selector: 'app-dealer-roles-container',
  templateUrl: './dealer-roles-container.component.html',
})
export class DealerRolesContainerComponent implements OnInit, AfterContentChecked {
  public positionSubmited!: Position | null;
  public positionEdit!: Position | null;

  constructor(private cdref: ChangeDetectorRef) { }

  ngOnInit(): void {
  }

  ngAfterContentChecked(): void {
    this.cdref.detectChanges();
  }

  setPositionSubmited(position: Position | null){
    this.positionSubmited = position;
    this.positionEdit = null;
  }

  setPositionEdit(position: Position | null){
    this.positionEdit = position;
    this.positionSubmited = null;
  }
}
