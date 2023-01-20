import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Workshop } from '@models/workshop.model';
import { ValidationService } from '@services/validation/validation.service';

@Component({
  selector: 'app-workshop-input',
  templateUrl: './workshop-input.component.html',
})
export class WorkshopInputComponent implements OnInit {
  @Input() workshopControl!: FormControl;
  @Input() validationService!: ValidationService;

  workshops: Workshop[] = [];

  constructor(
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.workshops = this.route.snapshot.data["data"]["workshops"];

  }

}
