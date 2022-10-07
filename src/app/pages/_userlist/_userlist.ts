import { OnDestroy, OnInit } from '@angular/core';
import { NavController, ModalController, AlertController, LoadingController, PopoverController, ActionSheetController, ToastController, IonSearchbar  } from '@ionic/angular';
import { Component, ViewChild, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from "@angular/router";
import { FormBuilder, FormGroup, FormControl, FormArray, Validators, NgForm } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { Observable, Subscription, BehaviorSubject, from, timer } from 'rxjs';
import { IonInfiniteScroll, Platform } from '@ionic/angular';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { Camera, CameraOptions, PictureSourceType } from '@ionic-native/camera/ngx';
import { File, Entry, FileEntry } from '@ionic-native/file/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { FileChooser } from '@ionic-native/file-chooser/ngx';
import { TranslateService } from '@ngx-translate/core';
import { IonicSelectableComponent } from 'ionic-selectable';
import { FileUploadComponent, FileUploadControl, FileUploadValidators } from '@iplab/ngx-file-upload';
import { UserData, DbRecord, DbFile, LocaleService, Settings, DbApp, DbAppValidators, History } from '../../providers';
import { environment } from '../../../environments/environment';
import { _user } from '../../providers';

// Component
@Component({
	selector: 'page-_user-list',
	templateUrl: '_userlist.html',
	styleUrls: ['_userlist.scss']
})
export class _userListPage implements OnDestroy, OnInit {
	@ViewChild(IonInfiniteScroll, { static: false }) infiniteScroll: IonInfiniteScroll;
	currentItems: any;
	orderBy: any;
	reverse: boolean;
	foreignKey: any;
	loadingMessage: string;
	keyCount: number = 1;
	pageId: string = "list";
	pageUrl: string = "_userlist";
	isLoggedIn: boolean;
	isAdmin: boolean;
	userId: string;
	permissions: any;
	userIdAllowed: boolean;
	private navigationSubscription: Subscription;

	// Constructor
	constructor(
		public dbapp: DbApp,
		public translate: TranslateService,
		public locale: LocaleService,
		public navController: NavController,
		public loadingController: LoadingController,
		public actionSheetController: ActionSheetController,
		public modalController: ModalController,
		public alertController: AlertController,
		public toastController: ToastController,
		public router: Router,
		public formBuilder: FormBuilder,
		public user: UserData,
		public inAppBrowser: InAppBrowser,
		private activatedRoute: ActivatedRoute,
		public history: History,
		private camera: Camera,
		private file: File,
		private webview: WebView,
		private platform: Platform,
		private changeDetectorRef: ChangeDetectorRef,
		private filePath: FilePath,
		private fileChooser: FileChooser,
		private sanitizer: DomSanitizer,
		public popoverController: PopoverController,
		public items: _user,
		) {
		this.items.currentPage = 1;
		this.userIdAllowed = this.dbapp.userIdAllow("_user", this.pageId);
		this.getUserData();
	}

	/**
	 * Get foreign key
	 */
	getForeignKey(): any {
		let keys, key;
		return null;
	}

	// OnInit
	ngOnInit() {
		this.navigationSubscription = this.router.events.subscribe(async (e: any) => {
			if (e instanceof NavigationEnd && this.history.isCurrentPage(this.pageUrl)) { // Re-init component
				await this.init();
			}
		});
	}

	// OnDestroy
	ngOnDestroy() {
		if (this.navigationSubscription)
			this.navigationSubscription.unsubscribe(); // Clean up
	}

	// Init
	async init() {
		this.foreignKey = this.getForeignKey();
		await this.user.set("_user_foreignKey", this.foreignKey);
		this.loadingMessage = await this.translate.get("LOADING").toPromise();
		const loading = await this.loadingController.create({
			message: this.loadingMessage,
			showBackdrop: false,
			mode: this.dbapp.loadingMode
		});
		await loading.present();
		try {
			let items = await this.items.query(this.foreignKey);
			if (items) {
				await this.items.lookup(items, this.pageId);
				this.currentItems = await Promise.all(items.map(async item => await this.items.renderRow(item, this.pageId)));
			} else {
				this.currentItems = [];
			}
		} catch(err) {
			await this.showError(err);
		} finally {
			loading.dismiss();
		}
	}

	/**
	 * Get query parameters
	 */
	private getParams() {
		let params = {};
		return Object.assign(params, this.foreignKey);
	}

	/**
	 * Search for the proper items
	 */
	async getItems(ev?: any) {
		this.items.currentPage = 1; // Reset to the first page
		const loading = await this.loadingController.create({
			message: this.loadingMessage,
			showBackdrop: false,
			mode: this.dbapp.loadingMode
		});
		await loading.present();
		try {
			let items = await this.items.query(this.getParams(), this.orderBy, this.reverse);
			if (items) {
				await this.items.lookup(items, this.pageId);
				this.currentItems = await Promise.all(items.map(async item => await this.items.renderRow(item, this.pageId)));
			}
		} catch(err) {
			await this.showError(err);
		} finally {
			await loading.dismiss();
		}
	}

	/**
	 * Add items (Infinite scroll)
	 */
	async addItems() {
		try {
			let items = await this.items.query(this.getParams(), this.orderBy, this.reverse);
			if (items) {
				await this.items.lookup(items, this.pageId);
				items = await Promise.all(items.map(async item => await this.items.renderRow(item, this.pageId)));
				for (let item of items)
					this.currentItems.push(item)
			}
		} catch(err) {
			await this.showError(err);
		}
	}

	/**
	 * Pull to refresh
	 */
	async doRefresh(event) {

		//console.log('refresh');
		await this.getItems();
		event.target.complete();
	}

	/**
	 * Get primary key from an item
	 */
	getPrimaryKey(item: any): any {
		let keys = null;
		if (item) {
			keys = {};
			if (item["id"])
				keys["id"] = item["id"].value;
			if (Object.keys(keys).length != this.keyCount)
				keys = null;
		}
		return keys;
	}

	// Get user data
	getUserData() {
		this.user.isLoggedIn.subscribe(res => {
			this.isLoggedIn = res;
			this.isAdmin = this.user.isAdmin;
			this.userId = this.user.userId;
			this.permissions = this.user.permissions;
		});
	}

	/**
	 * Show message
	 */
	async showMessage(msg: string, header: string) {
		let values = await this.translate.get(["OK_BUTTON", header]).toPromise();
		const alert = await this.alertController.create({
			header: values[header],
			message: msg,
			buttons: [values.OK_BUTTON]
		});
		await alert.present();
	}

	/**
	 * Show error
	 */
	async showError(err: any) {
		let msg = (err instanceof Error) ? err.message : err;
		return this.showMessage(msg, "ERROR");
	}

	/**
	 * Show success message
	 */
	async showSuccess(msg: string) {
		return this.showMessage(msg, "SUCCESS");
	}

	/**
	 * Delete
	 */
	async delete(item: any) {
		let keys = this.getPrimaryKey(item);
		if (!keys) {
			let value = await this.translate.get("INVALID_PRIMARY_KEY").toPromise();
			await this.showError(value);
			return;
		}
		let values = await this.translate.get(["OK_BUTTON", "CANCEL_BUTTON", "DELETE_HEADER", "ERROR", "FAILED_TO_DELETE"]).toPromise();
		const alert = await this.alertController.create({
			header: values.DELETE_HEADER,
			message: item.title,
			buttons: [
				{
					text: values.CANCEL_BUTTON,
					role: "cancel",
					cssClass: "secondary"
				}, {
					text: values.OK_BUTTON,
					handler: async () => {
						let result = await this.items.delete(keys); // Delete the item
						if (result && result["success"]) { // Success
							let index = this.currentItems.indexOf(item);
							if(index > -1)
								this.currentItems.splice(index, 1);
						} else if (result && result["failMessage"]) { // Failure
							await this.showError(result["failMessage"]);
						} else {
							await this.showError(values.FAILED_TO_DELETE);
						}
					}
				}
			]
		});
		await alert.present();
	}

	/**
	 * Infinite scroll
	 */
	async loadData(event) {
		if (this.items.currentPage >= this.items.totalPage) {
			event.target.disabled = true;
			return;
		}
		this.items.currentPage++;
		await this.addItems();
		event.target.complete();
	}

	// Open URL
	openUrl(url: string, target?: string) {
		this.inAppBrowser.create(url, target);
	}
}