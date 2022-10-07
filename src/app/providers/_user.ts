import { HttpClient } from '@angular/common/http';
import { formatNumber } from '@angular/common';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { DbApp } from './dbapp';
import { UserData } from './user-data';
import { DbTable } from './dbtable';
import { DbRecord } from './dbrecord';
import { DbField } from './dbfield';
import { LocaleService } from './locale.service';
import { LocalDatePipe } from './localdate.pipe';
import { LocalNumberPipe } from './localnumber.pipe';
import { LocalCurrencyPipe } from './localcurrency.pipe';
import { LocalPercentPipe } from './localpercent.pipe';
import { AuthFilePipe } from './authfile.pipe';

// user
@Injectable({
	providedIn: 'root'
})
export class _user extends DbTable {
	pageId: string;
	fieldVars = ["id","nama","username","password","keterangan","level","pid"];
	fieldNames = []; // Array([name, var]) for fields with name != var
	listFields: string[] = ["id","nama","username","password","keterangan","level","pid"];
	viewFields: string[] = ["id","nama","username","password","keterangan","level","pid"];
	addFields: string[] = ["nama","username","password","keterangan","level","pid"];
	editFields: string[] = ["id","nama","username","password","keterangan","level","pid"];
	registerFields: string[] = ["nama","username","password"];
	lookupTables: any = {};
	displayValueSeparators: any = {};
	errorMessages: any;
	row: any; // Current row (rendered)
	labelAttribute: string = "name";

	// Constructor
	constructor(public dbapp: DbApp,
		public user: UserData,
		public translate: TranslateService,
		public locale: LocaleService,
		public router: Router,
			public http: HttpClient) {
		super(dbapp, http, user, translate, router);
		this.name = "_user";
		this.translate.get(this.fieldVars.map(fldvar => "__tables." + this.name + ".fields." + fldvar + ".errMsg")).subscribe(values => {
			for (let k in values)
				values[k] = (k != values[k]) ? values[k] : "";
			this.errorMessages = values;
		});
		this.infiniteScroll = true;
		this.pageSize = 30;
	}

	// Lookup
	async lookup(item: any, pageId: string) {
		if (!item)
			return;
		pageId = pageId == "signup" ? "register" : pageId;
		let page = pageId != "register" ? this.name + "_" + pageId : pageId;
		this.pageId = pageId;
		let p = [];

		// level
		if (this.renderField("level", pageId)) {
			let params;
			if (Array.isArray(item)) { // List
				let keys1 = item.map(row => row["level"]).filter((v, i, a) =>  !this.dbapp.isEmpty(v) && a.indexOf(v) == i);
				params = { action: "lookup", ajax: "modal", page: page, field: "level", keys: keys1 };
			} else { // Add/Edit/View
				params = { action: "lookup", ajax: "updateoption", page: page, field: "level" };
				if (pageId == "view")
					params["v0"] = item["level"];
			}
			p.push(this.query(params).then(items => {
				items.forEach(item => item["name"] = this.dbapp.displayValue(item, this.displayValueSeparators.level));
				return items;
			}));
		}

		// pid
		if (this.renderField("pid", pageId)) {
			let params;
			if (Array.isArray(item)) { // List
				let keys2 = item.map(row => row["pid"]).filter((v, i, a) =>  !this.dbapp.isEmpty(v) && a.indexOf(v) == i);
				params = { action: "lookup", ajax: "modal", page: page, field: "pid", keys: keys2 };
			} else { // Add/Edit/View
				params = { action: "lookup", ajax: "updateoption", page: page, field: "pid" };
				if (pageId == "view")
					params["v0"] = item["pid"];
			}
			p.push(this.query(params).then(items => {
				items.forEach(item => item["name"] = this.dbapp.displayValue(item, this.displayValueSeparators.pid));
				return items;
			}));
		}

		// Get lookup results
		try {
			[this.lookupTables.level, this.lookupTables.pid] = await Promise.all(p);
		} catch(err) {
			console.log(err);
		}
	}

	// Render field
	renderField(fieldName: string, pageId: string) {
		if (["list", "view", "add", "edit", "register"].includes(pageId))
			return this[pageId + "Fields"].includes(fieldName);
		return false;
	}

	// Get field variable name
	getFieldVar(name) {
		let f = this.fieldNames.find(f => f[0] == name);
		return f ? f[1] : name;
	}

	// Get field variable name
	getFieldName(varname) {
		let f = this.fieldNames.find(f => f[1] == varname);
		return f ? f[0] : varname;
	}

	// Render row
	async renderRow(item: any, pageId: string) {
		this.pageId = pageId;
		let row = new DbRecord(item, this.fieldNames, this.errorMessages);
		this.rowOnRender(row);

		// id
		if (this.renderField("id", pageId)) {
			if (!["list", "view"].includes(pageId))
				row["id"].value = formatNumber(row["id"].value, this.locale.locale);
		}

		// level
		if (this.renderField("level", pageId)) {
			row["level"].value = ""; // Value to be looked up
			let selectedRow = this.lookupTables.level.find(r => r.lf == row["level"].dbValue); // Compare with db value
			row["level"].formValue = row["level"].dbValue; // FormControl value cannot be undefined
			row["level"].value = selectedRow ? this.dbapp.displayValue(selectedRow, this.displayValueSeparators.level) : row["level"].dbValue;
		}

		// pid
		if (this.renderField("pid", pageId)) {
			row["pid"].value = ""; // Value to be looked up
			let selectedRow = this.lookupTables.pid.find(r => r.lf == row["pid"].dbValue); // Compare with db value
			row["pid"].formValue = row["pid"].dbValue; // FormControl value cannot be undefined
			row["pid"].value = selectedRow ? this.dbapp.displayValue(selectedRow, this.displayValueSeparators.pid) : row["pid"].dbValue;
		}
		row.rendered = true;
		this.rowAfterRendered(row);
		this.row = row; // Set current row
		return row;
	}

	// Render file URL
	async renderFileUrl(url: string) {
		return this.http.get(url, { responseType: "blob" }).toPromise().then(blob => {
			const reader = new FileReader();
			return new Promise((resolve, reject) => {
				reader.onloadend = () => resolve(reader.result as string);
				reader.readAsDataURL(blob);
			});
		});
	}
}