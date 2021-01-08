  import {inject} from 'aurelia-framework';
  import {EventAggregator} from 'aurelia-event-aggregator';
  import {ApplicantServices} from 'services/applicantservices';
  import {ApplicantUpdated,ApplicantViewed} from 'shared/messages';
  import {areEqual} from 'Utils/utility';
  
  interface Applicant {
    Name : string;
    FamilyName : string;
    Address : string;
    CountryOfOrigin : string;
    EmailAddress: string ;
    Age: number ;
    Hired: boolean ;
    Id: number;
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
        this.routeConfig.navModel.setTitle(this.applicant.Name);
        this.originalApplicant = JSON.parse(JSON.stringify(this.applicant));
        this.ea.publish(new ApplicantViewed(this.applicant));
      });
    }
  
    get canSave() {
      return this.applicant.Name && this.applicant.FamilyName &&this.applicant.Address && this.applicant.EmailAddress && !this.api.isRequesting;
    }
  
    save() {
      this.api.saveApplicant(this.applicant).then(applicant => {
        this.applicant = <Applicant>applicant;
        this.routeConfig.navModel.setTitle(this.applicant.Name);
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
  

  