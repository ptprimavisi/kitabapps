import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from "rxjs";
import { timeout, catchError } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../environments/environment';
import { UserData, DbApp } from './providers';

// DbAppHttpInterceptor
@Injectable()
export class DbAppHttpInterceptor implements HttpInterceptor {
	serverError: string;
	constructor(public dbapp: DbApp,
		public translate: TranslateService,
		public user: UserData) {
		this.translate.get("SERVER_ERROR").subscribe(value =>
			this.serverError = value);
	}
	intercept(request: HttpRequest<any>, next: HttpHandler): Observable<any> {
		const jwtToken = this.user.JWT;
		let requestToHandle = jwtToken
			? request.clone({
				headers: request.headers.set(this.dbapp.apiAuthHeader, "Bearer " + jwtToken),
				params: request.params.set("r", this.dbapp.random)
			})
			: request;
		return next.handle(requestToHandle).pipe(
			timeout(this.dbapp.timeout),
			catchError(error => {
				console.log("Error intercepted", error);
				if (environment.production) {
					if (error && error.status == 401)
						return throwError(error);
					else
						return throwError(new Error(this.serverError));
				} else {
					return throwError(error);
				}
			})
		);
	}
}