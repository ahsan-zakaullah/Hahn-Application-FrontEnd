  import {inject} from 'aurelia-framework';
  import {EventAggregator} from 'aurelia-event-aggregator';
  import {ApplicantServices} from 'services/applicantservices';
  import {ApplicantUpdated,ApplicantViewed} from 'shared/messages';
  import {areEqual} from 'Utils/utility';
  
  interface Applicant {
    name : string;
    familyName : string;
    address : string;
    countryOfOrigin : string;
    emailAddress: string ;
    age: number ;
    hired: boolean ;
    id: number;
  }
  
  @inject(ApplicantServices, EventAggregator)
  export class applicantDetail {
    routeConfig;
    applicant: Applicant;
    originalApplicant: Applicant;
  
    constructor(private api: ApplicantServices, private ea: EventAggregator) { }
  
    activate(params, routeConfig) {
      this.routeConfig = routeConfig;
  
      return this.api.getApplicantDetails(params.id).then(applicant => {
        this.applicant = <Applicant>applicant;
        this.routeConfig.navModel.setTitle(this.applicant.name);
        this.originalApplicant = JSON.parse(JSON.stringify(this.applicant));
        this.ea.publish(new ApplicantViewed(this.applicant));
      });
    }
  
    get canSave() {
      return this.applicant.name && this.applicant.familyName &&this.applicant.address && this.applicant.emailAddress && !this.api.isRequesting;
    }
  
    save() {
      this.api.saveApplicant(this.applicant).then(applicant => {
        this.applicant = <Applicant>applicant;
        this.routeConfig.navModel.setTitle(this.applicant.name);
        this.originalApplicant = JSON.parse(JSON.stringify(this.applicant));
        this.ea.publish(new ApplicantUpdated(this.applicant));
      });
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
  

  