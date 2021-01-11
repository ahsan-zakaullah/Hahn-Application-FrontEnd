import {inject,bindable} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import {ApplicantServices} from 'services/applicantservices';
import {ValidationController,ValidationRules,validateTrigger, ValidationControllerFactory} from 'aurelia-validation';
import { DialogService } from 'aurelia-dialog';
import {Prompt} from '../ViewModels/Prompt';
import { CreateApplicantModel } from 'models/CreateApplicantModel';
import {I18N} from 'aurelia-i18n';
import * as toastr from "toastr";
import {Notification} from 'aurelia-notification';
import { ApplicantUpdated } from 'shared/messages';
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

@inject(ApplicantServices, EventAggregator, ValidationController,ValidationControllerFactory, DialogService, I18N, toastr, Notification)
export class AddApplicant {
  notification;
  controller;
  constructor(private api: ApplicantServices, private ea: EventAggregator, contollerFactory:ValidationControllerFactory,
    private validationController: ValidationController,private dialogService:DialogService, private i18n:I18N, private toastSubscription:toastr, private notificationMsg:Notification)
  {
    this.notification=notificationMsg;
    this.i18n = i18n;
    this.i18n
    .setLocale('en-EN'); 
    // this.validationController.addRenderer(new ValidationRenderer());
    this.toastSubscription = this.ea.subscribe('toast', toast => {
      toastr[toast.type](toast.message);
    });

    this.notification.note('Plain');
    this.notification.success('Record created successfully');
    this.notification.error('Record creation failed');
    this.notification.info('New message');

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
         
         this.applicant =  new CreateApplicantModel();
      } else {
      }
      console.log(response);
   });
  }
  save() {

    // if(this.validationController.validate().then(error=> error.results.length<=0))
    // {
     let createdModel=new CreateApplicantModel();
     createdModel=this.applicant;
      console.log(createdModel);
      createdModel.age = parseInt(this.applicant.age.toString());
       this.api.saveApplicant(createdModel).then(applicant => {
        this.applicant = <CreateApplicantModel>applicant;
        this.ea.publish('toast', {
          type: 'error',
          message: 'Errors are love, errors are life',
          timeout: 10000 // Pass in a longer timeOut than for other messages
        });
        this.notification.success('Record created successfully');
        location.reload();
      // this.routeConfig.navigate('myroute', {replace:true, trigger:true})
      // this.routeConfig.navModel.setTitle(this.applicant.name);
      // this.originalApplicant = JSON.parse(JSON.stringify(this.applicant));
      // this.ea.publish(new ApplicantUpdated(this.applicant));
    });
  // }

  }
}
