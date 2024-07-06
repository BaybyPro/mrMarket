import { HttpInterceptorFn } from '@angular/common/http';
import { catchError,throwError  } from 'rxjs';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {

  const token = localStorage.getItem('token');


  const authReq = req.clone({
    headers: req.headers.set('Authorization',`Bearer ${token}`),
  });
  
  
  return next(authReq).pipe(
    catchError((error)=>{
      if(error.status === 401){
        localStorage.removeItem('token');
      }
      return throwError(() => error); 
    })
  );
};
