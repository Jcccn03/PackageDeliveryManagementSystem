import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {

  constructor(private router: Router) { }

  handleError(error: HttpErrorResponse){
    let errorMsg = error.error?.message || 'An unexpected error occured';
    if(error.status === 400){ // Bad Request
      console.log("this is from error-handle-component")
      // Navigate to the invalid data component
      
      this.router.navigate(['/invalid-data/',errorMsg]);
    }
    else if(error.status === 404){ // Page not found
      // Navigate to pagenotfound component
      this.router.navigate(['/page-not-found']);
    }
    else if(error.status === 403 ){ // token expired
      alert('Your session has expired. Please login again.');
      this.router.navigate(['/login']);
    } 
    else if(error.status === 401){
      alert('Access denied. Please login');
      this.router.navigate(['login']);
    }
    else{
      console.error('An unexpected error occured:', error);
    }

    return throwError(() => new Error('An error occured: ' + error.message));
  }
}
