import { Pipe, PipeTransform } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { UserData } from './user-data';
import { DbApp } from './dbapp';

@Pipe({
	name: 'authFile'
})
export class AuthFilePipe implements PipeTransform {

	// Constructor
	constructor(private http: HttpClient,
		private user: UserData,
		private sanitizer: DomSanitizer,
		private dbapp: DbApp) {}

	// Tranform
	transform(src: string): Observable<SafeUrl> {
		return new Observable<SafeUrl>(observer => {
			observer.next('data:image/png;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=');
			if (src && src.startsWith('data:')) {
				observer.next(src);
			} else if (src && src.match(/https?:\/\//i)) {
				let headers = new HttpHeaders();
				if (this.user && this.user.JWT)
					headers = headers.set(this.dbapp.apiAuthHeader, 'Bearer ' + this.user.JWT);
				this.http.get(src, { headers, responseType: 'blob' }).toPromise().then(data => {
					const reader = new FileReader();
					reader.onloadend = () => observer.next(this.sanitizer.bypassSecurityTrustUrl(reader.result as string));
					reader.readAsDataURL(data);
				});
			}
		});
	}

}
