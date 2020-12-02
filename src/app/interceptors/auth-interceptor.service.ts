import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {

    constructor(private authService: AuthService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const token = this.authService.getAuthData().token;
        if (!token) {
            return next.handle(req);
        }

        const modifiedRequest = req.clone({
            headers: req.headers.append('Authorization', token)
        });
        return next.handle(modifiedRequest).pipe(
            tap(
                () => {},
                err => {
                    if (err.status == 403) {
                        this.authService.logout();
                    }
                })
        );
    }

}