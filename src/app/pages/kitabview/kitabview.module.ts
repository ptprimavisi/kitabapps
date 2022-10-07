import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { EmbeddedMediaModule } from '@hkvstore/ngx-embedded-media';
import { kitabViewPage } from './kitabview';
import { DbAppPipe } from '../../providers/dbapp.pipe.module';
@NgModule({
	declarations: [
		kitabViewPage
	],
	imports: [
		EmbeddedMediaModule,
		CommonModule,
		IonicModule,
		DbAppPipe,
		RouterModule.forChild([
		{
			path: '',
			component: kitabViewPage
		}
		]),
		TranslateModule.forChild(),
	],
	exports: [
		kitabViewPage
	]
})
export class kitabViewPageModule { }