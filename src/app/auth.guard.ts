import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  debugger;
  const localData = localStorage.getItem("a3pdmaAppToken");
  if(localData != null){
    return true;
  }else{
    router.navigate(['login']);
    return false;
  }
};
