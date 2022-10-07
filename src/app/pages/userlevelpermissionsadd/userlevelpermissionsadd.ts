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
import { userlevelpermissions } from '../../providers';

// Component
@Component({
	selector: 'page-userlevelpermissions-add',
	templateUrl: 'userlevelpermissionsadd.html',
	styleUrls: ['userlevelpermissionsadd.scss']
})
export class userlevelpermissionsAddPage implements OnDestroy, OnInit {
	key: any;
	keyCount: number = 2;
	item: any;
	item$: BehaviorSubject<DbRecord>;
	foreignKey: any;
	pageId: string = "add";
	pageUrl: string = "userlevelpermissionsadd";
	returnUrl: string = "/userlevelpermissionslist";
	loadingMessage: string;
	formGroup: FormGroup;
	isLoggedIn: boolean;
	isAdmin: boolean;
	userId: string;
	permissions: any;
	userIdAllowed: boolean;
	submitted: boolean;
	private saving: boolean;
	private subscription: Subscription; // For AutoSuggest
	private currentPage: number; // For AutoSuggest
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
		public items: userlevelpermissions,
		) {
		this.item$ = new BehaviorSubject<DbRecord>(null);
		this.userIdAllowed = this.dbapp.userIdAllow("userlevelpermissions", this.pageId);
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
		this.key = this.getPrimaryKey();
		this.foreignKey = await this.getForeignKey();
		this.formGroup = this.formBuilder.group({
			userlevelid: [{ value: "", disabled: false }, [Validators.required, DbAppValidators.integer]],
			tablename: [{ value: "", disabled: false }, [Validators.required]],
			permission: [{ value: "", disabled: false }, [Validators.required, DbAppValidators.integer]],
		});
		await this.getItem();
	}

	// Get empty item
	getEmptyItem() {
		return {
			"userlevelid": "",
			"tablename": "",
			"permission": ""
		};
	}

	// Get item
	async getItem() {
		this.loadingMessage = await this.translate.get("LOADING").toPromise();
		const loading = await this.loadingController.create({
			message: this.loadingMessage,
			showBackdrop: false,
			mode: this.dbapp.loadingMode
		});
		await loading.present();
		try {
			let item = this.dbapp.isObject(this.key)
				? await this.items.query(Object.assign({ action: "view" }, this.key)) // Copy, use "view" action to get the record
				: this.getEmptyItem(); // Add
			if (this.dbapp.isObject(item)) {
				if (this.foreignKey) {
					let fk = Object.assign({}, this.foreignKey);
					delete(fk[this.dbapp.TABLE_MASTER])
					for (let k in fk)
						item[this.items.getFieldName(k)] = fk[k];
				}
				await this.items.lookup(item, this.pageId);
				this.item = await this.items.renderRow(item, this.pageId);
				this.item$.next(this.item);
				this.formGroup.patchValue({
					userlevelid: this.item['userlevelid'].value,
					tablename: this.item['tablename'].dbValue,
					permission: this.item['permission'].value
				});
			}
		} catch(err) {
			this.showError(err);
		} finally {
			await loading.dismiss();
		}
	}

	/**
	 * Add
	 */
	async add() {
		this.submitted = true;
		if (!this.formGroup.valid) {
			let err = await this.translate.get("VALIDATION_ERROR").toPromise();
			if (err != "VALIDATION_ERROR")
				this.showError(err);
			return false;
		} else {
			let value = await this.unformatValue(this.formGroup.value), res;
			this.saving = true;
			try {
				res = await this.items.add(value);
			} finally {
				this.saving = false;
			}
			if (res && res.success) {
				this.formGroup.reset();
				this.submitted = false;
				if (this.foreignKey) {
					let fk = Object.assign({}, this.foreignKey);
					delete(fk[this.dbapp.TABLE_MASTER])
					this.router.navigate([this.returnUrl, fk]);
				} else {
					this.router.navigate([this.returnUrl]);
				}
			} else if (res && !res.success && res.failureMessage) {
				if (environment.production) {
					let err = await this.translate.get("FAILED_TO_ADD").toPromise();
					await this.showError(err);
				} else {
					await this.showError(res.failureMessage);
				}
			}
		}
	}

	/**
	 * Get foreign key
	 */
	async getForeignKey() {
		return await this.user.get("userlevelpermissions_foreignKey") || {};
	}

	/**
	 * Get primary key
	 */
	getPrimaryKey(): any {
		let keys = {}, key;
		key = this.activatedRoute.snapshot.paramMap.get("userlevelid");
		if (!this.dbapp.isEmpty(key))
			keys["userlevelid"] = key;
		key = this.activatedRoute.snapshot.paramMap.get("tablename");
		if (!this.dbapp.isEmpty(key))
			keys["tablename"] = key;
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
	 * Filter (SELECT)
	 */
	filter(items: any, text: string) {
		return items.filter(item => item.name.toLowerCase().includes(text));
	}

	/**
	 * On search fail
	 */
	onSearchFail(event: {
		component: IonicSelectableComponent,
		text: string
	}) {
		if (event.component.addItemTemplate) {
			let name = (event.component as any)._element.nativeElement.getAttribute("formControlName"),
				fg = this.formGroup.get(name + "Option"),
				f = fg.get("displayField") || fg.get("linkField");
			if (f)
				f.setValue(event.text);
			event.component.showAddItemTemplate();
		}
	}

	/**
	 * On search success
	 */
	onSearchSuccess(event: {
		component: IonicSelectableComponent,
		text: string
	}) {
		if (event.component.addItemTemplate)
			event.component.hideAddItemTemplate();
	}

	/**
	 * Get AutoSuggest parameters (TEXT)
	 */
	private getAutoSuggestParams(component: IonicSelectableComponent) {
		let fldname = (component as any)._element.nativeElement.dataset.field,
			params = {
				action: "lookup",
				ajax: "autosuggest",
				page: this.items.name + "_" + this.pageId,
				field: fldname,
				n: this.dbapp.autoSuggestPageSize,
				start: (this.currentPage - 1) * this.dbapp.autoSuggestPageSize
			};
		return params;
	}

	/**
	 * Get suggestions (TEXT)
	 */
	async getSuggestions(event: {
		component: IonicSelectableComponent,
		text: string
	}) {
		let component = event.component;
		let oldItems = component.hasValue()
			? component.items.filter(item => (component as any)._valueItems.includes(item[component.itemValueField]))
			: [];
		let text = event.text.trim();
		component.startSearch();

		// Close any running subscription.
		if (this.subscription)
			this.subscription.unsubscribe();
		if (!text) {

			// Close any running subscription
			if (this.subscription)
				this.subscription.unsubscribe();
			component.items = oldItems;
			component.endSearch();
			return;
		}
		this.currentPage = 1;
		let params = this.getAutoSuggestParams(component);
		params["q"] = text;
		this.subscription = from(this.items.query(params)).subscribe(items => {

			// Subscription will be closed when unsubscribed manually
			if (this.subscription.closed)
				return;
			let fldvar = (component as any)._element.nativeElement.getAttribute("formControlName");
			items.forEach(item => item["name"] = this.dbapp.displayValue(item, this.items.displayValueSeparators[fldvar]));
			if (items.length) {
				for (let oldItem of oldItems) { // Add old items
					if (!items.some(item => oldItem[component.itemValueField] == item[component.itemValueField]))
						items = [oldItem, ...items];
				}
				component.items = items;
				component.endSearch();

				// Infinite scroll
				if (items.totalRecordCount > params.start + items.length) {
					this.currentPage++;
					component.enableInfiniteScroll();
				} else {
					component.disableInfiniteScroll();
				}
			} else {
				component.items = oldItems;
				component.endSearch();
				if (text && component.addItemTemplate) {
					this.formGroup.get(fldvar + "Option").get("displayField").setValue(text);
					component.showAddItemTemplate();
				}
			}
		});
	}

	/**
	 * Get more suggestions (TEXT)
	 */
	getMoreSuggestions(event: {
		component: IonicSelectableComponent,
		text: string
	}) {
		let params = this.getAutoSuggestParams(event.component);
		params["q"] = (event.text || "").trim();
		from(this.items.query(params)).subscribe(items => {
			let fldvar = (event.component as any)._element.nativeElement.getAttribute("formControlName");
			items.forEach(item => item["name"] = this.dbapp.displayValue(item, this.items.displayValueSeparators[fldvar]));
			event.component.items = event.component.items.concat(items);
			event.component.endInfiniteScroll();

			// Infinite scroll
			if (items.totalRecordCount > params.start + items.length) {
				this.currentPage++;
				event.component.enableInfiniteScroll();
			} else {
				event.component.disableInfiniteScroll();
			}
		});
	}

	/**
	 * Create form group for new option
	 */
	getNewOptionFormGroup() {
		return this.formBuilder.group({
			linkField: "",
			displayField: "",
			displayField2: "",
			displayField3: "",
			displayField4: ""
		});
	}

	/**
	 * Add option
	 */
	async addOption(name: string) {
		let component = this[name];
		if (!(component instanceof IonicSelectableComponent))
			return;

		// Get values
		let el = (component as any)._element.nativeElement,
			dataset = el.dataset,
			linkTable = dataset.lt,
			option = this.formGroup.get(name + "Option"),
			value = option.value,
			data = {},
			item = {};
		if (dataset.lf)
			item["lf"] = data[dataset.lf] = value.linkField;
		if (dataset.df)
			item["df"] = data[dataset.df] = value.displayField;
		if (dataset.df2)
			item["df2"] = data[dataset.df2] = value.displayField2;
		if (dataset.df3)
			item["df3"] = data[dataset.df3] = value.displayField3;
		if (dataset.df4)
			item["df4"] = data[dataset.df4] = value.displayField4;

		// Add new option
		try {
			let result = await this.items.send(Object.assign({ object: linkTable, action: "add" }, data));

			// Add item
			if (!dataset.autoSuggest) {
				let fldvar = el.getAttribute("formControlName");
				if (dataset.lfAuto) // Link field is autoinc
					item["lf"] = result[linkTable][dataset.lfAuto];
				item["df"] = item["df"] || item["lf"]; // Display field = Link field
				item["name"] = this.dbapp.displayValue(item, this.items.displayValueSeparators[fldvar]);
				await component.addItem(item);
			}

			// Search the new option
			component.search(data[dataset.df]);

			// Reset
			option.reset();

			// Show list
			component.hideAddItemTemplate();
		} catch(err) {
			await this.showError(err);
		}
	}

	// Unformat field values before submit
	async unformatValue(value: any) {
		let gpSep = this.locale.groupSeparator,
			decSep = this.locale.decimalSeparator;
		for (let fldvar of ["userlevelid","permission"])
			value[fldvar] = this.dbapp.parseNumber(value[fldvar], gpSep, decSep);
		return value;
	}

	// Quick access to form controls
	get f() {
		return this.formGroup.controls;
	}

	// Open URL
	openUrl(url: string, target?: string) {
		this.inAppBrowser.create(url, target);
	}

	/**
	 * Select image
	 * @param {string} sourceType Source type ('PHOTOLIBRARY'|'CAMERA'|'SAVEDPHOTOALBUM'|'FILE')
	 * @param {string} fldvar Field variable name
	 * e.g. <ion-button (click)="selectImage('CAMERA', 'fldvar')"><ion-icon slot="start" name="camera"></ion-icon></ion-button>
	 */
	async selectImage(sourceType: string, fldvar: string) {
		let entry = await this.takePicture(sourceType),
			file = new DbFile(entry);
		file.previewUrl = this.webview.convertFileSrc(this.file.dataDirectory + entry.name);
		this.item[fldvar].addFiles([file]);
	}

	/**
	 * Take picture and copy to this.file.dataDirectory
	 * e.g. this.takePicture(this.camera.PictureSourceType.CAMERA)
	 * @param {string} sourceType Source type ('PHOTOLIBRARY'|'CAMERA'|'SAVEDPHOTOALBUM'|'FILE')
	 * @returns {Entry}
	 */
	async takePicture(sourceType: string) {
		let options = Object.assign({}, this.dbapp.cameraOptions, { sourceType: this.camera.PictureSourceType[sourceType] }),
			isCamera = ["PHOTOLIBRARY", "CAMERA", "SAVEDPHOTOALBUM"].includes(sourceType),
			correctPath, currentName;
		try {
			let imagePath = isCamera ? await this.camera.getPicture(options) : await this.fileChooser.open();
			if (this.platform.is("android") && sourceType === "PHOTOLIBRARY") {
				currentName = imagePath.substring(imagePath.lastIndexOf("/") + 1, imagePath.lastIndexOf("?"));
				let filePath = await this.filePath.resolveNativePath(imagePath);
				correctPath = filePath.substr(0, filePath.lastIndexOf("/") + 1);
			} else {
				currentName = imagePath.substr(imagePath.lastIndexOf("/") + 1);
				correctPath = imagePath.substr(0, imagePath.lastIndexOf("/") + 1);
			}
			let entry = await this.file.copyFile(correctPath, currentName, this.file.dataDirectory, this.dbapp.createFileName());
			return await this.file.resolveLocalFilesystemUrl(this.file.dataDirectory + entry.name);
		} catch(err) { // e.g. Cordova not available
			this.showError(err);
		}
	}

	/**
	 * Remove a file from a field
	 * @param {string} fldvar Field name
	 * @param {DbFile} dbfile File to be removed
	 */
	async removeFile(fldvar: string, dbfile: DbFile) {
		let i = this.item[fldvar].files.indexOf(dbfile),
			f = dbfile.file;
		if (f) {
			if (f instanceof Blob) { // File upload component
				this[fldvar].control.removeFile(f); // Will trigger valueChanges
			} else if (f.isFile) { // Entry (Take picture)
				let fullPath = this.file.dataDirectory + f.name,
					correctPath = fullPath.substr(0, fullPath.lastIndexOf("/") + 1);
				await this.file.removeFile(correctPath, f.name);
			}
		}
		if (dbfile)
			this.item[fldvar].removeFile(dbfile);
	}

	/**
	 * Remove files from a field
	 * @param {string} fldvar Field variable name
	 */
	async removeFiles(fldvar: string) {
		let files = this.item[fldvar].files;
		for (let i = files.length - 1; i >= 0; i--) {
			if (files[i].isBlob)
				this.item[fldvar].removeFile(i); // Do not remove files from the File upload component
			else
				this.removeFile(fldvar, files[i]);
		}
	}
}