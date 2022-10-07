import { Pipe, PipeTransform } from '@angular/core';
import { formatPercent } from '@angular/common';
import { LocaleService } from './locale.service';

@Pipe({
	name: 'localPercent',
})
export class LocalPercentPipe implements PipeTransform {

	constructor(private locale: LocaleService) {}

	transform(value: any, format: string) {
		if (value === null) // !value returns true for zeros
			return '';

		if (!format)
			format = '.2-2';

		return formatPercent(value, this.locale.locale, format);
	}
}