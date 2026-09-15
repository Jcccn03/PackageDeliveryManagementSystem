import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem("a3pdmaAppToken");

  // if the JWT is present, then we will clone the HTTP headers, and add an extra Authorization header, which will contain the JWT
  const clonedReq = req.clone({
    setHeaders: {Authorization: `Bearer ${token}`}
  });

  return next(clonedReq);
};
