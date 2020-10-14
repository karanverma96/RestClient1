import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  coverAPI_uri : string = "https://iamabhishek.azurewebsites.net/api/ApiCover";

  constructor(private http: HttpClient) { }

  getImage(iurl: string, header) : Observable<Blob>{
    return this.http.get(iurl, { responseType: 'blob' , headers: header});
  }

  getReq(uri:string, header) {
    return this.http.get(`${uri}`, {headers : header, observe: 'response'});
  }
  postReq(uri, data, header) {
    return this.http.post(uri, data, {headers : header, observe: 'response'});
  }
  deleteReq(uri:string, header) {
    return this.http.delete(`${uri}`, {headers : header, observe: 'response'});
  }
  putReq(uri, data, header) {
    return this.http.put(uri, data, {headers : header, observe: 'response'});
  }
  coverAPI(uri:string, method:string, data="", header={}){
    if(method.toUpperCase() == "GET") data ="";
    var body = {
      'url' : uri,
      'method' : method,
      'header': header,
      'body' : btoa(data)
    }
    return this.http.post(this.coverAPI_uri, body, {headers : {'Content-Type' : 'application/json'}})
  }
}
