import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { FileUploadModule } from '@iplab/ngx-file-upload';
import { IonicSelectableModule } from 'ionic-selectable';
import { _userEditPage } from './_useredit';
import { DbAppPipe } from '../../providers/dbapp.pipe.module';
@NgModule({
	declarations: [
		_userEditPage
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
			component: _userEditPage
		}
		]),
		TranslateModule.forChild(),
	],
	exports: [
		_userEditPage
	]
})
export class _userEditPageModule {}