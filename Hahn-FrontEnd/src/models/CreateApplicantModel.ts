import { bindable } from 'aurelia-framework';
export class CreateApplicantModel  {
  @bindable
  name : string | undefined;
  familyName : string | undefined;
  address : string | undefined;
  countryOfOrigin : string | undefined;
  emailAddress: string | undefined;
  age: number | undefined;
  hired: boolean | undefined;
  id: number | undefined;
}
