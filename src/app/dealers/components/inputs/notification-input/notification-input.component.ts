import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { SystemService } from '@models/system-service.model';
import { ValidationService } from '@services/validation/validation.service';
import { ValidatorService } from '@services/validation/validator.service';

@Component({
  selector: 'app-notification-input',
  templateUrl: './notification-input.component.html',
})
export class NotificationInputComponent implements OnInit {

  @Input() contactFormControl!: AbstractControl | null;

  notificationsControl = this.fb.control('', Validators.required);

  systemServices: SystemService[] = [];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    public validatorsService: ValidatorService,
    public validationService: ValidationService) { }

  ngOnInit(): void {
    this.systemServices = this.route.snapshot.data["data"]["systemServices"];
  }

  addNotification() {
    const systemServiceSelected = this.notificationsControl.value as SystemService;
    const systemServicesSelected = this.contactFormControl?.get("notifications")?.value as SystemService[];

    const alreadySelected = systemServicesSelected.find(
      (systemService) => systemService.id === systemServiceSelected.id
    );
    if (!alreadySelected) {
      this.contactFormControl?.get("notifications")?.reset([
        ...systemServicesSelected,
        systemServiceSelected,
      ]);
    }
  }

  removeNotification(id: number) {
    const systemServicesSelected = this.contactFormControl?.get("notifications")?.value as SystemService[];
    const newValue = systemServicesSelected.filter((systenServiceFilter) => systenServiceFilter.id !== id);
    this.contactFormControl?.get("notifications")?.reset(newValue);
  }


}
