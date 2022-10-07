import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { EmbeddedMediaModule } from '@hkvstore/ngx-embedded-media';
import { v_kitabListPage } from './v_kitablist';
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
			component: v_kitabListPage
		}
		]),
		TranslateModule.forChild(),
	],
	entryComponents: [
	],
	declarations: [
		v_kitabListPage
	]
})
export class v_kitabListPageModule {}