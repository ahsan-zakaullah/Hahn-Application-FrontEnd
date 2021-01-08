let latency = 200;
export class ApplicantServices{
   applicants=[];
   isRequesting = false;
   isSaved=false;
  getAll() {
   return fetch('http://localhost:13298/api/ApplicantV1', {
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
          Name:x.Name,
          FamilyName:x.FamilyName,
          EmailAddress:x.EmailAddress
        }});
        resolve(results);
        this.isRequesting = false;
      }, latency);
    });
  }

  getApplicantDetails(id){
    this.isRequesting = true;
    // return new Promise(resolve => {
    //   setTimeout(() => {
    //     let found = this.applicants.filter(x => x.id == id)[0];
    //     resolve(JSON.parse(JSON.stringify(found)));
    //     this.isRequesting = false;
    //   }, latency);
    // });
    return fetch("").then(response=>response.json())
    .then(result=>{let applicantId=parseInt(id);
    let item=result.find(x=>x.Id==applicantId);
    this.isRequesting=false;
  return item;
  }).catch(error=>console.log(error));
  }

  saveApplicant(applicant){
    this.isRequesting = true;

          return fetch('http://localhost:5000/api/GetAll', {
            method: 'post',
                body: JSON.stringify(applicant),
          }).then(resp => {
            let response=resp.json();
            this.isRequesting = false;
            return response;
          });
        
        
  }

}
