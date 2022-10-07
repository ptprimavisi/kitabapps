import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CanLoad, Route, Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { AlertController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { satisfies } from 'semver';
import { environment } from './../../environments/environment';
import { DbApp } from './dbapp';
import { UserOptions } from '../interfaces/user-options';

// User Data
@Injectable({
	providedIn: 'root'
})
export class UserData implements CanLoad {
	private USER_DATA_KEY = '_userdata';
	private _permissions: any[];
	version: string;
	JWT: string;
	username: string;
	userId: any;
	parentUserId: any;
	userLevelId: number;
	permissions: any;
	isLoggedIn: BehaviorSubject<boolean>;
	isAdmin: boolean;
	keys: string[] = ["ADD", "EDIT", "LIST", "VIEW"];

	// Constructor
	constructor(public dbapp: DbApp,
		public http: HttpClient,
		public translate: TranslateService,
		public alertController: AlertController,
		private router: Router,
		public storage: Storage) {
		this.setPermissions(this.dbapp.permissions); // Init permissions
		this.isLoggedIn = new BehaviorSubject<boolean>(undefined);
	}

	// Load data from storage
	load(): Promise<any> {
		return this.get(this.USER_DATA_KEY).then(data => {
			data = data || {};
			if (this.dbapp.useSecurity) { // Use security
				return this.setProfile(data).then(data =>
					this.isLoggedIn.next(data.success)); // Always emit new value
			} else { // No security => All permissions like administrator
				this.userLevelId = -1;
				this.isAdmin = true;
				this.isLoggedIn.next(true);
			}
			return data;
		});
	}

	// Login
	login(user: UserOptions): Promise<any> {
		let formData = this.dbapp.getFormData(user);
		formData.set("action", "login");
		return this.http.post(environment.apiUrl, formData).toPromise().then(async (data: any) => {
			data = data || {};
			if (data.version && !satisfies(data.version, this.dbapp.requiredApiVersion))
				await this.translate.get("INCOMPATIBLE_API", { s: data.version }).toPromise();
			await this.setProfile(data);
			this.isLoggedIn.next(data.success); // Always emit new value
			if (data.success)
				window.dispatchEvent(new CustomEvent('user:login'));
			return data;
		});
	}

	// Logout
	async logout() {
		await this.setProfile({ logout: true });
		this.isLoggedIn.next(false);
		window.dispatchEvent(new CustomEvent('user:logout'));
		return this.load(); // Reload anonymous user permissions
	}

	// Set profile
	setProfile(data: any): Promise<any> {
		this.version = data.version;
		this.JWT = data.JWT;
		this.username = data.username;
		this.userId = data.userid;
		this.parentUserId = data.parentuserid;
		this.userLevelId = data.userlevelid;
		this.isAdmin = data.userlevelid == -1;
		return this.getPermissions().then(privs => {
			data.permissions = privs;
			return this.set(this.USER_DATA_KEY, data);
		}); // Get permssions and then save data
	}

	// Get permissions
	getPermissions(): Promise<any> {
		return this.http.get(environment.apiUrl, this.dbapp.getHttpOptions({ action: "permissions" })).toPromise().then((data: any) => { // GET
			let permissions = (data && data.permissions) ? data.permissions : {};
			this.setPermissions(permissions);
			return permissions;
		});
	}

	/**
	 * Set permissions
	 * Allow getting permission in Angular template by user.permissions.<pageId>['<tableName>'], e.g. permissions.list['cars']
	 * @param {any} permissions Permissions in the format of { tableName: permission, ... }
	 */
	setPermissions(permissions: any) {
		this._permissions = permissions;
		let privs = {},
			keys = Object.keys(this.dbapp.permission);
		for (let key of keys) {
			let k = key.toLowerCase();
			privs[k] = {};
			for (let t of this.dbapp.tables)
				privs[k][t[0]] = this.isAllowed(t[0], this.dbapp.permission[key]);
		}
		this.permissions = privs;
	}

	// Set value to storage
	set(name: string, value: any): Promise<any> {
		return this.storage.set(name, value);
	}

	// Get value from storage
	get(name: string): Promise<any> {
		return this.storage.get(name);
	}

	// Remove value from storage
	remove(name: string): Promise<any> {
		return this.storage.remove(name);
	}

	// Check if key exists in storage
	has(name: string): Promise<boolean> {
		return this.storage.keys().then(keys => keys.includes(name));
	}

	// Is allowed
	isAllowed(tableName: string, permission: number) {
		if (this.isAdmin)
			return true;
		let p = this._permissions[tableName] || 0;
		return (p & permission) == permission;
	}

	// Allow list
	allowList(tableName: string) {
		return this.isAllowed(tableName, this.dbapp.permission.LIST);
	}

	// Allow add
	allowAdd(tableName: string) {
		return this.isAllowed(tableName, this.dbapp.permission.ADD);
	}

	// Allow delete
	allowDelete(tableName: string) {
		return this.isAllowed(tableName, this.dbapp.permission.DELETE);
	}

	// Allow edit
	allowEdit(tableName: string) {
		return this.isAllowed(tableName, this.dbapp.permission.EDIT);
	}

	// Allow view
	allowView(tableName: string) {
		return this.isAllowed(tableName, this.dbapp.permission.VIEW);
	}

	// Allow search
	allowSearch(tableName: string) {
		return this.isAllowed(tableName, this.dbapp.permission.SEARCH);
	}

	// Allow lookup
	allowLookup(tableName: string) {
		return this.isAllowed(tableName, this.dbapp.permission.LOOKUP);
	}

	// Show error
	async showError() {
		let values = await this.translate.get(["OK_BUTTON", "ERROR", "NoPermission"]).toPromise();
		const alert = await this.alertController.create({
			header: values.ERROR,
			message: values.NoPermission,
			buttons: [values.OK_BUTTON]
		});
		await alert.present();
	}

	// Can load // Not supported
	canLoad(route: Route): Observable<boolean> | Promise<boolean> | boolean {
		return true;
	}
}