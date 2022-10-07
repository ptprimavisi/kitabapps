import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Injector } from '@angular/core';
import { LocaleService } from './locale.service';

// Inject service
const injector = Injector.create([
	{ provide: LocaleService, deps: [] }
]);
const locale = injector.get(LocaleService);

// Check US Date format (mm/dd/yyyy)
function checkUSDate(value) {
	return checkDateEx(value, "us", locale.dateSeparator);
}

// Check US Date format (mm/dd/yy)
function checkShortUSDate(value) {
	return checkDateEx(value, "usshort", locale.dateSeparator);
}

// Check Date format (yyyy/mm/dd)
function checkDate(value) {
	return checkDateEx(value, "std", locale.dateSeparator);
}

// Check Date format (yy/mm/dd)
function checkShortDate(value) {
	return checkDateEx(value, "stdshort", locale.dateSeparator);
}

// Check Euro Date format (dd/mm/yyyy)
function checkEuroDate(value) {
	return checkDateEx(value, "euro", locale.dateSeparator);
}

// Check Euro Date format (dd/mm/yy)
function checkShortEuroDate(value) {
	return checkDateEx(value, "euroshort", locale.dateSeparator);
}

// Check date format
// format: std/stdshort/us/usshort/euro/euroshort
function checkDateEx(value, format, sep) {
	if (!value || value.length == "")
		return true;
	value = value.replace(/ +/g, " ").trim();
	let arDT = value.split(" ");
	if (arDT.length > 0) {
		let re, ar, sYear, sMonth, sDay;
		re = /^(\d{4})-([0][1-9]|[1][0-2])-([0][1-9]|[1|2]\d|[3][0|1])$/;
		if (ar = re.exec(arDT[0])) {
			sYear = ar[1];
			sMonth = ar[2];
			sDay = ar[3];
		} else {
			let wrksep = escapeRegExChars(sep);
			switch (format) {
				case "std":
					re = new RegExp("^(\\d{4})" + wrksep + "([0]?[1-9]|[1][0-2])" + wrksep + "([0]?[1-9]|[1|2]\\d|[3][0|1])$");
					break;
				case "stdshort":
					re = new RegExp("^(\\d{2})" + wrksep + "([0]?[1-9]|[1][0-2])" + wrksep + "([0]?[1-9]|[1|2]\\d|[3][0|1])$");
					break;
				case "us":
					re = new RegExp("^([0]?[1-9]|[1][0-2])" + wrksep + "([0]?[1-9]|[1|2]\\d|[3][0|1])" + wrksep + "(\\d{4})$");
					break;
				case "usshort":
					re = new RegExp("^([0]?[1-9]|[1][0-2])" + wrksep + "([0]?[1-9]|[1|2]\\d|[3][0|1])" + wrksep + "(\\d{2})$");
					break;
				case "euro":
					re = new RegExp("^([0]?[1-9]|[1|2]\\d|[3][0|1])" + wrksep + "([0]?[1-9]|[1][0-2])" + wrksep + "(\\d{4})$");
					break;
				case "euroshort":
					re = new RegExp("^([0]?[1-9]|[1|2]\\d|[3][0|1])" + wrksep + "([0]?[1-9]|[1][0-2])" + wrksep + "(\\d{2})$");
					break;
			}
			if (!re.test(arDT[0]))
				return false;
			let arD = arDT[0].split(sep);
			switch (format) {
				case "std":
				case "stdshort":
					sYear = unformatYear(arD[0]);
					sMonth = arD[1];
					sDay = arD[2];
					break;
				case "us":
				case "usshort":
					sYear = unformatYear(arD[2]);
					sMonth = arD[0];
					sDay = arD[1];
					break;
				case "euro":
				case "euroshort":
					sYear = unformatYear(arD[2]);
					sMonth = arD[1];
					sDay = arD[0];
					break;
			}
		}
		if (!checkDay(sYear, sMonth, sDay))
			return false;
	}
	if (arDT.length > 1 && !checkTime(arDT[1]))
		return false;
	return true;
}

// Year for unformatting year
const UNFORMAT_YEAR = 50;

