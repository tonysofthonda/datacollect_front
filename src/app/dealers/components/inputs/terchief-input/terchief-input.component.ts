import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Terchief } from '@models/terchief.model';
import { ValidationService } from '@services/validation/validation.service';

@Component({
  selector: 'app-terchief-input',
  templateUrl: './terchief-input.component.html',
})
export class TerchiefInputComponent implements OnInit {
  @Input() terchiefControl!: FormControl;
  @Input() validationService!: ValidationService;

  terchiefs: Terchief[] = [];

  constructor(
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.terchiefs = this.route.snapshot.data["data"]["terchiefs"];
  }

}
