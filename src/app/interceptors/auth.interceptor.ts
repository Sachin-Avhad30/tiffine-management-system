import { HttpClient, HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { SnackbarService } from '../services/snackbar.service';
import { catchError, switchMap, throwError } from 'rxjs';
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  console.log('inside interceptor');
  const token = sessionStorage.getItem('token');
  console.log('token', token);
  /*if (token) {
    console.log('in if of interceptor');
    const clonedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(clonedRequest);
    return next(clonedRequest);
  } else {
    return next(req);
  }
    */


  const authService = inject(AuthService)
  const snackBar = inject(SnackbarService);
  if (token) {
    console.log('in if of interceptor');
    console.log('inside interceptor checking token expiry', authService.isAccessTokenExpired());

    const token = sessionStorage.getItem('token');
    console.log('Access Token:', token);
    const clonedRequest = token
      ? req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      })
      : req;

    return next(clonedRequest).pipe(
      catchError((error: HttpErrorResponse) => {
        console.log('Interceptor error:', error);
        if (error.status === 401 && authService.isAccessTokenExpired()) {
          console.log('Access token expired, trying to refresh...');
          return authService.refreshTokens().pipe(
            switchMap((response: any) => {
              console.log('Refresh token response:', response);
              authService.saveTokens(response.newAccessToken, response.newRefreshToken);
              const newRequest = req.clone({
                setHeaders: {
                  Authorization: `Bearer ${response.token}`,
                },
              });
              return next(newRequest);
            }),
            catchError((refreshError) => {
              console.error('Refresh token failed:', refreshError);
              authService.logout();
              snackBar.showError('Session expired. Please login again.');
              return throwError(() => refreshError);
            })
          );
        }
        return throwError(() => error);
      })
    );
  } else {
    return next(req);
  }
};