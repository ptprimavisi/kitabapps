import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { EmbeddedMediaModule } from '@hkvstore/ngx-embedded-media';
import { _userListPage } from './_userlist';
import { DbAppPipe } from '../../providers/dbapp.pipe.module';
@NgModule({
	imports: [
		EmbeddedMediaModule,
		CommonModule,
		IonicModule,
		DbAppPipe,
		RouterModule.forChild([
		{
			path: '',
			component: _userListPage
		}
		]),
		TranslateModule.forChild(),
	],
	entryComponents: [
	],
	declarations: [
		_userListPage
	]
})
export class _userListPageModule {}