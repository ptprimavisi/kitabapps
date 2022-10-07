import { Pipe, PipeTransform } from '@angular/core';
import { formatNumber } from '@angular/common';
import { LocaleService } from './locale.service';

@Pipe({
	name: 'localNumber',
})
export class LocalNumberPipe implements PipeTransform {

	constructor(private locale: LocaleService) {}

	transform(value: any, format: string) {
		if (value == null) // !value returns true for zeros
			return '';

		if (!format)
			format = '.2-2';

		return formatNumber(value, this.locale.locale, format);
	}
}