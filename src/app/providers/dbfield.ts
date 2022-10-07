import { Injector } from '@angular/core';
import { Entry, FileEntry } from '@ionic-native/file/ngx';
import { BehaviorSubject } from 'rxjs';
import { DbApp } from './dbapp';

// Inject services
const injector = Injector.create([
	{ provide: DbApp, deps: [] }
]);
const dbapp = injector.get(DbApp);

/**
 * DbField class
 *
 * @export
 * @class DbField
 */
export class DbField {
	private _value: any;
	dbValue: any; // Value from API
	formValue: any; // FormControl value
	hyperlink: string;
	target: string;
	files: any[] = [];
	map: any;
	barcode: any;
	qrcode: any;
	visible: boolean = true;
	errorMessage: string;
	valueChanges: BehaviorSubject<any>;

	// Constructor
	constructor(value: any, err: string) {
		this.dbValue = value;
		this.valueChanges = new BehaviorSubject<any>(this.files);
		this.value = value;
		this.errorMessage = err;
	}

	// Set value
	set value(value: any) {
		if (Array.isArray(value)) { // Multiple file object
			this.files = value.filter(file => dbapp.isObject(file) && file.hasOwnProperty("type") || dbapp.isString(file))
				.map(file => new DbFile(file));
		} else if (dbapp.isObject(value)) {
			if (value.hasOwnProperty("type")) // Single file object
				this.files = [ new DbFile(value) ];
			else
				Object.assign(this, value);
		} else {
			this._value = value;
		}
		this.valueChanges.next(this.files);
	}

	// Get value
	get value() {
		return this.isFile ? this.fileNames : this._value;
	}

	// Assign
	assign(value: any) {
		if (Array.isArray(value)) // Multiple file object
			this.files = value.map(file => new DbFile(file));
		this.valueChanges.next(this.files);
	}

	// Add files
	addFiles(files: any) {
		let newFiles = files.some(file => file instanceof Blob) // From FileUploadControl
			? this.files.filter(file => !file.isBlob) // Remove old files from FileUploadControl
			: this.files;
		for (let file of files)
			newFiles.push((file instanceof DbFile) ? file : new DbFile(file));
		this.files = newFiles;
		this.valueChanges.next(this.files);
	}

	// Remove file
	removeFile(dbfile: DbFile) {
		let pos = this.files.findIndex(file => file.name == dbfile.name);
		if (this.files[pos])
			this.files.splice(pos, 1);
		this.valueChanges.next(this.files);
	}

	// Is file field
	get isFile(): boolean {
		return Array.isArray(this.files) && this.files.length > 0;
	}

	// URL for first file item (used by thumbnail) or hyperlink
	get url(): string {
		return this.isFile ? this.files[0].url : this.hyperlink;
	}

	// URL for first file item in List page (used by thumbnail) or hyperlink
	get listUrl(): string {
		return this.isFile ? this.files[0].listUrl : this.hyperlink;
	}

	// URL for first file item in View page (used by thumbnail) or hyperlink
	get viewUrl(): string {
		return this.isFile ? this.files[0].viewUrl : this.hyperlink;
	}

	// Get file names
	get fileNames(): string[] {
		return this.isFile ? this.files.map(f => f.name) : null;
	}

	// Get text (remove HTML)
	get text(): string {
		return (this._value || "").replace(/<[^>]*>/g, "");
	}

	// To string
	toString(): string {
		return this.value;
	}
}

/**
 * DbFile class
 *
 * @export
 * @class DbFile
 */
export class DbFile {
	name: string;
	value: any;
	type: string;
	size: number;
	site: string;
	url: any;
	options: any;
	file: any; // File|Entry;
	blob: any; // File|ArrayBuffer;
	previewUrl: string;

	// Constructor
	constructor(value: any) {
		if (dbapp.isObject(value)) {
			if (value instanceof Blob) { // Upload file // Do not use instanceof File
				this.file = value;
				this.name = (value as any).name;
				this.type = value.type;
				this.size = value.size;
				this.blob = value;
			} else if (value.isFile) { // Entry (camera)
				this.file = value;
				this.name = value.name;
				(<FileEntry>value).file(file => {
					const reader = new FileReader();
					reader.onload = () => {
						this.blob = new Blob([reader.result], { type: file.type });
						this.type = this.blob.type;
						this.size = this.blob.size;
					};
					reader.readAsArrayBuffer(file);
				});
			} else {
				Object.assign(this, value);
			}
			this.setPreviewUrl(value);
		} else if (dbapp.isString(value)) {
			this.value = value;
		}
	}

	// Is File type (File of FileList)
	get isBlob() {
		return this.file instanceof Blob;
	}

	// Is file entry (From camera)
	get isEntry() {
		return this.file && this.file.isFile;
	}

	// File type: video|audio|image|hyperlink
	get fileType(): string {
		if (/^video\//i.test(this.type))
			return "video";
		else if (/^audio\//i.test(this.type))
			return "audio";
		else if (/^image/i.test(this.type))
			return "image";
		else
			return "hyperlink";
	}

	// Set preview URL
	setPreviewUrl(value) {
		if (value instanceof Blob) { // Upload file
			const reader = new FileReader();
			reader.onload = () => {
				this.previewUrl = reader.result as string;
			};
			reader.readAsDataURL(value);
		} else {
			this.previewUrl = this.url;
		}
	}

	/**
	 * URL for List page (Video/Audio/Image)
	 */
	get listUrl(): string {
		return this.url + "&resize=1&crop=1&width=" + dbapp.thumbnailWidth + "&height=" + dbapp.thumbnailHeight;
	}

	/**
	 * URL for View page (Video/Audio/Image)
	 */
	get viewUrl(): string {
		return this.url + "&resize=1&width=" + dbapp.thumbnailWidthView + "&height=" + dbapp.thumbnailHeightView;
	}
}