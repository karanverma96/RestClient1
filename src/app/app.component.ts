import {Component } from '@angular/core';
import {ApiService} from './service/api.service';
import {FormControl} from '@angular/forms';
import {Observable, of} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent{
  title = 'RestClient';
  image:any;
  res:any;
  res_beautified : any;
  header_beautified : any;
  res_type ={
    lineNumbers: true,
    theme: 'material',
    mode: 'application/json',
    lineWrapping : true,
    smartIndent : true,
    readOnly : true
  };
  body_type ={
    lineNumbers: true,
    theme: 'duotone-light',
    mode: 'application/json',
    lineWrapping : true,
    smartIndent : true
  };
  header:any = [['Content-Type','application/json']];
  //headerName : string;
  reqType = "GET";
  isCORS = false;
  body_dat : any;
  keep_run = false;
  isImage = false;
  imageLoading: boolean;

  headerName = new FormControl();
  headerNameOptions: string[] = [];
  headerNamefilteredOptions: Observable<string[]>;

  headerValue = new FormControl();
  headerValueOptions: string[] = [];
  headerValuefilteredOptions: Observable<string[]>;

  headerVals = {
    'Content-Type' : ['application/x-www-form-urlencoded', 'application/json', 'application/javascript', 'application/xml',
                    'text/html','text/plain','text/json'],
    'Accept' : ['application/json', 'application/xml'],
    'Accept-Language' : ['fr','de-DE','en-US','en-CA'],
    'Access-Control-Request-Method': ['GET','DELETE','PUT','POST'],
    'Access-Control-Request-Headers': ['Content-Length','Content-Type'],
    'Accept-Encoding': ['gzip','deflate','compress','br','indentity','*'],
    'Allow': ['GET','DELETE','PUT','POST'],
    'Authorization':[],
    'Cache-Control' : ['no-cache'],
    'Clear-Site-Data': ['"storage"','"cookies"','"cache"','"executionContexts"','"*"'],
    'Cookie': [],
    'Connection' : ['keep-alive', 'close'],
    'From': [],
    'If-Match': ['*'],
    'Save-Data':['On'],
    'Transfer-Encoding':['chunked','gzip','deflate','compress','indentity']
  }

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    for(var i in this.headerVals){
      this.headerNameOptions.push(i);
    }
    this.headerNamefilteredOptions = this.headerName.valueChanges
      .pipe(
        startWith(''),
        map(value => {
          this._refre(value);
          return this._filter(value, this.headerNameOptions)
        })
    );
    this.headerValuefilteredOptions = this.headerValue.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value, this.headerValueOptions))
    );
  }
  _refre(dat : string){
    this.headerValueOptions = this.headerVals[dat] || [];
    this.headerValuefilteredOptions = of(this._filter('', this.headerValueOptions));
  }
  private _filter(value: string, arr : string[] ): string[] {
    const filterValue = value.toLowerCase();
    return arr.filter(option => option.toLowerCase().includes(filterValue));
  }
  async callReq(uri){
    var data = this.body_dat
    console.log(data)
    this.res = "";
    this.res_beautified = "";
    this.header_beautified = "";
    var type = this.reqType; 
    console.log(uri, type, data, this.isCORS);
    var headers  = {};
    for(var i=0; i<this.header.length; i++){
      headers[this.header[i][0]] = this.header[i][1];
    }
    this.keep_run = true;

    if(this.isImage){
      this.imageLoading=true;
      this.apiService.getImage(uri,headers).subscribe(data => {
        this.convertimageblob(data);
        this.imageLoading = false;
      }, error => {
        this.imageLoading = false;
        console.log(error);
      });
    }

    if(this.isCORS){
      this.apiService.coverAPI(uri,type, data, headers).subscribe((data) =>{
        var type = "plain";
        for(var eachheader in data['headers']){
          if(eachheader.toUpperCase() == "CONTENT-TYPE"){
            type = data['headers'][eachheader].split(";")[0]
            break;
          }
        }
        data['headers']['Status Code'] = data['status_code'];
        delete data['headers'].status;
        this.display(atob(data['body']), type.toLowerCase(), data['headers'])
      },
       err =>{
        this.keep_run = false;
        this.header_beautified = "Invalid Address";
      })

    }
    else if(type == "GET"){
      this.apiService.getReq(uri, headers).subscribe( (data) => {
        var dat_type = data.headers.get('Content-type').split(";")[0] || "text/plain"
        dat_type = dat_type.toLowerCase();
        var scode = data.status + " " + data.statusText;
        if(dat_type == "application/json")
          this.display(JSON.stringify(data.body),dat_type, this.getHeadOBJ(data.headers, scode));
        else
          this.display(data.body.toString(), dat_type, this.getHeadOBJ(data.headers, scode))
       },
       err =>{
        this.keep_run = false;
        console.log(err)
        this.header_beautified = "Make sure address is correct and CORS available";
       })  
    }
    else if(type == "DELETE"){
      this.apiService.deleteReq(uri, headers).subscribe( (data) => {
        var dat_type = data.headers.get('Content-type').split(";")[0] || "text/plain"
        dat_type = dat_type.toLowerCase();
        var scode = data.status + " " + data.statusText;
        if(dat_type == "application/json")
          this.display(JSON.stringify(data.body),dat_type, this.getHeadOBJ(data.headers, scode));
        else
          this.display(data.body.toString(), dat_type, this.getHeadOBJ(data.headers, scode))
       },
       err =>{
        this.keep_run = false;
        console.log(err)
        this.header_beautified = "Make sure address is correct and CORS available";
       })  
    }
    else if(type=="POST"){
      this.apiService.postReq(uri, data, headers ).subscribe((data) => {
        var dat_type = data.headers.get('content-type').split(";")[0] || "text/plain"
        dat_type = dat_type.toLowerCase();
        var scode = data.status + " " + data.statusText;
        if(dat_type == "application/json")
          this.display(JSON.stringify(data.body),dat_type, this.getHeadOBJ(data.headers, scode));
        else
          this.display(data.body.toString(), dat_type, this.getHeadOBJ(data.headers, scode))
       },
       err =>{
        this.keep_run = false;
        console.log(err)
        this.header_beautified = "Make sure address is correct and CORS available";
      })  
    }
    else if(type=="PUT"){
      this.apiService.putReq(uri, data, headers ).subscribe((data) => {
        var dat_type = data.headers.get('content-type').split(";")[0] || "text/plain"
        dat_type = dat_type.toLowerCase();
        var scode = data.status + " " + data.statusText;
        if(dat_type == "application/json")
          this.display(JSON.stringify(data.body),dat_type, this.getHeadOBJ(data.headers, scode));
        else
          this.display(data.body.toString(), dat_type, this.getHeadOBJ(data.headers, scode))
       },
       err =>{
        this.keep_run = false;
        console.log(err)
        this.header_beautified = "Make sure address is correct and CORS available";
      })  
    } 
    else{
      this.keep_run = false;
    }
    
  }

  convertimageblob(image1: Blob) {
   let reader = new FileReader();
   reader.addEventListener("load", () => {
      this.image = reader.result;
   }, false);

   if (image1) {
      reader.readAsDataURL(image1);
   }
  }

  display(data : string, dat_type : string, headers){
    this.res = data;
    this.res_type.mode = dat_type;
    console.log(headers)
    if(dat_type == "application/json"){
      var tmp = JSON.parse(data)
      this.res_beautified = JSON.stringify(tmp, null, 4);
    }
    else{
      this.res_beautified = data;
    }
    this.header_beautified = `${JSON.stringify(headers, null, 4)}`;
    this.keep_run = false;
  }
  getHeadOBJ(headers, status){
    var all_header = headers.keys()
    var tmp = {}
    for(var k in all_header){
      tmp[all_header[k]] = headers.get(all_header[k])
    }
    tmp['Status'] = status;
    return tmp
  }
  deleteHeader(id:number){
    this.header.splice(id,1);
    console.log("deleted")
  }
  addHeader(){
    var name = this.headerName.value || "";
    var value = this.headerValue.value|| "";
    if(name.length * value.length == 0) return;
    this.header.push([name,value]);
    console.log("added")
  }
}
