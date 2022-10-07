import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { EmbeddedMediaModule } from '@hkvstore/ngx-embedded-media';
import { userlevelpermissionsViewPage } from './userlevelpermissionsview';
import { DbAppPipe } from '../../providers/dbapp.pipe.module';
@NgModule({
	declarations: [
		userlevelpermissionsViewPage
	],
	imports: [
		EmbeddedMediaModule,
		CommonModule,
		IonicModule,
		DbAppPipe,
		RouterModule.forChild([
		{
			path: '',
			component: userlevelpermissionsViewPage
		}
		]),
		TranslateModule.forChild(),
	],
	exports: [
		userlevelpermissionsViewPage
	]
})
export class userlevelpermissionsViewPageModule { }