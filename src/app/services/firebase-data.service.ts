import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ErrorHandlerService } from './error-handler.service';
import { catchError } from 'rxjs';
const API_URL = 'api/v1';
const httpOptions = {
  headers: new HttpHeaders({"Content-Type": "application/json"}),
};

@Injectable({
  providedIn: 'root'
})
export class FirebaseDataService {

  constructor(private http: HttpClient, private errorHandler: ErrorHandlerService) { }

  getStats(){
    return this.http.get(API_URL + '/stats')
      .pipe(
        catchError(this.errorHandler.handleError.bind(this.errorHandler))
      );
  }

  getLogin(data: object){
    return this.http.post(API_URL + "/users/login", data, httpOptions)
      .pipe(
        catchError(this.errorHandler.handleError.bind(this.errorHandler))
      );
  }

  getSignUp(data: object){
    console.log('getSignup')
    return this.http.post(API_URL + '/users/signup', data, httpOptions)
      .pipe(
        catchError(this.errorHandler.handleError.bind(this.errorHandler))
      );
  }

  getLogOut(){
    return this.http.get(API_URL + '/users/logout');
  }
}
