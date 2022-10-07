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

// userlevelpermissions
@Injectable({
	providedIn: 'root'
})
export class userlevelpermissions extends DbTable {
	pageId: string;
	fieldVars = ["userlevelid","tablename","permission"];
	fieldNames = []; // Array([name, var]) for fields with name != var
	listFields: string[] = ["userlevelid","tablename","permission"];
	viewFields: string[] = ["userlevelid","tablename","permission"];
	addFields: string[] = ["userlevelid","tablename","permission"];
	editFields: string[] = ["userlevelid","tablename","permission"];
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
		this.name = "userlevelpermissions";
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

		// Get lookup results
		try {
			[] = await Promise.all(p);
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

		// userlevelid
		if (this.renderField("userlevelid", pageId)) {
			if (!["list", "view"].includes(pageId))
				row["userlevelid"].value = formatNumber(row["userlevelid"].value, this.locale.locale);
		}

		// permission
		if (this.renderField("permission", pageId)) {
			if (!["list", "view"].includes(pageId))
				row["permission"].value = formatNumber(row["permission"].value, this.locale.locale);
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