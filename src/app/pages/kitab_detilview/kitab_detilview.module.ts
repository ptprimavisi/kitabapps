import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { EmbeddedMediaModule } from '@hkvstore/ngx-embedded-media';
import { kitab_detilViewPage } from './kitab_detilview';
import { DbAppPipe } from '../../providers/dbapp.pipe.module';
@NgModule({
	declarations: [
		kitab_detilViewPage
	],
	imports: [
		EmbeddedMediaModule,
		CommonModule,
		IonicModule,
		DbAppPipe,
		RouterModule.forChild([
		{
			path: '',
			component: kitab_detilViewPage
		}
		]),
		TranslateModule.forChild(),
	],
	exports: [
		kitab_detilViewPage
	]
})
export class kitab_detilViewPageModule { }