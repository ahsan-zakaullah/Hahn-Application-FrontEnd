  import {inject,bindable} from 'aurelia-framework';
  import {EventAggregator} from 'aurelia-event-aggregator';
  import {ApplicantServices} from 'services/applicantservices';
  import {ApplicantUpdated,ApplicantViewed} from 'shared/messages';
  import {areEqual} from 'Utils/utility';
  import {ValidationController,ValidationRules,validateTrigger} from 'aurelia-validation';
  import {ValidationRenderer} from '../resources/validations/validation-renderer';
import { DialogService } from 'aurelia-dialog';
  interface CreateApplicantModel {
    name : string;
    familyName : string;
    address : string;
    countryOfOrigin : string;
    emailAddress: string ;
    age: number ;
    hired: boolean ;
    id: number;
  }
  
  @inject(ApplicantServices, EventAggregator,ValidationController,DialogService)
  export class applicantDetail {
    routeConfig;
    applicant: CreateApplicantModel;
    originalApplicant: CreateApplicantModel;
  
    constructor(private api: ApplicantServices, private ea: EventAggregator,private validationController: ValidationController,private dialogService:DialogService) { 
      this.validationController.addRenderer(new ValidationRenderer());
    }
  
    activate(params, routeConfig) {
      this.routeConfig = routeConfig;
  
      return this.api.getApplicantDetails(params.id).then(applicant => {
        this.applicant = <CreateApplicantModel>applicant;
        this.routeConfig.navModel.setTitle(this.applicant.name);
        this.originalApplicant = JSON.parse(JSON.stringify(this.applicant));
        this.ea.publish(new ApplicantViewed(this.applicant));
      });
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
    get canSave() {
      return this.applicant.name && this.applicant.familyName &&this.applicant.address && this.applicant.emailAddress && !this.api.isRequesting;
    }
  
    save() {

      if(this.validationController.validate().then(error=> error.results.length<=0))
      {
        console.log('validation passed');
      this.api.saveApplicant(this.applicant).then(applicant => {
        this.applicant = <CreateApplicantModel>applicant;
        // this.routeConfig.navModel.setTitle(this.applicant.name);
        // this.originalApplicant = JSON.parse(JSON.stringify(this.applicant));
        this.ea.publish(new ApplicantUpdated(this.applicant));
      });
    }

    }
    canDeactivate() {
      if(!areEqual(this.originalApplicant, this.applicant)){
        let result = confirm('You have unsaved changes. Are you sure you wish to leave?');
  
        if(!result) {
          this.ea.publish(new ApplicantViewed(this.applicant));
        }
  
        return result;
      }
  
      return true;
    }
  }
  

  