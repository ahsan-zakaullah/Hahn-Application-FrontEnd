
import {EventAggregator} from 'aurelia-event-aggregator';
import {ApplicantServices} from 'services/applicantservices';
import {ApplicantUpdated, ApplicantViewed} from 'shared/messages';
import {inject,PLATFORM} from 'aurelia-framework';
import {DialogService} from 'aurelia-dialog';  
import {Prompt} from '../ViewModels/Prompt';
import {EditApplicant} from 'ViewModels/Edit-Applicant';
  @inject(ApplicantServices, EventAggregator,DialogService)
  export class ApplicantList {
    applicants;
    selectedId = 0;
  
    constructor(private api: ApplicantServices, ea: EventAggregator,private dialogService:DialogService) {
      this.dialogService=dialogService;
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
  

    Edit(applicant){
      this.dialogService.open({ viewModel: EditApplicant, model: applicant, lock: false }).whenClosed(response => {
        if (!response.wasCancelled) {
          this.api.updateApplicant(applicant).then(response => {
            alert(response);
          })
        } else {
          console.log('bad');
        }
        console.log(response.output);
      });
    }

    select(applicant) {
      this.selectedId = applicant.id;
      return true;
    }
    delete(applicant){
console.log("delete method");
      // if(confirm('Are you sure you want to delete?'))
      // {
      //   this.api.deleteApplicant(applicant).then(response => {
      //     alert(response);
      //   })
      // }
      this.dialogService.open( {viewModel: Prompt, model: 'Are you sure?' , lock:false} ).whenClosed(response => {
        console.log(response);
     
        if (!response.wasCancelled) {
           console.log('OK Pressed');
           this.api.deleteApplicant(applicant).then(response => {
            alert(response);
          })
        } else {
           console.log('cancelled');
        }
        console.log(response);
     });
  }

      // if(confirm('Are you sure you want to delete?'))
      // {
      //   this.api.deleteApplicant(applicant).then(response => {
      //     alert(response);
      //   })
      // }

  }
  

  