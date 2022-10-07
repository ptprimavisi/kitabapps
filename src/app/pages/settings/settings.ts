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
import { MobileAccessibility } from '@ionic-native/mobile-accessibility/ngx';

// Component
@Component({
	selector: 'page-settings',
	templateUrl: 'settings.html',
	styleUrls: ['./settings.scss'],
})
export class SettingsPage implements OnDestroy, OnInit {
	options: any; // Local settings object
	settingsReady = false;
	form: FormGroup;
	timer: any;
	subscription: Subscription;

	// Constructor
	constructor(public dbapp: DbApp,
		public router: Router,
		public settings: Settings,
		public locale: LocaleService,
		public user: UserData,
		public formBuilder: FormBuilder,
		public translate: TranslateService,
		public history: History,
		public mobileAccessibility: MobileAccessibility,
		) {
		let prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
		prefersDark.addListener((e) => this.setDark(e.matches)); // Listen for changes to the prefers-color-scheme media query
	}

	// Set dark mode
	setDark(enabled: boolean) {
		let toggle = this.form.controls.dark;
		if (toggle)
			toggle.setValue(enabled);
	}

	// Init
	async init() {
		await this.settings.load();
		this.settingsReady = true;
		this.options = this.settings.allSettings;
		this.buildForm();
	}

	// OnInit
	ngOnInit() {
		Promise.resolve().then(async () => {
			await this.init();
		});
	}

	// OnDestroy
	ngOnDestroy() {
	}

	// Build form
	private buildForm() {
		let group = {
		};
		this.form = this.formBuilder.group(group);

		// Watch the form for changes
		this.form.valueChanges.subscribe(() => {

			// Save old settings
			let oldSettings = Object.assign({}, this.settings.allSettings);

			// Get the form value
			this.settings.merge(this.form.value);

			// Get new settings
			let newSettings = this.settings.allSettings;

			// Check if Use preferred text zoom
			let usePreferredTextZoom = false;
			if (usePreferredTextZoom)
				this.mobileAccessibility.usePreferredTextZoom(true);

			// Check if font size changed
			if (newSettings.fontsize != oldSettings.fontsize) {
				if (!usePreferredTextZoom) {
					if (this.subscription)
						this.subscription.unsubscribe();
					if (!this.timer)
						this.timer = timer(200);
					this.subscription = this.timer.subscribe(() => {
						this.mobileAccessibility.setTextZoom(newSettings.fontsize);
					});
				}
			}

			// Check if language changed
			if (newSettings.language != oldSettings.language) {
				this.translate.use(newSettings.language);
				this.locale.use(newSettings.language);
			}

			// Check if dark theme changed
			if (newSettings.dark != oldSettings.dark) {
				let eventName = newSettings.dark ? "theme:dark" : "theme:light";
				window.dispatchEvent(new CustomEvent(eventName));
			}
		});
	}

	// Events
}