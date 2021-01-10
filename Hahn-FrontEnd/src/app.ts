import { bootstrap } from 'aurelia-bootstrapper';
import {Router, RouterConfiguration} from 'aurelia-router';
import {inject, PLATFORM} from 'aurelia-framework';
import {ApplicantServices} from './services/applicantservices';
import {AddApplicant} from './ViewModels/Add-Applicant';
import "../node_modules/font-awesome/css/font-awesome.min.css";
import "../node_modules/jquery";

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
