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

// kitab_detil
@Injectable({
	providedIn: 'root'
})
export class kitab_detil extends DbTable {
	pageId: string;
	fieldVars = ["id","pid","judul","isi","gambar","keterangan","tag","rujukan","aktif"];
	fieldNames = []; // Array([name, var]) for fields with name != var
	listFields: string[] = ["id","pid","judul","gambar","keterangan","tag","rujukan","aktif"];
	viewFields: string[] = ["id","pid","judul","isi","gambar","keterangan","tag","rujukan","aktif"];
	addFields: string[] = ["pid","judul","isi","gambar","keterangan","tag","rujukan","aktif"];
	editFields: string[] = ["id","pid","judul","isi","gambar","keterangan","tag","rujukan","aktif"];
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
		this.name = "kitab_detil";
		this.translate.get(this.fieldVars.map(fldvar => "__tables." + this.name + ".fields." + fldvar + ".errMsg")).subscribe(values => {
			for (let k in values)
				values[k] = (k != values[k]) ? values[k] : "";
			this.errorMessages = values;
		});
		this.translate.get(["__tables.kitab_detil.fields.aktif.tagValues"]).subscribe(values => {
			this.lookupTables.aktif = dbapp.convertUserValues(values["__tables.kitab_detil.fields.aktif.tagValues"]);
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

		// pid
		if (this.renderField("pid", pageId)) {
			let params;
			if (Array.isArray(item)) { // List
				let keys1 = item.map(row => row["pid"]).filter((v, i, a) =>  !this.dbapp.isEmpty(v) && a.indexOf(v) == i);
				params = { action: "lookup", ajax: "modal", page: page, field: "pid", keys: keys1 };
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
			[this.lookupTables.pid] = await Promise.all(p);
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

		// pid
		if (this.renderField("pid", pageId)) {
			row["pid"].value = ""; // Value to be looked up
			let selectedRow = this.lookupTables.pid.find(r => r.lf == row["pid"].dbValue); // Compare with db value
			row["pid"].formValue = row["pid"].dbValue; // FormControl value cannot be undefined
			row["pid"].value = selectedRow ? this.dbapp.displayValue(selectedRow, this.displayValueSeparators.pid) : row["pid"].dbValue;
		}

		// aktif
		if (this.renderField("aktif", pageId)) {
			let selectedRow = this.lookupTables.aktif.find(r => r.lf == row["aktif"].dbValue); // Compare with db value
			row["aktif"].formValue = row["aktif"].dbValue; // FormControl value cannot be undefined
			row["aktif"].value = selectedRow ? this.dbapp.displayValue(selectedRow, this.displayValueSeparators.aktif) : row["aktif"].dbValue;
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