import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DealerGroup } from '@models/dealer-group.model';
import { ValidationService } from '@services/validation/validation.service';

@Component({
  selector: 'app-dealer-group-input',
  templateUrl: './dealer-group-input.component.html',
})
export class DealerGroupInputComponent implements OnInit {
  @Input() dealerGroupControl!: FormControl;
  @Input() validationService!: ValidationService;

  dealersGroups: DealerGroup[] = [];

  constructor(
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.dealersGroups = this.route.snapshot.data["data"]["dealersGroups"];
  }
}