// Unformat 2 digit year to 4 digit year
function unformatYear(yr) {
	if (yr.length == 2)
		return (yr > UNFORMAT_YEAR) ? "19" + yr : "20" + yr;
	return yr;
}

// Check day
function checkDay(checkYear, checkMonth, checkDay) {
	checkYear = parseInt(checkYear, 10);
	checkMonth = parseInt(checkMonth, 10);
	checkDay = parseInt(checkDay, 10);
	let maxDay = [4, 6, 9, 11].includes(checkMonth) ? 30 : 31;
	if (checkMonth == 2)
		maxDay = (checkYear % 4 > 0 || checkYear % 100 == 0 && checkYear % 400 > 0) ? 28 : 29;
	return checkDay >= 1 && checkDay <= maxDay;
}

// Check time
function checkTime(value) {
	if (!value || value.length == 0)
		return true;
	value = value.trim();
	let re = new RegExp('^(0\\d|1\\d|2[0-3])' + escapeRegExChars(locale.timeSeparator) + '[0-5]\\d(( (AM|PM))|(' + escapeRegExChars(locale.timeSeparator) + '[0-5]\\d(\\.\\d+)?)?)$', 'i');
	return re.test(value);
}

// Check number
function checkNumber(value) {
	value = String(value);
	if (!value || value.length == 0)
		return true;
	value = value.trim();
	var ts = escapeRegExChars(locale.groupSeparator), dp = escapeRegExChars(locale.decimalSeparator),
		re = new RegExp("^[+-]?(\\d{1,3}(" + (ts ? ts + "?" : "") + "\\d{3})*(" + dp + "\\d+)?|" + dp + "\\d+)$");
	return re.test(value);
}

// Check integer
function checkInteger(value) {
	if (value.includes(locale.decimalSeparator))
		return false;
	return checkNumber(value);
}

// Escape regular expression chars
function escapeRegExChars(str) {
	return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}

/**
 * Valdiators
 */

// Date/Time
export const date = (value: number): ValidatorFn => {
	return (control: AbstractControl): ValidationErrors => {
		if (value === undefined || value === null)
			return null;

		let obj = Validators.required(control);
		if (obj !== undefined && obj !== null)
			return null;

		const v: string = control.value.trim();

		if (!v || v.length == 0)
			return null;

		let result = false;
		if ([12, 15, 115].includes(value)) {
			result = !checkShortDate(v);
		} else if ([5, 9, 109].includes(value)) {
			result = !checkDate(v);
		} else if ([14, 17, 117].includes(value)) {
			result = !checkShortEuroDate(v);
		} else if ([7, 11, 111].includes(value)) {
			result = !checkEuroDate(v);
		} else if ([13, 16, 116].includes(value)) {
			result = !checkShortUSDate(v);
		} else if ([6, 10, 110].includes(value)) {
			result = !checkUSDate(v);
		}

		return result ? { date: true } : null;
	};
};

// Time
export const time = (value: number): ValidatorFn => {
	return (control: AbstractControl): ValidationErrors => {
		if (value === undefined || value === null || ![3, 4].includes(value))
			return null;
		let obj = Validators.required(control);
		if (obj !== undefined && obj !== null)
			return null;

		const v: string = control.value.trim();

		if (!v || v.length == 0)
			return null;

		let result = !checkTime(v);
		return result ? { time: true } : null;
	};
};

// Credit card
export const creditCard: ValidatorFn = (control: AbstractControl): ValidationErrors => {
	let obj = Validators.required(control);
	if (obj !== undefined && obj !== null)
		return null;

	const v: string = control.value;

	const sanitized = v.replace(/[^0-9]+/g, '');

	// problem with chrome
	/* tslint:disable */
	if (!(/^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11}|(?:9792)\d{12})$/.test(sanitized))) {
		return { creditCard: true };
	}
	/* tslint:enable */

	let sum = 0;
	let digit;
	let tmpNum;
	let shouldDouble;
	for (let i = sanitized.length - 1; i >= 0; i--) {
		digit = sanitized.substring(i, (i + 1));
		tmpNum = parseInt(digit, 10);
		if (shouldDouble) {
			tmpNum *= 2;
			if (tmpNum >= 10) {
				sum += ((tmpNum % 10) + 1);
			} else {
				sum += tmpNum;
			}
		} else {
			sum += tmpNum;
		}
		shouldDouble = !shouldDouble;
	}

	if (Boolean((sum % 10) === 0 ? sanitized : false)) {
		return null;
	}

	return { creditCard: true };
};

