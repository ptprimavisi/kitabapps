import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { EmbeddedMediaModule } from '@hkvstore/ngx-embedded-media';
import { kitab_detilListPage } from './kitab_detillist';
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
			component: kitab_detilListPage
		}
		]),
		TranslateModule.forChild(),
	],
	entryComponents: [
	],
	declarations: [
		kitab_detilListPage
	]
})
export class kitab_detilListPageModule {}