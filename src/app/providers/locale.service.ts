import { Injectable } from '@angular/core';
import { registerLocaleData, NumberSymbol, getLocaleNumberSymbol, FormatWidth, getLocaleDateTimeFormat, getLocaleDateFormat, getLocaleTimeFormat, getLocaleCurrencySymbol } from '@angular/common';
import { format } from 'url';
import localeEnglish from '@angular/common/locales/en';

/**
 * ion-datetime formats
 * https://ionicframework.com/docs/api/datetime#display-and-picker-formats
 */
let ionDateFormatMap = new Map([
	[0, 'shortDate'], // shortDate
	[1, 'short'], // short
	[2, 'shortDate'], // shortDate
	[3, 'shortTime'], // shortTime
	[4, 'mediumTime'], // mediumTime
	[5, 'YYYY/MM/DD'],
	[6, 'MM/DD/YYYY'],
	[7, 'DD/MM/YYYY'],
	[8, 'shortDate'], // shortDate
	[9, 'YYYY/MM/DD HH:mm:ss'],
	[10, 'MM/DD/YYYY HH:mm:ss'],
	[11, 'DD/MM/YYYY HH:mm:ss'],
	[12, 'YY/MM/DD'],
	[13, 'MM/DD/YY'],
	[14, 'DD/MM/YY'],
	[15, 'YY/MM/DD HH:mm:ss'],
	[16, 'MM/DD/YY HH:mm:ss'],
	[17, 'DD/MM/YY HH:mm:ss'],
	[109, 'YYYY/MM/DD HH:mm'],
	[110, 'MM/DD/YYYY HH:mm'],
	[111, 'DD/MM/YYYY HH:mm'],
	[115, 'YY/MM/DD HH:mm'],
	[116, 'MM/DD/YY HH:mm'],
	[117, 'DD/MM/YY HH:mm']
]);

// Locale service class
@Injectable({
	providedIn: 'root'
})
export class LocaleService {
	private _locale: string;

	// Set locale
	set locale(value: string) {
		this._locale = value;
	}

	// Get locale
	get locale(): string {
		return this._locale || 'en';
	}

	// Date separator
	get dateSeparator(): string {
		return getLocaleDateFormat(this.locale, FormatWidth.Short).match(/\W/)[0];
	}

	// Time separator
	get timeSeparator(): string {
		return getLocaleTimeFormat(this.locale, FormatWidth.Short).match(/\W/)[0];;
	}

	// Group separator
	get groupSeparator(): string {
		return getLocaleNumberSymbol(this.locale, NumberSymbol.Group);
	}

	// decimal separator
	get decimalSeparator(): string {
		return getLocaleNumberSymbol(this.locale, NumberSymbol.Decimal);
	}

	// Currency symbol
	get currencySymbol(): string {
		return getLocaleCurrencySymbol(this.locale);
	}

	// Use locale
	use(culture: string) {
		if (!culture)
			return;
		this.locale = culture;

		// Register locale data (or only en-US locale data available)
		switch (culture) {
			case 'en': {
				registerLocaleData(localeEnglish);
				break;
			}
		}
	}

	/**
	 * Convert Angular formats to ion-datetime display format
	 * https://angular.io/api/common/DatePipe
	 * https://ionicframework.com/docs/api/datetime#display-and-picker-formats
	 * Examples are given in en-US locale.
	 * 'short': equivalent to 'M/d/yy, h:mm a' (6/15/15, 9:03 AM) => getLocaleDateTimeFormat(this.locale, FormatWidth.Short)
	 *     where {1} = getLocaleDateFormat(this.locale, FormatWidth.Short) and {0} = getLocaleTimeFormat(this.locale, FormatWidth.Short)
	 * 'shortDate': equivalent to 'M/d/yy' (6/15/15) => getLocaleDateFormat(this.locale, FormatWidth.Short)
	 * 'shortTime': equivalent to 'h:mm a' (9:03 AM) => getLocaleTimeFormat(this.locale, FormatWidth.Short)
	 * 'mediumTime': equivalent to 'h:mm:ss a' (9:03:01 AM) => getLocaleTimeFormat(this.locale, FormatWidth.Medium)
	 */
	getIonDateTimeDisplay(format: number): string {
		switch (format) {
			case 0: // shortDate
			case 2:
			case 8:
				return getLocaleDateFormat(this.locale, FormatWidth.Short).replace(/y/g, "Y").replace(/d/g, "D");
			case 1: // short
				return getLocaleDateTimeFormat(this.locale, FormatWidth.Short)
					.replace("{1}", getLocaleDateFormat(this.locale, FormatWidth.Short))
					.replace("{0}", getLocaleTimeFormat(this.locale, FormatWidth.Short))
					.replace(/y/g, "Y").replace(/d/g, "D");
			case 3: // shortTime
				return getLocaleTimeFormat(this.locale, FormatWidth.Short).replace(/y/g, "Y").replace(/d/g, "D");
			case 4: // mediumTime
				return getLocaleTimeFormat(this.locale, FormatWidth.Medium).replace(/y/g, "Y").replace(/d/g, "D");
			default:
				return ionDateFormatMap.get(format);
		}
	}
}