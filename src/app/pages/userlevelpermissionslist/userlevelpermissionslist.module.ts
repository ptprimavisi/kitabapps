import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { EmbeddedMediaModule } from '@hkvstore/ngx-embedded-media';
import { userlevelpermissionsListPage } from './userlevelpermissionslist';
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
			component: userlevelpermissionsListPage
		}
		]),
		TranslateModule.forChild(),
	],
	entryComponents: [
	],
	declarations: [
		userlevelpermissionsListPage
	]
})
export class userlevelpermissionsListPageModule {}