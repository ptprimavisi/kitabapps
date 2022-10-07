import { OnDestroy, OnInit } from '@angular/core';
import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { SwUpdate } from '@angular/service-worker';
import { MenuController, Platform, ToastController, AlertController, LoadingController, IonRouterOutlet } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { TranslateService } from '@ngx-translate/core';
import { Storage } from '@ionic/storage';
import { UserData, Settings, LocaleService, DbApp, History } from './providers';

// Component
@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnDestroy, OnInit {
	@ViewChild(IonRouterOutlet, { static: true }) routerOutlet: IonRouterOutlet;
	appPages: any[];
	loggedIn: boolean = false;
	dark: boolean = false;
	lastTimeBackPress: number = 0;
	timePeriodToExit: number = 2000;

	// Constructor
	constructor(public dbapp: DbApp,
		public translate: TranslateService,
		public menu: MenuController,
		public alertController: AlertController,
		public loadingController: LoadingController,
		public platform: Platform,
		public settings: Settings,
		public locale: LocaleService,
		public router: Router,
		public splashScreen: SplashScreen,
		public statusBar: StatusBar,
		public storage: Storage,
		public user: UserData,
		public swUpdate: SwUpdate,
		public toastController: ToastController,
		public history: History,
		) {
		this.initializeApp();
		this.initLanguage();
		this.listenForEvents();
		let prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
		prefersDark.addListener((e) => this.setDark(e.matches)); // Listen for changes to the prefers-color-scheme media query
		this.settings.load().then(settings => { // Load settings
			let isDark = this.dbapp.isBoolean(settings.dark) ? settings.dark : prefersDark.matches;
			this.setDark(isDark);
			let langId = settings.language || this.dbapp.defaultLanguage; // Language ID
			this.translate.use(langId); // Set language
			this.locale.use(langId); // Set localee
		});
		this.user.load().then(async data => {
			if (data && data.failureMessage)
				await this.showError(data.failureMessage);
		});
		this.appPages = this.dbapp.menuItems;
		let titles = this.appPages.map(p => p.title);
		this.translate.get(titles).subscribe(values =>
			this.appPages.forEach(p => p.title = values[p.title])
		);
		this.backButtonEvent(); // Init back button
	}

	// Set dark mode
	setDark(enabled: boolean) {
		this.settings.set('dark', enabled);
		document.body.classList.toggle('dark', enabled);
	}

	// Init
	async init() {
		this.checkLoginStatus();
		this.swUpdate.available.subscribe(async res => {
			const toast = await this.toastController.create({
				message: await this.translate.get('UPDATE_AVAILABLE').toPromise(),
				duration: 2000
			});
			await toast.present();
			toast.onDidDismiss().then(() => this.swUpdate.activateUpdate())
				.then(() => window.location.reload());
		});
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

	// Pass routerOutlet to history
	ngAfterViewInit(): void {
		this.history.routerOutlet = this.routerOutlet;
	}

	// Init app
	initializeApp() {
		this.platform.ready().then(() => {
			this.statusBar.styleDefault();
			this.splashScreen.hide();
		});
	}

	// Check login status
	checkLoginStatus() {
		this.user.isLoggedIn.subscribe(loggedIn => {
			this.updateLoggedInStatus(loggedIn);
		});
	}

	// Update logged in status
	updateLoggedInStatus(loggedIn: boolean) {
		this.loggedIn = loggedIn;

		// Update menu items
		for (let p of this.appPages) { // Do not use forEach()
			if (this.dbapp.isString(p.security))
				p.allowed = eval(p.security); // Do not use Function() due to "this" in code
		}
	}

	// Listen for events
	listenForEvents() {
		window.addEventListener('user:login', () => {
			this.updateLoggedInStatus(true);
		});
		window.addEventListener('user:signup', () => {
			this.updateLoggedInStatus(true);
		});
		window.addEventListener('user:logout', () => {
			this.updateLoggedInStatus(false);
		});
		window.addEventListener('theme:dark', () => {
			document.body.classList.toggle('dark', true);
		});
		window.addEventListener('theme:light', () => {
			document.body.classList.toggle('dark', false);
		});
	}

	// Logout
	logout() {
		this.user.logout();
		this.router.navigateByUrl(''); // Go to start page
	}

	// Init translation and locale service
	initLanguage() {
		let languages = Object.keys(this.dbapp.languages);

		// Load all languages phrases
		this.translate.addLangs(languages);

		// Set the default language for translation strings, and the current language.
		this.translate.setDefaultLang(this.dbapp.defaultLanguage);
	}

	// Present toast
	async presentToast(msg: string) {
		const toast = await this.toastController.create({
			message: msg,
			duration: 2000
		});
		toast.present();
	}

	// Back button
	backButtonEvent() {
		this.platform.backButton.subscribe(async () => {
			if (this.history.canGoBack) {
				this.history.goBack();
			} else {
				if (new Date().getTime() - this.lastTimeBackPress < this.timePeriodToExit) {
					navigator['app'].exitApp(); // Exit from app
				} else {
					let msg = await this.translate.get('EXIT').toPromise();
					await this.presentToast(msg);
					this.lastTimeBackPress = new Date().getTime();
				}
			}
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
}