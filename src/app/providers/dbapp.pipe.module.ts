import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { LocalDatePipe, LocalNumberPipe, LocalCurrencyPipe, LocalPercentPipe, AuthFilePipe } from './';

// Module
@NgModule({
	declarations:[
		LocalDatePipe,
		LocalNumberPipe,
		LocalCurrencyPipe,
		LocalPercentPipe,
		AuthFilePipe
	],
	imports:[CommonModule],
	exports:[
		LocalDatePipe,
		LocalNumberPipe,
		LocalCurrencyPipe,
		LocalPercentPipe,
		AuthFilePipe
	]
})

// Export
export class DbAppPipe {}