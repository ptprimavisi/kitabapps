import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { FileUploadModule } from '@iplab/ngx-file-upload';
import { IonicSelectableModule } from 'ionic-selectable';
import { kitabAddPage } from './kitabadd';
import { DbAppPipe } from '../../providers/dbapp.pipe.module';
@NgModule({
	declarations: [
		kitabAddPage
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
			component: kitabAddPage
		}
		]),
		TranslateModule.forChild(),
	],
	exports: [
		kitabAddPage
	]
})
export class kitabAddPageModule { }