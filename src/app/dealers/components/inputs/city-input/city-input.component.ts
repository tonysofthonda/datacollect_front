import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { City } from '@models/city.model';
import { State } from '@models/state.model';
import { ValidationService } from '@services/validation/validation.service';

@Component({
  selector: 'app-city-input',
  templateUrl: './city-input.component.html',
})
export class CityInputComponent implements OnInit {

  @Input() stateControl!: FormControl;
  @Input() cityControl!: FormControl;
  @Input() validationService!: ValidationService;

  states: State[] = [];
  cities: City[] = [];

  constructor(
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.states = this.route.snapshot.data["data"]["states"];
    if(this.cityControl.value){
      const state = this.states.find(state=>state.id === this.cityControl.value.state.id);
      this.stateControl.reset(state);
      this.cities = state!.cities;
      this.cityControl.reset(this.cityControl.value);
    }
    this.stateControl.valueChanges.subscribe((value)=>{
      this.cities = value.cities;
    })
  }

}
