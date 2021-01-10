import {inject,bindable} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import {ApplicantServices} from 'services/applicantservices';
import {ValidationController,ValidationRules,validateTrigger} from 'aurelia-validation';
import {ValidationRenderer} from '../resources/validations/validation-renderer';
import { DialogService } from 'aurelia-dialog';
import {Prompt} from '../ViewModels/Prompt';
import { CreateApplicantModel } from 'models/CreateApplicantModel';
import {I18N} from 'aurelia-i18n';
// interface CreateApplicantModel {
//   name : string;
//   familyName : string;
//   address : string;
//   countryOfOrigin : string;
//   emailAddress: string ;
//   age: number ;
//   hired: boolean ;
//   id: number;
// }

@inject(ApplicantServices, EventAggregator,ValidationController,DialogService, I18N)
export class AddApplicant {
  constructor(private api: ApplicantServices, private ea: EventAggregator,
    private validationController: ValidationController,private dialogService:DialogService, private i18n:I18N)
  {
    this.i18n = i18n;
    this.i18n
    .setLocale('en-EN'); 
    this.validationController.addRenderer(new ValidationRenderer());
  }
  applicant: CreateApplicantModel =new CreateApplicantModel();
  public bind() {
    ValidationRules
      .ensure("name").required().minLength(5).withMessage("The name must be at least 5 character long")
      .ensure("familyName").required().minLength(5).withMessage("The family name must be at least 5 character long")
      .ensure("address").required().minLength(10).withMessage("The address must be at least 10 character long")
      .ensure("age").required().between(20,60).withMessage("The minimum age is 20 and the maximum age is 60 years")
      .ensure("emailAddress").required().email().withMessage("Please enter the valid email")
      .on(this.applicant);
  }

  get canSave() {
    return this.applicant.name && this.applicant.familyName &&this.applicant.address && this.applicant.emailAddress && !this.api.isRequesting;
  }
  get canReset() {
    return this.applicant.name || this.applicant.familyName || this.applicant.address || this.applicant.emailAddress ||this.applicant.countryOfOrigin || this.applicant.age || this.applicant.hired ;
  }

  reset(){
    this.dialogService.open( {viewModel: Prompt, model: 'Are you sure to reset?' , lock:false} ).whenClosed(response => {
      console.log(response);
   
      if (!response.wasCancelled) {
         console.log('OK Pressed');
         this.applicant =  new CreateApplicantModel();
      } else {
         console.log('cancelled');
      }
      console.log(response);
   });
  }
  save() {

    if(this.validationController.validate().then(error=> error.results.length<=0))
    {
     let createdModel=new CreateApplicantModel();
     createdModel=this.applicant;
      console.log('validation passed');
      console.log(createdModel);
    this.api.saveApplicant(createdModel).then(applicant => {
      this.applicant = <CreateApplicantModel>applicant;
      // this.routeConfig.navModel.setTitle(this.applicant.name);
      // this.originalApplicant = JSON.parse(JSON.stringify(this.applicant));
      // this.ea.publish(new ApplicantUpdated(this.applicant));
    });
  }

  }
}
