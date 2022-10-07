import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { map, catchError } from 'rxjs/operators';
import { environment } from './../../environments/environment';
import { UserData } from './user-data';
import { DbApp } from './dbapp';
import { DbRecord } from './dbrecord';

/**
 * DbTable class
 *
 * @export
 * @class DbTable
 */
@Injectable({
	providedIn: 'root'
})
export class DbTable {
	name: string; // Table name
	totalRecordCount = 0;
	currentPage = 1;
	pageSize: number;
	items: any;
	defaultItem: any;
	infiniteScroll: boolean;
	messages: any;

	// Constructor
	constructor(public dbapp: DbApp,
		public http: HttpClient,
		public user: UserData,
		public translate: TranslateService,
		public router: Router) {
		this.translate.get(["EXPIRED", "UNAUTHORIZED", "UNAUTHENTICATED", "UNKNOWN_ERROR"]).subscribe(values => this.messages = values);
	}

	// Handle error
	async handleError(error: any) {
		let isHttpErrorResponse = error instanceof HttpErrorResponse,
			message = "";
		if (!isHttpErrorResponse && error && error.message) {
			message = error.message;
		} else if (isHttpErrorResponse) {
			if (error.error instanceof ErrorEvent) {
				message = error.error.message;
				if (!environment.production && error.error.error)
					message += error.error.error;
			} else {
				if (error.status == 401) {
					if (this.dbapp.useSecurity) { // Use security
						if (this.user.isLoggedIn.value) { // Already logged in => JWT expired
							if (this.messages.EXPIRED != "EXPIRED") // Please sign in again
								message = this.messages.EXPIRED;
							this.user.logout();
						} else { // Not logged in
							if (this.messages.UNAUTHENTICATED != "UNAUTHENTICATED")
								message = this.messages.UNAUTHENTICATED; // Please sign in
						}
						this.router.navigateByUrl("/login"); // Go to login page
					} else { // No security
						message = this.messages.UNAUTHORIZED; // Unauthorized access
						this.router.navigateByUrl(""); // Go to start page
					}
				} else {
					message = environment.production ? error.status + " " + error.statusText : error.message;
				}
			}
		} else {
			message = this.messages.UNKNOWN_ERROR;
		}
		if (message)
			throw new Error(message);
	}

	// Query
	async query(params?: any, orderby?: any, reverse?: boolean, pagesize?: number): Promise<any> {
		let url = environment.apiUrl,
			body = null,
			options = null;
		params = this.dbapp.isObject(params) ? params : {};
		let action = params["action"];
		if (action == "lookup") { // Lookup => POST
			body = this.dbapp.getFormData(params);
		} else { // Not lookup
			options = Object.assign({ object: this.name }, params);
			if (!action || action == "list") { // List
				if (pagesize != undefined)
					this.pageSize = pagesize;
				Object.assign(options, {
					recperpage: this.pageSize, // Record per page
					start: (this.currentPage - 1) * this.pageSize + 1, // Start position
					lang: (this.dbapp.multiLanguage) ? this.translate.currentLang : "", // Language
					order: orderby || "",
					ordertype: (orderby != undefined && reverse != undefined) ? (reverse ? "DESC" : "ASC") : ""
				});
			}
		}
		return this.http.post(url, body, this.dbapp.getHttpOptions(options)).pipe(
			map(data => {
				if (data && data["result"] == "OK") { // Lookup
					let items = data["records"];
					items.totalRecordCount = data["totalRecordCount"];
					return items;
				}
				if (data && data["success"]) { // Actions
					this.totalRecordCount = data["totalRecordCount"];
					this.items = data[this.name];
				} else { // No data
					this.totalRecordCount = 0;
					this.currentPage = 1;
					this.items = [];
					if (data && data["failureMessage"])
						throw new Error(data["failureMessage"]);
				}
				return this.items;
			}),
			catchError((err: any) =>
				this.handleError(err)
			)
		).toPromise();
	}

	// Send request
	async send(body: any, options?: any): Promise<any> {
		return this.http.post(environment.apiUrl, this.dbapp.getFormData(body), this.dbapp.getHttpOptions(options)).pipe(
			catchError((err: any) =>
				this.handleError(err)
			)
		).toPromise();
	}

	// Add
	async add(data: any): Promise<any> {
		return await this.send(Object.assign(data, { object: this.name, action: "add" }));
	}

	// Register
	async register(data: any): Promise<any> {
		return await this.send(Object.assign(data, { action: "register" }));
	}

	// Edit
	async edit(key: any, data: any): Promise<any> {
		return await this.send(Object.assign(data, { object: this.name, action: "edit" }), key);
	}

	// Delete
	async delete(key: any): Promise<any> {
		return await this.send(null, Object.assign({ object: this.name, action: "delete" }, key));
	}

	// Clear items
	clear() {
		this.items = null;
		this.totalRecordCount = 0;
		this.currentPage = 1;
	}

	// Total page count
	get totalPage() {
		if (this.dbapp.isNumber(this.pageSize) && this.pageSize > 0)
			return Math.ceil(this.totalRecordCount / this.pageSize);
		return 0;
	}

	// Events (virtual)
	rowOnRender(row: any) {}
	rowAfterRendered(row: any) {}
}