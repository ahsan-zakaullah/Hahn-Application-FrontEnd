import {EventAggregator} from 'aurelia-event-aggregator';
import {ApplicantServices} from 'services/applicantservices';
import {ApplicantUpdated, ApplicantViewed} from 'shared/messages';
import {inject} from 'aurelia-framework';
  
  @inject(ApplicantServices, EventAggregator)
  export class ApplicantList {
    applicants;
    selectedId = 0;
  
    constructor(private api: ApplicantServices, ea: EventAggregator) {
      ea.subscribe(ApplicantViewed, msg => this.select(msg.applicant));
      ea.subscribe(ApplicantUpdated, msg => {
        let id = msg.applicant.id;
        let found = this.applicants.find(x => x.id == id);
        Object.assign(found, msg.applicant);
      });
    }
  
    created() {
      this.api.getApplicantList().then(applicants => this.applicants = applicants);
    }
  
    select(applicant) {
      this.selectedId = applicant.id;
      return true;
    }
  }
  

  