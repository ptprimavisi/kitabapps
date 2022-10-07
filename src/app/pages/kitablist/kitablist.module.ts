import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { EmbeddedMediaModule } from '@hkvstore/ngx-embedded-media';
import { kitabListPage } from './kitablist';
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
			component: kitabListPage
		}
		]),
		TranslateModule.forChild(),
	],
	entryComponents: [
	],
	declarations: [
		kitabListPage
	]
})
export class kitabListPageModule {}