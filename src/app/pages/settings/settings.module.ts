import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { SettingsPage } from './settings';
@NgModule({
	declarations: [
		SettingsPage,
	],
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		IonicModule,
		RouterModule.forChild([
			{
				path: '',
				component: SettingsPage
			}
		]),
		TranslateModule.forChild(),
	],
	exports: [
		SettingsPage
	]
})
export class SettingsPageModule { }