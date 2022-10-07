import { Injector } from '@angular/core';
import { DbField } from './dbfield';

/**
 * DbRecord class
 *
 * @export
 * @class DbRecord
 */
export class DbRecord {
	title: any;
	rendered: boolean;
	private _fieldVars: Map<string, any>; // Array([name, var]) for fields with name != var
	private __item: any;

	// Constructor
	constructor(item: any, names: any[], errors: any) {
		this._fieldVars = new Map<string, string>(names);
		if (item && typeof item === 'object') {
			this.__item = item;
			for (let name in item) {
				let varname = this._fieldVars.get(name) || name;
				this[varname] = new DbField(item[name], errors[varname]);
			}
		}
	}

	// Get original item
	getItem() {
		return this.__item;
	}
}