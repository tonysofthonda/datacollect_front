import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Position } from '@models/position.model';
import { Role } from '@models/role.model';
import { RolesService } from '@services/roles/roles.service';

@Component({
  selector: 'app-dealer-roles-list',
  templateUrl: './dealer-roles-list.component.html',
})
export class DealerRolesListComponent implements OnInit, OnChanges {
  @Output() positionEdit = new EventEmitter<Position | null>();
  @Input() positionSubmited!: Position | null;

  positionEditEmited!: Position | null;

  positionsSelectedUnfiltered: Position[] = [];

  constructor(private route: ActivatedRoute,public roleService: RolesService) { }

  ngOnInit(): void {
    const role: Role = this.route.snapshot.data["data"]["role"];
    if(role){
      this.roleService.positionsFormSelected = role.positions;
    }
  }

  ngOnChanges(): void {
    if(this.positionSubmited && this.positionEditEmited) {
      const isSelected = this.roleService.positionsFormSelected.some(position=>position.jobId === this.positionEditEmited!.jobId);
      if(isSelected){
        this.roleService.positionsFormSelected = this.roleService.positionsFormSelected.map(position=>position.jobId === this.positionEditEmited!.jobId ? this.positionSubmited! : position);
      }else{
        this.roleService.positionsFormSelected.push(this.positionSubmited);
      }
      this.positionEditEmited = null;
    }else if(this.positionSubmited){
      this.roleService.positionsFormSelected.push(this.positionSubmited);
    }
    this.positionsSelectedUnfiltered = this.roleService.positionsFormSelected;
  }

  setTerm(term:string){
    if(term){
      this.roleService.positionsFormSelected = this.roleService.positionsFormSelected.filter(position=>position.jobId.includes(term)|| position.name.includes(term));
    }else{
      this.roleService.positionsFormSelected = this.positionsSelectedUnfiltered;
    }
  }

  setPositionEdit(position: Position){
    this.positionEdit.emit({...position});
    this.positionEditEmited = {...position};
  }

  removePosition(jobId: string){
    this.roleService.positionsFormSelected = this.roleService.positionsFormSelected.filter(position=>position.jobId !== jobId);
  }

}
