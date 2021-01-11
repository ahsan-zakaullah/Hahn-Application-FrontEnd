import {inject} from 'aurelia-framework';
import {DialogController} from 'aurelia-dialog';
import {ApplicantServices} from 'services/applicantservices'
import {ValidationController,ValidationRules,validateTrigger} from 'aurelia-validation';
import {ValidationRenderer} from '../resources/validations/validation-renderer';
export interface CreateApplicantModel {
  name : string;
  familyName : string;
  address : string;
  countryOfOrigin : string;
  emailAddress: string ;
  age: number ;
  hired: boolean ;
  id: number;
}
@inject(ApplicantServices,DialogController,ValidationController)
export class EditApplicant {
  applicant: CreateApplicantModel;
  constructor(private api: ApplicantServices,private controller,private validationController: ValidationController){
    this.controller = controller;
    this.validationController.addRenderer(new ValidationRenderer());
  }
  get canSave() {
    return this.applicant.name && this.applicant.familyName &&this.applicant.address && this.applicant.emailAddress && !this.api.isRequesting;
  }
  public bind() {
    ValidationRules
      .ensure("name").required().minLength(5).withMessage("The name must be at least 5 character long")
      .ensure("familyName").required().minLength(5).withMessage("The family name must be at least 5 character long")
      .ensure("address").required().minLength(10).withMessage("The address must be at least 10 character long")
      .ensure("age").required().between(20,60).withMessage("The minimum age is 20 and the maximum age is 60 years")
      .ensure("emailAddress").required().email().withMessage("Please enter the valid email")
      .on(this.applicant);
  }

  activate(applicant){
    this.applicant = applicant;
  }
}


