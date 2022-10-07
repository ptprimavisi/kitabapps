import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { IonRouterOutlet } from '@ionic/angular';
import { filter } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class History {
	public history = [];
	public backButtonText: string = "";
	public routerOutlet: IonRouterOutlet; // Reserved

	// Constructor
	constructor(private router: Router,
		private translate: TranslateService) {
		this.router.events
			.pipe(filter(event => event instanceof NavigationEnd))
			.subscribe(({urlAfterRedirects}: NavigationEnd) => {
				this.history = [...this.history, urlAfterRedirects];
			});
		this.translate.get("BACK_BUTTON").subscribe(value => this.backButtonText = (value != "BACK_BUTTON") ? value : "");
	}

	// Get history
	public getHistory(): string[] {
		return this.history;
	}

	// Get current URL
	public getCurrentUrl(): string {
		return this.history[this.history.length - 1];
	}

	// Get previous URL
	public getPreviousUrl(): string {
		return this.history[this.history.length - 2];
	}

	// Is current page
	public isCurrentPage(pageUrl: string): boolean {
		let currentUrl = this.getCurrentUrl();
		return currentUrl && currentUrl.split(/[/;]/)[1] == pageUrl;
	}

	// Can go back
	get canGoBack() {
		return this.history.length > 1;
	}

	/**
	 * Go back
	 * Remove current and previous URL from history
	 */
	public goBack() {
		if (this.canGoBack) {
			this.history.pop(); // Remove current URL
			let url = this.history.pop(); // Returns previous URL
			if (url)
				this.router.navigateByUrl(url);
		}
	}
}