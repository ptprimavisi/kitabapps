import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Mode } from '@ionic/core';
import { CameraOptions } from '@ionic-native/camera/ngx';
import { NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';

// Class DbApp
@Injectable({
	providedIn: 'root'
})
export class DbApp {
	id: string = "kitab"; // App ID
	multiLanguage: any = false; // Multi-Language
	languages: any = {"en":{"file":"en.json","description":"English"}}; // Language list
	defaultLanguage: string = "en"; // Default language

	// Folders
	imageFolder: string = "assets/img/";
	mediaFolder: string = "assets/media/";
	fileFolder: string = "assets/files/";

	// Thumbnail width/height
	thumbnailWidth: number = 80;
	thumbnailHeight: number = 80;
	thumbnailWidthView: number = 0;
	thumbnailHeightView: number = 375;

	// API
	requiredApiVersion: string = "^4.0.0 || ^16.0.15";
	apiAuthHeader = "X-Authorization";
	timeout: number = 30000;
	useSecurity = false;
	multipleOptionSeparator: string = ","; // Seperator for splitting dbvalue
	optionSeparator: string = ", "; // Separator for displaying multiple options
	autoSuggestPageSize: number = 20;

	// Master/Detail
	TABLE_MASTER: string = "master";

	// Tables as Array([tablename, tablevar])
	tables: any[] = [["kitab","kitab"],
		["kitab_detil","kitab_detil"],
		["user","_user"],
		["userlevelpermissions","userlevelpermissions"],
		["userlevels","userlevels"],
		["v_kitab","v_kitab"]];

	// Permission
	permission: any = {
		ADD: 1,
		DELETE: 2,
		EDIT: 4,
		LIST: 8,
		VIEW: 32,
		SEARCH: 64,
		LOOKUP: 256,
	};

	// Default permissions
	permissions: any = {};

	// User ID permissions
	userIdPermissions: any = {};
	USER_ID_ALLOW: number = this.permission.LIST + this.permission.VIEW + this.permission.SEARCH;

	// Menu options
	menuItems: any = [
		{
			"id": 6,
			"name": "mi_v_kitab",
			"title": "__menu._6",
			"url": "v_kitablist",
			"selected": true,
			"parentId": -1,
			"tableName": "v_kitab",
			"security": true,
			"allowed": true,
			"group": false,
			"custom": false,
			"icon": ""
		},
		{
			"id": 1,
			"name": "mi_kitab",
			"title": "__menu._1",
			"url": "kitablist",
			"selected": false,
			"parentId": -1,
			"tableName": "kitab",
			"security": true,
			"allowed": true,
			"group": false,
			"custom": false,
			"icon": ""
		},
		{
			"id": 2,
			"name": "mi_kitab_detil",
			"title": "__menu._2",
			"url": "kitab_detillist",
			"selected": false,
			"parentId": -1,
			"tableName": "kitab_detil",
			"security": true,
			"allowed": true,
			"group": false,
			"custom": false,
			"icon": ""
		},
		{
			"id": 3,
			"name": "mi__user",
			"title": "__menu._3",
			"url": "_userlist",
			"selected": false,
			"parentId": -1,
			"tableName": "user",
			"security": true,
			"allowed": true,
			"group": false,
			"custom": false,
			"icon": ""
		},
		{
			"id": 5,
			"name": "mi_userlevels",
			"title": "__menu._5",
			"url": "userlevelslist",
			"selected": false,
			"parentId": -1,
			"tableName": "userlevels",
			"security": true,
			"allowed": true,
			"group": false,
			"custom": false,
			"icon": ""
		}
	];

	// Icons
	icon: any = {
		menu: "menu-outline",
		map: "map-outline",
		sort: "reorder-two-outline",
		up: "arrow-up-outline",
		down: "arrow-down-outline",
		cloud: "cloud-upload-outline",
		checked: "checkmark",
		unchecked: "close",
		logout: "log-out",
		login: "log-in",
		signup: "person-add",
		settings: "settings",
		delete: "trash-outline",
		copy: "copy-outline",
		edit: "create-outline",
		text: "text",
		details: "ellipsis-vertical",
		pull: "arrow-dropdown",
		document: "document-outline",
		camera: "camera-outline",
		image: "image-outline",
		save: "dots",
		back: "chevron-back-outline"
	};

	// Spinners
	spinner: any = {
		refreshing: "circles",
		loading: "bubbles"
	};

	// Colors
	color: any = {
		"primary": "primary",
		"secondary": "secondary",
		"tertiary": "tertiary",
		"success": "success",
		"warning": "warning",
		"danger": "danger",
		"light": "light",
		"medium": "medium",
		"dark": "dark",
		"true": "success",
		"false": "danger"
	};

	// Loading mode
	loadingMode: Mode = "ios";

	// Camera options (https://cordova.apache.org/docs/en/latest/reference/cordova-plugin-camera/index.html#module_Camera.EncodingType)
	cameraOptions: CameraOptions = {
		quality: 100,
		saveToPhotoAlbum: false,
		correctOrientation: true,
		encodingType: 0 // 0 = JPEG, 1 = PNG
	};

	// Camera image file extension
	get cameraImageExtension() {
		switch (this.cameraOptions.encodingType) {
			case 0:
				return ".jpg";
			case 1:
				return ".png";
		}
	}
	geocoderOptions: NativeGeocoderOptions = {
		useLocale: true,
		maxResults: 5
	};

	// App settings (default)
	settings: any = {
		language: "en", // Default language
		fontsize: 100
	};

	// Start page
	startPage: string = "v_kitablist";

	// Constructor
	constructor() {
		let p = 0;
		if (!this.useSecurity) // If no security, grant all permissions
			p = Number(Object.values(this.permission).reduce((acc: number, cur: number) => acc + cur, 0));
		this.tables.forEach(t => this.permissions[t[1]] = p); // Init permissions
	}

	// Helper functions
	isBoolean(val: any): boolean {
		return typeof val === 'boolean';
	}
	isString(val: any): boolean {
		return typeof val === 'string';
	}
	isNumber(val: any): boolean {
		return typeof val === 'number' && isFinite(val);
	}
	isFunction(val: any): boolean {
		return (typeof val === 'function') || Object.prototype.toString.apply(val) === '[object Function]';
	}
	isDefined(val: any): boolean {
		return typeof val !== 'undefined';
	}
	isUndefined(val: any): boolean {
		return typeof val === 'undefined';
	}
	isObject(val: any): boolean {
		return val && (typeof val === 'object' || this.isFunction(val));
	}
	isValue(val: any): boolean {
		return this.isObject(val) || this.isString(val) || this.isNumber(val) || this.isBoolean(val);
	}
	isEmpty(val: any): boolean {
		return !this.isValue(val) || this.isString(val) && val.trim() == "" || Array.isArray(val) && val.length == 0;
	}

	// Get file extension in lowercase
	getExtension(val: string): string {
		val = val.trim();
		if (val) {
			let i = val.lastIndexOf(".");
			if (i !== -1)
				return val.substr(i + 1).toLowerCase();
		}
		return "";
	}

	// Is video
	isVideo(val: string): boolean {
		val = val.trim();
		return /^https?\:\/\/(www\.youtube\.com|youtu\.be)\//i.test(val) || // YouTube URL
			/^https?\:\/\/(player\.)?vimeo\.com\//i.test(val) || // Vimeo URL
			/^https?\:\/\/(www\.)?dailymotion\.com\//i.test(val) || // Dailymotion URL
			/^[\w\-]{11}$/.test(val) || // Youtube video ID
			["mp4", "webm"].includes(this.getExtension(val)); // File
	}

	// Is audio
	isAudio(val: string): boolean {
		return ["mp3", "wav"].includes(this.getExtension(val));
	}

	// Is image
	isImage(val: string): boolean {
		return ["png", "jpg", "jpeg", "gif", "bmp"].includes(this.getExtension(val));
	}

	// Display value
	displayValue(row: any, sep?: string | string[]): string {
		sep = sep || ", ";
		return this.isObject(row) ? ["df", "df2", "df3", "df4"].reduce((val, fld, i) => {
			if (row[fld]) {
				if (i > 0) {
					if (typeof sep === "string")
						val += sep;
					else if (Array.isArray(sep))
						val += sep[i - 1] || "";
				}
				return val + row[fld];
			}
			return val;
		}, "") : "";
	}

	// HTML encode (replace &, ", <, >)
	htmlEncode(t: any): string {
		return (t) ? t.toString().replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/</g,"&lt;").replace(/>/g,"&gt;") : "";
	}

	// Build HTML attributes
	htmlAttributes(attrs: any): string {
		return this.isObject(attrs) ? Object.keys(attrs).reduce((val, name) => {
			val += " " + name;
			let attr = attrs[name];
			if (String(attr) != "")
				val += '="' + this.htmlEncode(attr) + '"';
			return val;
		}, "") : "";
	}

	// Build HTML element
	htmlElement(tagname: string, attrs?: any, innerhtml?: string, endtag?: string): string {
		let html = "<" + tagname + this.htmlAttributes(attrs) + ">";
		if (innerhtml)
			html += innerhtml;
		if (typeof endtag === "undefined" || endtag)
			html += "</" + tagname + ">";
		return html;
	}

	// Escape regular expression chars
	escapeRegExChars(str: string): string {
		return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
	}

	// Convert data to number
	parseNumber(data, thouSep, decSep): number {
		if (this.isString(data) && (data.includes(thouSep) || data.includes(decSep))) {
			var regexBits = [], regex;
			if (thouSep)
				regexBits.push(this.escapeRegExChars(thouSep) + "(?=\\d)");
			regex = new RegExp("(?:" + regexBits.join("|") + ")", "g");
			if (decSep === ".")
				decSep = null;
			data = data.replace(regex, "");
			data = (decSep) ? data.replace(decSep, ".") : data;
		}
		if (this.isString(data) && data.trim() !== "")
			data = +data;
		if (!this.isNumber || !isFinite(data)) // Catch NaN and Infinity
			data = null;
		return data;
	}

	// Parse date
	parseDate(str: string): string {
		if (!str)
			return str;
		let m = str.match(/^(\d{4}[^d]\d{2}[^d]\d{2})T?(\d{2}[^d]\d{2}([^d]\d{2})?)(.+)/);
		return m ? m[1] + " " + m[2] : str;
	}

	// Random string
	get random(): string {
		return (new Date()).getTime().toString();
	}

	// Convert value to boolean
	getBool(value): boolean {
		return value && ["1", "y", "t", "true"].includes(value.toLowerCase());
	}

	// Convert data to FormData
	getFormData(data: any): FormData {
		let formData = new FormData();
		for (let k in data) {
			let v = data[k];
			if (Array.isArray(v) && v.some(f => f.blob)) { // File(s)
				let key = (v.length > 1) ? k + "[]" : k;
				for (let f of v) {
					if (f.blob)
						formData.append(key, f.blob, f.name);
				}
			} else {
				formData.set(k, this.isValue(v) ? v : "");
			}
		}
		return formData;
	}

	// Get User ID permission
	userIdAllow(table, pageId): boolean {
		if (table in this.userIdPermissions)
			return (this.userIdPermissions[table] & pageId) == pageId;
		return (this.USER_ID_ALLOW & pageId) == pageId;
	}

	// Title case
	titleCase(input): string {
		if (!input)
			return "";
		return input.toLocaleLowerCase().replace(/\b\w/g, first => first.toLocaleUpperCase());
	}

	// Parse JSON
	parseJson(json: string, reviver?: any): any {
		try {
			return JSON.parse(json, reviver);
		} catch (error) {
			return null;
		}
	}

	// Convert user values from string to array
	convertUserValues(values): any[] {
		values = this.parseJson(values) || [];
		return values.map(value => {
				let ar = value.map(v => v.replace(/&#44;/g, ",").replace(/&#124;/g, "|").replace(/&#61;/g, "="));
				return { lf: ar[0], name: ar[1] };
			});
	}

	/**
	 * Get options for HttpClient.post()
	 * Note: Must specify the return type as "object", not "any"
	 * Set "observe" of options as "body"
	 * See: https://angular.io/api/common/http/HttpClient
	 * @param {any} params Request paramters
	 * @param {any} reqOpts Request options
	 */
	getHttpOptions(params?: any, reqOpts?: any) {
		reqOpts = reqOpts || {
			params: new HttpParams(),
			observe: "body"
		};
		if (params) {
			reqOpts.params = new HttpParams();
			reqOpts.observe = "body";
			for (let k in params)
				reqOpts.params = reqOpts.params.set(k, params[k]);
		}
		return reqOpts;
	}

	// Create new file name
	createFileName(ext?: string) {
		return (new Date()).getTime() + (ext || this.cameraImageExtension);
	}

	// Is URL
	isUrl(value: any) {
		return String(value).trim().match(/https?:\/\//i);
	}
}