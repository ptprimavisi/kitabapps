import { Pipe, PipeTransform } from '@angular/core';
import { formatCurrency } from '@angular/common';
import { LocaleService } from './locale.service';

@Pipe({
	name: 'localCurrency',
})
export class LocalCurrencyPipe implements PipeTransform {

	constructor(private locale: LocaleService) {}

	/**
	 * Tranform
	 * @param value
	 * @param format
	 */
	transform(value: any, format: string) {
		if (value == null) // !value returns true for zeros
			return '';

		if (!format)
			format = '.2-2';

		return formatCurrency(value, this.locale.locale, this.locale.currencySymbol, undefined, format);
	}
}