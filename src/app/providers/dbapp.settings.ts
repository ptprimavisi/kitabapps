import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

/**
 * A simple settings/config class for storing key/value pairs with persistence
 */
export class Settings {
	private SETTINGS_KEY: string = '_settings';
	settings: any = {};
	_defaults: any = {};

	// Constructor
	constructor(public storage: Storage, defaults: any) {
		this._defaults = defaults;
	}

	// Load
	load() {
		return this.storage.get(this.SETTINGS_KEY).then(value => {
			this.settings = Object.assign({}, this._defaults, value || {});
			return this.save();
		});
	}

	// Merge
	merge(settings: any) {
		Object.assign(this.settings, settings);
		return this.save();
	}

	// Set
	set(key: string, value: any) {
		this.settings[key] = value;
		return this.save();
	}

	// Get
	get(key: string) {
		return this.settings[key];
	}

	// Set all
	setAll(value: any) {
		return this.storage.set(this.SETTINGS_KEY, value);
	}

	// Save
	save() {
		return this.setAll(this.settings);
	}

	// Get all
	get allSettings() {
		return this.settings;
	}
}