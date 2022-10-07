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
import { kitab } from '../../providers';

// Component
@Component({
	selector: 'page-kitab-view',
	templateUrl: 'kitabview.html',
	styleUrls: ['kitabview.scss']
})
export class kitabViewPage implements OnDestroy, OnInit {
	key: any;
	keyCount: number = 1;
	item: any;
	item$: BehaviorSubject<DbRecord>;
	pageId: string = "view";
	pageUrl: string = "kitabview";
	loadingMessage: string;
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
		public items: kitab,
		) {
		this.key = this.getPrimaryKey();
		this.item$ = new BehaviorSubject<DbRecord>(null);
		this.userIdAllowed = this.dbapp.userIdAllow("kitab", this.pageId);
		this.getUserData();
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
		this.loadingMessage = await this.translate.get("LOADING").toPromise();
		if (this.dbapp.isObject(this.key)) {
			const loading = await this.loadingController.create({
				message: this.loadingMessage,
				showBackdrop: false,
				mode: this.dbapp.loadingMode
			});
			await loading.present();
			try {
				let item = await this.items.query(Object.assign({ action: "view" }, this.key)); // Use "view" action to get the record
				if (this.dbapp.isObject(item)) {
					await this.items.lookup(item, this.pageId);
					this.item = await this.items.renderRow(item, this.pageId);
					this.item$.next(this.item);
				}
			} catch(err) {
				this.showError(err);
			} finally {
				await loading.dismiss();
			}
		}
	}

	/**
	 * Get primary key
	 */
	getPrimaryKey(): any {
		let keys = {}, key;
		key = this.activatedRoute.snapshot.paramMap.get("id");
		if (!this.dbapp.isEmpty(key))
			keys["id"] = key;
		return (Object.keys(keys).length === this.keyCount) ? keys : false;
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
	 * Show detail table buttons
	 */
	async presentDetails() {
		let ids = [
			"__tables.kitab_detil.caption",
			"DETAILS",
			"CANCEL_BUTTON"
		];
		let values = await this.translate.get(ids).toPromise();
		let buttons = [];
		if (this.user.permissions.list.kitab_detil) {
			buttons.push({
				text: values["__tables.kitab_detil.caption"],
				handler: () => {
					this.openDetail("kitab_detil");
				}
			});
		}
		let actionSheet = await this.actionSheetController.create({
			header: values.DETAILS,
			buttons: [...buttons,
				{
					text: values.CANCEL_BUTTON,
					role: 'cancel',
					handler: () => {
						console.log('Cancel clicked');
					}
				}
			]
		});
		await actionSheet.present();
	}

	/**
	 * Open detail table List page
	 * @param detailTable
	 */
	openDetail(detailTable: string) {
		if (!this.item)
			return;
		switch (detailTable) {
			case "kitab_detil":
				this.navController.navigateForward([detailTable + "list", { pid: this.item.id.dbValue }]);
				break;
		}
	}

	// Open URL
	openUrl(url: string, target?: string) {
		this.inAppBrowser.create(url, target);
	}
}