import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Facility } from '@models/facility.model';
import { ValidationService } from '@services/validation/validation.service';

@Component({
  selector: 'app-facility-input',
  templateUrl: './facility-input.component.html',
})
export class FacilityInputComponent implements OnInit {
  @Input() facilityControl!: FormControl;
  @Input() validationService!: ValidationService;

  facilities: Facility[] = [];

  constructor(
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.facilities = this.route.snapshot.data["data"]["facilities"]
  }
}
