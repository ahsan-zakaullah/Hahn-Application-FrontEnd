import {HttpClient,json} from 'aurelia-fetch-client';
import { UpdateApplicantModel } from 'models/UpdateApplicantModel';
import { CreateApplicantModel } from 'models/CreateApplicantModel';
let latency = 200;
const baseUrl='http://localhost:13298/api/ApplicantV1/';
let httpClient = new HttpClient().configure(config => {
  config
    .useStandardConfiguration()
    .withBaseUrl(baseUrl)
    .withDefaults({
      headers: {
        'X-Requested-With': 'Fetch'
      }
    })
    .withInterceptor({
      request(request) {
        // let authHeader = fakeAuthService.getAuthHeaderValue(request.url);
        // request.headers.append('Authorization', authHeader);
        return request;
      }
    });
});
export class ApplicantServices{
   applicants=[];
   isRequesting = false;
   isSaved=false;
   updateModel: UpdateApplicantModel = new UpdateApplicantModel();
   createModel: CreateApplicantModel = new CreateApplicantModel();
  getAll() {
   return httpClient.fetch('GetAll', {
      method: 'GET',
    }).then(resp => resp.json())
    .then(obj => {
      this.applicants = obj;
      console.log(obj);
    });
  }
  getApplicantList(){
    this.getAll();
    this.isRequesting = true;
    return new Promise(resolve => {
      setTimeout(() => {
        let results = this.applicants.map(x =>  { return {
          id:x.id,
          name:x.name,
          familyName:x.familyName,
          emailAddress:x.emailAddress,
          address:x.address,
          age:x.age,
          countryOfOrigin:x.countryOfOrigin,
          hired:x.hired

        }});
        resolve(results);
        this.isRequesting = false;
      }, latency);
    });
  }

  getApplicantDetails(id){
    this.isRequesting = true;
    return httpClient.fetch("GetAll").then(response=>response.json())
    .then(result=>{let applicantId=parseInt(id);
    let item=result.find(x=>x.id==applicantId);
    this.isRequesting=false;
  return item;
  }).catch(error=>console.log(error));
  }

saveApplicant(applicant){
this.isRequesting = true;
applicant.id=0;
    return httpClient.fetch('Create', {
      method: 'post',
          body: json(applicant),
    })
    .then(response => response.json())
    .then(createdApplicant => {
      this.isRequesting = false; 
      return createdApplicant;
    })
       .catch(error => {
           console.log('Error adding applicant.');
    });     
  }


  updateApplicant(applicant){
    this.updateModel=applicant;
    this.isRequesting = true;
              return httpClient.fetch('Update', {
                method: 'put',
                    body: json(this.updateModel),
              })  .then(response => response.json())
              .then(createdApplicant => {
                this.isRequesting = false; 
                  return createdApplicant;
              })
                 .catch(error => {
                     console.log('Error adding applicant.');
              })
            
            
      }

  deleteApplicant(applicant){
    this.isRequesting = true;
              return httpClient.fetch('Delete', {
                method: 'delete',
                body:json(applicant)
              })
              .then(responseMessage => {
                
                this.isRequesting = false;
                  return responseMessage;
              })
                .catch(error => {
                     console.log('Error deleting applicant.');
                });
            
            
      }

}
