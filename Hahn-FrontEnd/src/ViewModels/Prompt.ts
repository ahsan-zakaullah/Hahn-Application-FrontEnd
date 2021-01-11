import {inject} from 'aurelia-framework';
import {DialogController} from 'aurelia-dialog';
import {useView} from 'aurelia-framework';

@useView('./Prompt.html')
@inject(DialogController)
export class Prompt {
 message;
  constructor(private controller:DialogController){
    this.controller = controller;
  }
  activate(message) {
    this.message = message;
}

}

