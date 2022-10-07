import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserData } from './providers';
const routes: Routes = [
	{
		path: '',
		redirectTo: 'v_kitablist',
		pathMatch: 'full'
	},
	{
		path: 'kitablist',
		loadChildren: () => import('./pages/kitablist/kitablist.module').then(m => m.kitabListPageModule),
	},
	{
		path: 'kitabadd',
		loadChildren: () => import('./pages/kitabadd/kitabadd.module').then(m => m.kitabAddPageModule),
	},
	{
		path: 'kitabadd/:id',
		loadChildren: () => import('./pages/kitabadd/kitabadd.module').then(m => m.kitabAddPageModule),
	},
	{
		path: 'kitabedit/:id',
		loadChildren: () => import('./pages/kitabedit/kitabedit.module').then(m => m.kitabEditPageModule),
	},
	{
		path: 'kitabview/:id',
		loadChildren: () => import('./pages/kitabview/kitabview.module').then(m => m.kitabViewPageModule),
	},
	{
		path: 'kitab_detillist',
		loadChildren: () => import('./pages/kitab_detillist/kitab_detillist.module').then(m => m.kitab_detilListPageModule),
	},
	{
		path: 'kitab_detillist/:pid',
		loadChildren: () => import('./pages/kitab_detillist/kitab_detillist.module').then(m => m.kitab_detilListPageModule),
	},
	{
		path: 'kitab_detiladd',
		loadChildren: () => import('./pages/kitab_detiladd/kitab_detiladd.module').then(m => m.kitab_detilAddPageModule),
	},
	{
		path: 'kitab_detiladd/:id',
		loadChildren: () => import('./pages/kitab_detiladd/kitab_detiladd.module').then(m => m.kitab_detilAddPageModule),
	},
	{
		path: 'kitab_detiledit/:id',
		loadChildren: () => import('./pages/kitab_detiledit/kitab_detiledit.module').then(m => m.kitab_detilEditPageModule),
	},
	{
		path: 'kitab_detilview/:id',
		loadChildren: () => import('./pages/kitab_detilview/kitab_detilview.module').then(m => m.kitab_detilViewPageModule),
	},
	{
		path: '_userlist',
		loadChildren: () => import('./pages/_userlist/_userlist.module').then(m => m._userListPageModule),
	},
	{
		path: '_useradd',
		loadChildren: () => import('./pages/_useradd/_useradd.module').then(m => m._userAddPageModule),
	},
	{
		path: '_useradd/:id',
		loadChildren: () => import('./pages/_useradd/_useradd.module').then(m => m._userAddPageModule),
	},
	{
		path: '_useredit/:id',
		loadChildren: () => import('./pages/_useredit/_useredit.module').then(m => m._userEditPageModule),
	},
	{
		path: '_userview/:id',
		loadChildren: () => import('./pages/_userview/_userview.module').then(m => m._userViewPageModule),
	},
	{
		path: 'userlevelpermissionslist',
		loadChildren: () => import('./pages/userlevelpermissionslist/userlevelpermissionslist.module').then(m => m.userlevelpermissionsListPageModule),
	},
	{
		path: 'userlevelpermissionsadd',
		loadChildren: () => import('./pages/userlevelpermissionsadd/userlevelpermissionsadd.module').then(m => m.userlevelpermissionsAddPageModule),
	},
	{
		path: 'userlevelpermissionsadd/:userlevelid/:tablename',
		loadChildren: () => import('./pages/userlevelpermissionsadd/userlevelpermissionsadd.module').then(m => m.userlevelpermissionsAddPageModule),
	},
	{
		path: 'userlevelpermissionsedit/:userlevelid/:tablename',
		loadChildren: () => import('./pages/userlevelpermissionsedit/userlevelpermissionsedit.module').then(m => m.userlevelpermissionsEditPageModule),
	},
	{
		path: 'userlevelpermissionsview/:userlevelid/:tablename',
		loadChildren: () => import('./pages/userlevelpermissionsview/userlevelpermissionsview.module').then(m => m.userlevelpermissionsViewPageModule),
	},
	{
		path: 'userlevelslist',
		loadChildren: () => import('./pages/userlevelslist/userlevelslist.module').then(m => m.userlevelsListPageModule),
	},
	{
		path: 'userlevelsadd',
		loadChildren: () => import('./pages/userlevelsadd/userlevelsadd.module').then(m => m.userlevelsAddPageModule),
	},
	{
		path: 'userlevelsadd/:userlevelid',
		loadChildren: () => import('./pages/userlevelsadd/userlevelsadd.module').then(m => m.userlevelsAddPageModule),
	},
	{
		path: 'userlevelsedit/:userlevelid',
		loadChildren: () => import('./pages/userlevelsedit/userlevelsedit.module').then(m => m.userlevelsEditPageModule),
	},
	{
		path: 'userlevelsview/:userlevelid',
		loadChildren: () => import('./pages/userlevelsview/userlevelsview.module').then(m => m.userlevelsViewPageModule),
	},
	{
		path: 'v_kitablist',
		loadChildren: () => import('./pages/v_kitablist/v_kitablist.module').then(m => m.v_kitabListPageModule),
	},
	{
		path: 'settings',
		loadChildren: () => import('./pages/settings/settings.module').then(m => m.SettingsPageModule),
	},
];
@NgModule({
	imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: "reload" })],
	exports: [RouterModule]
})
export class AppRoutingModule {}