// Must match
export function mustMatch(controlName: string, matchingControlName: string) {
	return (formGroup: FormGroup): ValidationErrors => {
		const control = formGroup.get(controlName);
		const matchingControl = formGroup.get(matchingControlName);

		if (matchingControl.errors && !matchingControl.errors.mustMatch)
			return; // Return if another validator has already found an error on the matchingControl

		// Set error on matchingControl if validation fails
		if (control.value !== matchingControl.value)
			matchingControl.setErrors({ mustMatch: true });
		else
			matchingControl.setErrors(null);
	};
}

// Float
export const float: ValidatorFn = (control: AbstractControl): ValidationErrors => {
	let obj = Validators.required(control);
	if (obj !== undefined && obj !== null)
		return null;

	const v: string = control.value;
	let result = !checkNumber(v);

	return result ? { float: true } : null;
};

// Integer
export const integer: ValidatorFn = (control: AbstractControl): ValidationErrors => {
	let obj = Validators.required(control);
	if (obj !== undefined && obj !== null)
		return null;

	const v: string = control.value;
	let result = !checkInteger(v);

	return result ? { integer: true } : null;
};

// US phone
export const usphone: ValidatorFn = (control: AbstractControl): ValidationErrors => {
	let obj = Validators.required(control);
	if (obj !== undefined && obj !== null)
		return null;

	const v: string = control.value;
	let result = !v.match(/^\(\d{3}\) ?\d{3}( |-)?\d{4}|^\d{3}( |-)?\d{3}( |-)?\d{4}$/);

	return result ? { usphone: true } : null;
};

// US zip
export const uszip: ValidatorFn = (control: AbstractControl): ValidationErrors => {
	let obj = Validators.required(control);
	if (obj !== undefined && obj !== null)
		return null;

	const v: string = control.value;
	let result = !v.match(/^\d{5}$|^\d{5}-\d{4}$/);

	return result ? { uszip: true } : null;
};

// US SSN
export const usssn: ValidatorFn = (control: AbstractControl): ValidationErrors => {
	let obj = Validators.required(control);
	if (obj !== undefined && obj !== null)
		return null;

	const v: string = control.value;
	let result = !v.match(/^(?!219-09-9999|078-05-1120)(?!666|000|9\d{2})\d{3}-(?!00)\d{2}-(?!0{4})\d{4}$/);

	return result ? { usssn: true } : null;
};

// GUID
export const guid: ValidatorFn = (control: AbstractControl): ValidationErrors => {
	let obj = Validators.required(control);
	if (obj !== undefined && obj !== null)
		return null;

	const v: string = control.value;
	let result = !v.match(/^(\{\w{8}-\w{4}-\w{4}-\w{4}-\w{12}\}|\w{8}-\w{4}-\w{4}-\w{4}-\w{12})$/);

	return result ? { guid: true } : null;
};

// Files
export function files(args: any) {
	return (formGroup: FormGroup): ValidationErrors => {
		const control = formGroup.get(args.controlName);

		let errors = control.errors || {};

		const fnControl = formGroup.get(args.fileNamesControlName);
		const v: any[] = fnControl.value;

		if (args.required) {
			if (!v || Array.isArray(v) && v.length == 0)
				errors["required"] = true;
			else
				delete(errors["required"]);
		}

		if (args.size && Array.isArray(v)) {
			let ar = v.map(file => (file.size > args.size) ? { maxSize: args.size, actual: file.size, file } : null).filter(error => error);
			if (ar.length)
				errors["fileSize"] = ar;
			else
				delete(errors["fileSize"]);
		}

		if (args.count > 0 && Array.isArray(v) && v.length > args.count)
			errors["filesLimit"] = { max: args.count, actual: v.length };
		else
			delete(errors["filesLimit"]);

		let result = Object.keys(errors).length ? errors : null;
		control.setErrors(result);
		return result;
	};
}