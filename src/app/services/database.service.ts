import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs';
import { ErrorHandlerService } from './error-handler.service';

const API_URL = 'api/v1';
const httpOptions = {
  headers: new HttpHeaders({"Content-Type": "application/json"}),
};

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  constructor(private http: HttpClient, private errorHandler: ErrorHandlerService) { }

  addDriver(driver: object){
    return this.http.post(API_URL + '/drivers', driver, httpOptions)
      .pipe(
        catchError(this.errorHandler.handleError.bind(this.errorHandler))
    );
  }

  getDrivers(){
    return this.http.get(API_URL + '/drivers')
      .pipe(
        catchError(this.errorHandler.handleError.bind(this.errorHandler))
    );
  }

  getDriver(id: string){
    // retrieve one package by its id, we send a GET request with URL "packages/id"
    let url = API_URL + "/drivers/" + id;
    return this.http.get(url)
      .pipe(
        catchError(this.errorHandler.handleError.bind(this.errorHandler))
    );
  }

  deleteDriver(id: string){
    return this.http.delete(API_URL + '/drivers/'+ id, httpOptions)
      .pipe(
        catchError(this.errorHandler.handleError.bind(this.errorHandler))
    );
  }

  updateDriver(id: string, data: any ){
    console.log(id);
    let url = API_URL + "/drivers/" + id;
    return this.http.put(API_URL + "/drivers/" + id, data, httpOptions)
      .pipe(
        catchError(this.errorHandler.handleError.bind(this.errorHandler))
      );
  }

  addPackage(aPackage: object){
    return this.http.post(API_URL + '/packages', aPackage, httpOptions)
      .pipe(
        catchError(this.errorHandler.handleError.bind(this.errorHandler))
    );
  }

  getPackages(){
    return this.http.get(API_URL + '/packages')
      .pipe(
        catchError(this.errorHandler.handleError.bind(this.errorHandler))
    );
  }

  getPackage(id: string){
    // retrieve one package by its id, we send a GET request with URL "packages/id"
    let url = API_URL + "/packages/" + id;
    return this.http.get(url)
      .pipe(
        catchError(this.errorHandler.handleError.bind(this.errorHandler))
      );
  }

  deletePackage(id: string){
    return this.http.delete(API_URL + '/packages/' + id, httpOptions)
      .pipe(
        catchError(this.errorHandler.handleError.bind(this.errorHandler))
      );
  }

  updatePackage(id: string, data: any){
    console.log(id);
    return this.http.put(API_URL + "/packages/" + id, data, httpOptions)
      .pipe(
        catchError(this.errorHandler.handleError.bind(this.errorHandler))
      );
  }
}
