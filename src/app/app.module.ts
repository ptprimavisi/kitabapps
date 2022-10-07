import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Camera } from '@ionic-native/camera/ngx';
import { File } from '@ionic-native/file/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { FileChooser } from '@ionic-native/file-chooser/ngx';
import { IonicModule } from '@ionic/angular';
import { IonicStorageModule, Storage } from '@ionic/storage';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { UserData, Settings, LocaleService, DbApp, History } from './providers';
import { DbAppPipe } from './providers/dbapp.pipe.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { environment } from '../environments/environment';
import { DbAppHttpInterceptor } from './dbapp.http.interceptor';
import { IonicSelectableModule } from 'ionic-selectable';
import { EmbeddedMediaModule } from '@hkvstore/ngx-embedded-media';
import { kitab, kitab_detil, _user, userlevelpermissions, userlevels, v_kitab } from './providers';
import { MobileAccessibility } from '@ionic-native/mobile-accessibility/ngx';

// The translate loader needs to know where to load i18n files
// in Ionic's static asset pipeline.

export function createTranslateLoader(http: HttpClient) {
	return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

// Settings
export function provideSettings(storage: Storage, dbapp: DbApp) {
	return new Settings(storage, dbapp.settings);
}

// Module
@NgModule({
	declarations: [
		AppComponent
	],
	imports: [
		BrowserModule,
		BrowserAnimationsModule,
		AppRoutingModule,
		HttpClientModule,
		FormsModule,
		ReactiveFormsModule,
		IonicSelectableModule,
		TranslateModule.forRoot({
			loader: {
				provide: TranslateLoader,
				useFactory: (createTranslateLoader),
				deps: [HttpClient]
			}
		}),
		DbAppPipe,
		IonicModule.forRoot(),
		IonicStorageModule.forRoot(),
		ServiceWorkerModule.register('ngsw-worker.js', {
			enabled: environment.production
		}),
		EmbeddedMediaModule.forRoot(),
	],
	providers: [
		DbApp,
		UserData,
		History,
		kitab,
		kitab_detil,
		_user,
		userlevelpermissions,
		userlevels,
		v_kitab,
		{ provide: HTTP_INTERCEPTORS, useClass: DbAppHttpInterceptor, multi: true },
		{ provide: LOCALE_ID, deps: [LocaleService], useFactory: (localeService) => localeService.locale },
		{ provide: Settings, useFactory: provideSettings, deps: [Storage, DbApp] },
		InAppBrowser,
		SplashScreen,
		StatusBar,
		Camera,
		File,
		WebView,
		FilePath,
		FileChooser,
		MobileAccessibility,
	],
	bootstrap: [AppComponent]
})
export class AppModule {}