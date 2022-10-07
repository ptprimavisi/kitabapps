import { Pipe, PipeTransform } from '@angular/core';
import { formatDate } from '@angular/common';
import { LocaleService } from './locale.service';

@Pipe({
	name: 'localDate'
})
export class LocalDatePipe implements PipeTransform {

	constructor(private locale: LocaleService) { }

	transform(value: any, format: string) {

		if (!value)
			return '';

		if (!format)
			format = 'shortDate';

		format = format.replace(/\//g, this.locale.dateSeparator).replace(/:/g, this.locale.timeSeparator);

		return formatDate(value, format, this.locale.locale);
	}
}