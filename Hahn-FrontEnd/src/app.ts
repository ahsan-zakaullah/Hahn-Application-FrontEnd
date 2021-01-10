import { bootstrap } from 'aurelia-bootstrapper';
import {Router, RouterConfiguration} from 'aurelia-router';
import {inject, PLATFORM} from 'aurelia-framework';
import {ApplicantServices} from './services/applicantservices';
import {AddApplicant} from './ViewModels/Add-Applicant';
import "../node_modules/font-awesome/css/font-awesome.min.css";
import "../node_modules/jquery";
import {I18N} from 'aurelia-i18n';
import { ValidationMessageProvider } from 'aurelia-validation';

@inject(ApplicantServices, I18N)
export class App {
  router: Router;

  constructor(public api: ApplicantServices, public i18n) {
    this.i18n = i18n;
    this.i18n
    .setLocale('de-DE');
    this.initAureliaSingletons();
  }

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
    /**
   * Some configurations breaks in 'main.js'
   * singletons can be configure here
   * @return {void}
   */
  initAureliaSingletons() {
    const i18n = this.i18n;
    ValidationMessageProvider.prototype.getMessage = function(key) {
      const translation = i18n.tr(`validation-${key}`);
      return this.parser.parseMessage(translation);
    };
  }
}
