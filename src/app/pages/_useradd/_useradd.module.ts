import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { FileUploadModule } from '@iplab/ngx-file-upload';
import { IonicSelectableModule } from 'ionic-selectable';
import { _userAddPage } from './_useradd';
import { DbAppPipe } from '../../providers/dbapp.pipe.module';
@NgModule({
	declarations: [
		_userAddPage
	],
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		FileUploadModule,
		IonicModule,
		IonicSelectableModule,
		DbAppPipe,
		RouterModule.forChild([
		{
			path: '',
			component: _userAddPage
		}
		]),
		TranslateModule.forChild(),
	],
	exports: [
		_userAddPage
	]
})
export class _userAddPageModule { }