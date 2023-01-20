import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Position } from '@models/position.model';
import { ValidationService } from '@services/validation/validation.service';

@Component({
  selector: 'app-position-input',
  templateUrl: './position-input.component.html',
})
export class PositionInputComponent implements OnInit {

  @Input() positionControl!: FormControl;
  @Input() validationService!: ValidationService;

  positions: Position[] = [];

  constructor(
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.positions = this.route.snapshot.data["data"]["positions"]
  }

}
