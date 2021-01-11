import { EventAggregator } from 'aurelia-event-aggregator';
import { ApplicantServices } from 'services/applicantservices';
import { ApplicantUpdated, ApplicantViewed } from 'shared/messages';
import { inject, PLATFORM } from 'aurelia-framework';
import { DialogService } from 'aurelia-dialog';
import { Prompt } from '../ViewModels/Prompt';
import { EditApplicant } from 'ViewModels/Edit-Applicant';
@inject(ApplicantServices, EventAggregator, DialogService)
export class ApplicantList {
  applicants;
  selectedId = 0;

  constructor(private api: ApplicantServices, ea: EventAggregator, private dialogService: DialogService) {
    this.dialogService = dialogService;
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


  Edit(applicant) {
    this.dialogService.open({ viewModel: EditApplicant, model: applicant, lock: false }).whenClosed(response => {
      if (!response.wasCancelled) {
        this.api.updateApplicant(applicant).then(response => {
          location.reload();
        })
      } else {
      }
    });
  }

  select(applicant) {
    this.selectedId = applicant.id;
    return true;
  }
  delete(applicant) {
     this.dialogService.open({ viewModel: Prompt, model: 'Are you sure?', lock: false }).whenClosed(response => {
    
      if (!response.wasCancelled) {
        this.api.deleteApplicant(applicant).then(response => {
          location.reload();
        })
      } else {
      }
      
    });
  }

}


