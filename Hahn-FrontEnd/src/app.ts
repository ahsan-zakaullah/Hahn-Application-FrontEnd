import {Router, RouterConfiguration} from 'aurelia-router';
import {inject, PLATFORM} from 'aurelia-framework';
import {ApplicantServices} from './services/applicantservices';

@inject(ApplicantServices)
export class App {
  router: Router;

  constructor(public api: ApplicantServices) {}

  configureRouter(config: RouterConfiguration, router: Router) {
    config.title = 'Applicants';
    config.options.pushState = true;
    config.options.root = '/';
    config.map([
      { route: '',              moduleId: PLATFORM.moduleName('./components/no-selection'),   title: 'Select'},
      { route: 'applicants/:id',  moduleId: PLATFORM.moduleName('./components/applicant-detail'), name:'applicants' }
    ]);

    this.router = router;
  }
}
